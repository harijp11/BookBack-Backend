import { model, ObjectId } from "mongoose";
import { ISaleEntity } from "../../../entities/models/sale_entity";
import { SaleSchema } from "../schemas/sale_schema";

export interface ISaleModel extends  Omit<ISaleEntity,"_id"|"buyerId"|"ownerId"|"bookId">{
  _id:ObjectId
  buyerId:ObjectId
  ownerId:ObjectId
  bookId:ObjectId
}


export const SaleModel = model<ISaleModel>("Sale", SaleSchema);

