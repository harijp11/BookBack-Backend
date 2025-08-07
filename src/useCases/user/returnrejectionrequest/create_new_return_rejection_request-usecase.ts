import { inject, injectable } from "tsyringe";
import { ICreateNewReturnRejectionRequestUseCase } from "../../../entities/useCaseInterfaces/user/return_rejection_request_usecase-interface/create_new_return_rejection_request_usecase-interface";
import { IReturnRejectionRequestcreateDTO } from "../../../entities/models/return_rejection_request_input_data_entity";
import { IReturnRejectionRequestModel } from "../../../frameworks/database/models/return_rejection_request_model";
import { CustomError } from "../../../entities/utils/custom_error";
import { IReturnRejectionRequestRepository } from "../../../entities/repositoryInterface/common/return_rejection_request_repository-interface";
import { ERROR_MESSAGES, HTTP_STATUS, RETURN_REJECTION_REQUEST_ERROR } from "../../../shared/constants";


@injectable()
export class CreateNewReturnRejectionRequestUseCase implements ICreateNewReturnRejectionRequestUseCase{
  constructor(
    @inject("IReturnRejectionRequestRepository")
    private _returnRejectionRequestRepository:IReturnRejectionRequestRepository,
  ){}

  async execute(data: IReturnRejectionRequestcreateDTO): Promise<IReturnRejectionRequestModel | null> {
      if(!data.borrowerId || !data.ownerId || !data.reason || !data.rentId){
        throw new CustomError(ERROR_MESSAGES.MISSING_OF_DETAILS,HTTP_STATUS.BAD_REQUEST)    
      }

      const returnRejection = await this._returnRejectionRequestRepository.create(data)

      if(!returnRejection){
        throw new CustomError(RETURN_REJECTION_REQUEST_ERROR.CREATION_FAILED,HTTP_STATUS.BAD_REQUEST)
      }

    

      return returnRejection

  }
}