import { Request, Response } from "express";

export interface INotificationController{
    fetchAllUserNotifications(req:Request,res:Response):Promise<void>
    getChatAndNotificationUpdates(req:Request,res:Response):Promise<void>
}