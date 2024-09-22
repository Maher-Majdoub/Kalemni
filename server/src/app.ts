import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import api from "./routes/api.routes";
import { verifyToken } from "./utils";
import Message from "./models/message.model";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", api);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:5173"] },
});

const socketMap = new Map<string, string>(); // userId -> socketId

interface Props {
  senderId: string;
  recipientId: string;
  content: string;
}

const saveMessage = async (data: Props) => {
  const res = await Message.create(data);
  console.log(res);
};

io.on("connect", (socket) => {
  const authToken = socket.handshake.auth.authToken;
  const { isValid, data } = verifyToken(authToken);

  if (!isValid) return socket.disconnect();

  socketMap.set(data._id, socket.id);

  socket.on(
    "send-message",
    ({ receiverId, message }: { receiverId: string; message: string }) => {
      saveMessage({
        senderId: data._id,
        recipientId: receiverId,
        content: message,
      });

      io.to(socketMap.get(receiverId) as string).emit("receive-message", {
        senderId: data._id,
        message: message,
      });
    }
  );
});

export { httpServer, io };
