import { describe, it, expect } from 'vitest';
import { ExecutiveIntelligencePipeline, ExecutiveIntelligenceEngine } from '../ExecutiveIntelligencePipeline';
import { ExecutiveAdvisorRuntimeContext } from '../ExecutiveAdvisorRuntimeContext';
import { ExecutiveResponseContract } from '../ExecutiveResponseContract';

describe('Wave G5.0.2.3.1: Executive Advisor Runtime Foundation™', () => {

  const baseContext: ExecutiveAdvisorRuntimeContext = {
    identity: {
      userId: 'user-marcelo',
      tenantId: 'tenant-illumine',
      organizationId: 'org-123',
      operationalRole: 'CEO',
      executivePersona: 'Strategist',
      permissions: [],
      sessionId: 'sess-1',
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 1000),
      identitySource: 'SYSTEM'
    },
    organization: {
      tenantId: 'tenant-illumine',
      companyName: 'Illumine Corp',
      industry: 'Technology'
    },
    page: {
      route: '/dashboard/finance',
      domain: 'FINANCE',
      capability: 'Budgeting',
      purpose: 'Analise Financeira'
    },
    objective: {
      currentDecision: 'Redução de custos'
    },
    memory: {
      previousDecisions: [],
      unresolvedIssues: []
    },
    timestamp: new Date().toISOString(),
    contextVersion: '1.0'
  };

  class MockValidEngine implements ExecutiveIntelligenceEngine {
    async evaluate(context: ExecutiveAdvisorRuntimeContext, query: string): Promise<ExecutiveResponseContract> {
      return {
        schemaVersion: "1.0",
        executiveSummary: "O capital de giro está estável, mas a margem caiu.",
        recommendations: [{
          id: "rec-1",
          title: "Revisar custos operacionais",
          description: "Marcelo, devido à queda na margem, recomendo analisar os custos fixos.",
          urgency: "URGENT"
        }]
      };
    }
  }

  class MockInvalidEngine implements ExecutiveIntelligenceEngine {
    async evaluate(context: ExecutiveAdvisorRuntimeContext, query: string): Promise<ExecutiveResponseContract> {
      // @ts-ignore
      return {
        schemaVersion: "0.9", // Inválido, Pipeline deve bloquear
        executiveSummary: "Texto solto..."
      };
    }
  }

  it('Executive Identity Continuity Test - Bloqueia vazamento Cross-Tenant', async () => {
    const invalidContext = {
      ...baseContext,
      organization: { ...baseContext.organization, tenantId: 'tenant-other' }
    };

    const engine = new MockValidEngine();
    
    await expect(ExecutiveIntelligencePipeline.execute(invalidContext, engine, "O que fazer?"))
      .rejects.toThrowError("AR-GFC-COP-001: Multi-Tenant Boundary Violation.");
  });

  it('Executive Response Contract Validation - Bloqueia versão inválida', async () => {
    const engine = new MockInvalidEngine();
    
    await expect(ExecutiveIntelligencePipeline.execute(baseContext, engine, "O que fazer?"))
      .rejects.toThrowError("Pipeline Execution Halted: Invalid Response Contract Version.");
  });

  it('Executive Advisor Behavioral Test™ - Garante estrutura de decisão em vez de chat solto', async () => {
    const engine = new MockValidEngine();
    
    const response = await ExecutiveIntelligencePipeline.execute(baseContext, engine, "O que devo fazer?");
    
    expect(response.schemaVersion).toBe("1.0");
    expect(response.executiveSummary).toBeDefined();
    
    // Valida que a IA gerou uma recomendação estruturada em vez de texto bruto
    expect(response.recommendations?.length).toBe(1);
    expect(response.recommendations![0].title).toBe("Revisar custos operacionais");
    expect(response.recommendations![0].description).toContain("Marcelo"); // Usa o contexto (Memory/Identity)
  });
});
