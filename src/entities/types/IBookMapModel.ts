import { ObjectId } from "mongoose";
import { IBookModel } from "../../frameworks/database/models/book_model";

export interface IPopulatedBookModel extends Omit<IBookModel, 'categoryId' | 'dealTypeId' | 'ownerId'> {
  categoryId: {
    _id: ObjectId;
    name: string;
  };
  dealTypeId: {
    _id: ObjectId;
    name: string;
  };
  ownerId: {
    _id: ObjectId;
    Name: string;
  };
  distance?:number;
}
