import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BalanceSheetExecutiveNarrativeEngine } from '../src/core/runtime/governance/bp/BalanceSheetExecutiveNarrativeEngine';
import { BalanceSheetGovernanceOutputValidator } from '../src/core/runtime/governance/bp/BalanceSheetGovernanceOutputValidator';

describe('ExecutiveNarrative Golden Test', () => {
  it('should generate narrative for Granatum 2023', () => {
    const mockIndicators = [
      { metricName: 'Liquidez Real', value: 1.5, classification: 'HEALTHY' },
      { metricName: 'Liquidez Instantânea Real', value: 1.2, classification: 'HEALTHY' },
      { metricName: 'Endividamento Geral', value: 0.35, classification: 'HEALTHY' },
      { metricName: 'Dependência de Capital de Terceiros', value: 0.35, classification: 'HEALTHY' },
      { metricName: 'Capital Consumido', value: 0.225, evidence: { capitalConsumedAmount: 22500 } }
    ];
    
    const mockSummary = {
      patrimonioLiquido: 1000000,
      ativoTotal: 2000000,
      caixaEquivalentes: 500000,
      passivoCirculante: 400000
    };
    
    const narrativeObj = BalanceSheetExecutiveNarrativeEngine.generate(mockIndicators, mockSummary, 2023 as any, [] as any) as any;
    const narrative = narrativeObj.text || narrativeObj;
    
    assert.ok(narrative.includes('0,35x') || narrative.includes('35,0%'));
    assert.ok(narrative.includes('22,5%'));
    assert.ok(narrative.includes('Liquidez Real de 1,50'));
  });

  it('should fail validation if narrative is missing', () => {
    const mockOutput = {
      exerciseYear: 2023,
      sourceStatement: 'BALANCE_SHEET',
      indicators: { solvencyStatus: 'HEALTHY' },
      dominantBpRestriction: null,
      primaryRecommendation: { text: 'Ok', source: 'BALANCE_SHEET', rationale: [] },
      validation: { severity: 'INFO', findings: [], consistencyScore: 100 },
      explainability: { origin: 'test', indicatorsUsed: [], weightsApplied: {}, reason: 'test' },
      secondaryAdvisories: []
    };

    const result = BalanceSheetGovernanceOutputValidator.validate(mockOutput as any);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.includes('MISSING_EXECUTIVE_NARRATIVE (BLOCKING)'));
  });
});
