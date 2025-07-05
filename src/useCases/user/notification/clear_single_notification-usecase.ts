import { inject, injectable } from "tsyringe";
import { IClearSingleNotificationUseCase } from "../../../entities/useCaseInterfaces/user/notification/clear_single_notification_usecase-interface";
import { INotificationRepository } from "../../../entities/repositoryInterface/user/notification_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class ClearSingleNotificationUseCase implements IClearSingleNotificationUseCase{
    constructor(
       @inject("INotificationRepository")
       private _notificationRepository:INotificationRepository
    ){}

    async execute(notificationId: string): Promise<void> {
        if(!notificationId){
            throw new CustomError(ERROR_MESSAGES.NOTIFICATION_ID_NOT_AVAILABLE,HTTP_STATUS.NOT_FOUND)
        }

        await this._notificationRepository.findByIdAndDelete(notificationId)
    }
}