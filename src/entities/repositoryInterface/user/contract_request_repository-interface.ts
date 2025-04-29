import { IContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { ContractRequestInput } from "../../../shared/constants";
import { IContractRequestEntity } from "../../models/contract_request-entity";

export interface PaginatedRequestsRepo {
  getRequests(): IContractRequestModel[];
  count: number;
}

export interface IContractRequestRepository {
  findById(conReqId: string): Promise<IContractRequestModel | null>
  create(data:ContractRequestInput):Promise<void>
  checkExist(requesterId:string,bookId:string):Promise<IContractRequestEntity | null>
  FindByOwnerId(ownerId:string):Promise<IContractRequestModel[] | null>
  FindByRequesterId(requesterId:string,limit:number,filter:object,skip:number):Promise<PaginatedRequestsRepo | null>
  findByIdAndUpdateStatus(conReqId:string,status:string):Promise<IContractRequestModel | null>
  deleteRequest(conReqId:string):Promise<void>
}