import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { InstitutionalSurvivalHierarchyEngine } from '../../src/core/runtime/institutional-survival/InstitutionalSurvivalHierarchyEngine';
import { SurvivalPriorityClassificationEngine } from '../../src/core/runtime/institutional-survival/SurvivalPriorityClassificationEngine';
import { InstitutionalConflictArbitrationEngine } from '../../src/core/runtime/institutional-survival/InstitutionalConflictArbitrationEngine';
import { SurvivalConstraintPropagationEngine } from '../../src/core/runtime/institutional-survival/SurvivalConstraintPropagationEngine';
import { ExecutiveActionMatrixEngine } from '../../src/core/runtime/integrity/ExecutiveActionMatrixEngine';
import { ScenarioSimulationEngine } from '../../src/core/runtime/scenario/ScenarioSimulationEngine';
import { TreasuryPriorityMatrixEngine } from '../../src/core/runtime/treasury-intelligence/TreasuryPriorityMatrixEngine';

// Default healthy baseline input to avoid triggering fail-closed logic
const getHealthyInput = (): any => ({
  fiduciaryOutput: {
    patrimonialIntegrityStatus: 'PRESERVED',
    capitalProtectionStatus: 'STRONG_CAPITAL_PROTECTION',
    retentionClassification: 'STANDARD_RETENTION',
    distributionEligibility: { eligible: true },
    causalDrivers: [],
    lineageHash: 'VALID_FID_HASH',
    confidenceLevel: 'HIGH',
    blockedConclusions: []
  },
  treasuryRuntime: {
    severity: 'STABLE',
    treasuryLineageHash: 'VALID_TREASURY_HASH',
    confidenceLevel: 'HIGH',
    governanceVerdict: 'Healthy'
  },
  cashIntelligenceRuntime: {
    continuityRisk: {
      projectedRunwayMonths: 18,
      runwayStability: 'STABLE',
      continuityRisk: 'LOW',
      hasRuptureRisk: false
    },
    liquidityClassification: { classification: 'STABLE' },
    lineageHash: 'VALID_CASH_HASH',
    confidenceLevel: 'HIGH'
  },
  patrimonialIntelligenceRuntime: {
    confidenceLevel: 'HIGH',
    bpData: { passivoCirculante: 50000 }
  },
  historicalCycles: [
    { netIncome: 100000, startingEquity: 500000, endingEquity: 600000 },
    { netIncome: 120000, startingEquity: 600000, endingEquity: 720000 }
  ],
  historicalCyclesCount: 2,
  availableCash: 200000,
  fco: 50000,
  netIncome: 120000,
  memoryProfile: { fatigueScore: 10, persistentStructuralFragility: false }
});

