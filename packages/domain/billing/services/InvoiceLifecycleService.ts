import { Invoice } from '../models/Invoice';
import { InvoiceStatus } from '../value-objects/BillingValueObjects';

export class InvoiceLifecycleService {
  /**
   * Valida e executa a transição de estado da fatura.
   * Aplica regras rígidas da máquina de estados do domínio.
   */
  public transitionState(invoice: Invoice, targetStatus: InvoiceStatus): Invoice {
    if (!this.canTransition(invoice.status, targetStatus)) {
      throw new Error(`Invalid invoice state transition from ${invoice.status} to ${targetStatus}`);
    }

    const updatedInvoice = { ...invoice, status: targetStatus, updatedAt: new Date().toISOString() };
    return updatedInvoice;
  }

  private canTransition(current: InvoiceStatus, target: InvoiceStatus): boolean {
    const transitions: Record<InvoiceStatus, InvoiceStatus[]> = {
      [InvoiceStatus.DRAFT]: [InvoiceStatus.ISSUED, InvoiceStatus.VOID],
      [InvoiceStatus.ISSUED]: [InvoiceStatus.OPEN, InvoiceStatus.VOID],
      [InvoiceStatus.OPEN]: [InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.VOID],
      [InvoiceStatus.OVERDUE]: [InvoiceStatus.PAID, InvoiceStatus.VOID],
      [InvoiceStatus.PAID]: [], // Terminal success state
      [InvoiceStatus.VOID]: [], // Terminal cancelled state
    };

    return transitions[current]?.includes(target) ?? false;
  }
}
