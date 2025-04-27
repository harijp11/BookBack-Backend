import { Schema, Types } from 'mongoose';

import { ContractRequestModel } from '../models/contract_request-model';

export const ContractRequestSchema = new Schema<ContractRequestModel>(
  {
    ownerId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    requesterId:{
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    bookId: {
      type: Types.ObjectId,
      required: true,
      ref: 'Book',
    },
    request_type: {
      type: String,
      enum: ['borrow', 'buy'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
    },
  },
    { timestamps: true },
);

ContractRequestSchema.index({ isActive: 1 });


