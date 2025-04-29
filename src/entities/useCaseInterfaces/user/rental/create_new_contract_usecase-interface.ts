import { RentalInput, SaleInput } from "../../../models/contract_input_entity";

export interface ContractResponse{
    success:boolean
    message:string
}
export interface ICreateNewContractUseCase {
    execute(data:RentalInput | SaleInput,request_type:string,conReqId:string):Promise< ContractResponse | void>
}