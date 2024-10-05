import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import api from "./routes/api.routes";
import { verifyToken } from "./utils";
import User from "./models/user.model";
import Conversation from "./models/conversation.model";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", api);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:5173"] },
});

const userSocketMap = new Map<
  string,
  { socketId: string; isConnected: boolean }
>();
const getSocketId = (userId: string) => userSocketMap.get(userId)?.socketId;
const isConnected = (userId: string) =>
  !!userSocketMap.get(userId)?.isConnected;

io.on("connect", async (socket) => {
  const authToken = socket.handshake.auth.authToken;
  const { isValid, data } = verifyToken(authToken);
  const userId = data._id;

  if (!isValid) return socket.disconnect();

  userSocketMap.set(userId, { socketId: socket.id, isConnected: true });

  const user = await User.findById(userId);
  if (!user) throw new Error("this should not be happened");

  for (const friend of user.friends) {
    const socketId = userSocketMap.get(String(friend._id))?.socketId;

    if (socketId)
      io.to(socketId).emit("userConnected", {
        _id: userId,
        firstName: user.firstName,
        lastName: user.firstName,
        profilePicture: user.profilePicture,
      });
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
    "seenMessage",
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
          participant.lastSeenMessageId = message._id;
          break;
        }
      }
      await conversation.save();

      for (const participant of conversation.participants) {
        if (participant.user._id.equals(userId)) continue;

        const socketId = getSocketId(participant.user._id.toString());
        if (socketId)
          io.to(socketId).emit("seenMessage", {
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
          });
      }
    }
  );
});

export { httpServer, io, getSocketId, isConnected };
