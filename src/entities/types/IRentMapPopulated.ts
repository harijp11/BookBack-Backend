import { IRentModel } from "../../frameworks/database/models/rent_model";
import { IUserModel } from "../../frameworks/database/models/User_model";
import { IBookModel } from "../../frameworks/database/models/book_model";

export interface IRentPopulated extends Omit<IRentModel, "borrowerId" | "ownerId" | "bookId"> {
  borrowerId: IUserModel,
  ownerId: IUserModel,
  bookId: IBookModel
}
