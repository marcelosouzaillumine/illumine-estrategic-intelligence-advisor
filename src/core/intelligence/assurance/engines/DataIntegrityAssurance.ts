import { IntelligenceAssuranceResult, ValidationIssue } from '../contracts/IntelligenceAssuranceResult';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

export class DataIntegrityAssurance {
  public static validate(data: NormalizedBalanceSheet): IntelligenceAssuranceResult {
    const issues: ValidationIssue[] = [];
    const timestamp = new Date();

    const { assets, liabilities, equity } = data;

    // 1. Fundamental Accounting Equation: Asset = Liability + Equity
    const totalAssets = assets.total;
    const totalLiabilities = liabilities.total;
    const equityTotal = equity.total;

    // We allow a small float tolerance (e.g. 1.0) for rounding issues in inputs
    const isEquationBalanced = Math.abs(totalAssets - (totalLiabilities + equityTotal)) <= 1.0;

    if (!isEquationBalanced) {
      issues.push({
        id: 'CRITICAL_ACCOUNTING_INCONSISTENCY',
        category: 'Data Integrity',
        severity: 'CRITICAL',
        message: 'The accounting equation (Assets = Liabilities + Equity) is unbalanced. Data integrity compromised.'
      });
    }

    // 2. Current Assets Validation
    // Basic structural check since we don't have all sub-items like 'otherCurrentAssets' strictly defined in the Normalized model
    const calculatedCurrentAssets = assets.cashAndEquivalents + assets.accountsReceivable + assets.inventory;
    if (assets.currentAssets < calculatedCurrentAssets) {
      issues.push({
        id: 'CURRENT_ASSETS_MISMATCH',
        category: 'Data Integrity',
        severity: 'WARNING',
        message: 'The sum of known current asset components exceeds the total current assets.'
      });
    }

    // 3. Liabilities Validation
    const calculatedTotalLiabilities = liabilities.currentLiabilities + liabilities.nonCurrentLiabilities;
    if (Math.abs(liabilities.total - calculatedTotalLiabilities) > 1.0 && liabilities.total > 0) {
      issues.push({
        id: 'LIABILITIES_MISMATCH',
        category: 'Data Integrity',
        severity: 'WARNING',
        message: 'The sum of current and non-current liabilities does not equal the total third-party liabilities.'
      });
    }

    const mathematical = issues.length === 0;

    return {
      status: mathematical ? 'VALID' : (issues.some(i => i.severity === 'CRITICAL') ? 'FAILED' : 'WARNING'),
      confidence: {
        score: mathematical ? 100 : 0, // Preliminary score, to be updated by ConfidenceEngine
        level: mathematical ? 'HIGH' : 'LOW',
        factors: []
      },
      issues,
      validations: {
        mathematical,
        accounting: false, // Pending next phase
        narrative: false   // Pending next phase
      },
      provenance: {
        source: 'DataIntegrityAssurance',
        rulesApplied: ['Accounting Equation', 'Balance Breakdown'],
        validatedAt: timestamp.toISOString()
      },
      timestamp
    };
  }
}
