import { injectable, inject } from 'tsyringe';
import { IFundPurseUseCase } from '../../../entities/useCaseInterfaces/user/purse/fund_usecase-interface';
import { IStripeService } from '../../../entities/serviceInterfaces/stripe_service-interface';
import { IPurseRepository } from '../../../entities/repositoryInterface/user/purse_repository-interface';
import { generateUniqueTrsasactionId } from '../../../frameworks/security/uniqueid_bcrypt';

@injectable()
export class FundPurseUseCase implements IFundPurseUseCase {
  constructor(
    @inject('IStripeService') private stripeService: IStripeService,
    @inject('IPurseRepository') private purseRepository: IPurseRepository
  ) {}

  async execute(userId: string, amount: number, currency: string): Promise<{ clientSecret: string; paymentIntentId: string; 
    tsId: string
 }> {
    let purse = await this.purseRepository.findById(userId);
    if (!purse) {
      purse = await this.purseRepository.create(userId);
      if (!purse) {
        throw new Error('Failed to create purse');
      }
    }

    // Create a pending transaction
    const tsId = generateUniqueTrsasactionId()
     await this.purseRepository.addTransaction(userId, {
        tsId,
        type: 'credit',
        amount: amount / 100,
        status: 'pending',
        description: `Funding wallet with ${amount / 100} ${currency.toUpperCase()}`,
      });
      
      const paymentIntent = await this.stripeService.createPaymentIntent(amount, currency, purse?.userId.toString(),tsId);
      
      return {
        ...paymentIntent,
        tsId    // ✅ Correct name
      };
  }

  async handleWebhookEvent(event: any): Promise<{
    status: string;
    paymentIntentId?: string;
    walletId?: string;
    amount?: number;
    eventType?: string;
    tsId?: string;
  }> {
    const result = await this.stripeService.handleWebhookEvent(event);
    console.log("event from db",result.status)
    
    if (result.status === 'success' && result.walletId && result.amount) {
      console.log("result details",result.walletId, result.tsId, result.amount)
      const purse = await this.purseRepository.updateTransactionStatus(result.walletId, result.tsId!, 'completed');
      if (!purse) {
        throw new Error('Failed to update transaction status');  
      }
     
     await this.purseRepository.updateBalance(result.walletId, result.amount / 100); 
     console.log("balance updated")
    } else if (result.status === 'failed' && result.walletId && result.paymentIntentId) {
      await this.purseRepository.updateTransactionStatus(result.walletId, result.paymentIntentId, 'failed');
    }
    return {
      ...result,
      paymentIntentId: result.paymentIntentId, // Use paymentIntentId as tsId for webhook correlation
    };
  }
}