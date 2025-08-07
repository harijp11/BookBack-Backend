import { inject, injectable } from "tsyringe";
import { IRentalController } from "../../entities/controllersInterfaces/rental_controller-interface";
import { CustomRequest } from "../middlewares/auth_middleware";
import { IRentModel } from "../../frameworks/database/models/rent_model";
import { HTTP_STATUS, RENTAL_SUCCESS, SUCCESS_MESSAGES } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { Request, Response } from "express";
import { IGetRentedOutBooksContractUseCase } from "../../entities/useCaseInterfaces/user/rental/get_rented_out_books_contracts_usecase-interface";
import { IGetBorrowedOutBooksContractUseCase } from "../../entities/useCaseInterfaces/user/rental/get_borrowed_books_contract_usecase-interface";
import { IGetAdminRentedOutBooksContractUseCase } from "../../entities/useCaseInterfaces/admin/rental/get_admin_rented_out_books_contract_usecase-interface";
import { IGetRentedOutBookDetailsUseCase } from "../../entities/useCaseInterfaces/user/rental/get_rented_out_book_details_usecase-interface";
import { IUpdateRentalContractStatusUseCase } from "../../entities/useCaseInterfaces/user/rental/update_rental_contract_status_usecase-interface";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/send_otp_usecase-interface";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/verify_otp_usecase-interface";
import { otpMailValidationSchema } from "./AuthValidation/otp_mail_validation_schema";
import { ISubmitContractRenewalRequestUseCase } from "../../entities/useCaseInterfaces/user/rental/submit_contract_renewal_request_usecase-interface";
import { IRentEntity, renewal_details } from "../../entities/models/rent_entity";
import { IPopulatedBookModel } from "../../entities/types/IBookMapModel";
import { RentDTO } from "../../shared/dto/IRentDto";

@injectable()
export class RentalController implements IRentalController {
  constructor(
    @inject("IGetRentedOutBooksContractsUseCase")
    private _getRentedOutBooksContractUseCase: IGetRentedOutBooksContractUseCase,
    @inject("IGetBorrowedBooksContractsUseCase")
    private _getBorrowedBooksContractUseCase: IGetBorrowedOutBooksContractUseCase,
    @inject("IGetRentedOutBookDetailsUseCase")
    private _getRentedBookDetailsUseCase: IGetRentedOutBookDetailsUseCase,
    @inject("IUpdateRentalContractStatusUseCase")
    private _updateRentalContractStatusUseCase: IUpdateRentalContractStatusUseCase,
    @inject("ISendOtpEmailUseCase")
    private _sendOtpEmailUseCase: ISendOtpEmailUseCase,
    @inject("IVerifyOtpUseCase")
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    @inject("ISubmitContractRenewalRequestUseCase")
    private _submitContractRenewalRequestUseCase:ISubmitContractRenewalRequestUseCase,

    @inject("IGetAdminRentedOutBooksContractsUseCase")
    private _getAdminRentedOutBooksContractUseCase: IGetAdminRentedOutBooksContractUseCase
  ) {}

