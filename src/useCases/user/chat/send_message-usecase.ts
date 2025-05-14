import { injectable, inject } from 'tsyringe';
import { ISendMessageUseCase } from '../../../entities/useCaseInterfaces/user/chat/send_message_usecase-interface';
import { IChatRepository } from '../../../entities/repositoryInterface/user/chat_repository-interface';
import { IMessageRepository } from '../../../entities/repositoryInterface/user/message_repository-interface';
import { Message } from '../../../entities/socket/socket_server-interface';
import { v4 as uuidv4 } from 'uuid';
import { model } from 'mongoose';

interface IUser {
  _id: string;
  Name: string;
  profileImage?: string;
}

const UserModel = model<IUser>('User');

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject('IChatRepository') private chatRepository: IChatRepository,
    @inject('IMessageRepository') private messageRepository: IMessageRepository
  ) {}

  async execute(data: {
    senderId: string;
    receiverId: string;
    content?: string;
    mediaUrl?: string;
    messageType: 'text' | 'media';
  }): Promise<{ chatId: string; message: Message; isNewChat: boolean }> {
    // Find or create chat
    let chat = await this.chatRepository.findChatByParticipants(data.senderId, data.receiverId);
    let isNewChat = false;

    const lastMessage = data.content || data.mediaUrl || '';

    if (!chat) {
      chat = await this.chatRepository.createChat({
        chatId: uuidv4(),
        userId1: data.senderId,
        userId2: data.receiverId,
        last_message: lastMessage,
      });
      isNewChat = true;
    } else {
      chat = await this.chatRepository.updateLastMessage(chat.chatId, lastMessage);
    }

    if (!chat) {
      throw new Error('Failed to create or update chat');
    }

    // Create message
    const message = await this.messageRepository.saveMessage({
      messageId: uuidv4(),
      chatId: chat._id.toString(),
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content || '',
      mediaUrl: data.mediaUrl || '',
      messageType: data.messageType,
      status: 'sent',
    });

    // Fetch user data
    const [sender, receiver] = await Promise.all([
      UserModel.findById(data.senderId).select('_id Name profileImage').lean().exec(),
      UserModel.findById(data.receiverId).select('_id Name profileImage').lean().exec(),
    ]);

    if (!sender || !receiver) {
      throw new Error('Failed to fetch sender or receiver data');
    }

    return {
      chatId: chat.chatId,
      message: {
        messageId: message.messageId.toString(),
        chatId: message.chatId.toString(),
        senderId: {
          _id: sender._id.toString(),
          Name: sender.Name,
          profileImage: sender.profileImage,
        },
        receiverId: {
          _id: receiver._id.toString(),
          Name: receiver.Name,
          profileImage: receiver.profileImage,
        },
        content: message.content ?? "",
        mediaUrl: message.mediaUrl || '',
        messageType: message.messageType,
        status: message.status,
        created_at: message.created_at.toISOString(),
        updated_at: message.updated_at.toISOString(),
      },
      isNewChat,
    };
  }
}