import {  injectable } from "tsyringe";
import { INotificationRepository, PaginatedNotificationRepo } from "../../../entities/repositoryInterface/user/notification_repository-interface";
import { NotificationModel } from "../../../frameworks/database/models/notification_model";


@injectable()
export class NotificationRepository implements INotificationRepository{
   async setNotitfication(data: { userId: string; title?: string; message: string; type: "warning" | "info" | "fault" | "good" | "normal"; navlink?: string; }): Promise<void> {
       await NotificationModel.create(data)
   }

   async findNotificationByUserId(userId: string, filter: object, limit: number, skip: number): Promise<PaginatedNotificationRepo | null> {

    const query: Record<string,any> = {
      userId,
        ...filter
      };

    const [notifications,count] = await Promise.all([
           NotificationModel.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
            NotificationModel.countDocuments(query)
          ])

          const result: PaginatedNotificationRepo = {
            getNotifications: () => notifications, 
                  count
                };
                return result
   }
}