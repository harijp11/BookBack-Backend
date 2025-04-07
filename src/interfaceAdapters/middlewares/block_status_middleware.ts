import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../entities/repositoryInterface/user/user_repository-interface";
import { CustomRequest } from "./auth_middleware";
import { NextFunction, Response } from "express";
import { IBlackListTokenUseCase } from "../../entities/useCaseInterfaces/auth/blacklist_token_usecase-interface";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/revoke_refresh_token_usecase-interface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { clearAuthCookies } from "../../shared/utils/cookie_helper";

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
          message: "Unauthorized: No user found in request",
        });
      }

      const { _id, role } = req.user;
      const user = await this.userRepository.findById(_id);
      
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
          message: "Access denied: Your account is inactive",
        });
      }

      next();
    } catch (error) {
      console.error("Block Status Middleware Error: ", error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error while checking user status",
      });
    }
  };
}
