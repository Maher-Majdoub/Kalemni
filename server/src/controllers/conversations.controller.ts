import { Request, Response } from "express";
import Conversation from "../models/conversation.model";

class ConversationsController {
  getConversations = async (req: Request, res: Response) => {
    const conversations = await Conversation.find({
      "participants.userId": req.body.user._id,
    }).sort("updatedAt");

    res.send(conversations);
  };
}

export default ConversationsController;
