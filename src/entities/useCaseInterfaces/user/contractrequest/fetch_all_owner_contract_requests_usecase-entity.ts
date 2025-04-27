import { ContractRequestModel } from "../../../../frameworks/database/models/contract_request-model";

export interface IFetchAllOwnerRequestsUseCase {
    execute(ownerId:string):Promise<ContractRequestModel[] | null>
}