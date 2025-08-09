import { inject, injectable } from "tsyringe";
import { ISaleRepository } from "../../../entities/repositoryInterface/common/sale_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { PaginatedSoldBooksContracts } from "../../../entities/models/paginated_sale_books_contract_entity";
import { IFetchBoughtBooksContractsUseCase } from "../../../entities/useCaseInterfaces/user/sales/fetch_bought_books_usecase-interface";
import { BOOK_ERROR_RESPONSES, HTTP_STATUS } from "../../../shared/constants";
import { SoldBookContractMapper } from "../../../shared/utils/mappers/saleMapper";

@injectable()
export class FetchBoughtBooksContractUseCase implements IFetchBoughtBooksContractsUseCase{
  constructor(
    @inject("ISaleRepository")
    private _saleRepository:ISaleRepository
  ){}

  async execute(userId: string,filter:object,page:number,limit:number): Promise<PaginatedSoldBooksContracts| null> {
      const skip = (page - 1) * limit;
     const soldBooksContract = await this._saleRepository.findBoughtBooksContracts(userId,filter,limit,skip)


     if (!soldBooksContract) {
        throw new CustomError(BOOK_ERROR_RESPONSES.BOOKS_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }

     const { getSoldBooksContracts, count } = soldBooksContract;

      const saleBooksContract = getSoldBooksContracts();
       

         const totalPages = Math.ceil(count / limit);

         return{ 
            saleBooksContracts:saleBooksContract.map(SoldBookContractMapper.toDTO) || [],
            totalSoldContracts:count,
             totalPages,
             currentPage:page
         }
  }
}