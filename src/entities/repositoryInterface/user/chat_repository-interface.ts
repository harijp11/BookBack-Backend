import { IChatModel } from "../../../frameworks/database/models/chat_model";
import { IChatEntity } from "../../models/IChatEntity";
import { IBaseRepository } from "../baseRepo/base_repository-interface";

export interface IChatRepository extends IBaseRepository<IChatModel,{
    chatId: string;
    userId1: string;
    userId2: string;
    last_message?: string;
  }> {
  // createChat(chat: {
  //   chatId: string;
  //   userId1: string;
  //   userId2: string;
  //   last_message?: string;
  // }): Promise<IChatModel>
  findChatByParticipants(
    userId1: string,
    userId2: string
  ): Promise<IChatModel | null>
  updateLastMessage(
    chatId: string,
    last_message: string
  ): Promise<IChatModel | null>;
  findChatByUserId(userId: string): Promise<IChatModel[] | []>
  }