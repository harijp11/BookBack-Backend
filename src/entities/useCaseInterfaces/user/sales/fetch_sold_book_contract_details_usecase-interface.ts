import { ISaleModel } from "../../../../frameworks/database/models/sale_model";
import { SingleSaleDTO } from "../../../../shared/dto/singleSaleDto";

export interface IFetchSoldBooksContractDetailsUseCase {
    execute(saleContractId:string):Promise<SingleSaleDTO | null>
}