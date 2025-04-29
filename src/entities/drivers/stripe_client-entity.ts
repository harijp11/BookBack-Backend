import Stripe from 'stripe';

export interface IStripeClient {
  createPaymentIntent(
    amount: number,
    currency: string,
    metadata: { walletId: string,tsId:string }
  ): Promise<Stripe.PaymentIntent>;

  verifyWebhookEvent(
    payload: Buffer,
    signature: string
  ): Stripe.Event;
}
