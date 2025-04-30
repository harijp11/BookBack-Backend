import { PaginatedRentedBooksContracts } from "../../../models/paginated_rental_contracts_entity";


export interface IGetAdminRentedOutBooksContractUseCase {
    execute(filter:object,page:number,limit:number):Promise<PaginatedRentedBooksContracts | null >
}