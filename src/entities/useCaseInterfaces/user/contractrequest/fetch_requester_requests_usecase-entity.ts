
import { PaginatedContractRequest } from "../../../models/paginated_contract_request-entity";


export interface IFetchRequesterRequestsUseCase{
    execute(userId:string,page:number,limit:number,Filter:Object):Promise<PaginatedContractRequest | null>
}