import { describe, it, expect, vi } from 'vitest';
import { ExecutiveRuntime, RuntimeConfig } from '../ExecutiveRuntime';
import { CapabilityResolver, CapabilityAdapter } from '../CapabilityResolver';
import { ExecutiveReasoningContext } from '../../contracts/ExecutiveReasoningContext';

describe('ExecutiveRuntime', () => {
  it('should successfully create an ExecutiveSession', () => {
    const config: RuntimeConfig = { version: '1.2.0', featureFlags: {}, globalVariables: {} };
    const resolver = new CapabilityResolver();
    const runtime = new ExecutiveRuntime(config, resolver);

    const context: ExecutiveReasoningContext = {
      business: { sector: 'Tech', size: 'Enterprise', maturity: 'Scale-up', governanceLevel: 'High' },
      decision: { objective: 'Analyze Health', urgency: 'Low', stakeholder: 'CFO', timeHorizon: 'Short' },
      environment: { inflationTrend: 'Stable', interestRates: 'High', exchangeRate: 'Volatile', macroeconomicScenario: 'Growth', countryRisk: 'Medium' },
      organizational: { mission: 'Scale', culture: 'Agile', boardDirectives: [] },
      historical: { previousDecisions: [], previousOutcomes: [], institutionalMemory: [] }
    };

    const session = runtime.createSession('user_123', 'ws_456', 'cap_789', 'Production', 'Deterministic', context);

    expect(session.sessionId).toBeDefined();
    expect(session.executionMode).toBe('Production');
    expect(session.reasoningMode).toBe('Deterministic');
    expect(session.capabilityId).toBe('cap_789');
  });

  it('should successfully execute a pipeline and return ExecutiveIntelligenceOutput', async () => {
    const config: RuntimeConfig = { version: '1.2.0', featureFlags: {}, globalVariables: {} };
    const resolver = new CapabilityResolver();
    
    const mockAdapter: CapabilityAdapter = {
      id: 'cap_789',
      type: 'TEST',
      version: '1.0',
      adapt: async (data) => ({ adapted: true, raw: data })
    };
    resolver.register(mockAdapter);

    const runtime = new ExecutiveRuntime(config, resolver);
    const session = runtime.createSession('user_123', 'ws_456', 'cap_789', 'Production', 'Deterministic', {} as any);

    const mockStage = async (sess: any, data: any) => {
      return {
        meta: { pipelineId: 'test_pipeline' },
        knowledgeContext: {},
        reasoning: {},
        decision: {},
        governance: { validation: { valid: data.adapted } }
      };
    };

    const output = await runtime.execute(session, { test: 123 }, [mockStage]);

    expect(output.meta.runtimeVersion).toBe('1.2.0');
    expect(output.governance.validation.valid).toBe(true);
  });
});
