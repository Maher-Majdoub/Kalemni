import { Request, Response } from "express";
import User, { userSnapshotFields } from "../models/user.model";
import { Types } from "mongoose";
import Conversation from "../models/conversation.model";

export const getMe = async (req: Request) => {
  const me = await User.findById(req.body.user._id)
    .select(["-password", "-username"])
    .populate("friends")
    .populate("friendRequests.user");

  if (!me)
    throw new Error("User is Authenticated and is not found in the database");

  return me;
};

export const getUser = async (
  userId: string | Types.ObjectId,
  res: Response
) => {
  const user = await User.findById(userId).select(userSnapshotFields);

  if (!user) res.status(404).send({ message: "User not found" });
  return user;
};

export const sendBadRequestResponse = async (
  message: String,
  res: Response
) => {
  res.status(400).send({ message: message });
};

export const createFriendship = async (
  user1Id: Types.ObjectId | string,
  user2Id: Types.ObjectId | string
) => {
  await Promise.all([
    User.findByIdAndUpdate(user1Id, { $push: { friends: user2Id } }),
    User.findByIdAndUpdate(user2Id, { $push: { friends: user1Id } }),
    Conversation.create([
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
