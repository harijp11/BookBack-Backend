export interface IWebhookHandlingUseCase {
    handleWebhookEvent(event: any): Promise<{
        status: string;
        paymentIntentId?: string;
        walletId?: string;
        amount?: number;
        eventType?: string;
        tsId?: string;
      }>;
}