import { inject, injectable } from "tsyringe";
import { IRentalController } from "../../entities/controllersInterfaces/rental_controller-interface";
import { CustomRequest } from "../middlewares/auth_middleware";
import { IRentModel } from "../../frameworks/database/models/rent_model";
import { HTTP_STATUS } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { Request, Response } from "express";
import { IGetRentedOutBooksContractUseCase } from "../../entities/useCaseInterfaces/user/rental/get_rented_out_books_contracts_usecase-interface";
import { IGetBorrowedOutBooksContractUseCase } from "../../entities/useCaseInterfaces/user/rental/get_borrowed_books_contract_usecase-interface";
import { IGetAdminRentedOutBooksContractUseCase } from "../../entities/useCaseInterfaces/admin/rental/get_admin_rented_out_books_contract_usecase-interface";
import { IGetRentedOutBookDetailsUseCase } from "../../entities/useCaseInterfaces/user/rental/get_rented_out_book_details_usecase-interface";

@injectable()
export class RentalController implements IRentalController{
   constructor(
    @inject("IGetRentedOutBooksContractsUseCase")
    private _getRentedOutBooksContractUseCase:IGetRentedOutBooksContractUseCase,
    @inject("IGetBorrowedBooksContractsUseCase")
    private _getBorrowedBooksContractUseCase:IGetBorrowedOutBooksContractUseCase,
    @inject("IGetRentedOutBookDetailsUseCase")
    private _getRentedBookDetailsUseCase:IGetRentedOutBookDetailsUseCase,


    @inject("IGetAdminRentedOutBooksContractsUseCase")
    private _getAdminRentedOutBooksContractUseCase:IGetAdminRentedOutBooksContractUseCase
   ){}

   async  getRentedOutBooksContract(req: Request, res: Response): Promise<void> {
          try{
                 const {filter = {} ,page = 1 , limit = 5} = req.query as {filter?:string,page?:number,limit?:number}
         
                 const userId = (req as CustomRequest).user._id.toString();
           
                 const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;
           
                 const result = await this._getRentedOutBooksContractUseCase.execute(userId,Filter,page,limit)
           
                  const { rentedBooksContracts, totalRentedContracts, totalPages, currentPage } = result as {
                    rentedBooksContracts: IRentModel[];
                    totalRentedContracts: number;
                         totalPages: number;
                         currentPage: number;
                       };
                 
                       res.status(HTTP_STATUS.OK).json({
                         success: true,
                         message: "contracts fetched successfully",
                         rentedBooksContracts,
                         totalRentedContracts,
                         totalPages,
                         currentPage,
                       });
              }catch(error){
                 handleErrorResponse(res,error)
              }
   }

   async getBorrowedBooksContract(req: Request, res: Response): Promise<void> {
    try{
        const {filter = {} ,page = 1 , limit = 5} = req.query as {filter?:string,page?:number,limit?:number}

        const userId = (req as CustomRequest).user._id.toString();
  
        const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;
  
        const result = await this._getBorrowedBooksContractUseCase.execute(userId,Filter,page,limit)
  
         const { rentedBooksContracts, totalRentedContracts, totalPages, currentPage } = result as {
           rentedBooksContracts: IRentModel[];   
           totalRentedContracts: number;
                totalPages: number;
                currentPage: number;
              };
        
              res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "contracts fetched successfully",
                borrowedBooksContract:rentedBooksContracts,
                totalBorrowedContracts:totalRentedContracts,
                totalPages,
                currentPage,
              });
     }catch(error){
        handleErrorResponse(res,error)
     }
   }



   async  getAdminRentedOutBooksContract(req: Request, res: Response): Promise<void> {
    try{
           const {filter = {} ,page = 1 , limit = 5} = req.query as {filter?:string,page?:number,limit?:number}
   
      
     
           const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;
     
           const result = await this._getAdminRentedOutBooksContractUseCase.execute(Filter,page,limit)
     
            const { rentedBooksContracts, totalRentedContracts, totalPages, currentPage } = result as {
              rentedBooksContracts: IRentModel[];
              totalRentedContracts: number;
                   totalPages: number;
                   currentPage: number;
                 };
           
                 res.status(HTTP_STATUS.OK).json({
                   success: true,
                   message: "contracts fetched successfully",
                   rentedBooksContracts,
                   totalRentedContracts,
                   totalPages,
                   currentPage,
                 });
        }catch(error){
           handleErrorResponse(res,error)
        }
}

async getRentedOutBookDetails(req: Request, res: Response): Promise<void> {
   try{
     const {rentalId} = req.params as {rentalId:string}
      console.log("req paramsss",req.params)
     const rentedBooksContracts = await this._getRentedBookDetailsUseCase.execute(rentalId.toString())
     
     res.status(HTTP_STATUS.OK).json({
      success:true,
      message:"Rental Contract details fetched successfully",
      rentedBooksContracts
     })


   }catch(error){
      handleErrorResponse(res,error)
   }
}



}