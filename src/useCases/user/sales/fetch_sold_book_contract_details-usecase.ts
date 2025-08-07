import { inject, injectable } from "tsyringe";
import { IFetchSoldBooksContractDetailsUseCase } from "../../../entities/useCaseInterfaces/user/sales/fetch_sold_book_contract_details_usecase-interface";
import { ISaleRepository } from "../../../entities/repositoryInterface/common/sale_repository-interface";
import { ISaleModel } from "../../../frameworks/database/models/sale_model";
import { CustomError } from "../../../entities/utils/custom_error";
import { HTTP_STATUS, SALE_ERROR_RESPONSES } from "../../../shared/constants";

@injectable()
export class FetchSoldBookContractDetailsUseCase implements IFetchSoldBooksContractDetailsUseCase {
    constructor(
        @inject("ISaleRepository")
        private _saleRepository:ISaleRepository
    ){}

    async execute(saleContractId: string): Promise<ISaleModel | null> {
        const saleContract = await this._saleRepository.findSoldBookDetails(saleContractId)

        if(!saleContract){
            throw new CustomError(SALE_ERROR_RESPONSES.SALE_CONTRACT_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }

        return saleContract
    }
}