/**
 * Illumine OS™ Executive Contracts
 * Financial Decision Trust Signal (CFDI v2.1)
 */

import { AllowedDecisionLevel } from './FinancialDecisionPermissionMatrix';

export interface FinancialDecisionTrustSignal {
  readonly financialCertificationStatus: 'CERTIFIED' | 'WARNING' | 'FAILED';
  readonly financialHealthIndex: number;
  readonly dataConfidence: number; // 0 - 1
  readonly allowedDecisionLevel: AllowedDecisionLevel;
  readonly datasetHash: string;
}
