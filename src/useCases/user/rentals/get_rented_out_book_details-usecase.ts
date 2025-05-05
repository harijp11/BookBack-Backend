import { inject, injectable } from "tsyringe";
import { IGetRentedOutBookDetailsUseCase } from "../../../entities/useCaseInterfaces/user/rental/get_rented_out_book_details_usecase-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { IRentModel, RentModel } from "../../../frameworks/database/models/rent_model";
import { CustomError } from "../../../entities/utils/custom_error";

@injectable()
export class GetRentedOutBookDetailsUseCase implements IGetRentedOutBookDetailsUseCase {
    constructor(
        @inject("IRentRepository")
    private _rentRepository:IRentRepository
    ){}

    async execute(rentalId: string): Promise<IRentModel | null> {

        if(!rentalId){
            throw new CustomError("Rental Id is required",400)
        }

        const rentedContract = await this._rentRepository.findRentedOutBookDetails(rentalId)

        if(!rentedContract){
            throw new CustomError("Rental contract not Found",404)
        }

        return rentedContract
    }
}