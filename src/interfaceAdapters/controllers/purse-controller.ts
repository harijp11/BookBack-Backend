import { inject, injectable } from 'tsyringe';
import { IPurseController } from '../../entities/controllersInterfaces/purse_controller-enitity';
import { Request, Response, Router } from 'express';
import { IFetchPurseDetailsUseCase } from '../../entities/useCaseInterfaces/user/purse/fetch_purse_details_usecase-interface';
import { IFundPurseUseCase } from '../../entities/useCaseInterfaces/user/purse/fund_usecase-interface';
import { handleErrorResponse } from '../../shared/utils/errorHandler';
import { CustomRequest } from '../middlewares/auth_middleware';

@injectable()
export class PurseController implements IPurseController {

  constructor(
    @inject('IFetchPurseDetailsUseCase') private fetchPurseDetailsUseCase: IFetchPurseDetailsUseCase,
    @inject('IFundPurseUseCase') private fundPurseUseCase: IFundPurseUseCase
  ) {}
  async fetchPurseDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user._id.toString();
      const purse = await this.fetchPurseDetailsUseCase.execute(userId);

      if (!purse) {
        res.status(200).json({
          success: false,
          message: 'Purse not available',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Purse found successfully',
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

      res.status(200).json({
        success: true,
        message: 'PaymentIntent created successfully',
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
      const result = await this.fundPurseUseCase.handleWebhookEvent(event);

      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
        result,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

}