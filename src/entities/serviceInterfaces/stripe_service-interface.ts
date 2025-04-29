export interface IStripeService {
    createPaymentIntent(amount: number, currency: string, walletId: string,tsId:string): Promise<{ clientSecret: string; paymentIntentId: string }>;
    handleWebhookEvent(event: any): Promise<{ status: string; paymentIntentId?: string; tsId?:string; walletId?: string; amount?: number; eventType?: string }>;
  }