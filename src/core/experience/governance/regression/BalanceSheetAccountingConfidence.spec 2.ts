import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceEngine } from '../../../../capabilities/financial/intelligence/BalanceSheetIntelligenceEngine';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

describe('Constitutional Gate: BalanceSheetAccountingConfidence', () => {
    it('should drop Overall Confidence to LOW if accounting equation is unbalanced', () => {
        const mockData: NormalizedBalanceSheet = {
            year: 2024,
            assets: { total: 1000, currentAssets: 500, nonCurrentAssets: 500, cashAndEquivalents: 100, accountsReceivable: 100, inventory: 100, fixedAssets: 100 },
            liabilities: { total: 800, currentLiabilities: 400, nonCurrentLiabilities: 400, suppliers: 0, laborObligations: 0, taxes: 0, financialDebtsShortTerm: 0, financialDebtsLongTerm: 0 },
            equity: { total: 100, capital: 100, retainedEarnings: 0 }
            // Assets = 1000. Liabilities + Equity = 900. Unbalanced!
        } as any;

        const result = BalanceSheetIntelligenceEngine.execute(mockData);

        expect(result.confidence?.level).toBe('LOW');
        expect(result.confidence?.dimensions.accounting).toBe('INVALID');
    });
});
