// tests/governance/fiduciary-enforcement/fiduciary-enforcement.test.ts
//
// Ref: Governance / EFOS — Global Fiduciary Distribution Enforcement Layer
//

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DLPAFiduciaryInterpretationEngine } from '../../../src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine';
import { GlobalFiduciaryDistributionEnforcementEngine } from '../../../src/core/runtime/governance/fiduciary-enforcement/GlobalFiduciaryDistributionEnforcementEngine';
import { FinancialRuntimeContextAdapter } from '../../../src/core/runtime/financial-context/FinancialRuntimeContextAdapter';
import { InstitutionalBusinessProfile } from '../../../src/core/runtime/institutional-identity/InstitutionalBusinessProfile';
import { ExecutiveActionMatrixEngine } from '../../../src/core/runtime/integrity/ExecutiveActionMatrixEngine';
import { ExecutivePriorityConsolidationEngine } from '../../../src/core/runtime/ExecutivePriorityConsolidationEngine';
import { ExecutiveNarrativeOrchestrator } from '../../../src/core/runtime/ExecutiveNarrativeOrchestrator';
import { ScenarioFiduciarySimulator } from '../../../src/core/runtime/scenario/ScenarioFiduciarySimulator';

describe('Global Fiduciary Distribution Enforcement Layer Suite', () => {

  const createContext = (segment = 'Default SaaS') => {
    const adapter = new FinancialRuntimeContextAdapter();
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: segment,
      intensidadeCapital: 'LIGHT',
      perfilCicloFinanceiro: 'SHORT'
    };
    return adapter.createContext(profile);
  };

  const createBaseFiduciaryOutput = (overrides: any = {}) => {
    const context = createContext();
    return DLPAFiduciaryInterpretationEngine.evaluate({
      context,
      dlpaData: [{ year: 2026, capitalSocial: 100000, lucrosRetidosAcumulados: 20000 }],
      netIncome: 15000,
      retainedEarnings: 15000,
      totalDistributed: 0,
      startingEquity: 100000,
      endingEquity: 115000,
      capitalInjections: 0,
      operatingCashFlow: 12000,
      capitalSocial: 100000,
      lucrosPrejuizos: 20000,
      historicalCycles: [],
      ...overrides
    });
  };

  // 1. Negative profit blocks dividend recommendations
  it('1. Negative profit blocks dividend recommendations', () => {
    const fidOut = createBaseFiduciaryOutput({ netIncome: -5000, lucrosPrejuizos: 0 });
    const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fidOut);

    assert.equal(enforcement.enforcementTriggered, true);
    assert.ok(enforcement.blockedActions.includes('DIVIDEND'));
    assert.ok(enforcement.causalReasons.includes('INELEGIBILIDADE_DISTRIBUTIVA'));
  });

  // 2. Severe erosion removes payout actions
  it('2. Severe erosion removes payout actions', () => {
    const fidOut = createBaseFiduciaryOutput({ endingEquity: 45000, startingEquity: 100000 }); // ratio = 0.45, SEVERELY_ERODED
    const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fidOut);

    assert.equal(enforcement.enforcementTriggered, true);
    assert.ok(enforcement.blockedActions.includes('DISTRIBUTION'));
    assert.ok(enforcement.causalReasons.includes('EROSÃO_PATRIMONIAL_ATIVA'));
  });

  // 3. Low confidence activates fail-closed protection
  it('3. Low confidence activates fail-closed protection', () => {
    const context = createContext();
    context.contextualConfidence = 'LOW';
    const fidOut = createBaseFiduciaryOutput({ context });
    const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fidOut);

    assert.equal(enforcement.enforcementTriggered, true);
    assert.equal(enforcement.institutionalProtectionMode, 'FIDUCIARY_PROTECTION_MODE');
  });

  // 4. Treasury stress blocks shareholder extraction
  it('4. Treasury stress blocks shareholder extraction', () => {
    const fidOut = createBaseFiduciaryOutput({ operatingCashFlow: -2000 }); // negative cash flow
    const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fidOut);

    assert.equal(enforcement.enforcementTriggered, true);
    assert.ok(enforcement.blockedActions.includes('PARTNER_EXTRACTION'));
    assert.ok(enforcement.causalReasons.includes('INELEGIBILIDADE_DISTRIBUTIVA'));
  });

  // 5. Forced retention suppresses optimistic narratives
  it('5. Forced retention suppresses optimistic narratives', () => {
    const fidOut = createBaseFiduciaryOutput({ netIncome: -1000 }); // forced retention
    const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fidOut);

    assert.equal(enforcement.enforcementTriggered, true);
    const originalText = 'We maintained a healthy retention and conservative distribution.';
    const sanitized = GlobalFiduciaryDistributionEnforcementEngine.sanitizeNarrative(originalText, enforcement.enforcementTriggered);

    assert.ok(sanitized.includes('institutional preservation mode'));
    assert.ok(sanitized.includes('restricted distributive capacity'));
    assert.equal(sanitized.includes('healthy retention'), false);
  });

  // 6. Scenario proposing excessive payout becomes invalid
  it('6. Scenario proposing excessive payout becomes invalid', async () => {
    const baseSnapshot: any = {
      groupId: 'GRP-123',
      entities: [{ id: 'ENT-1', name: 'Ent 1', role: 'PARENT', ownershipPercentage: 100, consolidationMethod: 'FULL' }],
      bpByEntity: {
        'ENT-1': [
          { accountId: '1.1.1', category: 'Caixa', value: 10000 },
          { accountId: '2.1', category: 'Dívida', value: 5000 },
          { accountId: '2.3', category: 'Patrimônio Líquido', value: 10000 }
        ]
      },
      dreByEntity: {
        'ENT-1': [
          { accountId: '3.1', category: 'Receita', value: 50000 },
          { accountId: '3.2', category: 'Lucro Líquido', value: 1000 } // netIncome = 1000
        ]
      },
      confidenceByEntity: {},
      topologySnapshot: { nodes: [], edges: [] }
    };

    // Payout shock of 5000 exceeds netIncome of 1000
    const shocks = [{ type: 'DIVIDEND_PAYOUT' as any, targetEntityId: 'ENT-1', magnitude: 5000, description: 'Dividends payout' }];
    const result = await ScenarioFiduciarySimulator.runSimulation({ baseSnapshot, shocks, horizonMonths: 12 }, 'HIGH');

    assert.equal(result.projectedConfidence, 'CRITICAL_STRESS');
    assert.equal(result.fiduciarySeverity, 'CRITICAL');
    assert.equal(result.fiduciaryViolation, 'INVALID_FIDUCIARY_DISTRIBUTION');
  });

  // 7. Action Matrix automatically replaces extraction actions
  it('7. Action Matrix automatically replaces extraction actions', () => {
    const fidOut = createBaseFiduciaryOutput({ netIncome: -2000 }); // triggers enforcement
    const rawActions = [
      'Propor a distribuição de dividendos do período.',
      'Capex de expansão comercial.'
    ];

    const matrix = ExecutiveActionMatrixEngine.buildMatrix(
      rawActions,
      { hasData: true },
      { patrimonioLiquido: 100000 },
      {},
      'SAUDÁVEL',
      'GENERIC_OPERATION',
      fidOut
    );

    const titles = matrix.map(m => m.title.toLowerCase());
    
    // Check that dividend and Capex actions were removed
    assert.equal(titles.some(t => t.includes('distribuição')), false);
    assert.equal(titles.some(t => t.includes('capex de expansão')), false);

    // Check that replacement actions were added
    assert.ok(matrix.some(m => m.title.includes('Preservação de caixa')));
    assert.ok(matrix.some(m => m.title.includes('Capex Freeze')));
  });

  // 8. Executive narrative gets downgraded correctly
  it('8. Executive narrative gets downgraded correctly', () => {
    const mockReport = {
      capitalGovernanceReport: {
        isAvailable: true,
        fiduciaryOutput: createBaseFiduciaryOutput({ netIncome: -1000 }) // triggers enforcement
      }
    };

    const text = 'Nossa operação possui forte governança de capital com payout equilibrado e retenção saudável.';
    const orchestrated = ExecutiveNarrativeOrchestrator.orchestrate(
      mockReport,
      text,
      [],
      'Caixa sob estresse',
      'Erosão ativa'
    );

    assert.ok(orchestrated.leadParagraph.includes('fragilidade patrimonial'));
    assert.ok(orchestrated.leadParagraph.includes('prioridade de proteção de capital'));
    assert.equal(orchestrated.leadParagraph.includes('forte governança de capital'), false);
  });

  // 9. Missing fiduciaryOutput triggers global protection mode
  it('9. Missing fiduciaryOutput triggers global protection mode', () => {
    const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(undefined);

    assert.equal(enforcement.enforcementTriggered, true);
    assert.equal(enforcement.institutionalProtectionMode, 'FIDUCIARY_PROTECTION_MODE');
    assert.ok(enforcement.blockedActions.includes('OWNER_WITHDRAWAL'));
  });

  // 10. Longitudinal fragility escalates severity
  it('10. Longitudinal fragility escalates severity', () => {
    const historicalCycles = [
      { year: 2024, netIncome: -5000, totalDistributed: 0, startingEquity: 100000, endingEquity: 90000, operatingCashFlow: -1000 },
      { year: 2025, netIncome: -3000, totalDistributed: 0, startingEquity: 90000, endingEquity: 85000, operatingCashFlow: -500 }
    ];
    const fidOut = createBaseFiduciaryOutput({
      historicalCycles
    });
    const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fidOut);

    assert.equal(enforcement.enforcementTriggered, true);
    assert.equal(enforcement.fiduciarySeverityLevel, 'CRITICAL');
  });

  // 11. Scenario proposing Capex under stress becomes invalid
  it('11. Scenario proposing Capex under stress becomes invalid', async () => {
    const baseSnapshot: any = {
      groupId: 'GRP-123',
      entities: [{ id: 'ENT-1', name: 'Ent 1', role: 'PARENT', ownershipPercentage: 100, consolidationMethod: 'FULL' }],
      bpByEntity: {
        'ENT-1': [
          { accountId: '1.1.1', category: 'Caixa', value: 10000 },
          { accountId: '2.1', category: 'Dívida', value: 5000 },
          { accountId: '2.3', category: 'Patrimônio Líquido', value: 10000 }
        ]
      },
      dreByEntity: {
        'ENT-1': [
          { accountId: '3.1', category: 'Receita', value: 50000 },
          { accountId: '3.2', category: 'Lucro Líquido', value: -1000 } // negative income / FCO
        ]
      },
      confidenceByEntity: {},
      topologySnapshot: { nodes: [], edges: [] }
    };

    // Capex shock under stress (negative netIncome, no dedicated funding)
    const shocks = [{ type: 'CAPEX_INVESTMENT' as any, targetEntityId: 'ENT-1', magnitude: 8000, description: 'Aggressive expansion Capex' }];
    const result = await ScenarioFiduciarySimulator.runSimulation({ baseSnapshot, shocks, horizonMonths: 12 }, 'HIGH');

    assert.equal(result.projectedConfidence, 'CRITICAL_STRESS');
    assert.equal(result.fiduciarySeverity, 'CRITICAL');
    assert.equal(result.fiduciaryViolation, 'AGGRESSIVE_CAPEX_FROM_STRESSED_CASH');
  });

});
