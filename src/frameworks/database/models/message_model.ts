import { model, ObjectId } from "mongoose";
import { IMessageEntity } from "../../../entities/models/IMessageEntity";
import {  MessageSchema } from "../schemas/message_schema";

export interface IMessageModel extends Omit<IMessageEntity, "messageId"|"chatId"|"senderId"|"receiverId">,Document {
  messageId:ObjectId
  chatId:ObjectId
  senderId:ObjectId
  receiverId:ObjectId
}

export const MessageModel = model<IMessageModel>("Message",MessageSchema)