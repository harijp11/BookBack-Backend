export interface IOtpService {
	generateOtp(): string;
	storeOtp(email: string, otp: string,purpose:string): Promise<void>;
	verifyOtp(email: string, otp: string,purpose?:string): Promise<Boolean>;
}