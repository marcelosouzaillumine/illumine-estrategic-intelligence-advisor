import { describe, it, expect } from 'vitest';
import { ExecutiveRuntime, RuntimeConfig } from '../../runtime/ExecutiveRuntime';
import { CapabilityResolver, CapabilityAdapter } from '../../runtime/CapabilityResolver';
import { ExecutiveArtifact } from '../../contracts/schema/v1/ExecutiveArtifact.schema';

describe('Domain Independence (Contract Integrity)', () => {
  it('should seamlessly execute Financial and HR capabilities producing identical output structures', async () => {
    const config: RuntimeConfig = { version: '1.2.5', featureFlags: {}, globalVariables: {} };
    const resolver = new CapabilityResolver();
    const runtime = new ExecutiveRuntime(config, resolver);

    // Simulate a Financial Capability
    const liquidityCapability: CapabilityAdapter = {
      id: 'financial.liquidity',
      type: 'FINANCIAL',
      version: '1.0',
      adapt: async (data) => ({ adapted: true, domain: 'Finance', raw: data })
    };

    // Simulate an HR Capability
    const retentionCapability: CapabilityAdapter = {
      id: 'hr.retention',
      type: 'HR',
      version: '1.0',
      adapt: async (data) => ({ adapted: true, domain: 'HR', raw: data })
    };

    resolver.register(liquidityCapability);
    resolver.register(retentionCapability);

    const mockStage = async (sess: any, data: any) => {
      // Mocking the engine pipeline returning standard ExecutiveArtifact (as an Output format)
      return {
        meta: { runtimeVersion: '1.2.5' } as any,
        knowledgeContext: { ontology: data.domain } as any,
        reasoning: { facts: [] } as any,
        decision: { recommendations: [] } as any,
        governance: { confidence: { score: 90, level: 'HIGH', factors: [] }, validation: { valid: data.adapted }, evidence: {}, decisionProvenance: [] } as any
      };
    };

    // Run Finance
    const sessionFinance = runtime.createSession('u1', 'w1', 'financial.liquidity', 'Production', 'Deterministic', {} as any);
    const outputFinance = await runtime.execute(sessionFinance, { asset: 100 }, [mockStage]);

    // Run HR
    const sessionHR = runtime.createSession('u1', 'w1', 'hr.retention', 'Production', 'Deterministic', {} as any);
    const outputHR = await runtime.execute(sessionHR, { turnover: 0.1 }, [mockStage]);

    // Both should yield standard 5-axis shapes despite totally different domains
    expect(outputFinance.meta).toBeDefined();
    expect(outputFinance.knowledgeContext.ontology).toBe('Finance');
    expect(outputFinance.reasoning).toBeDefined();
    expect(outputFinance.decision).toBeDefined();
    expect(outputFinance.governance).toBeDefined();

    expect(outputHR.meta).toBeDefined();
    expect(outputHR.knowledgeContext.ontology).toBe('HR');
    expect(outputHR.reasoning).toBeDefined();
    expect(outputHR.decision).toBeDefined();
    expect(outputHR.governance).toBeDefined();
  });
});
