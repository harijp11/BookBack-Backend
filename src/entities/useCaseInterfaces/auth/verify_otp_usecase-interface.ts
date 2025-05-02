export interface IVerifyOtpUseCase {
	execute({ email, otp,purpose,requesterId }: { email: string; otp: string ,purpose?:string,requesterId?:string }): Promise<void>;
}