export interface IVerifyOtpUseCase {
	execute({ email, otp,purpose }: { email: string; otp: string ,purpose?:string }): Promise<void>;
}