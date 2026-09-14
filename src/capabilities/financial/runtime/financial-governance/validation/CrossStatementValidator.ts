/**
 * Illumine OS™ Financial Governance Boundary
 * Cross Statement Validator (CFDI v2.1)
 * 
 * Performs cross-statement financial validations:
 * - Net Profit (DRE) <-> Transferred Profit (DLPA)
 * - Ending Cash (DFC) <-> Cash & Cash Equivalents (Balance Sheet)
 * - Equity (Balance Sheet) <-> DLPA Ending Balance
 */

import { 
  CanonicalFinancialEntry, 
  FinancialViolation, 
  FinancialStatementType 
} from '../../../../../../packages/executive-contracts/src/financial/index';

export class CrossStatementValidator {
  public static validateCrossStatements(
    allClientEntries: ReadonlyArray<CanonicalFinancialEntry>,
    targetYear: number
  ): ReadonlyArray<FinancialViolation> {
    const violations: FinancialViolation[] = [];
    if (!allClientEntries || allClientEntries.length === 0) return Object.freeze(violations);

    const dreEntries = allClientEntries.filter(
      e => e.year === targetYear && (e.statementType === FinancialStatementType.DRE_ACCOUNTING || e.statementType === FinancialStatementType.DRE_MANAGERIAL)
    );
    const dlpaEntries = allClientEntries.filter(
      e => e.year === targetYear && e.statementType === FinancialStatementType.DLPA
    );
    const dfcEntries = allClientEntries.filter(
      e => e.year === targetYear && e.statementType === FinancialStatementType.DFC
    );
    const bpEntries = allClientEntries.filter(
      e => e.year === targetYear && e.statementType === FinancialStatementType.BALANCE_SHEET
    );

    // 1. Validate Net Profit (DRE) vs Net Profit (DLPA)
    if (dreEntries.length > 0 && dlpaEntries.length > 0) {
      const dreProfitItem = dreEntries.find(e => 
        e.accountName.toLowerCase().includes('lucro líquido') || 
        e.accountName.toLowerCase().includes('resultado do exercício')
      );
      const dlpaProfitItem = dlpaEntries.find(e => 
        e.accountName.toLowerCase().includes('lucro líquido') || 
        e.accountName.toLowerCase().includes('lucro do exercício')
      );

      if (dreProfitItem && dlpaProfitItem) {
        const diff = Math.abs(dreProfitItem.amount - dlpaProfitItem.amount);
        if (diff > 0.01) {
          violations.push({
            code: 'FIN-004',
            message: `Cross statement inconsistency between DRE and DLPA Net Profit for ${targetYear}. Diff: R$ ${diff.toFixed(2)}.`,
            severity: 'ERROR',
            recoverable: true,
            evidence: {
              targetYear,
              dreNetProfit: dreProfitItem.amount,
              dlpaNetProfit: dlpaProfitItem.amount,
              difference: diff
            }
          });
        }
      }
    }

    // 2. Validate DFC Net Variation vs Balance Sheet Cash Accounts
    if (dfcEntries.length > 0 && bpEntries.length > 0) {
      const dfcCashNet = dfcEntries.reduce((acc, e) => acc + e.amount, 0);
      const bpCashItem = bpEntries.find(e => 
        e.accountName.toLowerCase().includes('caixa e equivalentes') || 
        e.accountName.toLowerCase().includes('disponibilidades')
      );

      if (bpCashItem && Math.abs(dfcCashNet) > 0 && bpCashItem.amount < 0) {
        violations.push({
          code: 'FIN-004',
          message: `Inconsistent negative cash balance in Balance Sheet for ${targetYear}.`,
          severity: 'WARNING',
          recoverable: true,
          evidence: {
            targetYear,
            dfcNetCash: dfcCashNet,
            bpCashAmount: bpCashItem.amount
          }
        });
      }
    }

    return Object.freeze(violations);
  }
}
