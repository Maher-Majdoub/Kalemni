import { Request, Response } from "express";
import { ValidationError } from "joi";
import { Types } from "mongoose";
import User, { userSnapshotFields } from "../models/user.model";
import Conversation from "../models/conversation.model";
import config from "config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

interface FieldError {
  field: string;
  message: string;
}

export interface Error {
  errors: {
    fieldsErrors?: FieldError[];
    generalError?: {
      message: string;
    };
  };
}

export const extractJoiErrors = (error: ValidationError | undefined) => {
  if (error)
    return error.details.map((err) => {
      return {
        field: err.path[0] as string,
        message: err.message.replaceAll('"', ""),
      } as FieldError;
    });

  return [];
};

export const hashPassword = (password: string) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const validatePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const makeToken = (data: object) => {
  return jwt.sign(data, config.get("jwtSecretKey"));
};

interface UserData {
  _id: string;
}

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, config.get("jwtSecretKey"));
    return { isValid: true, data: decoded as UserData };
  } catch (ex) {
    return { isValid: false, data: {} as UserData };
  }
};
