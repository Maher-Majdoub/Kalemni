import { Request, Response } from "express";
import User from "../models/user.model";
import { io, getSocketId } from "../app";
import { Types } from "mongoose";

class UserController {
  private getUser = async (userId: string, fields?: string[]) =>
    await User.findById(userId)
      .select([...(fields || [])])
      .select("-password");

  private getMe = async (req: Request, fields?: string[]) => {
    const me = await this.getUser(req.body.user._id, fields);
    if (!me) {
      // this should not be happened
      throw new Error("User is Authenticated and is not found in the database");
    }
    return me;
  };

  getProfile = async (req: Request, res: Response) => {
    res.send(await this.getMe(req));
  };

  getFriends = async (req: Request, res: Response) => {
    const user = await this.getMe(req, ["friends"]);
    res.send(user.friends);
  };

  getNewFriends = async (req: Request, res: Response) => {
    const me = await this.getMe(req, ["friendRequests", "friends"]);

    // To Do: Implement a better solution
    const usersToExcelude = [
      me.friends.map((friend) => friend._id),
      me.friendRequests.map((friendRequest) => friendRequest.user?._id),
    ];

    const users = await User.find({
      _id: { $nin: usersToExcelude, $ne: me._id },
      friendRequests: {
        $not: {
          $elemMatch: {
            "user._id": req.body.user._id,
          },
        },
      },
    }).select(["firstName", "lastName", "profilePicture"]);

    res.send(users);
  };

  getFriendRequests = async (req: Request, res: Response) => {
    const me = await this.getMe(req, ["friendRequests"]);
    res.send(me.friendRequests);
  };

  sendFriendRequest = async (req: Request, res: Response) => {
    const userId = req.params["userId"];

    if (!Types.ObjectId.isValid(userId))
      return res.status(400).send({ message: "Invalid object id" });

    const user = await this.getUser(userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const me = await this.getMe(req, [
      "firstName",
      "lastName",
      "bio",
      "profilePicture",
    ]);

    const friendRequest = {
      _id: new Types.ObjectId(),
      user: {
        _id: me._id,
        firstName: me.firstName,
        lastName: me.lastName,
        bio: me.bio,
        profilePicture: me.profilePicture,
      },
    };

    user.friendRequests.push(friendRequest);
    await user.save();

    res.status(201).send(friendRequest);

    const recipientSocketId = getSocketId(userId);
    if (recipientSocketId)
      io.to(recipientSocketId).emit("newFriendRequest", friendRequest);
  };

  acceptFriendRequest = async (req: Request, res: Response) => {
    const me = await this.getMe(req, [
      "friendRequests",
      "friends",
      "firstName",
      "lastName",
      "bio",
      "profilePicture",
    ]);
    const requestId = req.params["requestId"];

    const friendRequest = me.friendRequests.find(
      (friendRequest) => friendRequest._id == requestId
    );

    if (!friendRequest?.user)
      return res.status(404).send({ message: "Friend request not found" });

    const user = await User.findById(friendRequest.user._id).select([
      "friends",
    ]);
    if (!user) return res.status(404).send({ message: "User not found" });

    me.friends.push(friendRequest.user);
    user.friends.push({
      _id: me._id,
      firstName: me.firstName,
      lastName: me.lastName,
      bio: me.bio,
      profilePicture: me.profilePicture,
    });
    me.friendRequests.remove(friendRequest);

    await Promise.all([me.save(), user.save()]);
    res.status(201).send({});
  };

  refuseFriendRequest = async (req: Request, res: Response) => {
    const me = await this.getMe(req, ["friendRequests"]);
    const requestId = req.params["requestId"];

    const friendRequest = me.friendRequests.find(
      (friendRequest) => friendRequest._id == requestId
    );

    me.friendRequests.remove(friendRequest);
    me.save();
    res.status(204).send({});
  };
}

export default UserController;
