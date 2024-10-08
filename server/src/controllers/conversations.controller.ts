import { Request, Response } from "express";
import { Types } from "mongoose";
import { io } from "../app";
import { getSocketId } from "../socket";
import Conversation from "../models/conversation.model";
import User from "../models/user.model";

export const getConversations = async (req: Request, res: Response) => {
  const userId = req.body.user._id;

  const conversations = await Conversation.find({
    participants: {
      $elemMatch: { "user._id": userId },
    },
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
        lastMessage && lastMessage.sender._id.equals(me.user._id),
      participants: conversation.participants.filter(
        (participant) => !participant.user._id.equals(me.user._id)
      ),
      cntNewMessages: cntNewMessages,
    };
  });
  res.send(filteredConversations);
};

export const getConversation = async (req: Request, res: Response) => {
  const conversationId = req.params["conversationId"];

  if (!Types.ObjectId.isValid(conversationId))
    return res.status(400).send({ message: "Invalid Conversation ID" });

  const conversation = await Conversation.findById(conversationId).lean();

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
};

export const sendMessage = async (req: Request, res: Response) => {
  const conversationId = req.params["conversationId"];

  if (!Types.ObjectId.isValid(conversationId))
    return res.status(400).send({ message: "Invalid Conversation ID" });

  const me = await User.findById(req.body.user._id);
  // TODO: implement this
  if (!me) return res.status(500).send({});

  const message = {
    _id: new Types.ObjectId(),
    sender: me.getSnapshot(),
    type: req.body.message.type,
    content: req.body.message.content as string,
    createdAt: new Date(Date.now()),
  };
  const conversation = await Conversation.findByIdAndUpdate(conversationId, {
    $push: {
      messages: {
        $each: [message],
        $position: 0,
      },
    },
  });

  if (!conversation) {
    return res.status(404).send({ message: "Conversation not found." });
  }

  // await Conversation.findByIdAndUpdate(conversation._id, conversation);

  res.status(201).send(message);

  // for (const participant of conversation.participants) {
  //   if (participant.user._id.equals(req.body.user._id)) {
  //     conversation.messages.unshift(message);
  //     res.status(201).send(message);
  //     break;
  //   }
  // }

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
};

export const createConversationGroup = async (req: Request, res: Response) => {
  const userId = req.body.user._id;

  const me = await User.findById(userId);
  if (!me) return res.status(404).send();

  const conversation = new Conversation({
    type: "g",
    name: req.body.conversationName,
    participants: [{ _id: new Types.ObjectId(), user: me.getSnapshot() }],
  });

  for (const friendId of req.body.participants) {
    const friend = await User.findById(friendId);
    if (!friend)
      return res.status(400).send({ message: "friend do not exist" });

    conversation.participants.push({
      user: friend.getSnapshot(),
    });
  }

  await conversation.save();
  res.status(201).send(conversation);
};
