export interface IOtpService {
	generateOtp(): string;
	storeOtp(email: string, otp: string,purpose:string, requesterId?: string): Promise<void>;
	verifyOtp(email: string, otp: string,purpose?:string, requesterId?: string): Promise<Boolean>;
}