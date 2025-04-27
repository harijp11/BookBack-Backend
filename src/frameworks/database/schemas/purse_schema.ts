import { Schema, model, Types, SchemaTypes } from 'mongoose';
import { IPurseModel } from '../models/purse_model';
import { generateUniqueTrsasactionId } from '../../security/uniqueid_bcrypt';

export const PurseSchema = new Schema<IPurseModel>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User',
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      tsId: { type: String, required:true, default: () => generateUniqueTrsasactionId() },
      type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        required: true,
      },
      description: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
},
{timestamps:true},
);






