import { inject, injectable } from "tsyringe";
import { ISaleController } from "../../entities/controllersInterfaces/sale_controller-interface";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth_middleware";
import { ISaleModel } from "../../frameworks/database/models/sale_model";
import { HTTP_STATUS } from "../../shared/constants";
import { IFetchSoldBooksContractUseCase } from "../../entities/useCaseInterfaces/user/sales/fetch_sold_books_usecase-interface";
import { IFetchBoughtBooksContractsUseCase } from "../../entities/useCaseInterfaces/user/sales/fetch_bought_books_usecase-interface";
import { handleErrorResponse } from "../../shared/utils/errorHandler";

@injectable()
export class SaleController implements ISaleController{
  constructor(
    @inject("IFetchSoldBooksContractUseCase")
    private _fetchSoldBooksContractUseCase:IFetchSoldBooksContractUseCase,
    @inject("IFetchSoldBooksContractUseCase")
    private _fetchBoughtBooksContractUseCase:IFetchBoughtBooksContractsUseCase
  ){}

  async fetchSoldBooksContract(req: Request, res: Response): Promise<void> {
     try{
        const {filter = {} ,page = 1 , limit = 5} = req.params as {filter?:string,page?:number,limit?:number}

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
                message: "contracts fetched successfully",
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
    const {filter = {} ,page = 1 , limit = 5} = req.params as {filter?:string,page?:number,limit?:number}

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
            message: "contracts fetched successfully",
            boughtBooksContract:saleBooksContracts,
            totalBoughtContracts:totalSoldContracts,
            totalPages,
            currentPage,
          });
}catch(error){
    handleErrorResponse(res,error)
  }
}

}