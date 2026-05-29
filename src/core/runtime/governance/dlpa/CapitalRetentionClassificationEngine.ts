// src/core/runtime/governance/dlpa/CapitalRetentionClassificationEngine.ts
//
// Ref: Governance Runtime Correction — DLPA Fiduciary Interpretation Refactor
// Classifies capital retention applying strict fail-closed and strategic rules.

import { CapitalPreservationStatus } from './PatrimonialIntegrityEngine';

export type CapitalRetentionClassification =
  | 'STRATEGIC_RETENTION'
  | 'FORCED_RETENTION'
  | 'EMERGENCY_CAPITAL_PRESERVATION'
  | 'SURVIVAL_STAGE_CAPITAL_STRUCTURE'
  | 'UNSUSTAINABLE_PRESERVATION'
  | 'GOVERNANCE_RETENTION'
  | 'RETENTION_NOT_ELIGIBLE';

export class CapitalRetentionClassificationEngine {
  public static classify(params: {
    netIncome: number;
    distributableBaseExists: boolean;
    operatingCashFlow: number;
    preservationStatus: CapitalPreservationStatus;
    totalDistributed: number;
  }): CapitalRetentionClassification {
    const {
      netIncome,
      distributableBaseExists,
      operatingCashFlow,
      preservationStatus,
      totalDistributed,
    } = params;

    // Rule 1: Fail-Closed Fiduciary Interpretation
    // If lucro líquido <= 0 OR PL severely deteriorated OR cash flow negative OR no distributable base
    // Then we must PROHIBIT positive classifications and migrate to forced/emergency structures.
    const hasFailClosedCondition =
      netIncome <= 0 ||
      preservationStatus === 'SEVERELY_ERODED' ||
      preservationStatus === 'CAPITAL_COLLAPSE_RISK' ||
      operatingCashFlow <= 0 ||
      !distributableBaseExists;

    if (hasFailClosedCondition) {
      if (preservationStatus === 'CAPITAL_COLLAPSE_RISK') {
        return 'SURVIVAL_STAGE_CAPITAL_STRUCTURE';
      }
      if (netIncome <= 0 || !distributableBaseExists) {
        return 'FORCED_RETENTION';
      }
      if (preservationStatus === 'SEVERELY_ERODED') {
        return 'EMERGENCY_CAPITAL_PRESERVATION';
      }
      // If cash is negative but profit exists and PL is preserved
      return 'RETENTION_NOT_ELIGIBLE';
    }

    // Rule 5: Strategic Retention Check
    // Can only exist if:
    // netIncome > 0 AND distributableBaseExists AND operatingCashFlow > 0 AND preservationStatus === 'PRESERVED' AND totalDistributed === 0
    const isStrategicRetention =
      netIncome > 0 &&
      distributableBaseExists &&
      operatingCashFlow > 0 &&
      preservationStatus === 'PRESERVED' &&
      totalDistributed === 0;

    if (isStrategicRetention) {
      return 'STRATEGIC_RETENTION';
    }

    // If profit, distributable base and PL are fine, but cash flow is negative (already handled by fail-closed, but double safeguard)
    if (operatingCashFlow <= 0) {
      return 'UNSUSTAINABLE_PRESERVATION';
    }

    // Otherwise, when company has capacity and chooses distribution or reinvestment under normal conditions
    return 'GOVERNANCE_RETENTION';
  }
}
