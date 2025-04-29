import { inject, injectable } from "tsyringe";
import { IFetchSoldBooksContractUseCase } from "../../../entities/useCaseInterfaces/user/sales/fetch_sold_books_usecase-interface";
import { ISaleRepository } from "../../../entities/repositoryInterface/common/sale_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { PaginatedSoldBooksContracts } from "../../../entities/models/paginated_sale_books_contract_entity";

@injectable()
export class FetchSoldBooksContractUseCase implements IFetchSoldBooksContractUseCase{
  constructor(
    @inject("ISaleRepository")
    private _saleRepository:ISaleRepository
  ){}

  async execute(userId: string,filter:object,page:number,limit:number): Promise<PaginatedSoldBooksContracts| null> {
      const skip = (page - 1) * limit;
     const soldBooksContract = await this._saleRepository.fetchSoldBooksContracts(userId,filter,limit,skip)


     if (!soldBooksContract) {
        throw new CustomError("No books found", 404);
      }

     const { getSoldBooksContracts, count } = soldBooksContract;

      const saleBooksContract = getSoldBooksContracts();
       

         const totalPages = Math.ceil(count / limit);

         return{ 
            saleBooksContracts:saleBooksContract || [],
            totalSoldContracts:count,
             totalPages,
             currentPage:page
         }
  }
}