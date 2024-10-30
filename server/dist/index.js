"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const winston_1 = __importDefault(require("winston"));
exports.default = winston_1.default.createLogger({
    level: "error",
    format: winston_1.default.format.json(),
    transports: [
        new winston_1.default.transports.File({
            filename: "logfile.log",
            handleExceptions: true,
            handleRejections: true,
        }),
    ],
});
winston_1.default.createLogger({
    level: "error",
    format: winston_1.default.format.json(),
    transports: [
        new winston_1.default.transports.File({
            filename: "logfile.log",
            handleExceptions: true,
            handleRejections: true,
        }),
    ],
});
const dbUrl = process.env.NODE_ENV === "production"
    ? process.env.DB_URL
    : "mongodb://localhost/Kalemni";
const port = process.env.PORT || 3000;
const start = async () => {
    await mongoose_1.default.connect(dbUrl);
    console.log("Connected to the database.");
    await app_1.httpServer.listen(port);
    console.log(`listening on port ${port}...`);
};
exports.start = start;
(0, exports.start)();
