import { Request, Response } from "express";
import { Types } from "mongoose";
import { getSocketId, io } from "../app";
import Conversation from "../models/conversation.model";
import User from "../models/user.model";

class ConversationsController {
  getConversations = async (req: Request, res: Response) => {
    const conversations = await Conversation.find({
      participants: {
        $elemMatch: { "user._id": req.body.user._id },
      },
    })
      .sort("-updatedAt")
      .lean();

    const me = await User.findById(req.body.user._id).select(["_id"]);
    if (!me) return res.status(500).send({});

    res.send(
      conversations.map((conversation) => {
        const lastMessage = conversation.messages.length
          ? conversation.messages[0]
          : undefined;

        return {
          ...conversation,
          messages: [lastMessage],
          lastMessage: lastMessage,
          isLastMessageSentByMe:
            lastMessage && lastMessage.sender._id.equals(me._id),
          participants: conversation.participants.filter(
            (participant) => !participant.user._id.equals(me._id)
          ),
        };
      })
    );
  };

  getConversation = async (req: Request, res: Response) => {
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

  sendMessage = async (req: Request, res: Response) => {
    const conversationId = req.params["conversationId"];

    if (!Types.ObjectId.isValid(conversationId))
      return res.status(400).send({ message: "Invalid Conversation ID" });

    const conversation = await Conversation.findById(conversationId);

    const me = await User.findById(req.body.user._id);

    // TODO: implement this
    if (!me) return res.status(500).send({});

    if (!conversation) {
      return res.status(404).send({ message: "Conversation not found." });
    }

    const message = {
      _id: new Types.ObjectId(),
      sender: me.getSnapshot(),
      content: req.body.message.content as string,
    };

    for (const participant of conversation.participants) {
      if (participant.user._id.equals(req.body.user._id)) {
        conversation.messages.unshift(message);
        await conversation.save();
        res.status(201).send(message);
        break;
      }
    }

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
}

export default ConversationsController;
