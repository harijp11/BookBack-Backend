import { Message } from "../../../socket/socket_server-interface";

export interface ISendMessageUseCase {
  execute(data: {
    senderId: string;
    receiverId: string;
    content?: string;
    mediaUrl?: string;
    messageType: 'text' | 'media';
  }): Promise<{
    chatId: string;
    message: Message;
    isNewChat: boolean;
  }>;
}