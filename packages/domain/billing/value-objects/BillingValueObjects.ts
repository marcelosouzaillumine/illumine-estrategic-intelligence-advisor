import { Identifier, Money } from '../../shared';

export type InvoiceNumber = Identifier;
export type SubscriptionReference = Identifier;
export type CustomerReference = Identifier;

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  OPEN = 'OPEN',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  VOID = 'VOID'
}

export interface BillingPeriod {
  periodStart: string;
  periodEnd: string;
}

export interface DueDate {
  date: string;
}

export interface TaxContext {
  jurisdiction: string;
  countryCode: string;
  taxProfileVersion: string;
}

export interface InvoiceSnapshot {
  pricingSnapshotId: string;
  capturedAt: string;
  snapshotAmount: Money;
}
