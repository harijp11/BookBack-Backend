import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { IAdminUserController } from "../../../entities/controllersInterfaces/admin/admin_user_controller-interface";
import { IUpdateUserStatusUseCase } from "../../../entities/useCaseInterfaces/admin/user/update_user_status_usecase-interface";
import { IGetAllUsersUseCase } from "../../../entities/useCaseInterfaces/admin/user/get_all_users_usecase-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { IUserEntity } from "../../../entities/models/user_entity";
import { CustomRequest } from "../../middlewares/auth_middleware";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";


@injectable()
export class AdminUserController implements IAdminUserController {
  constructor(
    @inject("IGetAllUsersUseCase")
    private getAllUsersUseCase: IGetAllUsersUseCase,
    @inject("IUpdateUserStatusUseCase")
    private updateUserStatusUseCase: IUpdateUserStatusUseCase,
  ) {}

 
  async getAllUsers(req: Request, res: Response): Promise<void> {
      try{
        const {page = "1",limit = "2",search = "",userType} = req.query

        const pageNumber = parseInt(page as string,10);
        const pageSize = parseInt(limit as string,10)
        const userTypeString = 
        typeof userType === "string" ? userType.toLowerCase() : "user"
        const searchTermString = typeof search === "string" ? search.trim() : "";


        if (
            isNaN(pageNumber) ||
            isNaN(pageSize) ||
            pageNumber < 1 ||
            pageSize < 1
          ) {
            throw new CustomError(
              ERROR_MESSAGES.VALIDATION_ERROR,
              HTTP_STATUS.BAD_REQUEST
            );
          }

          const { user, total } = await this.getAllUsersUseCase.execute(
            userTypeString,
            pageNumber,
            pageSize,
            searchTermString
          );
      
         res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DATA_RETRIEVED,
        users: user,
        totalPages: total,
        currentPage: pageNumber,
        totalUsers:
          user.length === 0 ? 0 : (pageNumber - 1) * pageSize + user.length,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userType, userId } = req.query as {
        userType: string;
        userId: any;
      };

      if (!userType || !userId) {
        throw new CustomError(
          ERROR_MESSAGES.MISSING_PARAMETERS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      if (!["user"].includes(userType.toLowerCase())) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      await this.updateUserStatusUseCase.execute(
        userType.toLowerCase(),
        userId
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }



}