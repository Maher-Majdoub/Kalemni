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
exports.handleIoConnection = exports.isConnected = exports.getSocketId = void 0;
const app_1 = require("./app");
const utils_1 = require("./controllers/utils");
const conversation_model_1 = __importDefault(require("./models/conversation.model"));
const user_model_1 = __importStar(require("./models/user.model"));
const userSocketMap = new Map();
const roomUsersMap = new Map();
const getSocketId = (userId) => userSocketMap.get(userId)?.socketId;
exports.getSocketId = getSocketId;
const isConnected = (userId) => !!userSocketMap.get(userId)?.isConnected;
exports.isConnected = isConnected;
const handleIoConnection = async (socket) => {
    const authToken = socket.handshake.auth.authToken;
    const { isValid, data } = (0, utils_1.verifyToken)(authToken);
    const userId = data._id;
    if (!isValid)
        return socket.disconnect();
    userSocketMap.set(userId, { socketId: socket.id, isConnected: true });
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new Error("this should not be happened");
    for (const friend of user.friends) {
        const socketId = userSocketMap.get(friend.toString())?.socketId;
        if (socketId)
            app_1.io.to(socketId).emit("userConnected", user.getSnapshot());
    }
    socket.on("disconnect", () => {
        roomUsersMap.forEach((users, room) => {
            const user = users.find((id) => id === userId);
            if (user) {
                roomUsersMap.set(room, users.filter((id) => id !== user));
                roomUsersMap.get(room)?.forEach((id) => {
                    if (user === id)
                        return;
                    const socketId = getSocketId(id);
                    if (socketId)
                        app_1.io.to(socketId).emit("participantLeft", userId);
                });
            }
        });
        const conf = userSocketMap.get(userId);
        if (conf) {
            conf.isConnected = false;
            userSocketMap.set(userId, conf);
            setTimeout(() => {
                if (!userSocketMap.get(userId)?.isConnected) {
                    userSocketMap.delete(userId);
                    for (const friend of user.friends) {
                        const socketId = userSocketMap.get(String(friend._id))?.socketId;
                        if (socketId) {
                            app_1.io.to(socketId).emit("userDisconnected", {
                                _id: userId,
                            });
                        }
                    }
                }
            }, 3000);
        }
    });
    socket.on("sawMessage", async ({ conversationId, messageId, }) => {
        const conversation = await conversation_model_1.default.findById(conversationId).select([
            "participants",
            "messages",
        ]);
        if (!conversation)
            return;
        const message = conversation.messages.find((message) => message._id.equals(messageId));
        if (!message)
            return;
        for (const participant of conversation.participants) {
            if (participant.user._id.equals(userId)) {
                participant.lastSawMessageId = message._id;
                break;
            }
        }
        await conversation.save();
        for (const participant of conversation.participants) {
            if (participant.user._id.equals(userId))
                continue;
            const socketId = getSocketId(participant.user._id.toString());
            if (socketId)
                app_1.io.to(socketId).emit("sawMessage", {
                    conversationId: conversation._id,
                    messageId: message._id,
                    userId: userId,
                });
        }
    });
    socket.on("startTyping", async ({ conversationId }) => {
        const conversation = await conversation_model_1.default.findById(conversationId).select("participants");
        if (!conversation)
            return;
        for (const participant of conversation.participants) {
            if (participant.user._id.equals(user._id))
                continue;
            const socketId = getSocketId(participant.user._id.toString());
            if (socketId)
                app_1.io.to(socketId).emit("startTyping", {
                    userId: user._id,
                    conversationId: conversation._id,
                    isTyping: true,
                });
        }
    });
    socket.on("stopTyping", async ({ conversationId }) => {
        const conversation = await conversation_model_1.default.findById(conversationId).select("participants");
        if (!conversation)
            return;
        for (const participant of conversation.participants) {
            if (participant.user._id.equals(user._id))
                continue;
            const socketId = getSocketId(participant.user._id.toString());
            if (socketId)
                app_1.io.to(socketId).emit("stopTyping", {
                    userId: user._id,
                    conversationId: conversation._id,
                    isTyping: false,
                });
        }
    });
    socket.on("join", async (room, type) => {
        const availableRoom = roomUsersMap.get(room);
        if (!availableRoom) {
            roomUsersMap.set(room, []);
        }
        console.log(availableRoom);
        if (availableRoom) {
            if (availableRoom.length >= 4) {
                app_1.io.to(socket.id).emit("fullCall");
                return;
            }
        }
        const currUsers = roomUsersMap
            .get(room)
            ?.filter((id) => id !== userId);
        const conversation = await conversation_model_1.default.findById(room).populate({
            path: "participants.user",
            select: user_model_1.userSnapshotFields,
        });
        const participant = conversation?.participants.find((participant) => participant.user._id.equals(userId));
        if (!participant)
            return;
        const user = participant.user;
        roomUsersMap.set(room, [...currUsers, userId]);
        currUsers.forEach((id) => {
            const socketId = getSocketId(id);
            if (socketId)
                app_1.io.to(socketId).emit("newParticipant", user);
        });
        if (roomUsersMap.get(room)?.length === 1) {
            conversation?.participants.forEach((participant) => {
                if (participant.user._id.toString() === userId)
                    return;
                const socketId = getSocketId(participant.user._id.toString());
                if (socketId)
                    app_1.io.to(socketId).emit("newCall", conversation, type);
            });
        }
    });
    socket.on("offer", async (id, offer) => {
        const socketId = getSocketId(id);
        if (socketId) {
            const user = await user_model_1.default.findById(userId);
            if (!user)
                return;
            socket.to(socketId).emit("offer", user.getSnapshot(), offer);
        }
    });
    socket.on("answer", (id, answer) => {
        const socketId = getSocketId(id);
        if (socketId)
            socket.to(socketId).emit("answer", userId, answer);
    });
    socket.on("iceCandidate", (room, id, candidate) => {
        const socketId = getSocketId(id);
        if (socketId)
            socket.to(socketId).emit("iceCandidate", userId, candidate);
    });
    socket.on("videoOffer", (id, offer) => {
        const socketId = getSocketId(id);
        if (socketId)
            app_1.io.to(socketId).emit("videoOffer", userId, offer);
    });
    socket.on("videoAnswer", (id, answer) => {
        const socketId = getSocketId(id);
        if (socketId)
            app_1.io.to(socketId).emit("videoAnswer", userId, answer);
    });
    socket.on("toggleEnableAudio", (room, isAudioEnabled) => {
        roomUsersMap.get(room)?.forEach((user) => {
            if (user === userId)
                return;
            const socketId = getSocketId(user);
            if (socketId)
                app_1.io.to(socketId).emit("toggleEnableAudio", userId, isAudioEnabled);
        });
    });
    socket.on("toggleEnableVideo", (room, isVideoEnabled) => {
        roomUsersMap.get(room)?.forEach((user) => {
            if (user === userId)
                return;
            const socketId = getSocketId(user);
            if (socketId)
                app_1.io.to(socketId).emit("toggleEnableVideo", userId, isVideoEnabled);
        });
    });
    socket.on("leaveCall", (room) => {
        const oldUsers = roomUsersMap.get(room);
        if (!oldUsers)
            return;
        roomUsersMap.set(room, oldUsers.filter((user) => user !== userId));
        oldUsers.forEach((user) => {
            if (user === userId)
                return;
            const socketId = getSocketId(user);
            if (socketId)
                app_1.io.to(socketId).emit("participantLeft", userId);
        });
    });
};
exports.handleIoConnection = handleIoConnection;