  async getRentedOutBooksContract(req: Request, res: Response): Promise<void> {
    try {
      const {
        filter = {},
        page = 1,
        limit = 5,
      } = req.query as { filter?: string; page?: number; limit?: number };

      const userId = (req as CustomRequest).user._id.toString();

      const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;

      const result = await this._getRentedOutBooksContractUseCase.execute(
        userId,
        Filter,
        page,
        limit
      );

      const {
        rentedBooksContracts,
        totalRentedContracts,
        totalPages,
        currentPage,
      } = result as {
        rentedBooksContracts: RentDTO[];
        totalRentedContracts: number;
        totalPages: number;
        currentPage: number;
      };

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: RENTAL_SUCCESS.CONTRACTS_FETCHED,
        rentedBooksContracts,
        totalRentedContracts,
        totalPages,
        currentPage,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async getBorrowedBooksContract(req: Request, res: Response): Promise<void> {
    try {
      const {
        filter = {},
        page = 1,
        limit = 5,
      } = req.query as { filter?: string; page?: number; limit?: number };

      const userId = (req as CustomRequest).user._id.toString();

      const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;

      const result = await this._getBorrowedBooksContractUseCase.execute(
        userId,
        Filter,
        page,
        limit
      );

      const {
        rentedBooksContracts,
        totalRentedContracts,
        totalPages,
        currentPage,
      } = result as {
        rentedBooksContracts: RentDTO[];
        totalRentedContracts: number;
        totalPages: number;
        currentPage: number;
      };

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: RENTAL_SUCCESS.BORROWED_CONTRACTS_FETCHED,
        borrowedBooksContract: rentedBooksContracts,
        totalBorrowedContracts: totalRentedContracts,
        totalPages,
        currentPage,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async getRentedOutBookDetails(req: Request, res: Response): Promise<void> {
    try {
      const { rentalId } = req.params as { rentalId: string };
     
      const rentedBooksContracts =
        await this._getRentedBookDetailsUseCase.execute(rentalId.toString());

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message:RENTAL_SUCCESS.RENTED_BOOK_DETAILS_FETCHED,
        rentedBooksContracts,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async sendOtpEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email,bookId } = req.body;
      const userId = (req as CustomRequest).user._id.toString();
      await this._sendOtpEmailUseCase.execute(email, "book_return", userId,bookId);
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.OTP_SEND_SUCCESS,
        success: true,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp,bookId } = req.body;
      const userId = (req as CustomRequest).user._id.toString();
      const validatedData = otpMailValidationSchema.parse({ email, otp });
      await this._verifyOtpUseCase.execute({
        ...validatedData,
        purpose: "book_return",
        requesterId: userId,
        bookId
      });
     
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async updateRentalStatusContractDetails(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { rentalId } = req.params as { rentalId: string };
      const { status } = req.body as { status: string };

      await this._updateRentalContractStatusUseCase.execute(rentalId, status);
      res.status(200).json({
        success: true,
        message: `${status}, successfully`,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }


  async submitContractRenewalRequest(req: Request, res: Response): Promise<void> {
    try{
      const { rentalId  } = req.params as { rentalId : string }
    const { days, amount } = req.body as {days:number,amount:number}

    await this._submitContractRenewalRequestUseCase.execute(rentalId,{days,amount})
     
    res.status(HTTP_STATUS.OK).json({
      success:true,
      message:RENTAL_SUCCESS.RENEWAL_REQUESTED,
    })

    }catch(error){
      handleErrorResponse(res,error)
    }
  }


  async handleContractRenewalResponse(req: Request, res: Response): Promise<void> {
    try{
      
      const { rentalId  } = req.params as { rentalId : string }
    const { days, amount,requested_at,response,responded_at } = req.body as renewal_details
     
    await this._submitContractRenewalRequestUseCase.execute(rentalId,{ days, amount,requested_at,response,responded_at })
     
    res.status(HTTP_STATUS.OK).json({
      success:true,
      message:RENTAL_SUCCESS.RENEWAL_RESPONDED,
    })
    }catch(error){
      handleErrorResponse(res,error)
    }
  }




  //admin

  async getAdminRentedOutBooksContract(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const {
        filter = {},
        page = 1,
        limit = 5,
      } = req.query as { filter?: string; page?: number; limit?: number };

      const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;

      const result = await this._getAdminRentedOutBooksContractUseCase.execute(
        Filter,
        page,
        limit
      );

      const {
        rentedBooksContracts,
        totalRentedContracts,
        totalPages,
        currentPage,
      } = result as {
        rentedBooksContracts: RentDTO[];
        totalRentedContracts: number;
        totalPages: number;
        currentPage: number;
      };

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message:  RENTAL_SUCCESS.CONTRACTS_FETCHED,
        rentedBooksContracts,
        totalRentedContracts,
        totalPages,
        currentPage,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}
