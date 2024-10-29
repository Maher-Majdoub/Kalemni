"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const socket_1 = require("./socket");
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
if (process.env.NODE_ENV === "production") {
    app.use((0, helmet_1.default)());
    app.use(compression_1.default);
}
app.use("/api", api_routes_1.default);
app.use(error_middleware_1.errorMiddleware);
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
const frontEndUrl = process.env.NODE_ENV === "production"
    ? process.env.FRONT_END_URL
    : "http://localhost:5173";
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: [frontEndUrl] },
});
exports.io = io;
io.on("connect", socket_1.handleIoConnection);
