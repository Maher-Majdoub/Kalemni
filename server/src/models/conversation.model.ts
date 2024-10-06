import mongoose, { Model, Schema, Types } from "mongoose";
import { IUserSnapshot, userSnapshotSchema } from "./user.model";

interface IMessage {
  _id: Types.ObjectId;
  sender: IUserSnapshot;
  content: String;
  updatedAt?: Date;
  createdAt?: Date;
}

interface IConversation {
  _id: Types.ObjectId;
  type: "p" | "g";
  participants: {
    user: IUserSnapshot;
    lastSawMessageId: Types.ObjectId;
  }[];
  messages: IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

type ConversationModel = Model<IConversation, {}>;

const messageSchema = new Schema(
  {
    sender: userSnapshotSchema,
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
    participants: [
      { user: userSnapshotSchema, lastSawMessageId: { type: Types.ObjectId } },
    ],
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
