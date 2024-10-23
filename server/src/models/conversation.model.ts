import mongoose, { Model, Schema, Types } from "mongoose";
import { IUserSnapshot, userSnapshotSchema } from "./user.model";

interface IMessage {
  _id: Types.ObjectId;
  sender: any;
  type: string;
  content: string;
  updatedAt?: Date;
  createdAt?: Date;
}

interface IMedia {
  src: string;
  type: "image" | "video";
}

interface IConversation {
  _id: Types.ObjectId;
  type: "p" | "g";
  participants: {
    user: any;
    lastSawMessageId?: Types.ObjectId;
  }[];
  messages: IMessage[];
  sharedMedia: IMedia[];
  name?: string;
  picture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ConversationModel = Model<IConversation, {}>;

const messageSchema = new Schema(
  {
    sender: {
      type: Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: ["text", "audio", "image", "video"],
      default: "text",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const conversationSchema = new Schema<IConversation, ConversationModel>(
  {
    type: {
      type: String,
      required: true,
      enum: ["p", "g"],
    },
    name: String,
    picture: String,
    participants: [
      {
        user: { type: Types.ObjectId, ref: "User" },
        lastSawMessageId: { type: Types.ObjectId },
      },
    ],
    messages: [messageSchema],
    sharedMedia: [
      {
        src: String,
        type: {
          type: String,
          enum: ["video", "image"],
        },
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
