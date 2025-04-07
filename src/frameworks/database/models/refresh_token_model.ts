import { model, ObjectId } from "mongoose";
import { RefreshTokenSchema } from "../schemas/refresh_token_schema";
import { IRefreshTokenEntity } from "../../../entities/models/resfreshToken_entity";

export interface IRefreshTokenModel
	extends Omit<IRefreshTokenEntity, "id" | "user">,
		Document {
	_id: ObjectId;
	user: string;
}

export const RefreshTokenModel = model<IRefreshTokenModel>(
	"RefreshToken",
	RefreshTokenSchema
);