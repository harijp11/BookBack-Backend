import { inject, injectable } from "tsyringe";
import { INotificationController } from "../../entities/controllersInterfaces/notification_controller-interface";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth_middleware";
import { HTTP_STATUS } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { IFetchAllUserNoticationUseCase } from "../../entities/useCaseInterfaces/user/notification/fetch_all_user_notification_usecase-interface";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject("IFetchAllUserNoticationUseCase")
    private _fetchAllUserNoticationUseCase:IFetchAllUserNoticationUseCase
  ){}

  async fetchAllUserNotifications(req: Request, res: Response): Promise<void> {
      try{

        const {filter = {},page=1,limit=1} = req.query as {filter?:string,page?:number,limit?:number}

        const userId = (req as CustomRequest).user._id.toString();

       const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;

       const { notifications, totalnotifications , totalPages, currentPage } = await this._fetchAllUserNoticationUseCase.execute(userId,Filter,page,limit)
       
         res.status(HTTP_STATUS.OK).json({
                        success: true,
                        message: "contracts fetched successfully",
                        notifications,
                        totalnotifications,
                        totalPages,
                        currentPage,
                      }); 

      }catch(error){
        handleErrorResponse(res,error)
      }
  }
}