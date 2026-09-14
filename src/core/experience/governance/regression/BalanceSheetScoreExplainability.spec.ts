import { describe, it, expect } from 'vitest';
import { FinancialPositionScoreEngine } from '../../../../capabilities/financial/intelligence/score/FinancialPositionScoreEngine';

describe('Constitutional Gate: BalanceSheetScoreExplainability', () => {
    it('should calculate overall score exactly from dimension contributions', () => {
        const result = FinancialPositionScoreEngine.calculate({
            liquidity: [{ name: 'LC', value: 1.5, status: 'STRONG' }],
            solvencyAndCapitalStructure: [],
            
            workingCapital: [{ name: 'CCL', value: 1000, status: 'STRONG' }],
            assetQuality: [{ name: 'Imob', value: 0.5, status: 'STRONG' }],
            
        } as any, 1, {});

        const calculatedOverall = 
            result.dimensions.liquidity.contribution + 
            result.dimensions.solvencyAndCapitalStructure.contribution +
            result.dimensions.workingCapital.contribution +
            result.dimensions.assetQuality.contribution +
            result.dimensions.evolution.contribution;

        expect(result.overall.value).toBe(Math.round(calculatedOverall));
        expect(result.methodology.weights.liquidity).toBe(0.25);
    });
});
