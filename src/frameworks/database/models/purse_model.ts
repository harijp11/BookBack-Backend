import { model, ObjectId,Document } from "mongoose";
import { IPurseEntity } from "../../../entities/models/purse_entity";
import { PurseSchema } from "../schemas/purse_schema";

export interface IPurseModel extends Omit<IPurseEntity ,"_id"|"userId">,Document{
    _id:ObjectId
    userId:ObjectId
}

export const  PurseModel = model<IPurseModel>("Purse",PurseSchema)