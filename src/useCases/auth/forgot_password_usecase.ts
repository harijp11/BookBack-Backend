import { inject, injectable } from "tsyringe";
import { IForgotPasswordUseCase } from "../../entities/useCaseInterfaces/auth/forgot_password_usecase-interface";
import { CustomError } from "../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ITokenService } from "../../entities/serviceInterfaces/token_service-interface";
import { IRedisTokenRepository } from "../../entities/repositoryInterface/redis/redis_token_repository-interface";
import { IEmailService } from "../../entities/serviceInterfaces/email_service-interface";
import { config } from "../../shared/config";
import { IUserRepository } from "../../entities/repositoryInterface/user/user_repository-interface";
import { IAdminRepository } from "../../entities/repositoryInterface/admin/admin_repository-interface";

// import { IAdminRepository } from "@/entities/repositoryInterfaces/admin/admin-repository.interface";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
	constructor(
		@inject("IClientRepository")
         private clientRepository: IUserRepository,
		@inject("IAdminRepository")
         private adminRepository: IAdminRepository,
		@inject("ITokenService")
         private tokenService: ITokenService,
		@inject("IRedisTokenRepository")
         private redisTokenRepository: IRedisTokenRepository,
		@inject("IEmailService")
         private emailService: IEmailService
	) {}

	async execute({ email, role }: { email: string; role: string }): Promise<void> {
		let repository;
		if (role === "user") {
			repository = this.clientRepository;
		} else if (role === "admin") {
			repository = this.adminRepository;
		} else {
			throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.FORBIDDEN);
		}

		const user = await repository.findByEmail(email);
		if (!user) {
			throw new CustomError(ERROR_MESSAGES.EMAIL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
		}

		const resetToken = this.tokenService.generateResetToken(email, role);
		try {
			await this.redisTokenRepository.storeResetToken(user._id.toString() ?? "", resetToken);
		} catch (error) {
			console.error("Failed to store reset token in Redis:", error);
			throw new CustomError(ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
		}

		const resetUrl = new URL(`/reset-password/${resetToken}/${role}`, config.cors.ALLOWED_ORIGIN).toString();
		await this.emailService.sendResetEmail(email, "BookBack - Change your password", resetUrl);
	}
}