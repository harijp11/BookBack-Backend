export interface IFundPurseUseCase {
    execute(userId: string, amount: number, currency: string): Promise<{ clientSecret: string; paymentIntentId: string;
         tsId: string
         }>;
  
  }