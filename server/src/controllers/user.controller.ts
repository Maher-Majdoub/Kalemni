import { getSocketId, isConnected } from "../socket";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { io } from "../app";
import User, {
  validateUpdateLoginInfosData,
  validateUpdateProfileInfosData,
} from "../models/user.model";
import Conversation from "../models/conversation.model";
import { hashPassword, validatePassword } from "../utils";

export const getUser = async (userId: string, fields?: string[]) =>
  await User.findById(userId)
    .select([...(fields || [])])
    .select("-password");

export const getMe = async (req: Request, fields?: string[]) => {
  const me = await getUser(req.body.user._id, fields);
  if (!me) {
    // this should not be happened
    throw new Error("User is Authenticated and is not found in the database");
  }
  return me;
};

export const getProfile = async (req: Request, res: Response) => {
  res.send(await getMe(req));
};

export const updateProfileInfos = async (req: Request, res: Response) => {
  const errors = validateUpdateProfileInfosData(req.body.data);

  if (errors.length) return res.status(400).send({ errors: errors });

  const user = await User.findByIdAndUpdate(req.body.user._id, req.body.data);
  if (!user) return res.status(404).send({ message: "User not found" });

  res.status(201).send(req.body.data);
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  const filePath = `/uploads/profilePictures/${req.file?.filename}`;
  await User.findByIdAndUpdate(req.body.user._id, {
    profilePicture: filePath,
  });

  res.send({ picture: filePath });
};

export const deleteProfilePicture = async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(req.body.user._id, {
    profilePicture: null,
  });

  res.status(204).send({});
};

export const updateLoginInfos = async (req: Request, res: Response) => {
  const errors = validateUpdateLoginInfosData(req.body.data);

  if (errors.length) return res.status(400).send({ errors: errors });

  const newPassword = req.body.data.newPassword;
  const newUsername = req.body.data.newUsername;
  const oldPassword = req.body.data.oldPassword;

  if (!newPassword && !newUsername) {
    return res
      .status(400)
      .send({ message: "You should update at least one value" });
  }

  const user = await User.findById(req.body.user._id);

  if (!user) return res.send();

  if (!validatePassword(oldPassword, user.password))
    return res.status(400).send({ message: "Old password is incorrect" });

  if (newPassword) user.password = hashPassword(newPassword);
  if (newUsername) user.username = newUsername;

  await user.save();
  res.status(201).send();
};

export const getFriends = async (req: Request, res: Response) => {
  const user = await getMe(req, ["friends"]);
  res.send(user.friends);
};

export const getOnlineFriends = async (req: Request, res: Response) => {
  const me = await getMe(req, ["friends"]);

  const onlineFriends = [];
  for (const friend of me.friends) {
    if (isConnected(String(friend._id)))
      onlineFriends.push({
        _id: friend._id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        profilePicture: friend.profilePicture,
      });
  }

  res.send(onlineFriends);
};

export const getNewFriends = async (req: Request, res: Response) => {
  const me = await getMe(req, ["friendRequests", "friends"]);

  // To Do: Implement a better solution
  const usersToExcelude = [];
  for (const friend of me.friends) usersToExcelude.push(friend._id);
  for (const friend of me.friendRequests) usersToExcelude.push(friend._id);

  const users = await User.find({
    _id: { $nin: usersToExcelude, $ne: me._id },
    friendRequests: {
      $not: {
        $elemMatch: {
          "user._id": me._id,
        },
      },
    },
  }).select(["firstName", "lastName", "profilePicture"]);

  res.send(users);
};

export const getFriendRequests = async (req: Request, res: Response) => {
  const me = await getMe(req, ["friendRequests"]);
  res.send(me.friendRequests);
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  const userId = req.params["userId"];

  if (!Types.ObjectId.isValid(userId))
    return res.status(400).send({ message: "Invalid object id" });

  const user = await getUser(userId);
  if (!user) return res.status(404).send({ message: "User not found" });

  const me = await getMe(req, [
    "firstName",
    "lastName",
    "bio",
    "profilePicture",
  ]);

  const friendRequest = {
    _id: new Types.ObjectId(),
    user: me.getSnapshot(),
  };

  user.friendRequests.push(friendRequest);
  await user.save();

  res.status(201).send(friendRequest);

  const recipientSocketId = getSocketId(userId);
  if (recipientSocketId)
    io.to(recipientSocketId).emit("newFriendRequest", friendRequest);
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  const me = await getMe(req, [
    "friendRequests",
    "friends",
    "firstName",
    "lastName",
    "bio",
    "profilePicture",
  ]);
  const requestId = req.params["requestId"];

  const friendRequest = me.friendRequests.find((friendRequest) =>
    friendRequest._id.equals(requestId)
  );

  if (!friendRequest?.user)
    return res.status(404).send({ message: "Friend request not found" });

  const user = await User.findById(friendRequest.user._id).select([
    "friends",
    "firstName",
    "lastName",
    "bio",
    "profilePicture",
  ]);

  if (!user) return res.status(404).send({ message: "User not found" });

  const meSnapshot = me.getSnapshot();
  const userSnapshot = user.getSnapshot();

  user.friends.push(meSnapshot);
  me.friends.push(userSnapshot);

  const friendRequestIndex = me.friendRequests.findIndex((req) =>
    req._id.equals(friendRequest._id)
  );

  if (friendRequestIndex !== -1)
    me.friendRequests.splice(friendRequestIndex, 1);

  await Promise.all([
    me.save(),
    user.save(),
    Conversation.create([
      {
        type: "p",
        participants: [
          { user: meSnapshot, lastSeen: Date.now() },
          { user: friendRequest.user, lastSeen: Date.now() },
        ],
      },
    ]),
  ]);

  res.status(201).send({});
};

export const refuseFriendRequest = async (req: Request, res: Response) => {
  const me = await getMe(req, ["friendRequests"]);
  const requestId = req.params["requestId"];

  const friendRequestIndex = me.friendRequests.findIndex((req) =>
    req._id.equals(requestId)
  );

  if (friendRequestIndex !== -1) {
    me.friendRequests.splice(friendRequestIndex, 1);
    await me.save();
  }
  res.status(204).send({});
};
