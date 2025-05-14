
import { IChatRepository } from '../../../entities/repositoryInterface/user/chat_repository-interface';
import { IMessageRepository } from '../../../entities/repositoryInterface/user/message_repository-interface';
import { IReceiveMessagesUseCase } from '../../../entities/useCaseInterfaces/user/chat/receive_message_usecase-interface';
import { injectable, inject } from 'tsyringe';
import { IMessageModel } from '../../../frameworks/database/models/message_model';

@injectable()
export class ReceiveMessagesUseCase implements IReceiveMessagesUseCase {
  constructor(
    @inject('IChatRepository') private _chatRepository: IChatRepository,
    @inject('IMessageRepository') private _messageRepository: IMessageRepository
  ) {}

  async execute({ senderId, receiverId }: { senderId: string; receiverId: string }): Promise<IMessageModel[] | []> {
    const chat = await this._chatRepository.findChatByParticipants(senderId, receiverId);
    if (!chat) {
      return [];
    }
    return await this._messageRepository.getMessagesByChatId(chat._id.toString());
  }
}