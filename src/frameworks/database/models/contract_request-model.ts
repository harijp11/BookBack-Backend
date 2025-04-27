import { model, ObjectId } from "mongoose";
import { IContractRequestEntity } from "../../../entities/models/contract_request-entity";
import { ContractRequestSchema } from "../schemas/contract_request-schema";

export interface ContractRequestModel extends  Omit<IContractRequestEntity,"_id"|"ownerId"|"bookId"|"requesterId">{
     _id:ObjectId
     ownerId:ObjectId
     bookId:ObjectId
     requesterId:ObjectId
}

export const ContractRequestModel = model<ContractRequestModel>("ContractRequest",ContractRequestSchema)