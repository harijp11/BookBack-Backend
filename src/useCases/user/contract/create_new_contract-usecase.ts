import { inject, injectable } from "tsyringe";
import { ContractResponse, ICreateNewContractUseCase } from "../../../entities/useCaseInterfaces/user/rental/create_new_contract_usecase-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { ISaleRepository } from "../../../entities/repositoryInterface/common/sale_repository-interface";
import { isRentInput, isSaleInput, RentalInput, SaleInput } from "../../../entities/models/contract_input_entity";
import { IPurseRepository } from "../../../entities/repositoryInterface/user/purse_repository-interface";
import { generateUniqueTrsasactionId } from "../../../frameworks/security/uniqueid_bcrypt";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";

@injectable()
export class CreateNewContractUseCase implements ICreateNewContractUseCase {
    constructor(
        @inject("IRentRepository")
        private _rentRepository:IRentRepository,
        @inject("ISaleRepository")
        private _saleRepository:ISaleRepository,
        @inject("IPurseRepository")
        private _purseRepository:IPurseRepository,
        @inject("IBookRepository")
        private _bookRepository:IBookRepository,
        @inject("IContractRequestRepository")
        private _contractRepository:IContractRequestRepository
    ){}

    async execute(data: RentalInput | SaleInput, request_type: string,conReqId:string): Promise<ContractResponse | void> {
        if(request_type === "buy"){
            if(isSaleInput(data)){
    
                let  purse =  await this._purseRepository.findById(data.buyerId)
                 
                if(!purse){
                  purse = await this._purseRepository.create(data.buyerId)
                }
                if((purse?.balance ?? 0) < data.price){
                    return {message:`your purse have only ${purse?.balance}`,success:false}
                }

                const book = await this._bookRepository.findById(data.bookId)
                if(book?.status !== "Avaialable" || !book?.isActive){
                    return {message:`The Book ${book?.name} is not available for deal`,success:false}
                }
                await this._saleRepository.createNewSale(data)
                const tsId = generateUniqueTrsasactionId()
                const description = `Amount debited Due to  bought a book`
                await this._purseRepository.addTransaction(data.buyerId, {
                    tsId,
                    type: "debit",
                    amount: data.price,
                    status: "completed",
                    description
                  });

                  await this._purseRepository.updateBalance(data.buyerId,-(data.price))
                  
                  await this._bookRepository.findByIdAndUpdateLiveStatus(data.bookId,'Sold Out')

                  await this._contractRepository.deleteRequest(conReqId)

                 return {message:`New Sale contract created successfully`,success:true}
            }
        }else if(request_type === "borrow"){
           
            if(isRentInput(data)){
                // console.log("datasss checking",data,isRentInput(data))
                let  purse =  await this._purseRepository.findById(data.borrowerId)
                 
                if(!purse){
                  purse = await this._purseRepository.create(data.borrowerId)
                }
                if((purse?.balance ?? 0) < data.original_amount){
                    return {message:`your purse have only ${purse?.balance}`,success:false}
                }

                const book = await this._bookRepository.findById(data.bookId)

                if(book?.status !== "Avaialable" || !book?.isActive){
                    return {message:`The Book ${book?.name} is not available for deal`,success:false}
                }
                
                await this._rentRepository.createNewRent(data)

                await this._bookRepository.findByIdAndUpdateLiveStatus(data.bookId,'Borrowed')

                await this._contractRepository.deleteRequest(conReqId)

                return {message:`New Rental contract created successfully`,success:true}
            }
        }
    }

   
}