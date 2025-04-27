import { model, ObjectId } from "mongoose";
import { IPurseEntity } from "../../../entities/models/purse_entity";
import { PurseSchema } from "../schemas/purse_schema";

export interface IPurseModel extends Omit<IPurseEntity ,"_id"|"userId">{
    _id:ObjectId
    userId:ObjectId
}

export const  PurseModel = model<IPurseModel>("Purse",PurseSchema)