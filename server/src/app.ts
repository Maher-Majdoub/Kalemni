import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import api from "./routes/api.routes";
import { verifyToken } from "./utils";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", api);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:5173"] },
});

const userSocketMap = new Map<string, string>(); // userId -> socketId
const getSocketId = (userId: string) => userSocketMap.get(userId);

io.on("connect", (socket) => {
  const authToken = socket.handshake.auth.authToken;
  const { isValid, data } = verifyToken(authToken);

  if (!isValid) return socket.disconnect();

  userSocketMap.set(data._id, socket.id);
});

export { httpServer, io, getSocketId };
