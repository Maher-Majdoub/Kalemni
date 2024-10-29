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
exports.deleteFriend = exports.refuseFriendRequest = exports.acceptFriendRequest = exports.sendFriendRequest = exports.getFriendRequests = exports.getNewFriends = exports.getOnlineFriends = exports.getFriends = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("./utils");
const socket_1 = require("../socket");
const user_model_1 = __importStar(require("../models/user.model"));
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const app_1 = require("../app");
const async_middleware_1 = __importDefault(require("../middlewares/async.middleware"));
exports.getFriends = (0, async_middleware_1.default)(async (req, res) => {
    const user = await (await (0, utils_1.getMe)(req)).populate("friends");
    res.send(user.friends);
});
exports.getOnlineFriends = (0, async_middleware_1.default)(async (req, res) => {
    const me = await (0, utils_1.getMe)(req);
    const onlineFriends = [];
    for (const friend of me.friends) {
        if ((0, socket_1.isConnected)(String(friend._id)))
            onlineFriends.push(friend);
    }
    res.send(onlineFriends);
});
exports.getNewFriends = (0, async_middleware_1.default)(async (req, res) => {
    const me = await (0, utils_1.getMe)(req);
    const usersToExcelude = [];
    for (const friend of me.friends)
        usersToExcelude.push(friend._id);
    for (const friend of me.friendRequests)
        usersToExcelude.push(friend._id);
    const users = await user_model_1.default.find({
        _id: { $nin: usersToExcelude, $ne: me._id },
        friendRequests: {
            $not: {
                $elemMatch: {
                    user: me._id,
                },
            },
        },
    }).select(user_model_1.userSnapshotFields);
    res.send(users);
});
exports.getFriendRequests = (0, async_middleware_1.default)(async (req, res) => {
    const me = await (0, utils_1.getMe)(req);
    res.send(me.friendRequests);
});
exports.sendFriendRequest = (0, async_middleware_1.default)(async (req, res) => {
    const userId = req.params["userId"];
    if (!mongoose_1.Types.ObjectId.isValid(userId))
        return res.status(400).send({ message: "Invalid object id" });
    const me = await (0, utils_1.getMe)(req);
    const request = me.friendRequests.find((friendRequest) => friendRequest.user._id.equals(userId));
    if (request) {
        // both users wants to be friends
        await (0, utils_1.createFriendship)(me._id, userId);
        me.friendRequests = me.friendRequests.filter((r) => r._id !== request._id);
        await me.save();
        return res.status(201).send();
    }
    const user = await user_model_1.default.findByIdAndUpdate(userId, {
        $addToSet: {
            friendRequests: { user: req.body.user._id },
        },
    }).select("_id");
    if (!user)
        return res.status(404).send({ message: "User not found" });
    res.send();
    const socketId = (0, socket_1.getSocketId)(userId);
    if (socketId)
        app_1.io.to(socketId).emit("newFriendRequest");
});
exports.acceptFriendRequest = (0, async_middleware_1.default)(async (req, res) => {
    const me = await (0, utils_1.getMe)(req);
    const requestId = req.params["requestId"];
    const friendRequest = me.friendRequests.find((friendRequest) => friendRequest._id.equals(requestId));
    if (!friendRequest)
        return res.status(404).send({ message: "Friend request not found" });
    const existFriend = me.friends.find((friend) => friend.equals(friendRequest.user._id));
    me.friendRequests = me.friendRequests.filter((r) => r._id !== friendRequest._id);
    await me.save();
    if (!existFriend)
        await (0, utils_1.createFriendship)(friendRequest.user._id, me._id);
    res.status(201).send({});
});
exports.refuseFriendRequest = (0, async_middleware_1.default)(async (req, res) => {
    const me = await (0, utils_1.getMe)(req);
    const requestId = req.params["requestId"];
    const friendRequestIndex = me.friendRequests.findIndex((req) => req._id.equals(requestId));
    if (friendRequestIndex !== -1) {
        me.friendRequests.splice(friendRequestIndex, 1);
        await me.save();
    }
    res.status(204).send({});
});
exports.deleteFriend = (0, async_middleware_1.default)(async (req, res) => {
    const userId = req.params["userId"];
    if (!mongoose_1.Types.ObjectId.isValid(userId))
        return res.status(400).send({ message: "Invalid object id" });
    await Promise.all([
        conversation_model_1.default.findOneAndDelete({
            type: "p",
            "participants.user": { $all: [userId, req.body.user._id] },
        }),
        await user_model_1.default.findByIdAndUpdate(req.body.user._id, {
            $pull: { friends: userId },
        }),
        await user_model_1.default.findByIdAndUpdate(userId, {
            $pull: { friends: req.body.user._id },
        }),
    ]);
    res.status(204).send();
});
