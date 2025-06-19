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
      purse = await this.purseRepository.create({userId});
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
        description: `Funding wallet with ${amount / 100} Rupee`,
      });
      
      const paymentIntent = await this.stripeService.createPaymentIntent(amount, currency, purse?.userId.toString(),tsId);
      
      return {
        ...paymentIntent,
        tsId    // ✅ Correct name
      };
  }

}