import { Schema } from "mongoose";
import { IRefreshTokenModel } from "../models/refresh_token_model";
import { string } from "zod";

export const RefreshTokenSchema = new Schema<IRefreshTokenModel>({
  user: { type: String, required: true },
  userType: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});