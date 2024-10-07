import mongoose, { Model, Schema, Types } from "mongoose";
import { IUserSnapshot, userSnapshotSchema } from "./user.model";

interface IMessage {
  _id: Types.ObjectId;
  sender: IUserSnapshot;
  type: string;
  content: string;
  updatedAt?: Date;
  createdAt?: Date;
}

interface IConversation {
  _id: Types.ObjectId;
  type: "p" | "g";
  participants: {
    user: IUserSnapshot;
    lastSawMessageId?: Types.ObjectId;
  }[];
  messages: IMessage[];
  name?: string;
  picture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ConversationModel = Model<IConversation, {}>;

const messageSchema = new Schema(
  {
    sender: userSnapshotSchema,
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
      { user: userSnapshotSchema, lastSawMessageId: { type: Types.ObjectId } },
    ],
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
