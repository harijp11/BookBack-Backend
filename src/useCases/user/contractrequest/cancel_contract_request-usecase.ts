import { inject, injectable } from "tsyringe";
import { ICancelContractRequestUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/cancel_contract_request_usecase-interface";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { IContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { CustomError } from "../../../entities/utils/custom_error";

@injectable()
export  class  CancelContractRequest implements ICancelContractRequestUseCase{
    constructor(
        @inject("IContractRequestRepository")
        private _contractRequestRepository:IContractRequestRepository
    ){}

    async execute(conReqId:string): Promise<IContractRequestModel | null> {
         
     const request = await this._contractRequestRepository.findByIdAndUpdateStatus(conReqId,"cancelled")

     if(!request){
        throw new CustomError("No request found",404)
     }

     return request
       
    }
}