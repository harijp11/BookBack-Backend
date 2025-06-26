import { inject, injectable } from "tsyringe";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/verify_otp_usecase-interface";
import { IOtpService } from "../../entities/serviceInterfaces/otp_service-interface";
import { CustomError } from "../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
	constructor(
      @inject("IOtpService") private _otpService: IOtpService
   ) {}
	async execute({
		email,
		otp,
		purpose = "login",
		requesterId,
		bookId
	}: {
		email: string;
		otp: string;
		purpose:string 
		requesterId?: string,
		bookId?:string
	}): Promise<void> {
		const isOtpValid = await this._otpService.verifyOtp(email, otp, purpose,requesterId,bookId);
      
		if (!isOtpValid)
			throw new CustomError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
	}
}