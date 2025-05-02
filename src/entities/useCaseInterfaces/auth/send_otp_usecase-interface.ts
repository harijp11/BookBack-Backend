export interface ISendOtpEmailUseCase {
	execute(email: string,purpose?:string, requesterId?: string): Promise<void>;
}