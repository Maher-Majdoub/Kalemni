import { createServer } from "http";
import express from "express";
import cors from "cors";
import api from "./routes/api.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", api);

const httpServer = createServer(app);

export default httpServer;
