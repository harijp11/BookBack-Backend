import { Schema } from "mongoose";
import { IChatModel } from "../models/chat_model";

export const ChatSchema = new Schema<IChatModel>(
    {
      chatId: { type: String, required: true},
      userId1: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
      userId2: { type:Schema.Types.ObjectId, required: true, ref: 'User' },
      last_message: { type: String },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
  );