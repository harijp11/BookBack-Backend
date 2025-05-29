import { inject, injectable } from "tsyringe";
import { IStripeService } from "../../entities/serviceInterfaces/stripe_service-interface";
import { IStripeClient } from "../../entities/drivers/stripe_client-entity";


@injectable()
export class StripeService implements IStripeService {
  constructor(
    @inject("IStripeClient")
    private _stripeClient:IStripeClient
  ){

  }

  async createPaymentIntent(amount: number, currency: string, walletId: string,tsId:string): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      if (!walletId) {
        throw new Error('Wallet ID is required');
      }

      const paymentIntent = await this._stripeClient.createPaymentIntent(amount, currency, { walletId,tsId });
      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      throw new Error(`Failed to create PaymentIntent: ${error.message}`);
    }
  }

  async handleWebhookEvent(event: any): Promise<{ status: string; paymentIntentId?:string,tsId?:string, walletId?: string; amount?: number; eventType?: string }> {
    try {
      console.log("eventttttttttttttttttttttttttttttttttttt",event.type)
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          return {
            status: 'success',
            paymentIntentId: paymentIntent.id,
            tsId:paymentIntent.metadata.tsId,
            walletId: paymentIntent.metadata.walletId,
            amount: paymentIntent.amount,
          };
        case 'payment_intent.payment_failed':
          return {
            status: 'failed',
            paymentIntentId: event.data.object.id,
            tsId:event.data.object.metadata.tsId,
            walletId: event.data.object.metadata.walletId,
          };
        default:
          return { status: 'unhandled', eventType: event.type };
      }
    } catch (error: any) {
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }
}