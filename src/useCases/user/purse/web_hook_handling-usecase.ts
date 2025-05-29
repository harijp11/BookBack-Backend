import { injectable, inject } from 'tsyringe';
import { IStripeService } from '../../../entities/serviceInterfaces/stripe_service-interface';
import { IPurseRepository } from '../../../entities/repositoryInterface/user/purse_repository-interface';
import { IWebhookHandlingUseCase } from '../../../entities/useCaseInterfaces/user/purse/web_hook_handling_usecase-interface';

@injectable()
export class WebHookHandlingUseCase implements IWebhookHandlingUseCase {
  constructor(
    @inject('IStripeService') private stripeService: IStripeService,
    @inject('IPurseRepository') private purseRepository: IPurseRepository
  ) {}

  async handleWebhookEvent(event: any): Promise<{
    status: string;
    paymentIntentId?: string;
    walletId?: string;
    amount?: number;
    eventType?: string;
    tsId?: string;
  }> {
    const result = await this.stripeService.handleWebhookEvent(event);
    
    console.log("stripe status",result)
    if (result.status === 'success' && result.walletId && result.amount) {
      
      const purse = await this.purseRepository.updateTransactionStatus(result.walletId, result.tsId!, 'completed');
      if (!purse) {
        throw new Error('Failed to update transaction status');  
      }
     
     await this.purseRepository.updateBalance(result.walletId, result.amount / 100); 
     console.log("balance updated")
    } else if (result.status === 'unhandled' && result.walletId && result.paymentIntentId) {
      await this.purseRepository.updateTransactionStatus(result.walletId, result.paymentIntentId, 'failed');
    }
    return {
      ...result,
      paymentIntentId: result.paymentIntentId, // Use paymentIntentId as tsId for webhook correlation
    };
  }
}