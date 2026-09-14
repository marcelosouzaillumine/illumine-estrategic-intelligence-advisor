import { describe, it, expect } from 'vitest';
import { ExecutiveAgentExecutionRuntime } from '@illumine/executive-page-intelligence';

describe('@illumine/governance (Wave 17.9 Risk Agent Activation)', () => {
  it('should execute risk evaluation journey on Balance Sheet', () => {
    const res = ExecutiveAgentExecutionRuntime.executeAction('risk-agent', 'Avaliar riscos', 'BalançoPatrimonialPage');

    expect(res.layer1Summary).toContain('liquidez');
    expect(res.layer2Evidences).toContain('Caixa reduzido em 14%');
    expect(res.layer4Recommendation).toContain('ciclo financeiro');
  });
});
