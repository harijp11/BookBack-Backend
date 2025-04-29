import { model, ObjectId } from "mongoose";
import { IRentEntity } from "../../../entities/models/rent_entity";
import { RentSchema } from "../schemas/rent_schema";

export interface IRentModel extends Omit<IRentEntity,"_id" | "ownerId" | "borrowerId" | "bookId">{
    _id:ObjectId
    ownerId:ObjectId
    borrowerId:ObjectId
    bookId:ObjectId
}

export const RentModel = model<IRentModel>("Rent", RentSchema);