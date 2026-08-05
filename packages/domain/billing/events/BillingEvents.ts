import { DomainEvent } from '../../shared';

export interface InvoiceGenerated extends DomainEvent {
  metadata: { invoiceNumber: string; subscriptionReference: string };
}

export interface InvoiceIssued extends DomainEvent {
  metadata: { invoiceNumber: string };
}

export interface InvoicePaid extends DomainEvent {
  metadata: { invoiceNumber: string; amountPaid: number };
}

export interface InvoiceOverdue extends DomainEvent {
  metadata: { invoiceNumber: string; daysOverdue: number };
}

export interface InvoiceCancelled extends DomainEvent {
  metadata: { invoiceNumber: string; reason: string };
}
