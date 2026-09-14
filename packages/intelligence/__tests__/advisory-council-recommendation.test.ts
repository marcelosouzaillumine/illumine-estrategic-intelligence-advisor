import { describe, it, expect } from 'vitest';
import { ExecutiveAgentExecutionRuntime } from '@illumine/executive-page-intelligence';

describe('@illumine/governance (Wave 17.9 Advisory Council Activation)', () => {
  it('should execute consolidated C-Level advisory council directive', () => {
    const res = ExecutiveAgentExecutionRuntime.executeAction('advisory-council', 'Emitir parecer', 'DashboardPage');

    expect(res.layer1Summary).toContain('Conselho Executivo');
    expect(res.layer2Evidences).toContain('Parecer favorável do Financial Agent');
  });
});
