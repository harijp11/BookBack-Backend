import { Request, Response } from "express";

export interface INotificationController{
    fetchAllUserNotifications(req:Request,res:Response):Promise<void>
    getChatAndNotificationUpdates(req:Request,res:Response):Promise<void>
    clearAllUserNotifications(req:Request,res:Response):Promise<void>
    clearSingleNotification(req:Request,res:Response):Promise<void>
}