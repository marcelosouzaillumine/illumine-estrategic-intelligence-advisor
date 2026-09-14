import { describe, it, expect } from 'vitest';
import { FinancialNarrativeEngine } from '../../../../capabilities/financial/intelligence/narrative/FinancialNarrativeEngine';

describe('Constitutional Gate: BalanceSheetNoUnsupportedClaim', () => {
    it('should include epistemic limit acknowledging causal boundary of the Balance Sheet', () => {
        const interpretation = FinancialNarrativeEngine.generateInterpretation({
            metric: 'Liquidez Corrente',
            value: '1.20',
            category: 'LIQUIDITY'
        });

        // Must not contain unsupported claims like "ineficiência operacional" without limits
        expect(interpretation.text).not.toContain('ineficiência operacional');
        expect(interpretation.text).toContain('Análise causal cruzada com DRE é necessária para conclusões definitivas');
    });
});
