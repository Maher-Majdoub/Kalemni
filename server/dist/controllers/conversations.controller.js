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
exports.leaveConversation = exports.addUsersToGroupConversation = exports.createGroupConversation = exports.sendMessage = exports.getSharedMedia = exports.getConversation = exports.getConversations = void 0;
const socket_1 = require("../socket");
const mongoose_1 = require("mongoose");
const utils_1 = require("./utils");
const app_1 = require("../app");
const user_model_1 = __importStar(require("../models/user.model"));
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const async_middleware_1 = __importDefault(require("../middlewares/async.middleware"));
exports.getConversations = (0, async_middleware_1.default)(async (req, res) => {
    const userId = req.body.user._id;
    const conversations = await conversation_model_1.default.find({
        participants: {
            $elemMatch: { user: userId },
        },
    })
        .populate({
        path: "participants.user",
        select: user_model_1.userSnapshotFields,
    })
        .sort("-updatedAt")
        .lean();
    const filteredConversations = conversations.map((conversation) => {
        const lastMessage = conversation.messages.length
            ? conversation.messages[0]
            : undefined;
        const me = conversation.participants.find((participant) => participant.user._id.equals(userId));
        if (!me)
            return res.status(404).send();
        let cntNewMessages = 0;
        for (const message of conversation.messages) {
            if (me.lastSawMessageId?.equals(message._id) || cntNewMessages >= 10)
                break;
            cntNewMessages++;
        }
        return {
            ...conversation,
            lastMessage: lastMessage,
            isLastMessageSentByMe: lastMessage && lastMessage.sender.equals(me.user._id),
            participants: conversation.participants.filter((participant) => !participant.user._id.equals(me.user._id)),
            cntNewMessages: cntNewMessages,
        };
    });
    res.send(filteredConversations);
});
exports.getConversation = (0, async_middleware_1.default)(async (req, res) => {
    const conversationId = req.params["conversationId"];
    if (!mongoose_1.Types.ObjectId.isValid(conversationId))
        return res.status(400).send({ message: "Invalid Conversation ID" });
    const conversation = await conversation_model_1.default.findById(conversationId)
        .populate({
        path: "participants.user",
        select: user_model_1.userSnapshotFields,
    })
        .populate({
        path: "messages.sender",
        select: user_model_1.userSnapshotFields,
    })
        .lean();
    if (conversation)
        for (const participant of conversation.participants) {
            if (participant.user._id == req.body.user._id) {
                return res.send({
                    ...conversation,
                    participants: conversation.participants.filter((participant) => !participant.user._id.equals(req.body.user._id)),
                    messages: conversation.messages.map((message) => {
                        return {
                            ...message,
                            sentByMe: message.sender?._id == req.body.user._id,
                        };
                    }),
                });
            }
        }
    // the user is not in the conversation or the conversation not found
    return res.status(404).send({ message: "Conversation not found." });
});
exports.getSharedMedia = (0, async_middleware_1.default)(async (req, res) => {
    const conversationId = req.params["conversationId"];
    const conversation = await conversation_model_1.default.findById(conversationId).select("sharedMedia");
    if (!conversation)
        return res.status(404).send({ message: "Conversation not found" });
    res.send(conversation.sharedMedia);
});
exports.sendMessage = (0, async_middleware_1.default)(async (req, res) => {
    const conversationId = req.params["conversationId"];
    if (!mongoose_1.Types.ObjectId.isValid(conversationId))
        return res.status(400).send({ message: "Invalid Conversation ID" });
    const me = await (0, utils_1.getMe)(req);
    const message = {
        _id: new mongoose_1.Types.ObjectId(),
        sender: me.getSnapshot(),
        type: req.body.message.type,
        content: req.body.message.content,
        createdAt: new Date(Date.now()),
    };
    const updateQuery = {
        $push: {
            messages: {
                $each: [message],
                $position: 0,
            },
            sharedMedia: ["video", "image"].includes(message.type)
                ? {
                    $each: [{ src: message.content, type: message.type }],
                    $position: 0,
                }
                : undefined,
        },
    };
    const conversation = await conversation_model_1.default.findByIdAndUpdate(conversationId, updateQuery);
    if (!conversation) {
        return res.status(404).send({ message: "Conversation not found." });
    }
    res.status(201).send(message);
    for (const participant of conversation.participants) {
        const participantId = String(participant.user._id);
        if (me._id.equals(participantId))
            continue;
        const socketId = (0, socket_1.getSocketId)(participantId);
        if (socketId) {
            app_1.io.to(socketId).emit("newMessage", {
                conversationId: conversationId,
                message: message,
            });
        }
    }
});
exports.createGroupConversation = (0, async_middleware_1.default)(async (req, res) => {
    const userId = req.body.user._id;
    const me = await user_model_1.default.findById(userId);
    if (!me)
        return res.status(404).send();
    const conversation = new conversation_model_1.default({
        type: "g",
        name: req.body.conversationName,
        participants: [
            { user: me._id },
            ...req.body.participants.map((participant) => {
                return { user: participant };
            }),
        ],
    });
    await conversation.save();
    res.status(201).send(conversation);
    conversation.participants.forEach((participant) => {
        const userId = participant.user.toString();
        if (userId === req.body.user._id)
            return;
        const socketId = (0, socket_1.getSocketId)(userId);
        if (socketId)
            app_1.io.to(socketId).emit("newConversation");
    });
});
exports.addUsersToGroupConversation = (0, async_middleware_1.default)(async (req, res) => {
    const users = req.body.users;
    const conversationId = req.params["conversationId"];
    const toAdd = users.map((user) => {
        return { user: user };
    });
    const conversation = await conversation_model_1.default.findByIdAndUpdate(conversationId, {
        $push: { participants: { $each: toAdd } },
    }).select("_id");
    if (!conversation)
        return res.status(404).send({ message: "Conversation not found" });
    res.status(201).send();
    users.forEach((userId) => {
        const socketId = (0, socket_1.getSocketId)(userId);
        if (socketId)
            app_1.io.to(socketId).emit("newConversation");
    });
});
exports.leaveConversation = (0, async_middleware_1.default)(async (req, res) => {
    const conversationId = req.params["conversationId"];
    const conversation = await conversation_model_1.default.findByIdAndUpdate(conversationId, {
        $pull: {
            participants: { user: req.body.user._id },
        },
    });
    if (!conversation)
        return res.status(404).send({ message: "Conversation not found" });
    res.status(204).send({});
});
