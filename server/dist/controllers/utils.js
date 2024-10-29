"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.makeToken = exports.validatePassword = exports.hashPassword = exports.extractJoiErrors = exports.createFriendship = exports.sendBadRequestResponse = exports.getUser = exports.getMe = void 0;
const user_model_1 = __importStar(require("../models/user.model"));
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const config_1 = __importDefault(require("config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getMe = async (req) => {
    const me = await user_model_1.default.findById(req.body.user._id)
        .select(["-password", "-username"])
        .populate("friends")
        .populate("friendRequests.user");
    if (!me)
        throw new Error("User is Authenticated and is not found in the database");
    return me;
};
exports.getMe = getMe;
const getUser = async (userId, res) => {
    const user = await user_model_1.default.findById(userId).select(user_model_1.userSnapshotFields);
    if (!user)
        res.status(404).send({ message: "User not found" });
    return user;
};
exports.getUser = getUser;
const sendBadRequestResponse = async (message, res) => {
    res.status(400).send({ message: message });
};
exports.sendBadRequestResponse = sendBadRequestResponse;
const createFriendship = async (user1Id, user2Id) => {
    await Promise.all([
        user_model_1.default.findByIdAndUpdate(user1Id, { $push: { friends: user2Id } }),
        user_model_1.default.findByIdAndUpdate(user2Id, { $push: { friends: user1Id } }),
        conversation_model_1.default.create([
            {
                type: "p",
                participants: [
                    { user: user1Id, lastSeen: Date.now() },
                    { user: user2Id, lastSeen: Date.now() },
                ],
            },
        ]),
    ]);
};
exports.createFriendship = createFriendship;
const extractJoiErrors = (error) => {
    if (error)
        return error.details.map((err) => {
            return {
                field: err.path[0],
                message: err.message.replaceAll('"', ""),
            };
        });
    return [];
};
exports.extractJoiErrors = extractJoiErrors;
const hashPassword = (password) => {
    const saltRounds = 10;
    const salt = bcrypt_1.default.genSaltSync(saltRounds);
    const hash = bcrypt_1.default.hashSync(password, salt);
    return hash;
};
exports.hashPassword = hashPassword;
const validatePassword = (password, hashedPassword) => {
    return bcrypt_1.default.compareSync(password, hashedPassword);
};
exports.validatePassword = validatePassword;
const makeToken = (data) => {
    return jsonwebtoken_1.default.sign(data, config_1.default.get("jwtSecretKey"));
};
exports.makeToken = makeToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtSecretKey"));
        return { isValid: true, data: decoded };
    }
    catch (ex) {
        return { isValid: false, data: {} };
    }
};
exports.verifyToken = verifyToken;
