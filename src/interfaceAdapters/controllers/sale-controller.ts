import { inject, injectable } from "tsyringe";
import { ISaleController } from "../../entities/controllersInterfaces/sale_controller-interface";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth_middleware";
import { ISaleModel } from "../../frameworks/database/models/sale_model";
import { HTTP_STATUS, SALE_MESSAGES } from "../../shared/constants";
import { IFetchSoldBooksContractUseCase } from "../../entities/useCaseInterfaces/user/sales/fetch_sold_books_usecase-interface";
import { IFetchBoughtBooksContractsUseCase } from "../../entities/useCaseInterfaces/user/sales/fetch_bought_books_usecase-interface";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { IFetchAdminSoldBooksContractUseCase } from "../../entities/useCaseInterfaces/admin/sale/fetch_admin_sold_books_contract_usecase-interface";
import { IFetchSoldBooksContractDetailsUseCase } from "../../entities/useCaseInterfaces/user/sales/fetch_sold_book_contract_details_usecase-interface";

@injectable()
export class SaleController implements ISaleController{
  constructor(
    @inject("IFetchSoldBooksContractsUseCase")
    private _fetchSoldBooksContractUseCase:IFetchSoldBooksContractUseCase,
    @inject("IFetchBoughtBooksContractsUseCase")
    private _fetchBoughtBooksContractUseCase:IFetchBoughtBooksContractsUseCase,
    @inject("IFetchSoldBookDetailsUseCase")
    private _fetchSoldBookContractDetails:IFetchSoldBooksContractDetailsUseCase,



    @inject("IFetchAdminSoldBooksContractsUseCase")
    private _fetchAdminSoldBooksContractUseCase:IFetchAdminSoldBooksContractUseCase
  ){}

  async fetchSoldBooksContract(req: Request, res: Response): Promise<void> {
     try{
        const {filter = {} ,page = 1 , limit = 5} = req.query as {filter?:string,page?:number,limit?:number}
      
        const userId = (req as CustomRequest).user._id.toString();
           
        const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;

        const result = await this._fetchSoldBooksContractUseCase.execute(userId,Filter,page,limit)
  
         const { saleBooksContracts, totalSoldContracts, totalPages, currentPage } = result as {
          saleBooksContracts: ISaleModel[];
          totalSoldContracts: number;
                totalPages: number;
                currentPage: number;
              };
        
              res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SALE_MESSAGES.CONTRACTS_FETCHED,
                saleBooksContracts,
                totalSoldContracts,
                totalPages,
                currentPage,
              }); 
     }catch(error){
        handleErrorResponse(res,error)
     }
  }


  async fetchBoughtBooksContract(req: Request, res: Response): Promise<void> {
  try{
    const {filter = {} ,page = 1 , limit = 5} = req.query as {filter?:string,page?:number,limit?:number}

    const userId = (req as CustomRequest).user._id.toString();

    const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;

    const result = await this._fetchBoughtBooksContractUseCase.execute(userId,Filter,page,limit)

     const { saleBooksContracts, totalSoldContracts, totalPages, currentPage } = result as {
      saleBooksContracts: ISaleModel[];
      totalSoldContracts: number;
            totalPages: number;
            currentPage: number;
          };
    
          res.status(HTTP_STATUS.OK).json({
            success: true,
            message: SALE_MESSAGES.CONTRACTS_FETCHED,
            boughtBooksContract:saleBooksContracts,
            totalBoughtContracts:totalSoldContracts,
            totalPages,
            currentPage,
          });
}catch(error){
    handleErrorResponse(res,error)
  }
}


async fetchSoldBookDetails(req: Request, res: Response): Promise<void> {
  try{
    const {saleContractId} = req.params

    const saleContract = await this._fetchSoldBookContractDetails.execute(saleContractId.toString())

    res.status(HTTP_STATUS.OK).json({
      success:true,
      message:SALE_MESSAGES.CONTRACT_DETAILS_FETCHED,
      saleBooksContracts:saleContract
    })

  }catch(error){
    handleErrorResponse(res,error)
  }
}





//admin


async fetchAdminSoldBooksContract(req: Request, res: Response): Promise<void> {
  try{
     const {filter = {} ,page = 1 , limit = 5} = req.query as {filter?:string,page?:number,limit?:number}
        
     const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;

     const result = await this._fetchAdminSoldBooksContractUseCase.execute(Filter,page,limit)

      const { saleBooksContracts, totalSoldContracts, totalPages, currentPage } = result as {
       saleBooksContracts: ISaleModel[];
       totalSoldContracts: number;
             totalPages: number;
             currentPage: number;
           };
     
           res.status(HTTP_STATUS.OK).json({
             success: true,
             message: SALE_MESSAGES.CONTRACTS_FETCHED,
             saleBooksContracts,
             totalSoldContracts,
             totalPages,
             currentPage,
           }); 
  }catch(error){
     handleErrorResponse(res,error)
  }
}


}