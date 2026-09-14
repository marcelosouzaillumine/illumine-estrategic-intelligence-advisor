import { describe, it, expect } from 'vitest';
import { SignalIntelligenceEngine } from '../../../../capabilities/financial/intelligence/signals/SignalIntelligenceEngine';

describe('Constitutional Gate: BalanceSheetRawMetricLeakage', () => {
    it('should format source metrics so that no raw unformatted metric leaks to the ViewModel', () => {
        const exposures = [{ id: 'test', metric: 'Endividamento', value: 0.825, category: 'STRUCTURE', severity: 'HIGH', message: 'Alerta.' }];
        const current = { year: 2024 };

        const signals = SignalIntelligenceEngine.synthesize(exposures, [], current);
        
        // The sourceMetric string should be formatted as a percentage string (e.g. "82,5%" or "83%")
        // Assuming ExecutiveFormattingService formats 0.825 properly.
        // The key is that sourceMetric.value is a string, not a raw number.
        expect(typeof signals[0].sourceMetric!.value).toBe('string');
        expect(signals[0].sourceMetric!.value).not.toBe('0.825'); // Should be formatted
    });
});
