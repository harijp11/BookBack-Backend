import { ContractRequestInput } from "../../../../shared/constants";


export interface ICreateNewContractRequestUseCase {
    execute(data:ContractRequestInput):Promise<void>
}