import { injectable,inject } from "tsyringe";
import { IFetchRequesterRequestsUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/fetch_requester_requests_usecase-entity";
import { IContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { CustomError } from "../../../entities/utils/custom_error";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { PaginatedContractRequest } from "../../../entities/models/paginated_contract_request-entity";

@injectable()
export class FetchRequesterRequestsUseCase implements IFetchRequesterRequestsUseCase{
    constructor(
        @inject("IContractRequestRepository")
        private _contractRequestRepository:IContractRequestRepository
    ){}

    async execute(userId:string,page:number,limit:number,Filter:Object): Promise<PaginatedContractRequest| null> {
        
        if(!userId){
            throw new CustomError("User not found",400)
        }
           const skip = (page - 1) * limit

        const result = await this._contractRequestRepository.FindByRequesterId(userId,limit,Filter,skip)

        if (!result) {
            throw new CustomError("No requests avaialable",404)
          }
        const {getRequests,count} = result
        const requests = getRequests()

        const totalPages = Math.ceil(count / limit);
        
        return{ 
            requests:requests || [],
            totalRequests:count,
            totalPages,
            currentPage:page
        }
    }
}