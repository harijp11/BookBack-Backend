import { injectable } from "tsyringe";
import { IChatRepository } from "../../../entities/repositoryInterface/user/chat_repository-interface";
import { ChatModel, IChatModel } from "../../../frameworks/database/models/chat_model";

@injectable()
export class ChatRepository implements IChatRepository {
  async createChat(chat: {
    chatId: string;
    userId1: string;
    userId2: string;
    last_message?: string;
  }): Promise<IChatModel> {
    return await ChatModel.create(chat);
  }

  async findChatByParticipants(
    userId1: string,
    userId2: string
  ): Promise<IChatModel | null> {
    return await ChatModel.findOne({
      $or: [
        { userId1, userId2 },
        { userId1: userId2, userId2: userId1 },
      ],
    }).exec();
  }

  async updateLastMessage(
    chatId: string,
    last_message: string
  ): Promise<IChatModel | null> {
    return await ChatModel.findOneAndUpdate(
      { chatId },
      { last_message, updatedAt: new Date() },
      { new: true }
    ).exec();
  }

  async findChatByUserId(userId: string): Promise<IChatModel[] | []> {
    return await ChatModel.find({
      $or: [{ userId1: userId }, { userId2: userId }],
    })
      .sort({ updated_at: -1 })
      .populate("userId1", "_id Name profileImage")
      .populate("userId2", "_id Name profileImage")
      .exec();
  }
}