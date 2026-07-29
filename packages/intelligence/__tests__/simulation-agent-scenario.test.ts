import { describe, it, expect } from 'vitest';
import { ExecutiveAgentExecutionRuntime } from '@illumine/executive-page-intelligence';

describe('@illumine/intelligence (Wave 17.9 Simulation Agent Activation)', () => {
  it('should execute simulation scenario journey', () => {
    const res = ExecutiveAgentExecutionRuntime.executeAction('simulation-agent', 'Simular cenário', 'StrategicSimulatorPage');

    expect(res.layer1Summary).toContain('10%');
    expect(res.layer2Evidences).toContain('Economia estimada de R$ 500.000');
  });
});
