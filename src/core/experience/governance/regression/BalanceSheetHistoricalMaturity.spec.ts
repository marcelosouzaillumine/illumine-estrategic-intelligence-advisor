import { describe, it, expect } from 'vitest';
import { FinancialPositionScoreEngine } from '../../../../capabilities/financial/intelligence/score/FinancialPositionScoreEngine';
import { IntelligenceDiagnosis } from '../../../../capabilities/financial/contracts/FinancialPositionIntelligenceContract';

describe('Constitutional Gate: BalanceSheetHistoricalMaturity', () => {
    it('should assign a neutral fallback interpretation for evolution when there is no historical data', () => {
        const mockDiagnosis: IntelligenceDiagnosis = {
            liquidity: [], solvencyAndCapitalStructure: [],  workingCapital: [], assetQuality: [], 
        } as any;

        // 1 data period = no history (only current period)
        const result = FinancialPositionScoreEngine.calculate(mockDiagnosis, 1, {});

        expect(result.dimensions.evolution.confidence).toBe('LOW');
        expect(result.dimensions.evolution.interpretation).toContain('Cobertura histórica insuficiente');
    });
});
