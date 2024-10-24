import { io } from "./app";
import { Socket } from "socket.io";
import { verifyToken } from "./utils";
import Conversation from "./models/conversation.model";
import User, { userSnapshotFields } from "./models/user.model";

const userSocketMap = new Map<
  string,
  { socketId: string; isConnected: boolean }
>();

const getSocketId = (userId: string) => userSocketMap.get(userId)?.socketId;

const isConnected = (userId: string) =>
  !!userSocketMap.get(userId)?.isConnected;

const handleIoConnection = async (socket: Socket) => {
  const authToken = socket.handshake.auth.authToken;
  const { isValid, data } = verifyToken(authToken);
  const userId = data._id;

  if (!isValid) return socket.disconnect();

  userSocketMap.set(userId, { socketId: socket.id, isConnected: true });

  const user = await User.findById(userId);

  if (!user) throw new Error("this should not be happened");

  for (const friend of user.friends) {
    const socketId = userSocketMap.get(friend.toString())?.socketId;
    if (socketId) io.to(socketId).emit("userConnected", user.getSnapshot());
  }

  socket.on("disconnect", () => {
    const conf = userSocketMap.get(userId);
    if (conf) {
      conf.isConnected = false;
      userSocketMap.set(userId, conf);

      setTimeout(() => {
        if (!userSocketMap.get(userId)?.isConnected) {
          userSocketMap.delete(userId);
          for (const friend of user.friends) {
            const socketId = userSocketMap.get(String(friend._id))?.socketId;
            if (socketId) {
              io.to(socketId).emit("userDisconnected", {
                _id: userId,
              });
            }
          }
        }
      }, 3000);
    }
  });

  socket.on(
    "sawMessage",
    async ({
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId: string;
    }) => {
      const conversation = await Conversation.findById(conversationId).select([
        "participants",
        "messages",
      ]);

      if (!conversation) return;

      const message = conversation.messages.find((message) =>
        message._id.equals(messageId)
      );

      if (!message) return;
      for (const participant of conversation.participants) {
        if (participant.user._id.equals(userId)) {
          participant.lastSawMessageId = message._id;
          break;
        }
      }
      await conversation.save();

      for (const participant of conversation.participants) {
        if (participant.user._id.equals(userId)) continue;

        const socketId = getSocketId(participant.user._id.toString());
        if (socketId)
          io.to(socketId).emit("sawMessage", {
            conversationId: conversation._id,
            messageId: message._id,
            userId: userId,
          });
      }
    }
  );

  socket.on(
    "startTyping",
    async ({ conversationId }: { conversationId: string }) => {
      const conversation = await Conversation.findById(conversationId).select(
        "participants"
      );

      if (!conversation) return;

      for (const participant of conversation.participants) {
        if (participant.user._id.equals(user._id)) continue;

        const socketId = getSocketId(participant.user._id.toString());
        if (socketId)
          io.to(socketId).emit("startTyping", {
            userId: user._id,
            conversationId: conversation._id,
            isTyping: true,
          });
      }
    }
  );

  socket.on(
    "stopTyping",
    async ({ conversationId }: { conversationId: string }) => {
      const conversation = await Conversation.findById(conversationId).select(
        "participants"
      );

      if (!conversation) return;

      for (const participant of conversation.participants) {
        if (participant.user._id.equals(user._id)) continue;

        const socketId = getSocketId(participant.user._id.toString());
        if (socketId)
          io.to(socketId).emit("stopTyping", {
            userId: user._id,
            conversationId: conversation._id,
            isTyping: false,
          });
      }
    }
  );

  socket.on("join", async (room, type) => {
    if (!io.sockets.adapter.rooms.get(room)?.size) {
      // new call
      const conversation = await Conversation.findById(room).populate({
        path: "participants.user",
        select: userSnapshotFields,
      });
      conversation?.participants.forEach((participant) => {
        const socketId = getSocketId(participant.user._id.toString());
        if (socketId === socket.id) return;

        if (socketId) io.to(socketId).emit("newCall", conversation, type);
      });
    }

    socket.join(room);
    socket.to(room).emit("newParticipant", userId);
  });

  socket.on("offer", (id, offer) => {
    const socketId = getSocketId(id);
    if (socketId) socket.to(socketId).emit("offer", userId, offer);
  });

  socket.on("answer", (id, answer) => {
    const socketId = getSocketId(id);
    if (socketId) socket.to(socketId).emit("answer", userId, answer);
  });

  socket.on("iceCandidate", (room, id, candidate) => {
    const socketId = getSocketId(id);
    if (socketId) socket.to(room).emit("iceCandidate", userId, candidate);
  });

  socket.on("videoOffer", (id, offer) => {
    const socketId = getSocketId(id);
    if (socketId) io.to(socketId).emit("videoOffer", userId, offer);
  });

  socket.on("videoAnswer", (id, answer) => {
    const socketId = getSocketId(id);
    if (socketId) io.to(socketId).emit("videoAnswer", userId, answer);
  });

  socket.on("toggleEnableAudio", (room, isAudioEnabled) => {
    socket.to(room).emit("toggleEnableAudio", userId, isAudioEnabled);
  });

  socket.on("toggleEnableVideo", (room, isVideoEnabled) => {
    socket.to(room).emit("toggleEnableVideo", userId, isVideoEnabled);
  });

  socket.on("leaveCall", (room) => {
    socket.leave(room);
    socket.to(room).emit("participantLeft", userId);
  });
};

export { getSocketId, isConnected, handleIoConnection };
