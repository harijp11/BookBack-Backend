import { inject, injectable } from 'tsyringe';
import { IPurseController } from '../../entities/controllersInterfaces/purse_controller-enitity';
import { Request, Response, Router } from 'express';
import { IFetchPurseDetailsUseCase } from '../../entities/useCaseInterfaces/user/purse/fetch_purse_details_usecase-interface';
import { IFundPurseUseCase } from '../../entities/useCaseInterfaces/user/purse/fund_usecase-interface';
import { handleErrorResponse } from '../../shared/utils/errorHandler';
import { CustomRequest } from '../middlewares/auth_middleware';
import { IWebhookHandlingUseCase } from '../../entities/useCaseInterfaces/user/purse/web_hook_handling_usecase-interface';
import { HTTP_STATUS, PURSE_ERROR, PURSE_SUCCESS } from '../../shared/constants';

@injectable()
export class PurseController implements IPurseController {

  constructor(
    @inject('IFetchPurseDetailsUseCase') private _fetchPurseDetailsUseCase: IFetchPurseDetailsUseCase,
    @inject('IFundPurseUseCase') private fundPurseUseCase: IFundPurseUseCase,
    @inject("IWebHookHandlingUseCase") private _webHookHandlingUseCase:IWebhookHandlingUseCase
  ) {}
  async fetchPurseDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user._id.toString();
      const purse = await this._fetchPurseDetailsUseCase.execute(userId);

      if (!purse) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: PURSE_ERROR.PURSE_NOT_AVAILABLE,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: PURSE_SUCCESS.PURSE_FETCHED,
        purse,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async createPaymentIntent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user._id.toString();
      const { amount, currency } = req.body;

      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }
      if (!currency) {
        throw new Error('Currency is required');
      }

      const paymentIntent = await this.fundPurseUseCase.execute(userId, amount, currency);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message:  PURSE_SUCCESS.PAYMENT_INTENT_CREATED,
        clientSecret: paymentIntent.clientSecret,
        paymentIntentId: paymentIntent.paymentIntentId,
        tsId: paymentIntent.tsId,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const event = req.body;
      const result = await this._webHookHandlingUseCase.handleWebhookEvent(event);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: PURSE_SUCCESS.WEBHOOK_PROCESSED,
        result,
      });
    } catch (error: any) {   
      handleErrorResponse(res, error);
    }
  }

}