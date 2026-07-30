/**
 * Illumine OS™ Executive Contracts
 * Certified Financial Dataset (CFDI v2.1)
 * 
 * Fiduciary institutional object consumed by the Executive Runtime Layer.
 * Signed with a SHA-256 datasetHash fingerprint to bind executive decision to exact dataset.
 */

import { CanonicalFinancialEntry } from './CanonicalFinancialEntry';
import { FinancialStatementType } from './FinancialStatementType';
import { Certification, FinancialHealthIndex } from './FinancialIntegrityContract';

export interface CertifiedFinancialDataset {
  readonly id: string;
  readonly clientId: string;
  readonly datasetHash: string; // SHA-256 fingerprint
  readonly statementTypes: ReadonlyArray<FinancialStatementType>;
  readonly entries: ReadonlyArray<CanonicalFinancialEntry>;
  readonly certification: Certification<ReadonlyArray<CanonicalFinancialEntry>>;
  readonly healthIndex: FinancialHealthIndex;
  readonly generatedAt: string;
  readonly pipelineVersion: '2.1.0';
}
