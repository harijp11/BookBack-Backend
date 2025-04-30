import { inject, injectable } from "tsyringe";
import { IGetBorrowedOutBooksContractUseCase } from "../../../entities/useCaseInterfaces/user/rental/get_borrowed_books_contract_usecase-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { PaginatedRentedBooksContracts } from "../../../entities/models/paginated_rental_contracts_entity";
import { CustomError } from "../../../entities/utils/custom_error";


@injectable()
export class GetBorrowedBooksContractUseCase implements IGetBorrowedOutBooksContractUseCase{
  constructor(
    @inject("IRentRepository")
    private _rentRepository:IRentRepository
  ){}

  async execute(userId: string, filter: object, page: number, limit: number): Promise<PaginatedRentedBooksContracts | null> {
        const skip = (page - 1) * limit;
                  const RentedBooksContract = await this._rentRepository.findBorrowedBooksContracts(userId,filter,limit,skip)
             
             
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