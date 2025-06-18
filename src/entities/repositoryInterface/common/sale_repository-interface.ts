import { ISaleModel } from "../../../frameworks/database/models/sale_model";
import { RentalInput, SaleInput } from "../../models/contract_input_entity";
import { IBaseRepository } from "../baseRepo/base_repository-interface";

export interface PaginatedSoldBooksRepo {
    getSoldBooksContracts(): ISaleModel[];
    count: number;
}

export interface ISaleRepository extends IBaseRepository<ISaleModel,SaleInput> {
    // createNewSale(data:SaleInput):Promise<void>
    fetchSoldBooksContracts(ownerId: string,
        filter: object,
        limit: number,
        skip: number):Promise<PaginatedSoldBooksRepo | null>

        findBoughtBooksContracts(buyerId: string,
            filter: object,
            limit: number,
            skip: number):Promise<PaginatedSoldBooksRepo | null>

            findAllBooks(
            filter: object,
            limit: number,
            skip: number):Promise<PaginatedSoldBooksRepo | null>

            findSoldBookDetails(saleContractId: string): Promise<ISaleModel | null>
            count(filter: object): Promise<number>;
            aggregate(pipeline: any[]): Promise<any[]>;
}