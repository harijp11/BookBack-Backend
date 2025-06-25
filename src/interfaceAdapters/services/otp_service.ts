import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../entities/serviceInterfaces/otp_service-interface";
import { config } from "../../shared/config";
import { IOtpRepository } from "../../entities/repositoryInterface/auth/otp_repository-interface";
import { IBcrypt } from "../../frameworks/security/bcrypt_interface";


@injectable()
export class OtpService implements IOtpService {
	constructor(
		@inject("IOtpRepository") private otpRepository: IOtpRepository,
		@inject("IOtpBcrypt") private otpBcrypt: IBcrypt
	) {}

	generateOtp(): string {
		return (Math.floor(Math.random() * 9000) + 1000).toString();
	}

	async storeOtp(email: string, otp: string,purpose:string, requesterId?: string,bookId?:string): Promise<void> {
		let expiresAt = new Date(
			Date.now() + Number(config.OtpExpiry) * 60 * 1000
		);
		await this.otpRepository.saveOtp(email, otp, expiresAt,purpose,requesterId,bookId);
	}

	async verifyOtp(email: string, otp: string,purpose:string, requesterId?: string,bookId?:string): Promise<Boolean> {
		const otpEntry = await this.otpRepository.findOtp(email,purpose,requesterId,bookId);
		if (!otpEntry) return false;
		if (
			new Date() > otpEntry.expiresAt ||
			!(await this.otpBcrypt.compare(otp, otpEntry.otp))
		) {
			await this.otpRepository.deleteOtp(email, otp);
			return false;
		}
		await this.otpRepository.deleteOtp(email, otp);
		return true;
	}
}