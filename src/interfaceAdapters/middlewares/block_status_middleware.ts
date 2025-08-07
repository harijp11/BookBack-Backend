import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../entities/repositoryInterface/user/user_repository-interface";
import { CustomJwtPayload, CustomRequest } from "./auth_middleware";
import { NextFunction, Response } from "express";
import { IBlackListTokenUseCase } from "../../entities/useCaseInterfaces/auth/blacklist_token_usecase-interface";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/revoke_refresh_token_usecase-interface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { clearAuthCookies } from "../../shared/utils/cookie_helper";
import { handleErrorResponse } from "../../shared/utils/errorHandler";

@injectable()
export class BlockStatusMiddleware {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @inject("IBlackListTokenUseCase")
    private readonly blacklistTokenUseCase: IBlackListTokenUseCase,
    @inject("IRevokeRefreshTokenUseCase")
    private readonly revokeRefreshTokenUseCase: IRevokeRefreshTokenUseCase
  ) {}

  checkUserStatus = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND_IN_REQUEST,
        });
      }

      const { _id, role } = req.user as CustomJwtPayload;
      const userId = _id.toString(); // Convert ObjectId to string
      
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        });
      }

      if (!user.isActive) {
        await this.blacklistTokenUseCase.execute(req.user.access_token);
        await this.revokeRefreshTokenUseCase.execute(req.user.refresh_token);

        const accessTokenName = `${role}_access_token`;
        const refreshTokenName = `${role}_refresh_token`;
        clearAuthCookies(res, accessTokenName, refreshTokenName);

        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGES.ACCOUNT_INACTIVE,
        });
      }

      next();
    } catch (error) {
      handleErrorResponse(res,error)
    }
  };
}
