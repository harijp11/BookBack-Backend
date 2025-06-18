import { injectable, inject } from 'tsyringe';
import { ISendMessageUseCase } from '../../../entities/useCaseInterfaces/user/chat/send_message_usecase-interface';
import { IChatRepository } from '../../../entities/repositoryInterface/user/chat_repository-interface';
import { IMessageRepository } from '../../../entities/repositoryInterface/user/message_repository-interface';
import { Message } from '../../../entities/socket/socket_server-interface';
import { v4 as uuidv4 } from 'uuid';
import { model } from 'mongoose';
import { IUserRepository } from '../../../entities/repositoryInterface/user/user_repository-interface';

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
    @inject('IMessageRepository') private messageRepository: IMessageRepository,
    @inject("IUserRepository") private _userRepository: IUserRepository
  ) {}

  private getMediaType(url?: string): 'image' | 'video' | 'pdf' | 'unknown' {
    if (!url) return 'unknown';
    // Remove query parameters and get extension
    const cleanUrl = url.split('?')[0];
    const extension = cleanUrl.split('.').pop()?.toLowerCase();
    if (!extension) return 'unknown';

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    const pdfExtensions = ['pdf'];

    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    if (pdfExtensions.includes(extension)) return 'pdf';
    return 'unknown';
  }

  async execute(data: {
    senderId: string;
    receiverId: string;
    content?: string;
    mediaUrl?: string;
    messageType: 'text' | 'media';
  }): Promise<{ chatId: string; message: Message; isNewChat: boolean }> {
    // Compute last_message based on messageType
    let last_message = '';
    if (data.messageType === 'text' && data.content) {
      last_message = data.content;
    } else if (data.messageType === 'media' && data.mediaUrl) {
      const mediaType = this.getMediaType(data.mediaUrl);
      switch (mediaType) {
        case 'image':
          last_message = 'Image';
          break;
        case 'video':
          last_message = 'Video';
          break;
        case 'pdf':
          last_message = 'PDF';
          break;
        default:
          last_message = 'File';
      }
    }

    // Find or create chat
    let chat = await this.chatRepository.findChatByParticipants(data.senderId, data.receiverId);
    let isNewChat = false;

    if (!chat) {
      chat = await this.chatRepository.create({
        chatId: uuidv4(),
        userId1: data.senderId,
        userId2: data.receiverId,
        last_message,
      });
      isNewChat = true;
    } else {
      chat = await this.chatRepository.updateLastMessage(chat.chatId, last_message);
    }

    if (!chat) {
      throw new Error('Failed to create or update chat');
    }

    // Create message
    const message = await this.messageRepository.create({
      messageId: uuidv4(),
      chatId: chat._id.toString(),
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content || '',
      mediaUrl: data.mediaUrl || '',
      messageType: data.messageType,
      status: 'sent',
    });

    const { sender, receiver } = await this._userRepository.findSenderAndReceiver(data.senderId, data.receiverId);

    if (!sender || !receiver) {
      throw new Error('Failed to fetch sender or receiver data');
    }

    return {
      chatId: chat.chatId,
      message: {
        _id:message!._id,
        messageId: message!.messageId.toString(),
        chatId: message!.chatId.toString(),
        senderId: {
          _id: sender._id.toString(),
          Name: sender.Name || "",
          profileImage: sender.profileImage,
        },
        receiverId: {
          _id: receiver._id.toString(),
          Name: receiver.Name || "",
          profileImage: receiver.profileImage,
        },
        content: message!.content ?? "",
        mediaUrl: message!.mediaUrl || '',
        messageType: message!.messageType,
        status: message!.status,
        created_at: message!.created_at.toISOString(),
        updated_at: message!.updated_at.toISOString(),
      },
      isNewChat,
    };
  }
}