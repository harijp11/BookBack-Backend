import { inject, injectable } from "tsyringe";
import { IContractRequestStatusUpdateUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/contract_request_update_status_usecase-interface";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { IContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { INotificationRepository } from "../../../entities/repositoryInterface/user/notification_repository-interface";

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
            throw new CustomError("No Contract Request found",404)
        }
        if(status === "accepted"){
           await this._notificationRepository.setNotitfication({
          userId: request.requesterId.toString(),
          message:
            "Your book rental request accepted by owner",
          type:"good",
          navlink: "/contract-requests",
        });
        }else if(status === "rejected"){
           await this._notificationRepository.setNotitfication({
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