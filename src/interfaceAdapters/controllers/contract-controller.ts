import { inject, injectable } from "tsyringe";
import { IContractController } from "../../entities/controllersInterfaces/recontract_controller-interface";
import { Request, Response } from "express";
import {
  RentalInput,
  SaleInput,
} from "../../entities/models/contract_input_entity";
import { ICreateNewContractUseCase } from "../../entities/useCaseInterfaces/user/rental/create_new_contract_usecase-interface";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/send_otp_usecase-interface";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/verify_otp_usecase-interface";
import { otpMailValidationSchema } from "./AuthValidation/otp_mail_validation_schema";
import { CustomRequest } from "../middlewares/auth_middleware";

@injectable()
export class ContractController implements IContractController {
  constructor(
    @inject("ICreateNewContractUseCase")
    private _createNewContractUseCase: ICreateNewContractUseCase,
    @inject("ISendOtpEmailUseCase")
    private _sendOtpEmailUseCase: ISendOtpEmailUseCase,
    @inject("IVerifyOtpUseCase")
    private _verifyOtpUseCase: IVerifyOtpUseCase
  ) {}

  async sendOtpEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const userId = (req as CustomRequest).user._id.toString();
      await this._sendOtpEmailUseCase.execute(email,"create_contract",userId);
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
      const { email, otp } = req.body;
      const userId = (req as CustomRequest).user._id.toString();
      const validatedData = otpMailValidationSchema.parse({ email, otp });
      await this._verifyOtpUseCase.execute({...validatedData,purpose:"create_contract",requesterId:userId});
     
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async createNewContract(req: Request, res: Response): Promise<void> {
    try {
      const { data } = req.body as {data: RentalInput | SaleInput};
      
      const {request_type,conReqId} = req.params as {request_type :string,conReqId:string}
     
      const result = await this._createNewContractUseCase.execute(
        data,
        request_type,
        conReqId
      );

      res.status(HTTP_STATUS.CREATED).json({
        ...result
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}
