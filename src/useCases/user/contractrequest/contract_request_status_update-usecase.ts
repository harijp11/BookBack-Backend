import { inject, injectable } from "tsyringe";
import { IContractRequestStatusUpdateUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/contract_request_update_status_usecase-interface";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { IContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { INotificationRepository } from "../../../entities/repositoryInterface/user/notification_repository-interface";
import { CONTRACT_REQUEST_ERROR, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class ContractRequestUpdateStatus implements IContractRequestStatusUpdateUseCase{
    constructor(
        @inject("IContractRequestRepository")
        private _contractRequestRepository:IContractRequestRepository,
        @inject("INotificationRepository")
        private _notificationRepository:INotificationRepository
    ){}

    async execute(conReqId: string, status: string): Promise<IContractRequestModel | null> {
        const request = await this._contractRequestRepository.findByIdAndUpdateStatus(conReqId,status)

        if(!request){
            throw new CustomError(CONTRACT_REQUEST_ERROR.REQUEST_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }
        if(status === "accepted"){
           await this._notificationRepository.create({
          userId: request.requesterId.toString(),
          message:
            "Your book rental request accepted by owner",
          type:"good",
          navlink: "/contract-requests",
        });
        }else if(status === "rejected"){
           await this._notificationRepository.create({
          userId: request.requesterId.toString(),
          message:
            "Your book rental request rejected by owner",
          type:"fault",
          navlink: "/contract-requests",
        });
        }
        return request
    }

}