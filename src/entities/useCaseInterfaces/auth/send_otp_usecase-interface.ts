export interface ISendOtpEmailUseCase {
	execute(email: string,purpose?:string, requesterId?: string,bookId?:string): Promise<void>;
}