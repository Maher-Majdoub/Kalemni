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

  getFriendRequests = async (req: Request, res: Response) => {
    const me = await this.getMe(req, ["friendRequests"]);
    res.send({ friendRequests: me.friendRequests });
  };

  sendFriendRequest = async (req: Request, res: Response) => {
    const userId = req.params["userId"];

    if (!Types.ObjectId.isValid(userId))
      return res.status(400).send({ message: "Invalid object id" });

    const user = await this.getUser(userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const me = await this.getMe(req, ["friendRequests"]);

    const friendRequest = {
      _id: me._id,
      firstName: me.firstName,
      lastName: me.lastName,
    };

    user.friendRequests.push(friendRequest);
    await user.save();

    res.status(201).send(friendRequest);

    const recipientSocketId = getSocketId(userId);
    if (recipientSocketId)
      io.to(recipientSocketId).emit("newFriendRequest", friendRequest);
  };

  acceptFriendRequest = async (req: Request, res: Response) => {
    const me = await this.getMe(req, ["friendRequests"]);

    const friendRequest = me.friendRequests.find(
      (friendRequest) => friendRequest._id === req.params["friendRequestId"]
    );

    console.log(friendRequest);
  };

  refuseFriendRequest = async (req: Request, res: Response) => {
    const me = await this.getMe(req, ["friendRequests"]);

    const friendRequest = me.friendRequests.find(
      (friendRequest) => friendRequest._id === req.params["friendRequestId"]
    );

    console.log(friendRequest);
  };
}

export default UserController;
