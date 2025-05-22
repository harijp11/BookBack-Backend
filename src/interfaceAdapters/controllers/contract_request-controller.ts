import { inject, injectable } from "tsyringe";
import { IContractRequestController } from "../../entities/controllersInterfaces/contract_request_controller-interface";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { Request, Response } from "express";
import { ContractRequestInput, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { ICreateNewContractRequestUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/create_new_contract_request_usecase-interface";
import { ICheckBookRequestExistUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/check_book_request_exist_usecase-interface";
import { IFetchAllOwnerRequestsUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/fetch_all_owner_contract_requests_usecase-entity";
import { IContractRequestStatusUpdateUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/contract_request_update_status_usecase-interface";
import { IFetchRequesterRequestsUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/fetch_requester_requests_usecase-entity";
import { CustomRequest } from "../middlewares/auth_middleware";
import { IContractRequestModel } from "../../frameworks/database/models/contract_request-model";
import { ICancelContractRequestUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/cancel_contract_request_usecase-interface";
import { IFetchFixDealDetailsUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/fetch_fix_deal_details_usecase-interface";

@injectable()
export class ContractRequestController implements IContractRequestController {
  constructor(
    @inject("ICreateNewContractRequestUseCase")
    private _createNewContractRequestUseCase: ICreateNewContractRequestUseCase,
    @inject("ICheckBookRequestExistUseCase")
    private _checkBookRequestExistUseCase: ICheckBookRequestExistUseCase,
    @inject("IFetchAllOwnerRequestsUseCase")
    private _fetchAllownerContractRequestsUseCase: IFetchAllOwnerRequestsUseCase,
    @inject("IContractRequestStatusUpdateUseCase")
    private _contractRequestStatusUpdateUseCase:IContractRequestStatusUpdateUseCase,
    @inject("IFetchRequesterRequestsUseCase")
    private _fetchRequesterRequestsUseCase:IFetchRequesterRequestsUseCase,
    @inject("ICancelContractRequestUseCase")
    private _cancelContractRequestUseCase:ICancelContractRequestUseCase,
    @inject("IFetchFixDealDetailsUseCase")
    private _fetchFixDealDetailsUseCase:IFetchFixDealDetailsUseCase
  ) {}

  async createNewContractRequest(req: Request, res: Response): Promise<void> {
    try {
      const data: ContractRequestInput = req.body;
      console.log("contract data", data);
      await this._createNewContractRequestUseCase.execute(data);
      res
        .status(201)
        .json({
          success: SUCCESS_MESSAGES.CREATED,
          message: "Contract request created successfully",
        });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async checkBookRequestExist(req: Request, res: Response): Promise<void> {
    try {
      const { requesterId, bookId } = req.query as {
        requesterId: string;
        bookId: string;
      };

      const request = await this._checkBookRequestExistUseCase.execute(
        requesterId,
        bookId
      );
      console.log("contract request", request);

      if (!request) {
        res.status(200).json({
          success: false,
          message: "User not requested yet",
          
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Already requested for contract",
        request
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async fetchAllOwnerContractRequests(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const ownerId = (req as CustomRequest).user._id.toString();
      
      const requests = await this._fetchAllownerContractRequestsUseCase.execute(
        ownerId
      );

      if (!requests || requests.length=== 0) {
        res.status(200).json({
          success: false,
          message: "No Requests found for contract",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Requestes fetched successfully",
        requests
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async contractRequestStatusUpdate(req: Request, res: Response): Promise<void> {
    try{
      const {conReqId,status} = req.body as {conReqId:string,status:string}
       console.log("req.body",req.body)
      const request = await this._contractRequestStatusUpdateUseCase.execute(conReqId,status)
        
      res.status(200).json({
        success:true,
        message:"Contract request updated successfully",
        request
      })
    }catch(error){
      handleErrorResponse(res,error)
    }
  }

  async fetchRequesterRequest(req: Request, res: Response): Promise<void> {
    try{
      const userId = (req as CustomRequest).user._id.toString();

      const {page=1,limit=5,filter={}} = req.query as {page?:number,limit?:number,filter?:string}
      const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;
      const result = await this._fetchRequesterRequestsUseCase.execute(userId,page,limit,Filter)

       const { requests, totalRequests, totalPages, currentPage } = result as {
              requests: IContractRequestModel[];
              totalRequests: number;
              totalPages: number;
              currentPage: number;
            };
    
      if(requests?.length === 0){
         res.status(200).json({
          success:false,
          message:"No requests found"
         })
         return 
      }

      res.status(200).json({
        success:true,
        message:"Requests Fetched successfully",
        requests,
        totalRequests,
        totalPages,
        currentPage
       })
    }catch(error){
      handleErrorResponse(res,error)
    }
  }

  async cancelContractRequest(req: Request, res: Response): Promise<void> {
    try{
      const{ conReqId } = req.params as {conReqId:string}
     console.log(req.params)
    const request = await this._cancelContractRequestUseCase.execute(conReqId.toString())
     
    res.status(HTTP_STATUS.OK).json({
      success:true,
      message:"Request Cancelled Successfully",
      request
    })
    }catch(error){
      handleErrorResponse(res,error)
    }

  }

  async fetchFixDealDetails(req: Request, res: Response): Promise<void> {
       const {conReqId} = req.query as {conReqId:string}

       const request = await this._fetchFixDealDetailsUseCase.execute(conReqId)

       res.status(HTTP_STATUS.OK).json({
        success:true,
        message:"Request details fetched successfully",
        request
       })

  }
}
