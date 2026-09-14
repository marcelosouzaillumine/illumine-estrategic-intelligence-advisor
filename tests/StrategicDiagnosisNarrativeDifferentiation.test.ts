import { describe, it } from 'node:test';
import assert from 'node:assert';
import { StrategicOpinionConsistencyEngine } from '../src/workspace/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';

describe('StrategicDiagnosisNarrativeDifferentiation - v3.1 Hotfix', () => {
  it('Should override stage optimism in CRITICAL scenarios', () => {
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
    
    assert.strictEqual(opinion.severityState, 'CRITICAL', 'Severity deve ser CRITICAL');
    assert.ok(
      opinion.outlook.toLowerCase().includes('estabilização') && 
      opinion.outlook.toLowerCase().includes('sobrevivência'),
      'Outlook de CRITICAL deve focar em estabilização e sobrevivência, nunca em otimismo de expansão'
    );
  });
});
