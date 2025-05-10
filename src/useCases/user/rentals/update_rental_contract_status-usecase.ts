import { inject, injectable } from "tsyringe";
import { IUpdateRentalContractStatusUseCase } from "../../../entities/useCaseInterfaces/user/rental/update_rental_contract_status_usecase-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { IRentModel } from "../../../frameworks/database/models/rent_model";
import { IPurseRepository } from "../../../entities/repositoryInterface/user/purse_repository-interface";
import { generateUniqueTrsasactionId } from "../../../frameworks/security/uniqueid_bcrypt";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";


@injectable()
export class UpdateRentalContractStatusUseCase implements IUpdateRentalContractStatusUseCase {
    constructor(
        @inject("IRentRepository")
        private _rentRepository:IRentRepository,
        @inject("IPurseRepository")
        private _purseRepository:IPurseRepository,
        @inject("IBookRepository")
        private _bookRepository:IBookRepository
    ){}

    async execute(rentalId: string, status: string): Promise<IRentModel | null> {
        const rentalContract = await this._rentRepository.findByIdAndUpdateStatus(rentalId,status)

        if(!rentalContract){
            throw new CustomError("No rental contract available", 404)
        }

        // console.log("statussssssssss",status)

        if(status === "Returned"){
           //borrower side
           const tsId = generateUniqueTrsasactionId()

           let borrowerPurse = await this._purseRepository.findById(rentalContract.borrowerId.toString())

           if(!borrowerPurse){
            borrowerPurse = await this._purseRepository.create(rentalContract.borrowerId.toString())
          }

          await this._purseRepository.addTransaction(rentalContract.borrowerId.toString(), {
            tsId,
            type: "debit",
            amount: rentalContract.rent_amount,
            status: "completed",
            description:"Amount Debited by Rent of a Book"
          });

          await this._purseRepository.updateBalance(rentalContract.borrowerId.toString(),-(rentalContract.rent_amount))

          await this._purseRepository.AddHoldAmount(rentalContract.borrowerId.toString(),-(rentalContract.original_amount))

          //owner side

           let ownerPurse = await this._purseRepository.findById(rentalContract.ownerId.toString())

           if(!ownerPurse){
            ownerPurse = await this._purseRepository.create(rentalContract.ownerId.toString())
          }

          await this._purseRepository.addTransaction(rentalContract.ownerId.toString(), {
            tsId,
            type: "credit",
            amount: rentalContract.rent_amount,
            status: "completed",
            description:"Amount Credited through Rent amount of a Book"
          });

          await this._purseRepository.updateBalance(rentalContract.ownerId.toString(),(rentalContract.rent_amount))

          rentalContract.returned_at = new Date()

          await this._rentRepository.save(rentalContract)

          await this._bookRepository.findByIdAndUpdateLiveStatus(rentalContract.bookId.toString(),"Available")
        }

        return rentalContract
    }
}