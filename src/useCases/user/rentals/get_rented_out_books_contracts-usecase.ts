import { inject, injectable } from "tsyringe";
import { IGetRentedOutBooksContractUseCase } from "../../../entities/useCaseInterfaces/user/rental/get_rented_out_books_contracts_usecase-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { PaginatedRentedBooksContracts } from "../../../entities/models/paginated_rental_contracts_entity";

@injectable()
export class GetRentedOutBooksContractUseCase implements IGetRentedOutBooksContractUseCase {
   constructor(
    @inject("IRentRepository")
    private _rentedRepository:IRentRepository
   ){}

   async execute(userId: string, filter: object, page: number, limit: number): Promise<PaginatedRentedBooksContracts | null> {
       const skip = (page - 1) * limit;
            const RentedBooksContract = await this._rentedRepository.findRentedBooksContracts(userId,filter,limit,skip)
       
       
            if (!RentedBooksContract) {
               throw new CustomError("No books found", 404);
             }
       
            const { getRentedBooksContracts, count } = RentedBooksContract;
       
             const rentedBooksContract = getRentedBooksContracts();
              
       
                const totalPages = Math.ceil(count / limit);
       
                return{ 
                   rentedBooksContracts:rentedBooksContract || [],
                   totalRentedContracts:count,
                    totalPages,
                    currentPage:page
                }
   }
}