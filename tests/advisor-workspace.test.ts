import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CommercialPlanEngine, TenantCommercialState } from '../src/core/commercial/CommercialPlanEngine';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('Phase 10: Advisor Workspace & Commercial Plan Engine Isolation Tests', () => {
  const mockReport = {
    context: {
      segment: 'Tecnologia',
      businessModel: 'ASSET_LIGHT',
      capitalIntensity: 'Asset Light',
      stage: 'EXPANSION',
      operationalProfile: 'Ciclo curto'
    },
    scores: {
      financial: 85,
      operational: 90,
      governance: 80,
      structural: 75,
      composite: 82.5
    },
    capitalStructure: {
      qualityRating: 'PRIME',
      elasticity: 'HIGH',
      rolloverRisk: 'LOW',
      operationalDependency: 'NONE'
    },
    causality: {
      event: 'Geração robusta de EBITDA',
      rootCause: 'Crescimento de ARR',
      financialPropagation: 'Aumento de caixa circulante',
      absorptionCapacity: 'Excelente capacidade',
      strategicImpact: 'Capex acelerado',
      insights: []
    },
    severity: {
      level: 'SAUDÁVEL',
      justification: 'Zona verde.'
    },
    advisory: {
      executiveSummary: 'Estável e saudável.',
      actionMatrix: ['Alocar caixa', 'Otimizar tributos'],
      priorityFocus: 'Alocação de excesso'
    },
    decomposition: [],
    compliance: {
      runtimeMode: 'FULL_FINANCIAL_VIEW',
      confidenceLevel: 'HIGH_CONFIDENCE',
      dataCompleteness: 1.0,
      causalDepth: 'DEEP',
      narrativeRestrictions: [],
      auditFlags: []
    }
  } as any;

  it('1. CommercialPlanEngine deve gerenciar planos, cotas e limites fiduciosamente', () => {
    const basicQuotas = CommercialPlanEngine.getQuotas('basic');
    const premiumQuotas = CommercialPlanEngine.getQuotas('premium');
    
    assert.strictEqual(basicQuotas.maxWorkspaces, 1);
    assert.strictEqual(basicQuotas.scenarioSimulationAllowed, false);

    assert.strictEqual(premiumQuotas.maxWorkspaces, 5);
    assert.strictEqual(premiumQuotas.scenarioSimulationAllowed, true);

    const state: TenantCommercialState = {
      tenantId: 'TENANT-123',
      planId: 'basic',
      activeWorkspacesCount: 1,
      activeAdvisorsCount: 0,
      billingStatus: 'ACTIVE',
      trialActive: false
    };

    // Cannot add workspace on basic plan if activeWorkspacesCount === maxWorkspaces (1)
    assert.strictEqual(CommercialPlanEngine.canAddWorkspace(state), false);

    // Can add advisor on premium plan
    const premiumState = { ...state, planId: 'premium' as const };
    assert.strictEqual(CommercialPlanEngine.canAddAdvisor(premiumState), true);
  });

  it('2. CommercialPlanEngine não pode alterar outputs financeiros de orquestração', () => {
    const reportCopy = JSON.parse(JSON.stringify(mockReport));
    
    // Call engine validation to show it doesn't change anything
    CommercialPlanEngine.validateSecurityIsolation(reportCopy);
    
    // Check that values are unchanged
    assert.deepEqual(reportCopy, mockReport);
  });

  it('3. Feature flags devem ser respeitadas conforme o plano ativo', () => {
    assert.strictEqual(CommercialPlanEngine.isFeatureAllowed('basic', 'scenarioSimulationAllowed'), false);
    assert.strictEqual(CommercialPlanEngine.isFeatureAllowed('premium', 'scenarioSimulationAllowed'), true);
    assert.strictEqual(CommercialPlanEngine.isFeatureAllowed('enterprise', 'isWhiteLabel'), true);
  });
});
