import { inject, injectable } from "tsyringe";
import { IGetAdminRentedOutBooksContractUseCase } from "../../../entities/useCaseInterfaces/admin/rental/get_admin_rented_out_books_contract_usecase-interface"; 
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { PaginatedRentedBooksContracts } from "../../../entities/models/paginated_rental_contracts_entity";
import { BOOK_ERROR_RESPONSES } from "../../../shared/constants";
import { RentMapper } from "../../../shared/utils/mappers/rentalMappers";

@injectable()
export class GetAdminRentedOutBooksContractUseCase implements IGetAdminRentedOutBooksContractUseCase {
   constructor(
    @inject("IRentRepository")
    private _rentedRepository:IRentRepository
   ){}

   async execute( filter: object, page: number, limit: number): Promise<PaginatedRentedBooksContracts | null> {
       const skip = (page - 1) * limit;
            const RentedBooksContract = await this._rentedRepository.findAllRentedBooksContracts(filter,limit,skip)
       
       
            if (!RentedBooksContract) {
               throw new CustomError(BOOK_ERROR_RESPONSES.BOOKS_NOT_FOUND, 404);
             }
       
            const { getRentedBooksContracts, count } = RentedBooksContract;
       
             const rentedBooksContract = getRentedBooksContracts();
              
       
                const totalPages = Math.ceil(count / limit);
       
                return{ 
                   rentedBooksContracts:rentedBooksContract.map(RentMapper) || [],
                   totalRentedContracts:count,
                    totalPages,
                    currentPage:page
                }
   }
}