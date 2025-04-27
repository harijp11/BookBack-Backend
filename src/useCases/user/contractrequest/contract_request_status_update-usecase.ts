import { inject, injectable } from "tsyringe";
import { IContractRequestStatusUpdateUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/contract_request_update_status_usecase-interface";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ContractRequestModel } from "../../../frameworks/database/models/contract_request-model";

@injectable()
export class ContractRequestUpdateStatus implements IContractRequestStatusUpdateUseCase{
    constructor(
        @inject("IContractRequestRepository")
        private _contractRequestRepository:IContractRequestRepository
    ){}

    async execute(conReqId: string, status: string): Promise<ContractRequestModel | null> {
        const request = await this._contractRequestRepository.findByIdAndUpdateStatus(conReqId,status)
        
        if(!request){
            throw new CustomError("No Contract Request found",404)
        }
        return request
    }

}