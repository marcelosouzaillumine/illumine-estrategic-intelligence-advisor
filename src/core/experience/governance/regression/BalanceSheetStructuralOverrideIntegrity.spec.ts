import { describe, it, expect } from 'vitest';
import { FinancialPositionScoreEngine } from '../../../../capabilities/financial/intelligence/score/FinancialPositionScoreEngine';
import { IntelligenceDiagnosis } from '../../../../capabilities/financial/contracts/FinancialPositionIntelligenceContract';

describe('Constitutional Gate: BalanceSheetStructuralOverrideIntegrity', () => {
    it('should force finalStatus to CRITICAL when NEGATIVE_EQUITY is present, without altering the math value', () => {
        const mockDiagnosis: IntelligenceDiagnosis = {
            liquidity: [{ name: 'LC', value: 1.5, status: 'STRONG' }],
            solvencyAndCapitalStructure: [{ name: 'Endividamento', value: -0.5, status: 'CRITICAL', code: 'equity_ratio', observation: 'Patrimônio Líquido Negativo' }],
            
            workingCapital: [{ name: 'CCL', value: 1000, status: 'STRONG' }],
            assetQuality: [{ name: 'Imob', value: 0.5, status: 'STRONG' }],
            
        } as any;

        const result = FinancialPositionScoreEngine.calculate(mockDiagnosis, 3, {}, { equity: { value: -1000 } });
        
        // Mathematical score should still be calculated normally (e.g. above 50 due to strong liquidity/WC)
        // But the Final Status must be CRITICAL
        expect(result.overall.structuralEvents).toContainEqual(
            expect.objectContaining({ type: 'NEGATIVE_EQUITY', severity: 'CRITICAL' })
        );
        expect(result.overall.finalStatus).toBe('CRITICAL');
        expect(result.overall.classification).not.toBe('CRITICAL'); 
    });
});
