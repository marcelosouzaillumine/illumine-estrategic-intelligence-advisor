/**
 * Illumine OS™ Executive Contracts
 * Financial Governance Contract (CFDI v2.1)
 * 
 * Formal boundary contract between Financial Governance Layer and Executive Runtime Layer.
 */

import { CertifiedFinancialDataset } from './CertifiedFinancialDataset';
import { FinancialDecisionTrustSignal } from './FinancialDecisionTrustSignal';

export interface FinancialGovernanceContract {
  readonly dataset: CertifiedFinancialDataset;
  readonly trustSignal: FinancialDecisionTrustSignal;
  readonly certificationStatus: 'CERTIFIED' | 'WARNING' | 'FAILED';
  readonly runtimePermission: 'ALLOW' | 'RESTRICT' | 'BLOCK';
}
