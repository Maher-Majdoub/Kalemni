import { Request, Response } from "express";
import { getSocketId } from "../socket";
import { Types } from "mongoose";
import { getMe } from "./utils";
import { io } from "../app";
import User, { userSnapshotFields } from "../models/user.model";
import Conversation from "../models/conversation.model";
import asyncMiddleware from "../middlewares/async.middleware";

export const getConversations = asyncMiddleware(
  async (req: Request, res: Response) => {
    const userId = req.body.user._id;

    const conversations = await Conversation.find({
      participants: {
        $elemMatch: { user: userId },
      },
    })
      .populate({
        path: "participants.user",
        select: userSnapshotFields,
      })
      .sort("-updatedAt")
      .lean();

    const filteredConversations = conversations.map((conversation) => {
      const lastMessage = conversation.messages.length
        ? conversation.messages[0]
        : undefined;

      const me = conversation.participants.find((participant) =>
        participant.user._id.equals(userId)
      );

      if (!me) return res.status(404).send();

      let cntNewMessages = 0;
      for (const message of conversation.messages) {
        if (me.lastSawMessageId?.equals(message._id) || cntNewMessages >= 10)
          break;
        cntNewMessages++;
      }

      return {
        ...conversation,
        lastMessage: lastMessage,
        isLastMessageSentByMe:
          lastMessage && lastMessage.sender.equals(me.user._id),
        participants: conversation.participants.filter(
          (participant) => !participant.user._id.equals(me.user._id)
        ),
        cntNewMessages: cntNewMessages,
      };
    });

    res.send(filteredConversations);
  }
);

export const getConversation = asyncMiddleware(
  async (req: Request, res: Response) => {
    const conversationId = req.params["conversationId"];

    if (!Types.ObjectId.isValid(conversationId))
      return res.status(400).send({ message: "Invalid Conversation ID" });

    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: "participants.user",
        select: userSnapshotFields,
      })
      .populate({
        path: "messages.sender",
        select: userSnapshotFields,
      })
      .lean();

    if (conversation)
      for (const participant of conversation.participants) {
        if (participant.user._id == req.body.user._id) {
          return res.send({
            ...conversation,
            participants: conversation.participants.filter(
              (participant) => !participant.user._id.equals(req.body.user._id)
            ),
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
  }
);

export const getSharedMedia = asyncMiddleware(
  async (req: Request, res: Response) => {
    const conversationId = req.params["conversationId"];

    const conversation = await Conversation.findById(conversationId).select(
      "sharedMedia"
    );

    if (!conversation)
      return res.status(404).send({ message: "Conversation not found" });

    res.send(conversation.sharedMedia);
  }
);

export const sendMessage = asyncMiddleware(
  async (req: Request, res: Response) => {
    const conversationId = req.params["conversationId"];

    if (!Types.ObjectId.isValid(conversationId))
      return res.status(400).send({ message: "Invalid Conversation ID" });

    const me = await getMe(req);

    const message = {
      _id: new Types.ObjectId(),
      sender: me.getSnapshot(),
      type: req.body.message.type,
      content: req.body.message.content as string,
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

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      updateQuery
    );

    if (!conversation) {
      return res.status(404).send({ message: "Conversation not found." });
    }

    res.status(201).send(message);
    for (const participant of conversation.participants) {
      const participantId = String(participant.user._id);
      if (me._id.equals(participantId)) continue;

      const socketId = getSocketId(participantId);
      if (socketId) {
        io.to(socketId).emit("newMessage", {
          conversationId: conversationId,
          message: message,
        });
      }
    }
  }
);

export const createGroupConversation = asyncMiddleware(
  async (req: Request, res: Response) => {
    const userId = req.body.user._id;

    const me = await User.findById(userId);
    if (!me) return res.status(404).send();

    const conversation = new Conversation({
      type: "g",
      name: req.body.conversationName,
      participants: [
        { user: me._id },
        ...req.body.participants.map((participant: string) => {
          return { user: participant };
        }),
      ],
    });

    await conversation.save();
    res.status(201).send(conversation);

    conversation.participants.forEach((participant) => {
      const userId = participant.user.toString();
      if (userId === req.body.user._id) return;

      const socketId = getSocketId(userId);
      if (socketId) io.to(socketId).emit("newConversation");
    });
  }
);

export const addUsersToGroupConversation = asyncMiddleware(
  async (req: Request, res: Response) => {
    const users = req.body.users as string[];
    const conversationId = req.params["conversationId"];

    const toAdd = users.map((user) => {
      return { user: user };
    });

    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      $push: { participants: { $each: toAdd } },
    }).select("_id");

    if (!conversation)
      return res.status(404).send({ message: "Conversation not found" });

    res.status(201).send();

    users.forEach((userId) => {
      const socketId = getSocketId(userId);
      if (socketId) io.to(socketId).emit("newConversation");
    });
  }
);

export const leaveConversation = asyncMiddleware(
  async (req: Request, res: Response) => {
    const conversationId = req.params["conversationId"];

    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      $pull: {
        participants: { user: req.body.user._id },
      },
    });

    if (!conversation)
      return res.status(404).send({ message: "Conversation not found" });

    res.status(204).send({});
  }
);
