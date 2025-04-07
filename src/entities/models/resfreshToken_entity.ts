import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants";

export interface IRefreshTokenEntity {
   _id:ObjectId;
   id?: string;
   token: string;
   user: string;
   userType: TRole;
   expiresAt: Date;
   createdAt?: Date;
   updatedAt?: Date;
}