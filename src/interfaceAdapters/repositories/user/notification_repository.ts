import {  injectable } from "tsyringe";
import { INotificationRepository, InputNotification, PaginatedNotificationRepo } from "../../../entities/repositoryInterface/user/notification_repository-interface";
import { INotificationModel, NotificationModel } from "../../../frameworks/database/models/notification_model";
import { BaseRepository } from "../baseRepo/base_repository";


@injectable()
export class NotificationRepository extends BaseRepository<INotificationModel,InputNotification> implements INotificationRepository{
   constructor(){
      super(NotificationModel)
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
            .sort({ created_at: -1 }),
            NotificationModel.countDocuments(query)
          ])

          const result: PaginatedNotificationRepo = {
            getNotifications: () => notifications, 
                  count
                };
                return result
   }

   async UpdateReadStatus(userId: string): Promise<void> {
     await NotificationModel.updateMany({userId},{$set:{isRead:true}})
   }

    async deleteDateExceeded(checkDate:Date): Promise<{
  acknowledged: boolean,
  deletedCount: number
}> {
     const deleted = await NotificationModel.deleteMany({isRead:true,created_at:{$lt:checkDate}})  
     return deleted
   }

   async findUnReadCountByUserId(userId: string): Promise<number> {
  const count = await NotificationModel.countDocuments({ userId, isRead: false });
  return count;
}

}