"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const winston_1 = __importDefault(require("winston"));
const errorMiddleware = (err, req, res, next) => {
    winston_1.default.error(err.message, err);
    res.status(500).send("Something went wrong");
};
exports.errorMiddleware = errorMiddleware;
