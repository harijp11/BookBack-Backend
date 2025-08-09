import { injectable,inject } from "tsyringe";
import { IFetchRequesterRequestsUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/fetch_requester_requests_usecase-entity";
import { CustomError } from "../../../entities/utils/custom_error";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { PaginatedContractRequest } from "../../../entities/models/paginated_contract_request-entity";
import { CONTRACT_REQUEST_ERROR, ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ContractRequestMapper } from "../../../shared/utils/mappers/contractRequestMapper";

@injectable()
export class FetchRequesterRequestsUseCase implements IFetchRequesterRequestsUseCase{
    constructor(
        @inject("IContractRequestRepository")
        private _contractRequestRepository:IContractRequestRepository
    ){}

    async execute(userId:string,page:number,limit:number,Filter:Object): Promise<PaginatedContractRequest| null> {
        
        if(!userId){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.BAD_REQUEST)
        }
           const skip = (page - 1) * limit

        const result = await this._contractRequestRepository.FindByRequesterId(userId,limit,Filter,skip)

        if (!result) {
            throw new CustomError(CONTRACT_REQUEST_ERROR.REQUEST_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
          }
        const {getRequests,count} = result
        const requests = getRequests()

        const totalPages = Math.ceil(count / limit);
        
        return{ 
            requests:requests.map(ContractRequestMapper.toDTO) || [],
            totalRequests:count,
            totalPages,
            currentPage:page
        }
    }
}