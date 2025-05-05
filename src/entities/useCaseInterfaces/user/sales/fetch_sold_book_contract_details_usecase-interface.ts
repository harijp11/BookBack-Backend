import { ISaleModel } from "../../../../frameworks/database/models/sale_model";

export interface IFetchSoldBooksContractDetailsUseCase {
    execute(saleContractId:string):Promise<ISaleModel | null>
}