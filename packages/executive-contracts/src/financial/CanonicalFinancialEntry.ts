/**
 * Illumine OS™ Executive Contracts
 * Canonical Financial Entry Contract (CFDI v2.1)
 * 
 * Schema Version: 2.1.0
 * Pure typed immutability via Readonly<CanonicalFinancialEntry>.
 * Legacy properties (conta, category, account, valor, value, val, tipo, type) are eliminated post-normalization.
 */

import { FinancialStatementType } from './FinancialStatementType';
import { FinancialLineageMetadata } from './FinancialLineageMetadata';

export interface CanonicalFinancialEntry {
  readonly id: string;
  readonly schemaVersion: '2.1.0';
  readonly accountCode: string;
  readonly accountName: string;
  readonly statementType: FinancialStatementType;
  readonly amount: number;
  readonly year: number;
  readonly month?: number;
  readonly clientId: string;
  readonly origin: string;
  readonly classification: string;
  readonly status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  readonly lineage: FinancialLineageMetadata;
}
