import test from 'node:test';
import assert from 'node:assert';
import { generateExecutiveAdvisory, AdvisoryInput } from '../src/lib/executive-advisory-engine.js';
import { MasterCausalOutput } from '../src/lib/master-causal-engine.js';
import { OperationalIntelligenceReport } from '../src/lib/operational-intelligence-engine.js';
import { CashFlowIntelligenceReport } from '../src/lib/cash-flow-intelligence-engine.js';

function createMockInput(overrides: Partial<AdvisoryInput> = {}): AdvisoryInput {
  const defaultCausal: MasterCausalOutput = {
    scenarios: [],
    blockedNarratives: [],
    behavioralInsights: {
      liquidezQualitativa: '',
      dinamicaDeCaixa: '',
      sustentabilidadeOperacional: ''
    }
  };

  const defaultOperational: OperationalIntelligenceReport = {
    ebitdaQuality: {
      score: 1, confidence: 'Alta', classification: 'EBITDA_SAUDAVEL',
      causalFlags: [], advisoryNotes: [], blockedFalsePositives: [], riskPropagationSignals: []
    },
    elasticity: { score: 1, confidence: 'Alta', classification: 'Alta', causalFlags: [], advisoryNotes: [], blockedFalsePositives: [], riskPropagationSignals: [] },
    cashConversion: { score: 1, confidence: 'Alta', classification: 'Alta', causalFlags: [], advisoryNotes: [], blockedFalsePositives: [], riskPropagationSignals: [] },
    growthDestroyingCash: null,
    revenueWithoutMargin: null,
    artificialEbitda: null,
    hospitalPressure: null,
    seasonality: null
  };

  const defaultCashFlow: CashFlowIntelligenceReport = {
    cashQuality: { classification: 'CAIXA_OPERACIONAL_SAUDAVEL', confidence: 'Alta', causalFlags: [], advisoryNotes: [], blockedFalsePositives: [] },
    runway: { classification: 'RUNWAY_SAUDAVEL', confidence: 'Alta', causalFlags: [], advisoryNotes: [], blockedFalsePositives: [] },
    financialDependency: { classification: 'baixa', confidence: 'Alta', causalFlags: [], advisoryNotes: [], blockedFalsePositives: [] },
    treasuryPressure: { classification: 'baixa', confidence: 'Alta', causalFlags: [], advisoryNotes: [], blockedFalsePositives: [] },
    riskPropagationSignals: []
  };

  return {
    causal: overrides.causal || defaultCausal,
    operational: overrides.operational || defaultOperational,
    cashFlow: overrides.cashFlow || defaultCashFlow
  };
}

test('EXECUTIVE ADVISORY ENGINE', async (t) => {

  await t.test('Harmonia Total (BP Saudável + DRE Saudável + Runway Saudável)', () => {
    const input = createMockInput();
    const result = generateExecutiveAdvisory(input);

    assert.ok(result.executivePosture === 'Expansiva e Estratégica');
    assert.ok(result.narrativeModeration.includes('Verificado: Alinhamento institucional perfeito. Otimismo seguro.'));
    assert.strictEqual(result.recommendedBoardDecision, 'Aprovar liberação de capital para expansão disciplinada e investimentos em crescimento com caixa livre orgânico.');
  });

  await t.test('Falso Positivo de EBITDA (EBITDA Saudável + Runway Crítico)', () => {
    const input = createMockInput();
    input.cashFlow.runway.classification = 'RUNWAY_CRITICO';
    
    const result = generateExecutiveAdvisory(input);

    assert.ok(result.executivePosture === 'Conservadora com Foco em Tesouraria');
    assert.ok(result.blockedFalsePositives.includes('Falso Positivo de Sucesso Operacional (Runway Oculto)'));
    assert.ok(result.causalConflicts.includes('EBITDA x RUNWAY'));
  });

  await t.test('Falso Positivo de Crescimento (Crescimento Consumindo Caixa Destrutivo)', () => {
    const input = createMockInput();
    input.cashFlow.cashQuality.classification = 'CAIXA_DESTRUTIVO';
    
    const result = generateExecutiveAdvisory(input);

    assert.ok(result.executivePosture === 'Restritiva');
    assert.ok(result.blockedFalsePositives.includes('Falso Positivo de Crescimento Saudável'));
    assert.strictEqual(result.recommendedBoardDecision, 'Interromper ou desacelerar o vetor de crescimento até que a eficiência de capital seja reestabelecida.');
  });

  await t.test('Falso Positivo de Caixa Elevado (Funding Artificial)', () => {
    const input = createMockInput();
    input.cashFlow.cashQuality.classification = 'CAIXA_ARTIFICIAL';
    input.cashFlow.financialDependency.classification = 'crítica';
    
    const result = generateExecutiveAdvisory(input);

    assert.ok(result.executivePosture === 'Defensiva e Reestruturante');
    assert.ok(result.blockedFalsePositives.includes('Falso Positivo de Caixa Elevado/Liquidez Saudável'));
    assert.ok(result.dominantRisks.includes('Funding Artificial'));
  });

  await t.test('Corrosão Patrimonial mascarada com PL Positivo', () => {
    const input = createMockInput();
    // Simulate Corrosao Patrimonial scenario inside causal
    input.causal.scenarios = [
      { id: 'CORROSAO_PATRIMONIAL', name: 'Corrosão', description: '', severity: 'Alta', isActive: true }
    ];
    
    const result = generateExecutiveAdvisory(input);

    assert.ok(result.executivePosture === 'Vigilante e Corretiva');
    assert.ok(result.blockedFalsePositives.includes('Falso Positivo de Estabilidade Patrimonial (PL Positivo)'));
  });

});
