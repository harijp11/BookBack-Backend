import { ISaleModel } from "../../../frameworks/database/models/sale_model";
import { RentalInput, SaleInput } from "../../models/contract_input_entity";

export interface PaginatedSoldBooksRepo {
    getSoldBooksContracts(): ISaleModel[];
    count: number;
}

export interface ISaleRepository {
    createNewSale(data:SaleInput):Promise<void>
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