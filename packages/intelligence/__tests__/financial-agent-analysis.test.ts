import { describe, it, expect } from 'vitest';
import { ExecutiveAgentExecutionRuntime } from '@illumine/executive-page-intelligence';

describe('@illumine/governance (Wave 17.9 Financial Agent Activation)', () => {
  it('should execute financial analysis journey on DRE', () => {
    const res = ExecutiveAgentExecutionRuntime.executeAction('financial-agent', 'Explicar variações', 'DREPage');

    expect(res.layer1Summary).toContain('EBITDA');
    expect(res.layer2Evidences).toContain('Receita +5%');
    expect(res.layer4Recommendation).toContain('comercial');
  });
});
