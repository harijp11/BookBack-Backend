import { inject, injectable } from "tsyringe";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/refresh_token_usecase-interface";
import { ITokenService } from "../../entities/serviceInterfaces/token_service-interface";
import { CustomError } from "../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { JwtPayload } from "jsonwebtoken";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
	constructor(@inject("ITokenService") private tokenService: ITokenService) {}
	execute(refreshToken: string): { role: string; accessToken: string } {
		const payload = this.tokenService.verifyRefreshToken(refreshToken);
		if (!payload) {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_TOKEN,
				HTTP_STATUS.BAD_REQUEST
			);
		}
		return {
			role: (payload as JwtPayload).role,
			accessToken: this.tokenService.generateAccessToken({
				_id: (payload as JwtPayload)._id,
				id: (payload as JwtPayload).id,
				email: (payload as JwtPayload).email,
				role: (payload as JwtPayload).role,
			}),
		};
	}
}