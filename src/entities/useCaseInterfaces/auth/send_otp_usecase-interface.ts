export interface ISendOtpEmailUseCase {
	execute(email: string,purpose?:string): Promise<void>;
}