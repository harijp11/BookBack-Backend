import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants";

export interface IUserEntity {
  _id: ObjectId;
  userId:string
  Name?: string;
  email: string;
  password: string;
  googleId: string;
  phoneNumber?: string;
  profileImage?:string;
  onlineStatus?: "online" | "offline";
  lastStatusUpdated: Date;
  role:TRole
  isActive:boolean
  createdAt: Date;
  updatedAt: Date;
}