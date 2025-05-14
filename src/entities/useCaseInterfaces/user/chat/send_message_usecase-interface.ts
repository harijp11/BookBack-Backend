import { IMessageModel } from "../../../../frameworks/database/models/message_model";

export interface ISendMessageUseCase {
    execute({
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
      }): Promise<{ chatId: string; message: IMessageModel }>
}