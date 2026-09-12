/**
 * Illumine OS™ Financial Governance Boundary
 * Financial Certification Engine (CFDI v2.1)
 * 
 * Generates official Certification<ReadonlyArray<CanonicalFinancialEntry>> payload.
 */

import { 
  CanonicalFinancialEntry, 
  Certification, 
  FinancialDataQualityScore, 
  FinancialViolation 
} from '../../../../../../packages/executive-contracts/src/financial/index';

export class FinancialCertificationEngine {
  public static certify(
    entries: ReadonlyArray<CanonicalFinancialEntry>,
    qualityScore: FinancialDataQualityScore,
    violations: ReadonlyArray<FinancialViolation>
  ): Certification<ReadonlyArray<CanonicalFinancialEntry>> {
    const hasCritical = violations.some(v => v.severity === 'CRITICAL');
    const hasErrors = violations.some(v => v.severity === 'ERROR');

    let status: 'CERTIFIED' | 'WARNING' | 'FAILED' = 'CERTIFIED';
    if (hasCritical || qualityScore.score < 50 || entries.length === 0) {
      status = 'FAILED';
    } else if (hasErrors || qualityScore.score < 75) {
      status = 'WARNING';
    }

    const confidence = Math.max(0, Math.min(1, qualityScore.score / 100));
    const warnings = violations
      .filter(v => v.severity === 'WARNING' || v.severity === 'INFO')
      .map(v => `[${v.code}] ${v.message}`);

    return {
      status,
      confidence,
      qualityScore,
      violations,
      warnings,
      certifiedAt: new Date().toISOString(),
      certifiedBy: 'FinancialCertificationEngine-v2.1.0',
      data: entries
    };
  }
}
