import { inject, injectable } from "tsyringe";
import { IGetChatAndNotificationUpdatesUseCase } from "../../../entities/useCaseInterfaces/user/notification/get_chat_and_notification_updates_usecase-interface";
import { IMessageRepository } from "../../../entities/repositoryInterface/user/message_repository-interface";
import { INotificationRepository } from "../../../entities/repositoryInterface/user/notification_repository-interface";

@injectable()
export class GetChatAndNotificationUpdatesUseCase implements IGetChatAndNotificationUpdatesUseCase{
    constructor(
        @inject("IMessageRepository")
        private _messageRepository:IMessageRepository,
        @inject("INotificationRepository")
        private _notificationRepository:INotificationRepository
    ){}

    async execute(userId: string): Promise<{ unReadMessagesCount: number; unReadNotificationsCount: number }> {
        
        const unReadMessagesCount = await this._messageRepository.findUnReadMessagesCount(userId)

        const unReadNotificationsCount = await this._notificationRepository.findUnReadCountByUserId(userId)

            return {
                unReadMessagesCount,
                unReadNotificationsCount
            }
    }
}