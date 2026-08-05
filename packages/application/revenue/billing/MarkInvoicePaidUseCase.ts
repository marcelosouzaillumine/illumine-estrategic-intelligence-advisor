import { Invoice, InvoiceStatus, InvoiceLifecycleService } from '@domain/billing';

export class MarkInvoicePaidUseCase {
  constructor(private readonly lifecycleService: InvoiceLifecycleService) {}

  /**
   * Invoked usually by an inbound Webhook (e.g. from Stripe) via an HTTP controller.
   * Translates the external payment confirmation into the final domain state change.
   */
  public execute(invoice: Invoice): Invoice {
    // Enforce business rules (e.g., OPEN -> PAID or OVERDUE -> PAID)
    const paidInvoice = this.lifecycleService.transitionState(invoice, InvoiceStatus.PAID);
    
    // Dispatch Domain Event (InvoicePaid) -> Might trigger Licensing/Entitlement

    return paidInvoice;
  }
}
