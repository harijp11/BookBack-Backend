import  { Schema, Document } from "mongoose";
import { IBookModel } from "../models/book_model";

type BookDocument = IBookModel & Document;

export const bookSchema: Schema<BookDocument> = new Schema<BookDocument>(
  {
    name: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    dealTypeId: { type: Schema.Types.ObjectId, ref: 'DealType', required: true },
    originalAmount: { type: Number, required: true },
    rentAmount: { type: Number, required: true },
    description: { type: String },
    maxRentalPeriod: { type: Number, required: true },
    images: [{ type: String, required: true }],
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['Available', 'Sold Out', 'Borrowed'],
      default: 'Available',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    locationName: { type: String },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ location: "2dsphere" });


