import { inject, injectable } from "tsyringe";
import { IReturnRejectionRequestController } from "../../entities/controllersInterfaces/return_rejection_request_controller-interface";
import { Request, Response } from "express";
import { IReturnRejectionRequestcreateDTO } from "../../entities/models/return_rejection_request_input_data_entity";
import { ICreateNewReturnRejectionRequestUseCase } from "../../entities/useCaseInterfaces/user/return_rejection_request_usecase-interface/create_new_return_rejection_request_usecase-interface";
import { HTTP_STATUS } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { IFetchAllPaginatedReturnRejectionRequestUseCase } from "../../entities/useCaseInterfaces/admin/returnrejectionrequest/fetch_all_paginated_return_rejection_request_usecase-interface";
import { IUpdateReturnRejectionRequestStatusUseCase } from "../../entities/useCaseInterfaces/admin/returnrejectionrequest/update_return_rejection_request_status_usecase-interface";

@injectable()
export class ReturnRejectionRequestController implements IReturnRejectionRequestController{
    constructor(
        @inject("ICreateNewReturnRejectionRequestUseCase")
        private _createNewReturnRejectionRequestUseCase:ICreateNewReturnRejectionRequestUseCase,


        @inject("IFetchAllPaginatedReturnRejectionRequestUseCase")
        private _fetchAllPaginatedReturnRejectionRequestUseCase:IFetchAllPaginatedReturnRejectionRequestUseCase,
        @inject("IUpdateReturnRejectionRequestStatusUseCase")
        private _updateReturnRejectionRequestStatusUseCase:IUpdateReturnRejectionRequestStatusUseCase
    ){}

    async createNewReturnRejectionRequest(req: Request, res: Response): Promise<void> {
       try{
               
        const data:IReturnRejectionRequestcreateDTO = req.body
         
        await this._createNewReturnRejectionRequestUseCase.execute(data)

        res.status(HTTP_STATUS.CREATED).json({
            success:true,
            message:"Return rejection Requested successfully"
        })
       }catch(error){
        handleErrorResponse(res,error)
       }
    }





    //admin

    async fetchAllPaginatedAdminReturnRequest(req: Request, res: Response): Promise<void> {
        try{
          const {page=1,limit=5,filter={}} = req.query as {page?:number,limit?:number,filter?:string}

          const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;


          const  {
            topFiveMostComplainted,topFiveMostComplaintedTo,returnRejectionRequest, totalReturnRejectionRequest,
            totalPages,
            currentPage
        } = await this._fetchAllPaginatedReturnRejectionRequestUseCase.execute(page,limit,Filter)

        if(!returnRejectionRequest){
            res.status(HTTP_STATUS.OK).json({
                success:false,
                message:"No Requests Found"
            })
            return
        }

        res.status(HTTP_STATUS.OK).json({
            success:true,
            message:"Return Rejection Request Found Fetched successfully",
            topFiveMostComplaintedBy:topFiveMostComplainted,
            topFiveMostComplaintedAgainst:topFiveMostComplaintedTo,
            returnRejectionRequest,
            totalReturnRejectionRequest,
            totalPages,
            currentPage
        })
         
        }catch(error){
          handleErrorResponse(res,error)
        }
    }


    async updateReturnRejectionRequestStatus(req: Request, res: Response): Promise<void> {
        try{ 
            const {status} = req.body as {status:string}
            const {retRejId}= req.params as {retRejId:string}

            await this._updateReturnRejectionRequestStatusUseCase.execute(status,retRejId)

            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:`Return Rejection Request ${status} successfully`
            })

        }catch(error){
            handleErrorResponse(res,error)
        }
    }




}