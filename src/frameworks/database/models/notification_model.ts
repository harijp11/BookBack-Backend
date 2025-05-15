import { model, ObjectId } from "mongoose"
import { INotificationEntity } from "../../../entities/models/notification_entity"
import { NotificationSchema } from "../schemas/notification_schema"

export interface INotificationModel extends Omit<INotificationEntity ,"_id"|"userId">,Document{
    _id:ObjectId
    userId:ObjectId
}

export const  NotificationModel = model<INotificationModel>("Notification",NotificationSchema)