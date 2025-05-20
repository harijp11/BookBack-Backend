import { INotificationModel } from "../../../frameworks/database/models/notification_model";

export interface PaginatedNotificationRepo {
    getNotifications(): INotificationModel[];
    count: number;
}

export interface INotificationRepository{
    setNotitfication(data:{userId:string,title?:string,message:string,type:'warning'|'info'|'fault'|'good'|'normal',navlink?:string}):Promise<void>

    findNotificationByUserId(userId: string,
            filter: object,
            limit: number,
            skip: number):Promise<PaginatedNotificationRepo | null>

    UpdateReadStatus(userId:string):Promise<void>

    deleteDateExceeded(checkDate:Date):Promise<{
  acknowledged: boolean,
  deletedCount: number
}>

 findUnReadCountByUserId(userId: string): Promise<number>
}