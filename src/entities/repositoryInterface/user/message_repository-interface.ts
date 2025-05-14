import { ObjectId,  } from "mongoose";
import { IMessageModel } from "../../../frameworks/database/models/message_model";

export interface IMessageRepository{
    saveMessage(message: {messageId:string, chatId: ObjectId | string;
        senderId: ObjectId | string;
        receiverId: ObjectId | string,messageType:"text" | "media",content:string,mediaUrl?: string,status?:"sent" | "delivered" | "read"}): Promise<IMessageModel>;
    getMessagesByChatId(chatId: string): Promise<IMessageModel[]>;
}