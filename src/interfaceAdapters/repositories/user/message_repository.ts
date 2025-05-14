import { injectable } from "tsyringe";
import { IMessageRepository } from "../../../entities/repositoryInterface/user/message_repository-interface";
import { IMessageModel, MessageModel } from "../../../frameworks/database/models/message_model";
import { ObjectId } from "mongoose";

@injectable()
export class MessageRepository implements IMessageRepository {
  async saveMessage(message: {
    messageId: string;
    chatId: ObjectId | string;
    senderId: ObjectId | string;
    receiverId: ObjectId | string;
    messageType: "text" | "media";
    content: string;
    mediaUrl?: string;
    status: "sent" | "delivered" | "read";
  }): Promise<IMessageModel> {
    return await MessageModel.create(message);
  }

  async getMessagesByChatId(chatId: string): Promise<IMessageModel[]> {
    return await MessageModel.find({ chatId })
      .sort({ created_at: 1 })
      .populate("senderId", "_id Name profileImage")
      .populate("receiverId", "_id Name profileImage")
      .exec();
  }
}