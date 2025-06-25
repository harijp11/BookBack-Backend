import mongoose, { ObjectId } from "mongoose";
import { IBookEntity } from "../../../entities/models/book_entity";
import { bookSchema } from "../schemas/book_schema";
import { Document } from "mongoose";

export interface IBookModel extends Omit<IBookEntity ,"_id" | "categoryId" | "dealTypeId" | "ownerId">, Document {
  _id: ObjectId;
  categoryId: ObjectId;
  dealTypeId: ObjectId;
  ownerId: ObjectId;
}

export const BookModel =  mongoose.model<IBookModel>('Book', bookSchema);