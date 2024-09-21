import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import User from "../models/user.model";
import auth from "./auth.routes";
import mongoose from "mongoose";
import Message from "../models/message.model";

const router = express.Router();

router.use("/", auth);

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.body.user._id).select("-password");
  res.send(user);
});

router.get("/me/friends", authMiddleware, async (req, res) => {
  const me = await User.findById(req.body.user._id).select("friends");
  res.send(me?.friends);
});

router.get(
  "/me/friends/:friendId/messages",
  authMiddleware,
  async (req, res) => {
    const friendId = req.params["friendId"];

    if (!mongoose.Types.ObjectId.isValid(friendId))
      return res.status(400).send({ message: "Invalid object id" });

    const user = await User.findById(friendId).select("_id");
    if (!user) return res.status(404).send({ message: "User not found." });

    const messages = await Message.find({
      senderId: {
        $in: [friendId, req.body.user._id],
      },
      recipientId: {
        $in: [friendId, req.body.user._id],
      },
    }).sort("-createdAt");

    res.send(messages);
  }
);

router.post("/:userId/request", authMiddleware, async (req, res) => {
  const userId = req.params["userId"];
  const user = await User.findById(userId);
  if (!user) return res.status(404).send({ message: "User not found" });

  const me = await User.findById(req.body.user._id);

  if (!me) {
    // this should not be happened
    throw new Error("User is Authenticated and is not found in the database");
  }

  const newFriend = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  me.friends.push(newFriend);
  me.save();

  res.status(201).send(newFriend);
});

export default router;
