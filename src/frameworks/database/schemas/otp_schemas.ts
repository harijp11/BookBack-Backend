import { Schema, model } from "mongoose";
import { IOTPModel } from "../models/otp_model";
import { OtpPurpose } from "../../../shared/constants";

export const OTPSchema = new Schema<IOTPModel>(
  {
    otp: { type: String, required: true },
    email: { type: String, required: true },
    purpose: { 
      type: String, 
      enum: Object.values(OtpPurpose), 
      required: true, 
      default: OtpPurpose.LOGIN 
    },
    expiresAt: { type: Date, required: true, expires: 60 }, 
    requesterId:{ type: Schema.Types.ObjectId, ref: 'User',default:null},
    bookId:{ type: Schema.Types.ObjectId, ref: 'Book',default:null},
  },
  { timestamps: true }
);

export const OTPModel = model<IOTPModel>("OTP", OTPSchema);
