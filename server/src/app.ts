import express from "express";
import cors from "cors";
import path from "path";
import api from "./routes/api.routes";
import { Server } from "socket.io";
import { createServer } from "http";
import { handleIoConnection } from "./socket";

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cors());

app.use("/api", api);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:5173"] },
});

io.on("connect", handleIoConnection);

export { httpServer, io };
