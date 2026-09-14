import { describe, it, expect } from 'vitest';
import { BalanceSheetCalculations } from '../../../../capabilities/financial/domain/balance-sheet/calculations/BalanceSheetCalculations';

describe('Constitutional Gate: BalanceSheetNegativeEquity', () => {
    it('should handle negative equity without producing Infinity or NaN for thirdPartyCapitalRatio and equityImmobilization', () => {
        const data = {
            assets: { total: 1000, currentAssets: 500, nonCurrentAssets: 500, cashAndEquivalents: 100, accountsReceivable: 100, inventory: 100, fixedAssets: 100 },
            liabilities: { total: 1500, currentLiabilities: 500, nonCurrentLiabilities: 1000, suppliers: 0, laborObligations: 0, taxes: 0, financialDebtsShortTerm: 0, financialDebtsLongTerm: 0 },
            equity: { total: -500, capital: 100, retainedEarnings: -600 }
        } as any;

        const metrics = BalanceSheetCalculations.calculateMetrics(data);

        // When equity is <= 0, these ratios are not applicable mathematically
        expect(metrics.thirdPartyCapitalRatio).toBeNull();
        expect(metrics.equityImmobilization).toBeNull();
    });
});
