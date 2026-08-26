import { describe, it, expect } from 'vitest';
import { SignalIntelligenceEngine } from '../../../../capabilities/financial/intelligence/signals/SignalIntelligenceEngine';

describe('Constitutional Gate: BalanceSheetSignalOrphan', () => {
    it('should never produce an orphan signal; all signals must have an Evidence Graph and an epistemic limit string if applicable', () => {
        const exposures = [{ id: 'test', metric: 'Endividamento', value: 0.8, category: 'STRUCTURE', severity: 'HIGH', message: 'Alerta.' }];
        const current = { year: 2024 };

        const signals = SignalIntelligenceEngine.synthesize(exposures, [], current);
        const signal = signals[0];

        expect(signal).toBeDefined();
        // Evidence Graph Check
        expect(signal.metric).toBeDefined();
        expect(signal.value).toBeDefined();
        expect(signal.period).toBeDefined();
        expect(signal.interpretation).toBeDefined();
        
        // At this level the epistemic limit is injected in the narrative layer, we check if the interpretation has it
        expect(signal.interpretation.text).toContain('Balanço Patrimonial por si só não comprova a causa');
    });
});
