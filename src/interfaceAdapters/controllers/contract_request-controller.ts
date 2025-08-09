import { inject, injectable } from "tsyringe";
import { IContractRequestController } from "../../entities/controllersInterfaces/contract_request_controller-interface";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { Request, Response } from "express";
import { CONTRACT_REQUEST_ERROR,CONTRACT_REQUEST_SUCCESS, ContractRequestInput, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { ICreateNewContractRequestUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/create_new_contract_request_usecase-interface";
import { ICheckBookRequestExistUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/check_book_request_exist_usecase-interface";
import { IFetchAllOwnerRequestsUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/fetch_all_owner_contract_requests_usecase-entity";
import { IContractRequestStatusUpdateUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/contract_request_update_status_usecase-interface";
import { IFetchRequesterRequestsUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/fetch_requester_requests_usecase-entity";
import { CustomRequest } from "../middlewares/auth_middleware";
import { IContractRequestModel } from "../../frameworks/database/models/contract_request-model";
import { ICancelContractRequestUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/cancel_contract_request_usecase-interface";
import { IFetchFixDealDetailsUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/fetch_fix_deal_details_usecase-interface";
import { ContractRequestDTO } from "../../shared/dto/contractRequestDto";

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
      await this._createNewContractRequestUseCase.execute(data);
      res
        .status(HTTP_STATUS.CREATED)
        .json({
          success: true,
          message: CONTRACT_REQUEST_SUCCESS.CONTRACT_CREATED,
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
     

      if (!request) {
        res.status(HTTP_STATUS.OK).json({
          success: false,
          message: CONTRACT_REQUEST_SUCCESS.NOT_EXIST,
          
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: CONTRACT_REQUEST_SUCCESS.REQUEST_ALREADY_EXISTING,
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
          message: CONTRACT_REQUEST_SUCCESS.NO_REQUESTS_FOUND,
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: CONTRACT_REQUEST_SUCCESS.OWNER_REQUESTS_FETCHED,
        requests
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async contractRequestStatusUpdate(req: Request, res: Response): Promise<void> {
    try{
      const {conReqId,status} = req.body as {conReqId:string,status:string}
      
      const request = await this._contractRequestStatusUpdateUseCase.execute(conReqId,status)
        
      res.status(HTTP_STATUS.OK).json({
        success:true,
        message:CONTRACT_REQUEST_SUCCESS.REQUEST_UPDATED,
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
              requests: ContractRequestDTO[];
              totalRequests: number;
              totalPages: number;
              currentPage: number;
            };
    
      if(requests?.length === 0){
         res.status(HTTP_STATUS.OK).json({
          success:false,
          message:CONTRACT_REQUEST_SUCCESS.NO_REQUESTS_FOUND,
         })
         return 
      }

      res.status(HTTP_STATUS.OK).json({
        success:true,
        message:CONTRACT_REQUEST_SUCCESS.REQUESTER_REQUESTS_FETCHED,
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
     
    const request = await this._cancelContractRequestUseCase.execute(conReqId.toString())
     
    res.status(HTTP_STATUS.OK).json({
      success:true,
      message:CONTRACT_REQUEST_SUCCESS.REQUEST_CANCELLED,
      request
    })
    }catch(error){
      handleErrorResponse(res,error)
    }

  }

  async fetchFixDealDetails(req: Request, res: Response): Promise<void> {
      try{
         const {conReqId} = req.query as {conReqId:string}

       const request = await this._fetchFixDealDetailsUseCase.execute(conReqId)

       res.status(HTTP_STATUS.OK).json({
        success:true,
        message:CONTRACT_REQUEST_SUCCESS.FIX_DEAL_DETAILS_FETCHED,
        request
       })
      }catch(error){
        handleErrorResponse(res,error)
      }

  }
}
