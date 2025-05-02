import { IOtpEntity } from "../../models/otp_entity";

export interface IOtpRepository {
	saveOtp(email: string, otp: string, expiresAt: Date, purpose:string,requesterId?:string): Promise<void>;
	findOtp(email: string,purpose?:string,requesterId?:string): Promise<IOtpEntity | null>;
	deleteOtp(email: string, otp: string,purpose?:string,requesterId?: string): Promise<void>;
}