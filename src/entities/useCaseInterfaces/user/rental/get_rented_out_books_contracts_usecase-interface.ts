import { PaginatedRentedBooksContracts } from "../../../models/paginated_rental_contracts_entity";


export interface IGetRentedOutBooksContractUseCase {
    execute(userId:string,filter:object,page:number,limit:number):Promise<PaginatedRentedBooksContracts | null >
}