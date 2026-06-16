import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CapitalStructureExecutiveAssessmentEngine } from '../src/core/runtime/executive-consolidation/CapitalStructureExecutiveAssessmentEngine';
import { WorkingCapitalExecutiveAssessmentEngine } from '../src/core/runtime/executive-consolidation/WorkingCapitalExecutiveAssessmentEngine';
import { StrategicOpinionConsistencyEngine } from '../src/core/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';

describe('BPFinalExecutiveConsistencyHotfix - End-to-End Alignment', () => {
  it('Should not contradict low leverage with alavancagem elevada', () => {
    const indicators = [
      { metricName: 'Autonomia Financeira', value: 80 },
      { metricName: 'Endividamento Geral', value: 10 },
      { metricName: 'Dependência de Capital de Terceiros', value: 0.1 }
    ];
    const bpSummary = { passivoTotal: 1000, passivoCirculante: 100 };
    
    const result = CapitalStructureExecutiveAssessmentEngine.assess(indicators, bpSummary);
    assert.ok(
      !result.executiveNarrative.toLowerCase().includes('alavancagem elevada'), 
      'Zero Contradiction: No high leverage narrative when leverage is low'
    );
  });

  it('Should not contradict critical liquidity with tesouraria folgada', () => {
    const indicators = [
      { metricName: 'Liquidez Corrente', value: 0.5 },
      { metricName: 'Liquidez Seca', value: 0.3 },
      { metricName: 'Liquidez Imediata', value: 0.1 }
    ];
    const bpSummary = { ativoCirculante: 500, passivoCirculante: 1000, caixaEquivalentes: 50 };
    
    const result = WorkingCapitalExecutiveAssessmentEngine.assess(indicators, bpSummary);
    assert.ok(
      !result.executiveNarrative.toLowerCase().includes('tesouraria folgada'), 
      'Zero Contradiction: No folgada narrative when liquidity is critical'
    );
  });

  it('Should not show optimistic outlook for critical diagnosis', () => {
    const context: any = {
      analysisYear: 2022,
      generatedAt: '2026-01-01',
      moduleContext: 'BP',
      fiduciaryClassification: 'CRÍTICO',
      mathematicalClassification: 'CRITICAL',
      globalScore: 20,
      activeFiduciaryRestrictions: [],
      primaryIndicators: {},
      technicalDrivers: {
        liquidezReal: 0.3,
        liquidezSeca: 0.2,
        liquidezInstantaneaReal: 0.1,
        endividamentoGeral: 120,
        autonomiaFinanceira: 10,
        patrimonioLiquido: 500
      },
      contextualAlerts: []
    };

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(context);
    assert.ok(
      !opinion.outlook.toLowerCase().includes('crescimento') && 
      !opinion.outlook.toLowerCase().includes('expansão') &&
      !opinion.outlook.toLowerCase().includes('fortalecimento'),
      'Zero Contradiction: No optimism in critical scenarios'
    );
  });
});
