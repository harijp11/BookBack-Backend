import { inject, injectable } from "tsyringe";
import { IBlackListTokenUseCase } from "../../entities/useCaseInterfaces/auth/blacklist_token_usecase-interface";
import { IRedisTokenRepository } from "../../entities/repositoryInterface/redis/redis_token_repository-interface";
import { ITokenService } from "../../entities/serviceInterfaces/token_service-interface";
import { JwtPayload } from "jsonwebtoken";

@injectable()
export class BlackListTokenUseCase implements IBlackListTokenUseCase {
	constructor(
		@inject("IRedisTokenRepository")
		private redisTokenRepository: IRedisTokenRepository,
		@inject("ITokenService") private tokenService: ITokenService
	) {}
	async execute(token: string): Promise<void> {
		const decoded: string | JwtPayload | null =
			this.tokenService.verifyAccessToken(token);
		if (!decoded || typeof decoded === "string" || !decoded.exp) {
			throw new Error("Invalid Token: Missing expiration time");
		}

		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
		if (expiresIn > 0) {
			await this.redisTokenRepository.blackListToken(token, expiresIn);
		}
	}
}