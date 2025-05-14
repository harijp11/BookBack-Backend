// import { ChatModel } from '../../../frameworks/database/models/chat_model';
// import { IMessageEntity } from '../../../entities/models/IMessageEntity';
import { IChatRepository } from '../../../entities/repositoryInterface/user/chat_repository-interface';
import { IMessageRepository } from '../../../entities/repositoryInterface/user/message_repository-interface';
import { ISendMessageUseCase } from '../../../entities/useCaseInterfaces/user/chat/send_message_usecase-interface';
import { inject, injectable } from 'tsyringe';
import { randomUUID } from 'crypto';
import { IMessageModel } from '../../../frameworks/database/models/message_model';


@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject("IChatRepository")
    private _chatRepository: IChatRepository,
    @inject("IMessageRepository")
    private _messageRepository: IMessageRepository
  ) {}

  async execute({
          senderId,
          receiverId,
          content,
          mediaUrl,
          messageType,
        }: {
          senderId: string;
          receiverId: string;
          content?: string;
          mediaUrl?: string;
          messageType: 'text' | 'media';
        }): Promise<{ chatId: string; message: IMessageModel }> {
    let chat = await this._chatRepository.findChatByParticipants(senderId, receiverId);

    
    const last_message = content || (mediaUrl ? 'Media' : '');
    if (!chat) {
      let Chat = {
        chatId:`BkBc-chat-${randomUUID().slice(10)}`,
        userId1: senderId,
        userId2: receiverId,
        last_message,
      }
      chat =  await this._chatRepository.createChat(Chat);
    } else {
       await this._chatRepository.updateLastMessage(chat._id.toString(), last_message);
    }

    

    const status:"sent"| "delivered" | "read" = 'sent'



    const message = {
      messageId: `BkBc-message-${randomUUID().slice(10)}`,
      chatId: chat!._id,
      senderId,
      receiverId,
      messageType,
      content: content || "",
      mediaUrl,
      status,
    }
    const Message =  await this._messageRepository.saveMessage(message);
  
    return { chatId: chat!._id.toString(), message:Message };
  }
}