import { IMessageModel } from "../../../../frameworks/database/models/message_model";

export interface IGetMessageUseCase {
    execute(messageId: string): Promise<IMessageModel  | null>
}