import { injectable, inject } from "tsyringe";
import { IMessageRepository } from "../../../entities/repositoryInterface/user/message_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";

@injectable()
export class UpdateMessageStatusUseCase {
  constructor(
    @inject("IMessageRepository") private messageRepository: IMessageRepository
  ) {}

  async execute(messageId: string, status: 'delivered' | 'read'): Promise<void> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new CustomError("Message not found", 404);
    }
    await this.messageRepository.updateStatus(messageId, status);
  }
}