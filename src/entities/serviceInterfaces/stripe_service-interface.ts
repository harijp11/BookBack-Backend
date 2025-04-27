export interface IStripeService {
    createPaymentIntent(amount: number, currency: string, walletId: string): Promise<{ clientSecret: string; paymentIntentId: string }>;
    handleWebhookEvent(event: any): Promise<{ status: string; paymentIntentId?: string; walletId?: string; amount?: number; eventType?: string }>;
  }