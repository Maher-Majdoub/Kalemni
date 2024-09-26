import mongoose, { Schema, Types } from "mongoose";
import { userSnapshotSchema } from "./user.model";

const messageSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const conversationSchema = new Schema(
  {
    participants: [userSnapshotSchema],
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
