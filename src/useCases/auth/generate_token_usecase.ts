import { inject, injectable } from "tsyringe";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate_token_usecase-interface";
import { ITokenService } from "../../entities/serviceInterfaces/token_service-interface";
import { IRefreshTokenRepository } from "../../entities/repositoryInterface/auth/refresh_token_repository-interface";
import { TRole } from "../../shared/constants";
import { ObjectId } from "mongoose";

@injectable()
export class GenerateTokenUseCase implements IGenerateTokenUseCase {
  constructor(
    @inject("ITokenService") private tokenService: ITokenService,
    @inject("IRefreshTokenRepository")
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute(
    _id: ObjectId,
    id: string,
    email: string,
    role: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { _id, id, email, role };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

	console.log("About to save refresh token with data:", {
		token: refreshToken,
		userType: role,
		user: id, // Check if this is empty
		expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
	  });
    await this.refreshTokenRepository.save({
      token: refreshToken,
      userType: role as TRole,
      user: id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    // In GenerateTokenUseCase.execute()
  

    return {
      accessToken,
      refreshToken,
    };
  }
}
