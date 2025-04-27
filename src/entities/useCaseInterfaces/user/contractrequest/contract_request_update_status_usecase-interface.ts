import { ContractRequestModel } from "../../../../frameworks/database/models/contract_request-model";

export interface IContractRequestStatusUpdateUseCase {
    execute(conReqId:string,status:string):Promise<ContractRequestModel | null>
}