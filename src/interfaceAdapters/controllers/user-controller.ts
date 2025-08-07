import { inject, injectable } from "tsyringe";
import { IUserController } from "../../entities/controllersInterfaces/user_controller-interface";
import { Request, Response } from "express";
import { IUsersEntity } from "../../entities/models/users_entity";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  USER_MESSAGES,
} from "../../shared/constants";
import { IUpdateUserProfileUseCase } from "../../entities/useCaseInterfaces/user/profile/update_user_profile_usecase-interface";
import { ICloudinarySignatureService } from "../../entities/serviceInterfaces/cloudinary_service-interface";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { IChangePasswordUseCase } from "../../entities/useCaseInterfaces/user/profile/change_user_password_usecase-interface";
import { IGetAllUsersUseCase } from "../../entities/useCaseInterfaces/admin/user/get_all_users_usecase-interface";
import { IUpdateUserStatusUseCase } from "../../entities/useCaseInterfaces/admin/user/update_user_status_usecase-interface";
import { CustomError } from "../../entities/utils/custom_error";
import { CustomRequest } from "../middlewares/auth_middleware";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject("IUpdateUserProfileUseCase")
    private _updateUserProfileUseCase: IUpdateUserProfileUseCase,
    @inject("ICloudinarySignatureService")
    private _cloudinarySignatureService: ICloudinarySignatureService,
    @inject("IChangePasswordUseCase")
    private _changePasswordUseCase: IChangePasswordUseCase,
    @inject("IGetAllUsersUseCase")
    private _getAllUsersUseCase: IGetAllUsersUseCase,
    @inject("IUpdateUserStatusUseCase")
    private _updateUserStatusUseCase: IUpdateUserStatusUseCase
  ) {}

  async generateUploadSignature(req: Request, res: Response): Promise<void> {
    try {
      const folder = req.query.folder?.toString() || "user-profiles";

      if (!folder) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ success: false, message: "Folder is required" });
        return;
      }

      const signatureData =
        this._cloudinarySignatureService.generateSignature(folder);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: signatureData,
      });
    } catch (error) {
      console.error("Cloudinary Signature Error:", error);
      handleErrorResponse(res, error);
    }
  }

  async updateUserProfile(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user._id.toString();
    const profileData = req.body;

    const allowedFields: (keyof Partial<IUsersEntity>)[] = [
      "Name",
      "email",
      "phoneNumber",
      "profileImage",
    ];

    const updates: Partial<IUsersEntity> = {};
    for (const key of allowedFields) {
      if (profileData[key] !== undefined) {
        updates[key] = profileData[key];
      }
    }

    const updatedUser = await this._updateUserProfileUseCase.execute(
      userId,
      updates
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: USER_MESSAGES.PROFILE_UPDATED,
      data: updatedUser,
    });
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user._id.toString();
      const { password, newPassword } = req.body as {
        password: string;
        newPassword: string;
      };

      await this._changePasswordUseCase.execute(userId, password, newPassword);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        messasge: USER_MESSAGES.PASSWORD_UPDATED,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  //Admin

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page = "1", limit = "2", search = "", userType } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);
      const userTypeString =
        typeof userType === "string" ? userType.toLowerCase() : "user";
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

      const { user, total } = await this._getAllUsersUseCase.execute(
        userTypeString,
        pageNumber,
        pageSize,
        searchTermString
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: USER_MESSAGES.USERS_FETCHED,
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
        userId: string;
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

      await this._updateUserStatusUseCase.execute(
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
