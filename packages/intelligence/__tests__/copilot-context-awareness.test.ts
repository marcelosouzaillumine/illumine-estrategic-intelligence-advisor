/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveCopilotLayer } from '../executive-experience-composer/src';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/intelligence (Wave 18.1 Copilot Context Awareness)', () => {
  it('should generate initial copilot greeting dynamically from context data without static templates (ADR-068)', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-emporio',
      companyName: 'Empório do Mármore',
      pageId: 'DREPage',
      period: '2026',
      comparisonPeriod: '2025',
      financialData: { EBITDA: 620000, ReceitaBruta: 8450000 },
      previousPeriodFinancialData: { EBITDA: 1292200, ReceitaBruta: 9100000 }
    });

    const copilotState = ExecutiveCopilotLayer.resolveInitialCopilotState(ctx);

    expect(copilotState.greetingText).toContain('Empório do Mármore');
    expect(copilotState.greetingText).toContain('2026');
    expect(copilotState.greetingText).toContain('variação de');
    expect(copilotState.greetingText).not.toContain('Posso ajudar na análise');
  });
});
