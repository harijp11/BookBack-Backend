import { injectable } from "tsyringe";
import { IOtpEntity } from "../../../entities/models/otp_entity";
import { IOtpRepository } from "../../../entities/repositoryInterface/auth/otp_repository-interface";
import { OTPModel } from "../../../frameworks/database/models/otp_model";

@injectable()
export class OtpRepository implements IOtpRepository {
	async saveOtp(
		email: string,
		otp: string,
		expiresAt: Date,
		purpose: string,
		requesterId?: string
	  ): Promise<void> {
		const otpData: any = { email, otp, expiresAt, purpose };
		if (requesterId) {
		  otpData.requesterId = requesterId;
		}
	   
		await OTPModel.create(otpData);
	  }
	  

	  async findOtp(
		email: string,
		purpose: string = "login",
		requesterId?: string
	  ): Promise<IOtpEntity | null> {
		const query: any = { email, purpose };
		if (requesterId) {
		  query.requesterId = requesterId;
		}
	
		const otpEntry = await OTPModel.find(query)
		  .sort({ createdAt: -1 })
		  .limit(1);
	  
		return otpEntry.length > 0 ? otpEntry[0] : null;
	  }
	  

	async deleteOtp(email: string, otp: string, purpose:string = "login" ,requesterId?: string): Promise<void> {
		const query: any = { email,otp,purpose };
		if (requesterId) {
		  query.requesterId = requesterId;
		}
	  
		await OTPModel.deleteOne(query);
	}
}