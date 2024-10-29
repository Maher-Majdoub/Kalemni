"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../controllers/utils");
const user_model_1 = __importDefault(require("../models/user.model"));
const authMiddleware = async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
        return res.status(401).send({ message: "Unautorized" });
    const { isValid, data } = (0, utils_1.verifyToken)(token);
    if (!isValid)
        return res.status(401).send({ message: "Invalid token" });
    const user = await user_model_1.default.findById(data._id).select("_id");
    if (!user)
        return res.status(401).send({ message: "Unauthorized" });
    req.body.user = data;
    next();
};
exports.default = authMiddleware;
