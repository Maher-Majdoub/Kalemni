import express from "express";
import cors from "cors";
import path from "path";
import api from "./routes/api.routes";
import { Server } from "socket.io";
import { createServer } from "http";
import { handleIoConnection } from "./socket";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("api is working");
});

app.use("/api", api);

app.use(errorMiddleware);

const httpServer = createServer(app);

const frontEndUrl =
  process.env.NODE_ENV === "production"
    ? process.env.FRONT_END_URL
    : "http://localhost:5173";

const io = new Server(httpServer, {
  cors: { origin: [frontEndUrl as string] },
});

io.on("connect", handleIoConnection);

export { httpServer, io };