describe('ISHE - Institutional Survival Hierarchy Engine', () => {

  it('[Rule 1] FCO negativo ativa SURVIVAL_MODE e rebaixa o nível da hierarquia', () => {
    const input = getHealthyInput();
    input.fco = -5000; // Negative FCO

    const output = InstitutionalSurvivalHierarchyEngine.evaluate(input);

    assert.equal(output.activeSurvivalMode, 'SURVIVAL_MODE');
    assert.equal(output.currentHierarchyLevel, 1);
    assert.ok(output.blockedHierarchyLevels.includes('LEVEL_5_SHAREHOLDER_OPTIMIZATION'));
    assert.ok(output.causalDrivers.includes('FCO_NEGATIVO'));
  });

  it('[Rule 2] Runway de caixa < 3 meses bloqueia ações e propostas de expansão', () => {
    const input = getHealthyInput();
    input.cashIntelligenceRuntime.continuityRisk.projectedRunwayMonths = 2; // Critical runway

    const output = InstitutionalSurvivalHierarchyEngine.evaluate(input);

    assert.equal(output.activeSurvivalMode, 'SURVIVAL_MODE');
    assert.ok(output.forbiddenInstitutionalPriorities.includes('EXPANSION'));
    
    // Test constraint propagation
    const isExpansionBlocked = SurvivalConstraintPropagationEngine.isActionBlocked('EXPANSION', output);
    assert.equal(isExpansionBlocked, true);
  });

  it('[Rule 3] Estresse severo de tesouraria bloqueia dividendos', () => {
    const input = getHealthyInput();
    input.treasuryRuntime.severity = 'TREASURY_RUPTURE_RISK'; // Severe treasury stress

    const output = InstitutionalSurvivalHierarchyEngine.evaluate(input);

    assert.equal(output.activeSurvivalMode, 'SURVIVAL_MODE');
    assert.ok(output.forbiddenInstitutionalPriorities.includes('DIVIDEND'));

    const isDividendBlocked = SurvivalConstraintPropagationEngine.isActionBlocked('DIVIDEND', output);
    assert.equal(isDividendBlocked, true);
  });

  it('[Rule 4] Erosão do PL bloqueia otimização distributiva societária', () => {
    const input = getHealthyInput();
    input.fiduciaryOutput.patrimonialIntegrityStatus = 'SEVERELY_ERODED'; // PL erosion

    const output = InstitutionalSurvivalHierarchyEngine.evaluate(input);

    assert.equal(output.activeSurvivalMode, 'SURVIVAL_MODE');
    assert.ok(output.forbiddenInstitutionalPriorities.includes('SHAREHOLDER_RETURN'));

    const isReturnBlocked = SurvivalConstraintPropagationEngine.isActionBlocked('SHAREHOLDER_RETURN', output);
    assert.equal(isReturnBlocked, true);
  });

  it('[Rule 5] Choque de Capex sob estresse de runway invalida a simulação (INVALID_SURVIVAL_CONFLICT)', async () => {
    const baseSnapshot: any = {
      groupId: 'test-group-id',
      entities: [{ id: 'entity-1', name: 'Entity 1', role: 'PARENT', ownershipPercentage: 100, consolidationMethod: 'FULL' }],
      dreByEntity: {
        'entity-1': [
          { accountId: '3.1', category: 'receita liquida', value: 100000 },
          { accountId: '3.2', category: 'lucro liquido', value: -10000 }
        ]
      },
      bpByEntity: {
        'entity-1': [
          { accountId: '2.1', category: 'patrimonio liquido', value: 100000 }
        ]
      },
      confidenceByEntity: {},
      topologySnapshot: { nodes: [], edges: [] }
    };

    const simulationInput = {
      baseSnapshot,
      shocks: [
        { type: 'REVENUE_DROP' as any, targetEntityId: 'GROUP_LEVEL', magnitude: 0.1, description: 'Aggressive Capex Expansion' }
      ],
      horizonMonths: 6,
      isSurvivalMode: true
    };

    const result = await ScenarioSimulationEngine.runSimulation(simulationInput, 'HIGH');
    assert.equal(result.scenarioValidity, 'INVALID_SURVIVAL_CONFLICT');
    assert.equal(result.projectedConfidence, 'LOW');
  });

  it('[Rule 6] Ausência de insumos ou baixa confiança ativa o fail-closed global no ISHE', () => {
    const input = getHealthyInput();
    delete input.fiduciaryOutput; // Missing required input

    const output = InstitutionalSurvivalHierarchyEngine.evaluate(input);

    assert.equal(output.activeSurvivalMode, 'SURVIVAL_MODE');
    assert.equal(output.currentHierarchyLevel, 1);
    assert.equal(output.failClosedTriggered, true);
    assert.equal(output.confidenceLevel, 'LOW');
  });

  it('[Rule 7] Fragilidade longitudinal recorrente degrada a confiança de recuperação institucional', () => {
    const input = getHealthyInput();
    
    // Set parameters that indicate multi-cycle historical erosion and fatigue
    input.historicalCycles = [
      { netIncome: -10000, startingEquity: 500000, endingEquity: 450000 },
      { netIncome: -20000, startingEquity: 450000, endingEquity: 400000 }
    ];
    input.memoryProfile = {
      fatigueScore: 45,
      persistentStructuralFragility: true
    };
    input.fiduciaryOutput.retentionClassification = 'FORCED_RETENTION';
    input.fiduciaryOutput.confidenceLevel = 'HIGH';

    const output = InstitutionalSurvivalHierarchyEngine.evaluate(input);

    assert.equal(output.confidenceLevel, 'LOW'); // Degraded confidence due to historical cycle fatigue
    assert.equal(output.failClosedTriggered, true); // LOW confidence triggers automatic fail-closed
  });

  it('[Rule 8] A Action Matrix prioriza ações de contenção de custos e proteção fiduciária', () => {
    const actions = [
      'Executar plano de expansão de vendas',
      'Distribuir dividendos aos sócios',
      'Reduzir custos e despesas gerais',
      'Contratação de novos gerentes'
    ];

    const survivalReport = {
      activeSurvivalMode: 'SURVIVAL_MODE' as const,
      currentHierarchyLevel: 1
    };

    const healthyInput = getHealthyInput();

    const matrix = ExecutiveActionMatrixEngine.buildMatrix(
      actions,
      { hasData: true },
      { patrimonioLiquido: 100000 },
      {},
      'CRÍTICO',
      'GENERIC_OPERATION',
      healthyInput.fiduciaryOutput,
      survivalReport
    );

    // Expansion & distribution should be expunged. Costs reduction remains.
    // Survival priorities should be prepended.
    assert.ok(matrix.length > 0);
    assert.ok(matrix.some(item => item.title.includes('CASH_PRESERVATION')));
    assert.ok(matrix.some(item => item.title.includes('COST_CONTAINMENT')));
    
    // The growth / expansion and distribution tasks must not exist in output
    const titles = matrix.map(m => m.title.toLowerCase());
    assert.equal(titles.some(t => t.includes('expansão de vendas')), false);
    assert.equal(titles.some(t => t.includes('distribuir dividendos')), false);
  });

  it('[Rule 9] O motor de narrativas higieniza e substitui termos otimistas', () => {
    const text = 'A empresa demonstrou forte crescimento e obteve uma expansão saudável com resultado estruturalmente saudável.';
    const sanitized = SurvivalConstraintPropagationEngine.sanitizeNarrative(text, true);

    assert.ok(!sanitized.includes('forte crescimento'));
    assert.ok(!sanitized.includes('expansão saudável'));
    assert.ok(!sanitized.includes('estruturalmente saudável'));
    assert.ok(sanitized.includes('preservação operacional'));
    assert.ok(sanitized.includes('foco restrito em sobrevivência'));
  });

  it('[Rule 10] O motor de tesouraria escala a prioridade e restrições compulsórias para CRITICAL', () => {
    const allocations = [
      { id: '1', category: 'Folha', amount: 50000, priority: 1 as const },
      { id: '2', category: 'CAPEX Expansão', amount: 30000, priority: 8 as const },
      { id: '3', category: 'Dividendos', amount: 20000, priority: 9 as const }
    ];

    const result = TreasuryPriorityMatrixEngine.evaluate({
      isSurvivabilityDegraded: false,
      isRunwayCritical: false,
      isFalseStability: false,
      hasPredictiveRupture: false,
      allocations,
      isSurvivalMode: true
    });

    assert.equal(result.activeCascadeBlock, true);
    assert.ok(result.restrictedLayers.includes('Capital Distribution'));
    assert.ok(result.restrictedLayers.includes('Controlled Expansion'));

    const allocation1 = result.priorities.find(p => p.id === '1');
    const allocation2 = result.priorities.find(p => p.id === '2');
    const allocation3 = result.priorities.find(p => p.id === '3');

    assert.equal(allocation1?.status, 'APPROVED'); // Priority 1 is allowed
    assert.equal(allocation2?.status, 'FROZEN');   // Priority 8 is frozen
    assert.equal(allocation3?.status, 'FROZEN');   // Priority 9 is frozen
  });
});
