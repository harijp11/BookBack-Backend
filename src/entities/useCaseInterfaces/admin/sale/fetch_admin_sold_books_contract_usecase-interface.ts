import { PaginatedSoldBooksContracts } from "../../../models/paginated_sale_books_contract_entity";

export interface IFetchAdminSoldBooksContractUseCase{
    execute(filter:object,page:number,limit:number):Promise<PaginatedSoldBooksContracts | null>
}