// src/entities/mappers/notification.mapper.ts

import { INotificationModel } from "../../../frameworks/database/models/notification_model";
import { NotificationDTO } from "../../dto/notificationDto";

export class NotificationMapper {
  static toDTO(notification: INotificationModel): NotificationDTO {
    return {
      _id: notification._id.toString(),
      userId: notification.userId.toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      navlink: notification.navlink,
      created_at: notification.created_at,
    };
  }

  static toDTOs(notifications: INotificationModel[]): NotificationDTO[] {
    return notifications.map(this.toDTO);
  }
}
