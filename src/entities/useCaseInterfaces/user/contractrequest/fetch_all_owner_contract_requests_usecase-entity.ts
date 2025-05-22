import { IContractRequestModel } from "../../../../frameworks/database/models/contract_request-model";

export interface IFetchAllOwnerRequestsUseCase {
    execute(ownerId:string):Promise<IContractRequestModel[] | null>
}