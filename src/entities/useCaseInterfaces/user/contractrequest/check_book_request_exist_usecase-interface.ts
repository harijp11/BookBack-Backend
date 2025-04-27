import { IContractRequestEntity } from "../../../models/contract_request-entity";

export interface ICheckBookRequestExistUseCase {
    execute(requesterId:string,bookId:string):Promise<IContractRequestEntity | null>
}