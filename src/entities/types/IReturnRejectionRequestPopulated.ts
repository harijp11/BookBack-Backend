import { ObjectId } from "mongoose";
import { IBookModel } from "../../frameworks/database/models/book_model";
import { IRentModel } from "../../frameworks/database/models/rent_model";
import { IUserModel } from "../../frameworks/database/models/User_model";


export interface IReturnRejectionRequestPopulated {
  _id: ObjectId;
  rentId: IRentModel & { bookId: IBookModel };
  ownerId: IUserModel;
  borrowerId: IUserModel;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}
