import { 
  Invoice, 
  InvoiceStatus,
  TaxContext,
  InvoiceSnapshot
} from '@domain/billing';

interface GenerateInvoiceCommand {
  subscriptionId: string;
  customerId: string;
  billingCycle: string;
  startDate: string;
  currency: string;
  amount: number;
}

export class GenerateInvoiceUseCase {
  /**
   * Acts upon the BillingActivationRequested event to instantiate a DRAFT Invoice.
   */
  public execute(command: GenerateInvoiceCommand): Invoice {
    
    // Freeze the economic snapshot of this specific charge
    const pricingSnapshot: InvoiceSnapshot = {
      pricingSnapshotId: `SNP-${Date.now()}`, // References the subscription pricing snapshot
      capturedAt: new Date().toISOString(),
      snapshotAmount: {
        amount: command.amount,
        currency: { code: command.currency, symbol: command.currency === 'BRL' ? 'R$' : '$' }
      }
    };

    const taxContext: TaxContext = {
      jurisdiction: 'DEFAULT',
      countryCode: 'BR',
      taxProfileVersion: '1.0' // Placeholder for future tax engine integration
    };

    // Calculate billing period and due date
    const periodStart = new Date(command.startDate);
    const periodEnd = new Date(periodStart);
    if (command.billingCycle === 'MONTHLY') periodEnd.setMonth(periodEnd.getMonth() + 1);
    else if (command.billingCycle === 'ANNUAL') periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    
    const dueDate = new Date(periodStart);
    dueDate.setDate(dueDate.getDate() + 5); // Example: due 5 days after generation

    const invoice: Invoice = {
      id: `INV-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subscription: command.subscriptionId,
      customer: command.customerId,
      pricingSnapshot,
      billingPeriod: { periodStart: periodStart.toISOString(), periodEnd: periodEnd.toISOString() },
      dueDate: { date: dueDate.toISOString() },
      taxContext,
      amount: pricingSnapshot.snapshotAmount,
      status: InvoiceStatus.DRAFT,
    };

    // Next steps: Save to Repository, Dispatch Domain Event (InvoiceGenerated)

    return invoice;
  }
}
