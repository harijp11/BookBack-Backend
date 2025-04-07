import { ObjectId } from "mongoose";

export interface IGenerateTokenUseCase {
	execute(
		_id:ObjectId,
		id: string,
		email: string,
		role: string
	): Promise<{ accessToken: string; refreshToken: string }>;
}