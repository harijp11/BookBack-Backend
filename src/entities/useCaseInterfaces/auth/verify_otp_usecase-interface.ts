export interface IVerifyOtpUseCase {
	execute({ email, otp,purpose,requesterId,bookId }: { email: string; otp: string ,purpose?:string,requesterId?:string,bookId?:string }): Promise<void>;
}