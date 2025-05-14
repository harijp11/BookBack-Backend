import { Schema, Types } from "mongoose";
import { IMessageModel } from "../models/message_model";

export const MessageSchema = new Schema<IMessageModel>(
  {
    messageId: { type: String, required: true },
    chatId: { type: Schema.Types.ObjectId, required: true, ref: "Chat" },
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    receiverId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    messageType: { type: String, enum: ["text", "media"], required: true },
    content: { type: String, default: "" },
    mediaUrl: { type: String },
    status: { type: String, enum: ["sent", "delivered", "read"], required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);
