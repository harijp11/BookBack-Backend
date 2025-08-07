import { inject, injectable } from "tsyringe";
import { INotificationController } from "../../entities/controllersInterfaces/notification_controller-interface";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth_middleware";
import { HTTP_STATUS, NOTIFICATION_SUCCESS, SUCCESS_MESSAGES } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { IFetchAllUserNoticationUseCase } from "../../entities/useCaseInterfaces/user/notification/fetch_all_user_notification_usecase-interface";
import { IGetChatAndNotificationUpdatesUseCase } from "../../entities/useCaseInterfaces/user/notification/get_chat_and_notification_updates_usecase-interface";
import { IClearAllNotificationsUseCase } from "../../entities/useCaseInterfaces/user/notification/clear_all_notifications_usecase-interface";
import { IClearSingleNotificationUseCase } from "../../entities/useCaseInterfaces/user/notification/clear_single_notification_usecase-interface";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject("IFetchAllUserNoticationUseCase")
    private _fetchAllUserNoticationUseCase:IFetchAllUserNoticationUseCase,
    @inject("IGetChatAndNotificationUpdatesUseCase")
    private _getChatAndNotificationUpdates:IGetChatAndNotificationUpdatesUseCase,
    @inject("IClearAllNotificationUseCase")
    private _clearAllNotificationUseCase:IClearAllNotificationsUseCase,
    @inject("IClearSingleNotificationUseCase")
    private _clearSingleNotificationUseCase:IClearSingleNotificationUseCase
  ){}

  async fetchAllUserNotifications(req: Request, res: Response): Promise<void> {
      try{

        const {filter = {},page=1,limit=1} = req.query as {filter?:string,page?:number,limit?:number}

        const userId = (req as CustomRequest).user._id.toString();

       const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;

       const { notifications, totalnotifications , totalPages, currentPage } = await this._fetchAllUserNoticationUseCase.execute(userId,Filter,page,limit)
       
         res.status(HTTP_STATUS.OK).json({
                        success: true,
                        message: NOTIFICATION_SUCCESS.NOTIFICATIONS_FETCHED,
                        notifications,
                        totalnotifications,
                        totalPages,
                        currentPage,
                      }); 
      }catch(error){
        handleErrorResponse(res,error)
      }
  }

  async getChatAndNotificationUpdates(req: Request, res: Response): Promise<void> {
     try{
      const userId = (req as CustomRequest).user._id.toString();
      
      const {unReadMessagesCount,unReadNotificationsCount} = await this._getChatAndNotificationUpdates.execute(userId)
     
      res.status(HTTP_STATUS.OK).json({
        success:true,
        message:NOTIFICATION_SUCCESS.COUNT_FETCHED,
        unReadMessagesCount,
        unReadNotificationsCount,
      })

     }catch(error){
      handleErrorResponse(res,error)
     }
  }


  async clearAllUserNotifications(req: Request, res: Response): Promise<void> {
    try{
      const userId = (req as CustomRequest).user._id.toString();

      await this._clearAllNotificationUseCase.execute(userId)

      res.status(HTTP_STATUS.OK).json({
        success:true,
        message: NOTIFICATION_SUCCESS.NOTIFICATIONS_CLEARED,
      })

    }catch(error){
      handleErrorResponse(res,error)
    }
  }

  async clearSingleNotification(req: Request, res: Response): Promise<void> {
    try{
       const notificationId = req.params.notificationId as string;

       await this._clearSingleNotificationUseCase.execute(notificationId)
       
       res.status(HTTP_STATUS.OK).json({
        success:true,
        message: NOTIFICATION_SUCCESS.SINGLE_NOTIFICATION_CLEARED
       })
  
    }catch(error){
      handleErrorResponse(res,error)
    }
  }
}