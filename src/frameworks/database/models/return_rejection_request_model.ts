import { Document, model, ObjectId } from "mongoose";
import { IReturnRejectionRequestEntity } from "../../../entities/models/return_rejection_request-entity";
import { ReturnRejectionRequestSchema } from "../schemas/return_rejection_request_schema";

export interface IReturnRejectionRequestModel extends Omit<IReturnRejectionRequestEntity , "_id"|"borrowerId"|"ownerId"|"rentId">,Document{
    _id:ObjectId,
    borrowerId:ObjectId
    ownerId:ObjectId,
    rentId:ObjectId
}

export const ReturnRejectionRequestModel  = model<IReturnRejectionRequestModel>("ReturnRejectionRequest", ReturnRejectionRequestSchema);