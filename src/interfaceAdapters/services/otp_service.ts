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

	async storeOtp(email: string, otp: string,purpose:string, requesterId?: string): Promise<void> {
		let expiresAt = new Date(
			Date.now() + Number(config.OtpExpiry) * 60 * 1000
		);
		const existOtp = await this.otpRepository.findOtp(email,purpose)
		if(existOtp?.purpose ===  "create_contract"){ 
			
		}
		await this.otpRepository.saveOtp(email, otp, expiresAt,purpose,requesterId);
	}
	async verifyOtp(email: string, otp: string,purpose:string, requesterId?: string): Promise<Boolean> {
		const otpEntry = await this.otpRepository.findOtp(email,purpose,requesterId);
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