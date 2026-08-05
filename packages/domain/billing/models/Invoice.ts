import { AggregateRoot, Money } from '../../shared';
import { 
  InvoiceNumber, 
  SubscriptionReference, 
  CustomerReference, 
  InvoiceStatus, 
  BillingPeriod, 
  DueDate, 
  TaxContext, 
  InvoiceSnapshot 
} from '../value-objects/BillingValueObjects';

export interface Invoice extends AggregateRoot<InvoiceNumber> {
  subscription: SubscriptionReference;
  customer: CustomerReference;
  pricingSnapshot: InvoiceSnapshot;
  billingPeriod: BillingPeriod;
  dueDate: DueDate;
  taxContext: TaxContext;
  amount: Money;
  status: InvoiceStatus;
}
