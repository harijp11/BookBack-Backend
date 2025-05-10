import { inject, injectable } from "tsyringe";
import { ICreateNewReturnRejectionRequestUseCase } from "../../../entities/useCaseInterfaces/user/return_rejection_request_usecase-interface/create_new_return_rejection_request_usecase-interface";
import { IReturnRejectionRequestcreateDTO } from "../../../entities/models/return_rejection_request_input_data_entity";
import { IReturnRejectionRequestModel } from "../../../frameworks/database/models/return_rejection_request_model";
import { CustomError } from "../../../entities/utils/custom_error";
import { IReturnRejectionRequestRepository } from "../../../entities/repositoryInterface/common/return_rejection_request_repository-interface";


@injectable()
export class CreateNewReturnRejectionRequestUseCase implements ICreateNewReturnRejectionRequestUseCase{
  constructor(
    @inject("IReturnRejectionRequestRepository")
    private _returnRejectionRequestRepository:IReturnRejectionRequestRepository,
  ){}

  async execute(data: IReturnRejectionRequestcreateDTO): Promise<IReturnRejectionRequestModel | null> {
      if(!data.borrowerId || !data.ownerId || !data.reason || !data.rentId){
        throw new CustomError("Missingg of details",400)    
      }

      const returnRejection = await this._returnRejectionRequestRepository.create(data)

      if(!returnRejection){
        throw new CustomError("There is issue in creating ReturnRejectionRequest",404)
      }

    

      return returnRejection

  }
}