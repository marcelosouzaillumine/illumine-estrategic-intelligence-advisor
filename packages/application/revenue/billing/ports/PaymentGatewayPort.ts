export interface PaymentRequest {
  id: string;
  gatewayUrl?: string;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
}

export interface PaymentGatewayPort {
  /**
   * Translates a Billing Domain Invoice into a physical Gateway payment intent.
   * Implementation will vary by provider (Stripe, Pagar.me, etc).
   */
  createPaymentRequest(
    invoiceId: string,
    amount: number,
    currency: string,
    customerId: string
  ): Promise<PaymentRequest>;
}
