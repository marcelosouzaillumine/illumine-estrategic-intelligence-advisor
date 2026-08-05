export type Identifier = string;

export interface Currency {
  code: string; // e.g. BRL, USD
  symbol: string; // e.g. R$, $
}

export interface Money {
  amount: number; // Stored in the lowest denominator (cents)
  currency: Currency;
}

export type Locale = 'pt-BR' | 'en-US' | 'es-ES';

export interface AuditMetadata {
  createdBy: string;
  createdAt: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
  ipAddress?: string;
}
