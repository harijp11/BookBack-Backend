import { IRentModel } from "../../../frameworks/database/models/rent_model";
import { RentalInput } from "../../models/contract_input_entity";



export interface PaginatedRentedBooksRepo {
    getRentedBooksContracts(): IRentModel[];
    count: number;
}

export interface IRentRepository {
    createNewRent(data:RentalInput):Promise<void>
    findRentedBooksContracts(ownerId: string,
            filter: object,
            limit: number,
            skip: number):Promise<PaginatedRentedBooksRepo | null>
    
            findBorrowedBooksContracts(borrowerId: string,
                filter: object,
                limit: number,
                skip: number):Promise<PaginatedRentedBooksRepo | null>


                findAllRentedBooksContracts(filter: object,
                    limit: number,
                    skip: number):Promise<PaginatedRentedBooksRepo | null>

                    findRentedOutBookDetails(rentalId:string):Promise<IRentModel | null>
}