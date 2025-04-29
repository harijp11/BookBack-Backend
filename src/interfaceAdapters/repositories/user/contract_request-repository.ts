import { injectable } from "tsyringe";
import { IContractRequestRepository, PaginatedRequestsRepo } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { ContractRequestInput } from "../../../shared/constants";
import { ContractRequestModel, IContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { IContractRequestEntity } from "../../../entities/models/contract_request-entity";

@injectable()
export class ContractRequestRepository implements IContractRequestRepository{
   async  create(data: ContractRequestInput): Promise<void> {
        await ContractRequestModel.create(data)
    }

    async checkExist(requesterId: string, bookId: string): Promise<IContractRequestEntity | null> {
        return await ContractRequestModel.findOne({requesterId,bookId})
    }

    async FindByOwnerId(ownerId: string): Promise<IContractRequestModel[] | null> {
        const requests = await ContractRequestModel.find({ownerId}).populate("ownerId","Name").populate("requesterId","Name email").populate("bookId","name").sort({createdAt:-1})
       return requests
    }

    async findById(conReqId: string): Promise<IContractRequestModel | null> {
        const requests = await ContractRequestModel.findOne({_id:conReqId}).populate("ownerId").populate("requesterId").populate("bookId")
       return requests
    }

    async FindByRequesterId(requesterId: string,limit:number,filter:object,skip:number): Promise<PaginatedRequestsRepo | null> {
        const Filter = {
            ...filter,       
            requesterId,    
          };
         const [requests,count] = await Promise.all([
            ContractRequestModel.find(Filter)
              .skip(skip)
              .limit(limit)
              .populate("ownerId","Name").populate("requesterId","Name email").populate("bookId","name").sort({createdAt:-1}),
              ContractRequestModel.countDocuments(Filter)
            ])
        
            
          return {
              getRequests:()=>requests,
              count
            };  
    }


    async findByIdAndUpdateStatus(conReqId: string, status: string): Promise<IContractRequestModel | null> {
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