export interface IFundPurseUseCase {
    execute(userId: string, amount: number, currency: string): Promise<{ clientSecret: string; paymentIntentId: string;
         tsId: string
         }>;
    handleWebhookEvent(event: any): Promise<{
      status: string;
      paymentIntentId?: string;
      walletId?: string;
      amount?: number;
      eventType?: string;
      tsId?: string;
    }>;
  }