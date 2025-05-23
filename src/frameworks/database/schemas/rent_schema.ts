import { Schema, Types } from 'mongoose';
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
        "Return Rejection Requested"
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
      type: [
        {
          days: { type: Number, required: true },
          amount: { type: Number, required: true },
          requested_at: { type: Date, required: true, default: Date.now },
          response: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
          responded_at: { type: Date, default: null },
        },
      ],
      default: [], 
    },
    return_requested_at: {
      type: Date,
      default:null,
    },
    returned_at: {
      type: Date,
      default: null,
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