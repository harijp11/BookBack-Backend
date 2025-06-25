import { Schema, Document } from "mongoose";
import { IBookModel } from "../models/book_model";
import { array } from "zod";

type BookDocument = IBookModel & Document;

export const bookSchema: Schema<BookDocument> = new Schema<BookDocument>(
  {
    name: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    dealTypeId: {
      type: Schema.Types.ObjectId,
      ref: "DealType",
      required: true,
    },
    originalAmount: { type: Number, required: true },
    rentAmount: { type: Number },
    description: { type: String },
    maxRentalPeriod: { type: Number },
    images: [{ type: String, required: true }],
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Available", "Sold Out", "Borrowed"],
      default: "Available",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    locationName: { type: String },
    numberOfPages: { type: Number, default: 0 },
    avgReadingTime: { type: String, default: "" },
    notifyUsers: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ location: "2dsphere" });
