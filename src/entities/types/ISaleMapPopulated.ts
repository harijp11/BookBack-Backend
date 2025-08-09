// src/entities/models/sale_populated_entity.ts

import { Types } from "mongoose";
import { IBookModel } from "../../frameworks/database/models/book_model";
import { IUserModel } from "../../frameworks/database/models/User_model";

export interface ISalePopulated {
  _id: Types.ObjectId;
  buyerId: IUserModel,
  ownerId:IUserModel,
  bookId: IBookModel
  price: number;
  sale_date: Date;
  created_at:Date,
  updated_at:Date
}
