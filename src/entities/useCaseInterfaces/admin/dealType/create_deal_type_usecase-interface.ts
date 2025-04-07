import { DealTypeUseCaseResponse } from "../../../../shared/constants"

export interface ICreateDealTypeUseCase{
    execute(name:string,description?:string):Promise<DealTypeUseCaseResponse | void>
}