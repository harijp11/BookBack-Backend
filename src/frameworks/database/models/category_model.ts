import { ObjectId,Document,model } from "mongoose";
import { ICategoryEntity } from "../../../entities/models/category_entity";
import { CategorySchema } from "../schemas/category_schema";

export interface ICategoryModel extends Omit<ICategoryEntity,"_id">,Document{
    _id: ObjectId
}

export const  categoryModel = model<ICategoryModel>("Category",CategorySchema)