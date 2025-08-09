import { inject, injectable } from "tsyringe";
import { IFetchAllOwnerRequestsUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/fetch_all_owner_contract_requests_usecase-entity";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { IContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { ContractRequestMapper } from "../../../shared/utils/mappers/contractRequestMapper";
import { ContractRequestDTO } from "../../../shared/dto/contractRequestDto";


@injectable()
export class FetchAllOwnerContractRequestsUseCase implements IFetchAllOwnerRequestsUseCase {
  constructor(
    @inject("IContractRequestRepository")
    private _contractRequestsRepository: IContractRequestRepository
  ){}

  async execute(ownerId: string): Promise<ContractRequestDTO[] | null | undefined> {
       const requests = await this._contractRequestsRepository.FindByOwnerId(ownerId)
       return requests?.map(ContractRequestMapper.toDTO)
  }
}