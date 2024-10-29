"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const winston_1 = __importDefault(require("winston"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
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
const dbUrl = config_1.default.get("dbUrl");
const port = process.env.PORT || 3000;
const start = async () => {
    await mongoose_1.default.connect(dbUrl);
    console.log("Connected to the database.");
    await app_1.httpServer.listen(port);
    console.log(`listening on port ${port}...`);
};
start();
