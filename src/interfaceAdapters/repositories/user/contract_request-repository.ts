import { injectable } from "tsyringe";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { ContractRequestInput } from "../../../shared/constants";
import { ContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { IContractRequestEntity } from "../../../entities/models/contract_request-entity";

@injectable()
export class ContractRequestRepository implements IContractRequestRepository{
   async  create(data: ContractRequestInput): Promise<void> {
        await ContractRequestModel.create(data)
    }

    async checkExist(requesterId: string, bookId: string): Promise<IContractRequestEntity | null> {
        return await ContractRequestModel.findOne({requesterId,bookId})
    }

    async FindByOwnerId(ownerId: string): Promise<ContractRequestModel[] | null> {
        const requests = await ContractRequestModel.find({ownerId}).populate("ownerId","Name").populate("requesterId","Name email").populate("bookId","name").sort({createdAt:-1})
       return requests
    }

    async findByIdAndUpdateStatus(conReqId: string, status: string): Promise<ContractRequestModel | null> {
        return await ContractRequestModel.findByIdAndUpdate(
            {_id:conReqId},
            {$set:{status}},
            {new:true}
        )
    }

    async deleteRequest(conReqId: string): Promise<void> {
        await ContractRequestModel.findByIdAndDelete({_id:conReqId})
    }

}