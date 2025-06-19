import { INotificationModel } from "../../../frameworks/database/models/notification_model";
import { IBaseRepository } from "../baseRepo/base_repository-interface";

export interface InputNotification {
  userId: string;
  title?: string;
  message: string;
  type: "warning" | "info" | "fault" | "good" | "normal";
  navlink?: string;
}

export interface PaginatedNotificationRepo {
  getNotifications(): INotificationModel[];
  count: number;
}

export interface INotificationRepository
  extends IBaseRepository<INotificationModel, InputNotification> {
  findNotificationByUserId(
    userId: string,
    filter: object,
    limit: number,
    skip: number
  ): Promise<PaginatedNotificationRepo | null>;

  UpdateReadStatus(userId: string): Promise<void>;

  deleteDateExceeded(checkDate: Date): Promise<{
    acknowledged: boolean;
    deletedCount: number;
  }>;

  findUnReadCountByUserId(userId: string): Promise<number>;
}
