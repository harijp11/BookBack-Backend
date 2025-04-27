import { inject, injectable } from "tsyringe";
import { IContractRequestController } from "../../entities/controllersInterfaces/contract_request_controller-interface";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { Request, Response } from "express";
import { ContractRequestInput, SUCCESS_MESSAGES } from "../../shared/constants";
import { ICreateNewContractRequestUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/create_new_contract_request_usecase-interface";
import { ICheckBookRequestExistUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/check_book_request_exist_usecase-interface";
import { IFetchAllOwnerRequestsUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/fetch_all_owner_contract_requests_usecase-entity";
import { IContractRequestStatusUpdateUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/contract_request_update_status_usecase-interface";

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
    private _contractRequestStatusUpdateUseCase:IContractRequestStatusUpdateUseCase
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
      const { ownerId } = req.query as { ownerId: string };
      
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
}
