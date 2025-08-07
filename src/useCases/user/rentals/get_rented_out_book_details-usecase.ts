import { inject, injectable } from "tsyringe";
import { IGetRentedOutBookDetailsUseCase } from "../../../entities/useCaseInterfaces/user/rental/get_rented_out_book_details_usecase-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { IRentModel, RentModel } from "../../../frameworks/database/models/rent_model";
import { CustomError } from "../../../entities/utils/custom_error";
import { HTTP_STATUS, RENTAL_ERROR } from "../../../shared/constants";

@injectable()
export class GetRentedOutBookDetailsUseCase implements IGetRentedOutBookDetailsUseCase {
    constructor(
        @inject("IRentRepository")
    private _rentRepository:IRentRepository
    ){}

    async execute(rentalId: string): Promise<IRentModel | null> {

        if(!rentalId){
            throw new CustomError(RENTAL_ERROR.RENTAL_ID_NOT_AVAILABLE,HTTP_STATUS.BAD_REQUEST)
        }

        const rentedContract = await this._rentRepository.findRentedOutBookDetails(rentalId)

        if(!rentedContract){
            throw new CustomError(RENTAL_ERROR.CONTRACT_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }

        return rentedContract
    }
}