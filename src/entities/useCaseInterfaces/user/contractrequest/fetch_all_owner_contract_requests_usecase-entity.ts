import { ContractRequestDTO } from "../../../../shared/dto/contractRequestDto";

export interface IFetchAllOwnerRequestsUseCase {
    execute(ownerId:string):Promise<ContractRequestDTO[] | null | undefined>
}