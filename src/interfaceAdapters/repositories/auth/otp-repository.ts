import { injectable } from "tsyringe";
import { IOtpEntity } from "../../../entities/models/otp_entity";
import { IOtpRepository } from "../../../entities/repositoryInterface/auth/otp_repository-interface";
import { OTPModel } from "../../../frameworks/database/models/otp_model";

@injectable()
export class OtpRepository implements IOtpRepository {
	async saveOtp(email: string, otp: string, expiresAt: Date): Promise<void> {
		await OTPModel.create({ email, otp, expiresAt });
	}

	async findOtp(email: string): Promise<IOtpEntity | null> {
		const otpEntry = await OTPModel.find({ email })
			.sort({ createdAt: -1 })
			.limit(1);
		return otpEntry.length > 0 ? otpEntry[0] : null;
	}

	async deleteOtp(email: string, otp: string): Promise<void> {
		await OTPModel.deleteOne({ email, otp });
	}
}