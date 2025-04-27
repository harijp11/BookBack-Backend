import { inject, injectable } from "tsyringe";
import { ICheckBookRequestExistUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/check_book_request_exist_usecase-interface";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { IContractRequestEntity } from "../../../entities/models/contract_request-entity";

@injectable()
export class CheckBookRequestExist implements ICheckBookRequestExistUseCase{
  constructor(
    @inject("IContractRequestRepository")
    private _contractRequestRepository:IContractRequestRepository
  ){}

  async execute(requesterId: string, bookId: string): Promise<IContractRequestEntity | null> {
      return await this._contractRequestRepository.checkExist(requesterId,bookId)
  }
}