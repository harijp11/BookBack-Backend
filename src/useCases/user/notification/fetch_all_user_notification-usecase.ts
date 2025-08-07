import { inject, injectable } from "tsyringe";
import { IFetchAllUserNoticationUseCase } from "../../../entities/useCaseInterfaces/user/notification/fetch_all_user_notification_usecase-interface";
import { INotificationRepository } from "../../../entities/repositoryInterface/user/notification_repository-interface";
import { Paginatednotifications } from "../../../entities/models/paginated_notification_entity";
import { CustomError } from "../../../entities/utils/custom_error";
import { BOOK_ERROR_RESPONSES, ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class FetchAllUserNotificationUseCase
  implements IFetchAllUserNoticationUseCase
{
  constructor(
    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository
  ) {}

  async execute(
    userId: string,
    Filter: object,
    page: number,
    limit: number
  ): Promise<Paginatednotifications> {
    if (!userId) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const skip = (page - 1) * limit;

    const result = await this._notificationRepository.findNotificationByUserId(
      userId,
      Filter,
      limit,
      skip
    );

    if (!result) {
      throw new CustomError(BOOK_ERROR_RESPONSES.BOOKS_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const { getNotifications, count } = result;

    const notifications = getNotifications();

    const totalPages = Math.ceil(count / limit);
    
    await this._notificationRepository.UpdateReadStatus(userId);

    return {
      notifications: notifications || [],
      totalnotifications: Number(count),
      totalPages,
      currentPage: page,
    };
  }
}
