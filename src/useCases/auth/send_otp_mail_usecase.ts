import { inject, injectable } from "tsyringe";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/send_otp_usecase-interface";
import { IEmailService } from "../../entities/serviceInterfaces/email_service-interface";
import { IOtpService } from "../../entities/serviceInterfaces/otp_service-interface";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user_exist_service-interface";
import { IBcrypt } from "../../frameworks/security/bcrypt_interface";
import { CustomError } from "../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class SendOtpEmailUseCase implements ISendOtpEmailUseCase {
	constructor(
		@inject("IEmailService") private _emailService: IEmailService,
		@inject("IOtpService") private _otpService: IOtpService,
		@inject("IUserExistenceService")
		private _userExistenceService: IUserExistenceService,
		@inject("IOtpBcrypt") private _otpBcrypt: IBcrypt
	) {}
	async execute(email: string,purpose:string = "login", requesterId?: string,bookId?:string): Promise<void> {
		if(purpose === "login"){
		const emailExists = await this._userExistenceService.emailExists(email);
		if (emailExists) {
			throw new CustomError(
				ERROR_MESSAGES.EMAIL_EXISTS,
				HTTP_STATUS.CONFLICT
			);
		}
	}

		const otp = this._otpService.generateOtp();
		console.log(`OTP:${otp} `);
		const hashedOtp = await this._otpBcrypt.hash(otp);
		await this._otpService.storeOtp(email, hashedOtp,purpose,requesterId,bookId);
		await this._emailService.sendOtpEmail(
			email,
			"BookBack - Verify Your Email",
			otp,
			purpose
		);
	}
}