import { IMessageModel } from "../../../../frameworks/database/models/message_model";



export interface IReceiveMessagesUseCase {
  execute({ senderId, receiverId }: { senderId: string; receiverId: string }): Promise<IMessageModel[] | []>;
}