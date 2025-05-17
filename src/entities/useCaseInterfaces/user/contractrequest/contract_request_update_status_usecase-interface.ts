import { IContractRequestModel } from "../../../../frameworks/database/models/contract_request-model";


export interface IContractRequestStatusUpdateUseCase {
    execute(conReqId:string,status:string):Promise<IContractRequestModel | null>
}