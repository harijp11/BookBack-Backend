import { inject, injectable } from "tsyringe";
import { IFetchFixDealDetailsUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/fetch_fix_deal_details_usecase-interface";
import { IContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { CONTRACT_REQUEST_ERROR, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class FetchFixDealDetailsUseCase implements IFetchFixDealDetailsUseCase {
    constructor(
      @inject("IContractRequestRepository")
      private _contractRequestRepository:IContractRequestRepository
    ){}

    async execute(conReqId: string): Promise<IContractRequestModel | null> {
        const request = await this._contractRequestRepository.findById(conReqId)
       
        if(!request){
            throw new CustomError(CONTRACT_REQUEST_ERROR.REQUEST_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }
        return request
    }
}