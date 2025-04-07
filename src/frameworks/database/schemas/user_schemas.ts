import { Schema } from "mongoose";
import { IUserModel } from "../models/User_model";
import { ROLES } from "../../../shared/constants";

export const UserSchema = new Schema<IUserModel>(
  {
    userId: { type: String, required: true },
    Name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phoneNumber: { type: String },
    isActive: { type:Boolean, default: true },
    role: { type: String, enum: ROLES, required: true },
    profileImage: { type: String },
    onlineStatus: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    lastStatusUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ status: 1 });