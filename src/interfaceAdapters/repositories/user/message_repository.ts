import { injectable } from "tsyringe";
import { IMessageRepository } from "../../../entities/repositoryInterface/user/message_repository-interface";
import { IMessageModel, MessageModel } from "../../../frameworks/database/models/message_model";
import { ObjectId } from "mongoose";
import { BaseRepository } from "../baseRepo/base_repository";

@injectable()
export class MessageRepository extends BaseRepository<IMessageModel,{
    messageId: string;
    chatId: ObjectId | string;
    senderId: ObjectId | string;
    receiverId: ObjectId | string;
    messageType: "text" | "media";
    content: string;
    mediaUrl?: string;
    status: "sent" | "delivered" | "read";
  }> implements IMessageRepository {
    constructor() {
      super(MessageModel);
    }
    


  async getMessagesByChatId(chatId: string): Promise<IMessageModel[]> {
    return await MessageModel.find({ chatId })
      .sort({ created_at: 1 })
      .populate("senderId", "_id Name profileImage")
      .populate("receiverId", "_id Name profileImage")
      .exec();
  }

  async findById(messageId: string): Promise<IMessageModel | null> {
    return await MessageModel.findById({_id:messageId})
  }
  
  async updateStatus(messageId: string, status: string): Promise<void> {
    await MessageModel.findByIdAndUpdate(
      {_id:messageId},
      {$set:{status}},
      {new:true}
    )
  }

  async findUnReadMessagesCount(userId: string): Promise<number> {
     return await MessageModel.countDocuments({receiverId:userId,status:{$ne:"read"}})
  }


}