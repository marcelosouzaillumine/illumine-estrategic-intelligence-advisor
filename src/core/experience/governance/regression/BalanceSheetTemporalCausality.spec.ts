import { describe, it, expect } from 'vitest';
import { SignalIntelligenceEngine } from '../../../../capabilities/financial/intelligence/signals/SignalIntelligenceEngine';

describe('Constitutional Gate: BalanceSheetTemporalCausality', () => {
    it('should respect temporal causality, stamping the current year without projecting into the future', () => {
        const exposures = [{ id: 'test', metric: 'Endividamento', value: 0.8, category: 'STRUCTURE', severity: 'HIGH', message: 'Alerta.' }];
        const current = { year: 2024 };

        const signals = SignalIntelligenceEngine.synthesize(exposures, [], current);
        expect(signals[0].period).toBe(2024);
    });
});
