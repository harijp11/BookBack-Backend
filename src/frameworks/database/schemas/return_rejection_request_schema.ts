import { Schema } from "mongoose";
import { IReturnRejectionRequestModel } from "../models/return_rejection_request_model";

export const ReturnRejectionRequestSchema = new Schema<IReturnRejectionRequestModel>(
    {
      rentId: { type: Schema.Types.ObjectId, required: true, ref: 'Rent' },
      ownerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
      borrowerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
      reason: { type: String, required: true },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    },
    { timestamps: true }
  );