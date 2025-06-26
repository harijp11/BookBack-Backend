import { ObjectId,  } from "mongoose";
import { IMessageModel } from "../../../frameworks/database/models/message_model";
import { IBaseRepository } from "../baseRepo/base_repository-interface";

export interface IMessageRepository extends IBaseRepository<IMessageModel,{
         messageId: string;
         chatId: ObjectId | string;
         senderId: ObjectId | string;
        receiverId: ObjectId | string;
        messageType: "text" | "media";
         content: string;
         mediaUrl?: string;
         status: "sent" | "delivered" | "read";
       }>{
    // saveMessage(message: {
    //     messageId: string;
    //     chatId: ObjectId | string;
    //     senderId: ObjectId | string;
    //     receiverId: ObjectId | string;
    //     messageType: "text" | "media";
    //     content: string;
    //     mediaUrl?: string;
    //     status: "sent" | "delivered" | "read";
    //   }): Promise<IMessageModel>;
    getMessagesByChatId(chatId: string): Promise<IMessageModel[]>;
    findById(messageId:string):Promise<IMessageModel | null>
    // updateStatus(messageId:string,status:string):Promise<void>
    findUnReadMessagesCount(userId:string):Promise<number>
}