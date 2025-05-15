import { INotificationModel } from "../../frameworks/database/models/notification_model";

export interface Paginatednotifications {
    notifications: INotificationModel[] | []
    totalnotifications: number;
    totalPages: number;
    currentPage: number;
  }