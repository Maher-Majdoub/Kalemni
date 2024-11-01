import { io } from "./app";
import { Socket } from "socket.io";
import { verifyToken } from "./controllers/utils";
import Conversation from "./models/conversation.model";
import User, { userSnapshotFields } from "./models/user.model";
import { log } from "winston";

const userSocketMap = new Map<
  string,
  { socketId: string; isConnected: boolean }
>();

const roomUsersMap = new Map<string, string[]>();

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
    roomUsersMap.forEach((users, room) => {
      const user = users.find((id) => id === userId);
      if (user) {
        roomUsersMap.set(
          room,
          users.filter((id) => id !== user)
        );
        roomUsersMap.get(room)?.forEach((id) => {
          if (user === id) return;
          const socketId = getSocketId(id);
          if (socketId) io.to(socketId).emit("participantLeft", userId);
        });
      }
    });

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
    const availableRoom = roomUsersMap.get(room);

    if (!availableRoom) {
      roomUsersMap.set(room, []);
    }

    console.log(availableRoom);
    if (availableRoom) {
      if (availableRoom.length >= 4) {
        io.to(socket.id).emit("fullCall");
        return;
      }
    }

    const currUsers = roomUsersMap
      .get(room)
      ?.filter((id) => id !== userId) as string[];

    const conversation = await Conversation.findById(room).populate({
      path: "participants.user",
      select: userSnapshotFields,
    });

    const participant = conversation?.participants.find((participant) =>
      participant.user._id.equals(userId)
    );

    if (!participant) return;

    const user = participant.user;
    roomUsersMap.set(room, [...currUsers, userId]);

    currUsers.forEach((id) => {
      const socketId = getSocketId(id);
      if (socketId) io.to(socketId).emit("newParticipant", user);
    });

    if (roomUsersMap.get(room)?.length === 1) {
      conversation?.participants.forEach((participant) => {
        if (participant.user._id.toString() === userId) return;
        const socketId = getSocketId(participant.user._id.toString());
        if (socketId) io.to(socketId).emit("newCall", conversation, type);
      });
    }
  });

  socket.on("offer", async (id, offer) => {
    const socketId = getSocketId(id);
    if (socketId) {
      const user = await User.findById(userId);
      if (!user) return;
      socket.to(socketId).emit("offer", user.getSnapshot(), offer);
    }
  });

  socket.on("answer", (id, answer) => {
    const socketId = getSocketId(id);
    if (socketId) socket.to(socketId).emit("answer", userId, answer);
  });

  socket.on("iceCandidate", (room, id, candidate) => {
    const socketId = getSocketId(id);
    if (socketId) socket.to(socketId).emit("iceCandidate", userId, candidate);
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
    roomUsersMap.get(room)?.forEach((user) => {
      if (user === userId) return;
      const socketId = getSocketId(user);
      if (socketId)
        io.to(socketId).emit("toggleEnableAudio", userId, isAudioEnabled);
    });
  });

  socket.on("toggleEnableVideo", (room, isVideoEnabled) => {
    roomUsersMap.get(room)?.forEach((user) => {
      if (user === userId) return;
      const socketId = getSocketId(user);
      if (socketId)
        io.to(socketId).emit("toggleEnableVideo", userId, isVideoEnabled);
    });
  });

  socket.on("leaveCall", (room) => {
    const oldUsers = roomUsersMap.get(room);

    if (!oldUsers) return;
    roomUsersMap.set(
      room,
      oldUsers.filter((user) => user !== userId)
    );

    oldUsers.forEach((user) => {
      if (user === userId) return;
      const socketId = getSocketId(user);
      if (socketId) io.to(socketId).emit("participantLeft", userId);
    });
  });
};

export { getSocketId, isConnected, handleIoConnection };
