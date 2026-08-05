import { Invoice, InvoiceStatus, InvoiceLifecycleService } from '@domain/billing';
import { PaymentProcessingRequested } from './events/IntegrationEvents';
import { PaymentGatewayPort } from './ports/PaymentGatewayPort';

export class IssueInvoiceUseCase {
  constructor(
    private readonly lifecycleService: InvoiceLifecycleService,
    private readonly gatewayPort: PaymentGatewayPort
  ) {}

  /**
   * Transitions the invoice to ISSUED/OPEN and prepares the integration event for the Payment Domain.
   */
  public async execute(invoice: Invoice): Promise<{ invoice: Invoice; integrationEvent: PaymentProcessingRequested }> {
    
    // 1. Enforce business rules via Domain Service (DRAFT -> ISSUED -> OPEN)
    let issuedInvoice = this.lifecycleService.transitionState(invoice, InvoiceStatus.ISSUED);
    let openInvoice = this.lifecycleService.transitionState(issuedInvoice, InvoiceStatus.OPEN);
    
    // 2. Interact with the external world (Gateway) via the isolated Port
    // This creates the physical payment intent at Stripe/Pagar.me without contaminating our domain
    const paymentRequest = await this.gatewayPort.createPaymentRequest(
      openInvoice.id,
      openInvoice.amount.amount,
      openInvoice.amount.currency.code,
      openInvoice.customer
    );

    // 3. Generate Integration Event for outbound communication
    const integrationEvent: PaymentProcessingRequested = {
      id: `EVT-${Date.now()}`,
      eventName: 'PaymentProcessingRequested',
      occurredAt: new Date().toISOString(),
      source: 'application:revenue:billing',
      payload: {
        invoiceId: openInvoice.id,
        customerId: openInvoice.customer,
        amount: openInvoice.amount.amount,
        currency: openInvoice.amount.currency.code,
        dueDate: openInvoice.dueDate.date,
      }
    };

    // 4. Dispatch Integration Event

    return { invoice: openInvoice, integrationEvent };
  }
}
