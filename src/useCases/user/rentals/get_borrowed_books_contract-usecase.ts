import { inject, injectable } from "tsyringe";
import { IGetBorrowedOutBooksContractUseCase } from "../../../entities/useCaseInterfaces/user/rental/get_borrowed_books_contract_usecase-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { PaginatedRentedBooksContracts } from "../../../entities/models/paginated_rental_contracts_entity";
import { CustomError } from "../../../entities/utils/custom_error";
import { BOOK_ERROR_RESPONSES, HTTP_STATUS } from "../../../shared/constants";
import { RentMapper } from "../../../shared/utils/mappers/rentalMappers";

@injectable()
export class GetBorrowedBooksContractUseCase
  implements IGetBorrowedOutBooksContractUseCase
{
  constructor(
    @inject("IRentRepository")
    private _rentRepository: IRentRepository
  ) {}

  async execute(
    userId: string,
    filter: object,
    page: number,
    limit: number
  ): Promise<PaginatedRentedBooksContracts | null> {
    const skip = (page - 1) * limit;
    const RentedBooksContract =
      await this._rentRepository.findBorrowedBooksContracts(
        userId,
        filter,
        limit,
        skip
      );

    if (!RentedBooksContract) {
      throw new CustomError(BOOK_ERROR_RESPONSES.BOOKS_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const { getRentedBooksContracts, count } = RentedBooksContract;

    const rentedBooksContract = getRentedBooksContracts();

    const totalPages = Math.ceil(count / limit);

    return {
      rentedBooksContracts: rentedBooksContract.map(RentMapper) || [],
      totalRentedContracts: count,
      totalPages,
      currentPage: page,
    };
  }
}
