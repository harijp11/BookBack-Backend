import { model, Document, ObjectId } from "mongoose";
import { UserSchema } from "../schemas/user_schemas";
import { IUsersEntity } from "../../../entities/models/users_entity";

export interface IUserModel extends Omit<IUsersEntity, "_id">, Document {
  _id: ObjectId;
}

export const UserModel = model<IUserModel>("User", UserSchema);