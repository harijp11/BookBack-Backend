import { inject, injectable } from "tsyringe";
import { IUpdateReturnRejectionRequestStatusUseCase } from "../../../entities/useCaseInterfaces/admin/returnrejectionrequest/update_return_rejection_request_status_usecase-interface";
import { IReturnRejectionRequestRepository } from "../../../entities/repositoryInterface/common/return_rejection_request_repository-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { IPurseRepository } from "../../../entities/repositoryInterface/user/purse_repository-interface";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { generateUniqueTrsasactionId } from "../../../frameworks/security/uniqueid_bcrypt";

@injectable()
export class UpdateReturnRejectionRequestStatusUseCase implements IUpdateReturnRejectionRequestStatusUseCase{
   constructor(
    @inject("IReturnRejectionRequestRepository")
    private _returnRejectionRequestRepository:IReturnRejectionRequestRepository,
    @inject("IRentRepository")
    private _rentRepository:IRentRepository,
    @inject("IPurseRepository")
    private _purseRepository:IPurseRepository,
    @inject("IBookRepository")
    private _bookRepository:IBookRepository
   ){}

   async execute(status: string, retRejId: string): Promise<void> {
    const returnRejectionRequest = await this._returnRejectionRequestRepository.findById(retRejId)

    if(!returnRejectionRequest){
        throw new CustomError("NO Return Rejection Request found",404)
    }

const rentalContract = await this._rentRepository.findById(returnRejectionRequest.rentId.toString())

if(!rentalContract){
    throw new CustomError("NO Return Rental contract found",404)
}

       if(status === "rejected"){
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
                    
                   rentalContract.status = "Returned"
                   
         
                   await this._rentRepository.save(rentalContract)
         
                   await this._bookRepository.findByIdAndUpdateLiveStatus(rentalContract.bookId.toString(),"Available")

       
       }else if(status === "accepted"){
        const tsId = generateUniqueTrsasactionId()
         
        let borrowerPurse = await this._purseRepository.findById(rentalContract.borrowerId.toString())

        if(!borrowerPurse){
            borrowerPurse = await this._purseRepository.create(rentalContract.borrowerId.toString())
          }

          await this._purseRepository.addTransaction(rentalContract.borrowerId.toString(), {
            tsId,
            type: "debit",
            amount: rentalContract.original_amount,
            status: "completed",
            description:"Amount Debited by Original of a Book in rental contract"
          });

          await this._purseRepository.updateBalance(rentalContract.borrowerId.toString(),-(rentalContract.original_amount))
         
         await this._purseRepository.AddHoldAmount(rentalContract.borrowerId.toString(),-(rentalContract.original_amount))


         //owner side
         
         let ownerPurse = await this._purseRepository.findById(rentalContract.ownerId.toString())
         
         if(!ownerPurse){
          ownerPurse = await this._purseRepository.create(rentalContract.ownerId.toString())
        }

        await this._purseRepository.addTransaction(rentalContract.ownerId.toString(), {
          tsId,
          type: "credit",
          amount: rentalContract.original_amount,
          status: "completed",
          description:"Amount Credited through original amount of a Book through rental contract"
        });

        await this._purseRepository.updateBalance(rentalContract.ownerId.toString(),(rentalContract.original_amount))

        rentalContract.returned_at = new Date()

        
        rentalContract.status = "Return Rejected"

        await this._rentRepository.save(rentalContract)

        await this._bookRepository.findByIdAndUpdateLiveStatus(rentalContract.bookId.toString(),"Available")
       }

       await this._returnRejectionRequestRepository.updateStatus(retRejId,status)
   }
}