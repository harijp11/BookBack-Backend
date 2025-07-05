import { inject, injectable } from "tsyringe";
import { IClearAllNotificationsUseCase } from "../../../entities/useCaseInterfaces/user/notification/clear_all_notifications_usecase-interface";
import { INotificationRepository } from "../../../entities/repositoryInterface/user/notification_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class ClearAllNotificationsUseCase implements IClearAllNotificationsUseCase{
    constructor(
        @inject("INotificationRepository")
        private _notificationRepository:INotificationRepository
    ){}

    async execute(userId: string): Promise<void> {
        if(!userId){
            throw new CustomError(ERROR_MESSAGES.USER_ID_NOT_AVAILABLE,HTTP_STATUS.NOT_FOUND)
        }
        await this._notificationRepository.findByUserIdAndDelete(userId);
    }
}