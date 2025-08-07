import { injectable, inject } from "tsyringe";
import { IMessageRepository } from "../../../entities/repositoryInterface/user/message_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class UpdateMessageStatusUseCase {
  constructor(
    @inject("IMessageRepository") private messageRepository: IMessageRepository
  ) {}

  async execute(messageId: string, status: 'delivered' | 'read'): Promise<void> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new CustomError(ERROR_MESSAGES.MESSAGE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    await this.messageRepository.updateStatus(messageId, status);
  }
}