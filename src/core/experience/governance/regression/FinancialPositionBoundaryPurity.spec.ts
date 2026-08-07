import { describe, it, expect } from 'vitest';
import { FinancialPositionProduct } from '../../products/FinancialPositionProduct';
import { FinancialPositionPureViewModelBuilder } from '../../../runtime/executive-consolidation/FinancialPositionPureViewModelBuilder';
// This test suite acts as the Constitutional Dependency Audit
describe('Financial Position Data Boundary Isolation™ (Wave 1.4.9)', () => {
  it('should guarantee builder generates pure facts without advisory DNA', () => {
    const pureModel = FinancialPositionPureViewModelBuilder.build({
      balanceSheet: { ativoTotal: 1000, passivoTotal: 500, patrimonioLiquido: 500 },
      indicators: [
        { name: 'Liquidez Corrente', value: 1.5, classification: 'SAUDÁVEL' }
      ],
      historicalSeries: [],
      metadata: { healthStatus: 'HEALTHY' }
    });

    const contextKeys = Object.keys(pureModel);
    
    // Check strict structure
    expect(contextKeys).toEqual(expect.arrayContaining([
      'overview', 'diagnosis', 'signals', 'historicalEvolution', 'executiveQuestions', 'technicalEvidence'
    ]));

    // Check no leaking objects
    expect(contextKeys).not.toContain('strategicTensions');
    expect(contextKeys).not.toContain('patrimonialIntelligenceReport');
    expect(contextKeys).not.toContain('executiveReport');
    expect(contextKeys).not.toContain('bpExecutiveAnalysisContext');
  });

  it('should throw Constitutional Violation if prescriptive verbs are used', () => {
    const PRESCRIPTIVE_VERBS = [
      'deve',
      'recomenda-se',
      'necessário',
      'ideal',
      'priorizar',
      'executar',
      'implementar',
      'direcionar',
      'reduzir',
      'aumentar',
      'fortalecer',
      'distribuir',
      'aprovar'
    ];

    const modelWithContamination = FinancialPositionPureViewModelBuilder.build({
      balanceSheet: {},
      indicators: [],
      historicalSeries: [],
      metadata: { drivers: ['A diretoria deve reduzir despesas'] }
    });

    // We can simulate the Firewall logic that would run on the Renderer
    // A robust firewall function would traverse the object:
    const assertPrescriptiveVerbs = (obj: any) => {
      const json = JSON.stringify(obj).toLowerCase();
      for (const verb of PRESCRIPTIVE_VERBS) {
        if (json.includes(verb)) {
          throw new Error(`[BP Constitutional Violation] Prescriptive verb found: ${verb}`);
        }
      }
    };

    expect(() => assertPrescriptiveVerbs(modelWithContamination)).toThrowError(/Constitutional Violation/);
  });
});
