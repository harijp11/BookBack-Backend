import { PaginatedRentedBooksContracts } from "../../../models/paginated_rental_contracts_entity";

export interface IGetBorrowedOutBooksContractUseCase {
    execute(userId:string,filter:object,page:number,limit:number):Promise<PaginatedRentedBooksContracts | null >
}