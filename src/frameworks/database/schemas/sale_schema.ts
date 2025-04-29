import { Schema, model, Types } from 'mongoose';

export const SaleSchema = new Schema(
  {
    buyerId: {
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
    price: {
      type: Number,
      required: true,
    },
    sale_date: {
      type: Date,
      required: true,
      default:Date.now,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);


SaleSchema.index({ buyerId: 1 });
SaleSchema.index({ ownerId: 1 });

