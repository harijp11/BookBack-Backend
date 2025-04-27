import { inject, injectable } from "tsyringe";
import { IFetchAllOwnerRequestsUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/fetch_all_owner_contract_requests_usecase-entity";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { ContractRequestModel } from "../../../frameworks/database/models/contract_request-model";


@injectable()
export class FetchAllOwnerContractRequestsUseCase implements IFetchAllOwnerRequestsUseCase {
  constructor(
    @inject("IContractRequestRepository")
    private _contractRequestsRepository: IContractRequestRepository
  ){}

  async execute(ownerId: string): Promise<ContractRequestModel[] | null> {
       const requests = await this._contractRequestsRepository.FindByOwnerId(ownerId)
       return requests
  }
}