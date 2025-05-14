import { Document, model, ObjectId } from "mongoose";
import { IChatEntity } from "../../../entities/models/IChatEntity";
import { ChatSchema } from "../schemas/chat_schema";

export interface IChatModel extends Omit<IChatEntity,"_id"|"chatId"|"userId1"|"userId2">,Document{
    _id:ObjectId
    chatId:string
    userId1:ObjectId
    userId2:ObjectId
}

export const ChatModel = model<IChatModel>("Chat",ChatSchema)