import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import api from "./routes/api.routes";
import { verifyToken } from "./utils";
import User from "./models/user.model";

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
});

export { httpServer, io, getSocketId, isConnected };
