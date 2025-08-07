import { inject, injectable } from "tsyringe";
import { IGetMessageUseCase } from "../../../entities/useCaseInterfaces/user/chat/get_message_usecase-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { IMessageModel } from "../../../frameworks/database/models/message_model";
import { IMessageRepository } from "../../../entities/repositoryInterface/user/message_repository-interface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class GetMessageUseCase implements IGetMessageUseCase{
    constructor(
       @inject("IMessageRepository")
       private _messageRepository:IMessageRepository
    ) {}
     async execute(messageId: string): Promise<IMessageModel | null> {
         const message = await this._messageRepository.findById(messageId);
      if (!message) {
        throw new CustomError(ERROR_MESSAGES.MESSAGE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }
      return message;
    }
}