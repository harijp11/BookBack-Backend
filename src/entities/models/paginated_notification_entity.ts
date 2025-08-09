import { NotificationDTO } from "../../shared/dto/notificationDto";

export interface Paginatednotifications {
    notifications: NotificationDTO[] | []
    totalnotifications: number;
    totalPages: number;
    currentPage: number;
  }