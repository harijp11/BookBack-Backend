import { Document, model, ObjectId } from "mongoose";
import { IAdminEntity } from "../../../entities/models/admin_entity";
import { AdminSchema } from "../schemas/admin_schema";

export interface IAdminModel extends Omit<IAdminEntity, "_id">, Document {
  _id: ObjectId;
}

export const AdminModel = model<IAdminModel>("Admin", AdminSchema);