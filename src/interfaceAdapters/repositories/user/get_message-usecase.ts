import { inject, injectable } from "tsyringe";
import { IGetMessageUseCase } from "../../../entities/useCaseInterfaces/user/chat/get_message_usecase-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { IMessageModel } from "../../../frameworks/database/models/message_model";
import { IMessageRepository } from "../../../entities/repositoryInterface/user/message_repository-interface";

@injectable()
export class GetMessageUseCase implements IGetMessageUseCase{
    constructor(
       @inject("IMessageRepository")
       private _messageRepository:IMessageRepository
    ) {}
     async execute(messageId: string): Promise<IMessageModel | null> {
         const message = await this._messageRepository.findById(messageId);
      if (!message) {
        throw new CustomError('Message not found', 404);
      }
      return message;
    }
}