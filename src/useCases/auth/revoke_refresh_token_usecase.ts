import { inject, injectable } from "tsyringe";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/revoke_refresh_token_usecase-interface";
import { IRefreshTokenRepository } from "../../entities/repositoryInterface/auth/refresh_token_repository-interface";

@injectable()
export class RevokeRefreshTokenUseCase implements IRevokeRefreshTokenUseCase {
	constructor(
		@inject("IRefreshTokenRepository")
		private refreshTokenRepository: IRefreshTokenRepository
	) {}
	async execute(token: string): Promise<void> {
		await this.refreshTokenRepository.revokeRefreshToken(token);
	}
}