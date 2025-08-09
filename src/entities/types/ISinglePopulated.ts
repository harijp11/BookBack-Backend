// src/entities/models/book/book_populated-entity.ts

import { ICategoryModel } from "../../frameworks/database/models/category_model";
import { IUserModel } from "../../frameworks/database/models/User_model";
import { IDealTypeModel } from "../../frameworks/database/models/deal_type_model";
import { IBookModel } from "../../frameworks/database/models/book_model";

export interface IBookPopulated extends Omit<IBookModel, "categoryId" | "ownerId" | "dealTypeId"> {
  categoryId: ICategoryModel;
  ownerId: IUserModel;
  dealTypeId: IDealTypeModel
}
