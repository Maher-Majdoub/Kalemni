import { Types } from "mongoose";
import { createFriendship, getMe } from "./utils";
import { getSocketId, isConnected } from "../socket";
import { Request, Response } from "express";
import User, { userSnapshotFields } from "../models/user.model";
import Conversation from "../models/conversation.model";
import { io } from "../app";
import asyncMiddleware from "../middlewares/async.middleware";

export const getFriends = asyncMiddleware(
  async (req: Request, res: Response) => {
    const user = await (await getMe(req)).populate("friends");
    res.send(user.friends);
  }
);

export const getOnlineFriends = asyncMiddleware(
  async (req: Request, res: Response) => {
    const me = await getMe(req);

    const onlineFriends = [];
    for (const friend of me.friends) {
      if (isConnected(String(friend._id))) onlineFriends.push(friend);
    }
    res.send(onlineFriends);
  }
);

export const getNewFriends = asyncMiddleware(
  async (req: Request, res: Response) => {
    const me = await getMe(req);

    const usersToExcelude = [];
    for (const friend of me.friends) usersToExcelude.push(friend._id);
    for (const friend of me.friendRequests) usersToExcelude.push(friend._id);

    const users = await User.find({
      _id: { $nin: usersToExcelude, $ne: me._id },
      friendRequests: {
        $not: {
          $elemMatch: {
            user: me._id,
          },
        },
      },
    }).select(userSnapshotFields);

    res.send(users);
  }
);

export const getFriendRequests = asyncMiddleware(
  async (req: Request, res: Response) => {
    const me = await getMe(req);
    res.send(me.friendRequests);
  }
);

export const sendFriendRequest = asyncMiddleware(
  async (req: Request, res: Response) => {
    const userId = req.params["userId"];
    if (!Types.ObjectId.isValid(userId))
      return res.status(400).send({ message: "Invalid object id" });

    const me = await getMe(req);

    const request = me.friendRequests.find((friendRequest) =>
      friendRequest.user._id.equals(userId)
    );

    if (request) {
      // both users wants to be friends
      await createFriendship(me._id, userId);
      me.friendRequests = me.friendRequests.filter(
        (r) => r._id !== request._id
      );
      await me.save();
      return res.status(201).send();
    }

    const user = await User.findByIdAndUpdate(userId, {
      $addToSet: {
        friendRequests: { user: req.body.user._id },
      },
    }).select("_id");

    if (!user) return res.status(404).send({ message: "User not found" });
    res.send();

    const socketId = getSocketId(userId);
    if (socketId) io.to(socketId).emit("newFriendRequest");
  }
);

export const acceptFriendRequest = asyncMiddleware(
  async (req: Request, res: Response) => {
    const me = await getMe(req);
    const requestId = req.params["requestId"];

    const friendRequest = me.friendRequests.find((friendRequest) =>
      friendRequest._id.equals(requestId)
    );

    if (!friendRequest)
      return res.status(404).send({ message: "Friend request not found" });
    const existFriend = me.friends.find((friend: Types.ObjectId) =>
      friend.equals(friendRequest.user._id)
    );

    me.friendRequests = me.friendRequests.filter(
      (r) => r._id !== friendRequest._id
    );
    await me.save();

    if (!existFriend) await createFriendship(friendRequest.user._id, me._id);

    res.status(201).send({});
  }
);

export const refuseFriendRequest = asyncMiddleware(
  async (req: Request, res: Response) => {
    const me = await getMe(req);
    const requestId = req.params["requestId"];

    const friendRequestIndex = me.friendRequests.findIndex((req) =>
      req._id.equals(requestId)
    );

    if (friendRequestIndex !== -1) {
      me.friendRequests.splice(friendRequestIndex, 1);
      await me.save();
    }
    res.status(204).send({});
  }
);

export const deleteFriend = asyncMiddleware(
  async (req: Request, res: Response) => {
    const userId = req.params["userId"];

    if (!Types.ObjectId.isValid(userId))
      return res.status(400).send({ message: "Invalid object id" });

    await Promise.all([
      Conversation.findOneAndDelete({
        type: "p",
        "participants.user": { $all: [userId, req.body.user._id] },
      }),

      await User.findByIdAndUpdate(req.body.user._id, {
        $pull: { friends: userId },
      }),

      await User.findByIdAndUpdate(userId, {
        $pull: { friends: req.body.user._id },
      }),
    ]);

    res.status(204).send();
  }
);
