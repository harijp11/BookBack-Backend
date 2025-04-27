import { inject, injectable } from "tsyringe";
import { ICreateNewContractRequestUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/create_new_contract_request_usecase-interface";
import { ContractRequestInput } from "../../../shared/constants";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";


@injectable()
export class CreateNewContractRequest implements ICreateNewContractRequestUseCase{
  constructor(
    @inject("IContractRequestRepository")
    private _contractRequestRepository:IContractRequestRepository
  ){}

  async execute(data: ContractRequestInput): Promise<void> {

     if(!data.bookId || !data.request_type || !data.requesterId || !data.ownerId){
        throw new CustomError("please check the datas",400)
     }
      
    const exist =  await this._contractRequestRepository.checkExist(data.requesterId,data.bookId)

    if(exist){
      await this._contractRequestRepository.deleteRequest(exist._id)
    }
     
     await this._contractRequestRepository.create(data)  
  }
}