import { injectable } from 'tsyringe';
import Stripe from 'stripe';
import { IStripeClient } from '../../../entities/drivers/stripe_client-entity';

@injectable()
export class StripeClient implements IStripeClient {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });
    this.webhookSecret=process.env.STRIPE_WEBHOOK_SECRET!;
  }

  async createPaymentIntent(amount: number, currency: string, metadata: { walletId: string,tsId:string }): Promise<Stripe.PaymentIntent> {
    console.log("paymenetintetnt create",amount,currency,metadata)
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });
  }

  verifyWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
  }
}