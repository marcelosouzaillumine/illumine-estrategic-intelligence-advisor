/**
 * Illumine OS™ Financial Governance Boundary
 * Financial Health Index Engine (CFDI v2.1)
 * 
 * Computes executive health index (0 - 100) combining quality score,
 * statement coverage, and cross-statement consistency.
 */

import { 
  CanonicalFinancialEntry, 
  FinancialDataQualityScore, 
  FinancialHealthIndex, 
  FinancialViolation 
} from '../../../../../packages/executive-contracts/src/financial/index';

export class FinancialHealthIndexEngine {
  public static calculate(
    entries: ReadonlyArray<CanonicalFinancialEntry>,
    qualityScore: FinancialDataQualityScore,
    violations: ReadonlyArray<FinancialViolation>
  ): FinancialHealthIndex {
    if (!entries || entries.length === 0) {
      return { index: 0, status: 'CRITICAL' };
    }

    const hasCriticalViolation = violations.some(v => v.severity === 'CRITICAL');
    const hasErrorViolation = violations.some(v => v.severity === 'ERROR');

    let healthValue = qualityScore.score;
    if (hasCriticalViolation) healthValue = Math.min(healthValue, 45);
    else if (hasErrorViolation) healthValue = Math.min(healthValue, 68);

    let status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' = 'HEALTHY';
    if (healthValue < 50) status = 'CRITICAL';
    else if (healthValue < 75) status = 'DEGRADED';

    return {
      index: healthValue,
      status
    };
  }
}
