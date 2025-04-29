import { IContractRequestModel } from "../../../../frameworks/database/models/contract_request-model";

export interface IFetchFixDealDetailsUseCase {
    execute(conReqId:string):Promise<IContractRequestModel | null>
}