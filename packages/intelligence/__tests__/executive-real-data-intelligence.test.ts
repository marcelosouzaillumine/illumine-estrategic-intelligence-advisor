import { describe, it, expect } from 'vitest';
import { ExecutiveSignalResolver } from '@illumine/executive-decision-intelligence';

describe('@illumine/intelligence (Wave 17.12 Real Data Intelligence)', () => {
  it('should resolve signal using active financial metrics from financial model', () => {
    const sig = ExecutiveSignalResolver.resolveSignal({
      pageId: 'DREPage',
      financialData: { EBITDA: 1200000 }
    });

    expect(sig.signalTitle).toContain('Margem EBITDA');
    expect(sig.severity).toBe('WARNING');
  });
});
