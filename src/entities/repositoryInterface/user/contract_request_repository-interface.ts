import { ContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { ContractRequestInput } from "../../../shared/constants";
import { IContractRequestEntity } from "../../models/contract_request-entity";


export interface IContractRequestRepository {
  create(data:ContractRequestInput):Promise<void>
  checkExist(requesterId:string,bookId:string):Promise<IContractRequestEntity | null>
  FindByOwnerId(ownerId:string):Promise<ContractRequestModel[] | null>
  findByIdAndUpdateStatus(conReqId:string,status:string):Promise<ContractRequestModel | null>
  deleteRequest(conReqId:string):Promise<void>
}