import { Schema, model, Types } from 'mongoose';
import { IRentModel } from '../models/rent_model';

export const RentSchema = new Schema<IRentModel>(
  {
    borrowerId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    ownerId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    bookId: {
      type: Types.ObjectId,
      required: true,
      ref: 'Book',
    },
    rent_amount: {
      type: Number,
      required: true,
    },
    original_amount: {
      type: Number,
      required: true,
    },
    rent_start_date: {
      type: Date,
      required: true,
    },
    rent_end_date: {
      type: Date,
      required: true,
    },
    period_of_contract: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'On Rental',
        'Return Requested',
        'Returned',
        'Return Rejected',
        'Contract Date Exceeded',
      ],
      required: true,
      default:'On Rental'
    },
    renewal_status: {
      type: String,
      enum: [
        'No Renewal',
        'Renewal Requested',
        'Renewal Rejected',
        'Renewed',
      ],
      required: true,
      default:'No Renewal'
    },
    renewal_details: {
      type: {
        days: { type: Number, required: true },
        amount: { type: Number, required: true },
      },
      required: false,
      default: null,
    },
    requested_at: {
      type: Date,
      default: Date.now(),
    },
    penalty_amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

RentSchema.index({ borrowerId: 1 });
RentSchema.index({ ownerId: 1 });