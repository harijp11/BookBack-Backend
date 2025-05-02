import { model, ObjectId } from "mongoose";
import { OTPSchema } from "../schemas/otp_schemas";
import { OtpPurpose } from "../../../shared/constants";

export interface IOTPModel extends Document {
  _id: ObjectId;
  otp: string;
  email: string;
  purpose:OtpPurpose;
  expiresAt: Date;
  requesterId:ObjectId
}

export const OTPModel = model<IOTPModel>("OTP", OTPSchema);