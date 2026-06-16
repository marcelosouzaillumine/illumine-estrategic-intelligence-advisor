import { describe, it } from 'node:test';
import assert from 'node:assert';
import { buildDfcNarrative } from '../../lib/dfc-narrative-engine';

describe('DFC Narrative Semantic Isolation Contract', () => {
  it('Não deve vazar terminologia de DRE ou BP (margem, EBITDA, patrimônio) para a narrativa gerada pela DFC', () => {
    const narrativeInput: any = {
      narrativeContext: { 
        institutionalStage: 'SCALING' as any,
        confidenceLevel: 'HIGH',
        organizationalMomentum: 'ACCELERATING',
        governanceReadiness: 'HIGH',
        contextualWarnings: []
      },
      fco: 500000,
      fci: -100000,
      fcf: 50000,
      runwayMonths: 12,
      externalCapitalDependency: 20,
      cashGenerationQuality: 'alta',
      growthFinancingMode: 'fundo próprio'
    };

    const narrative = buildDfcNarrative(narrativeInput);
    assert.ok(narrative, 'Narrativa deve ser gerada');

    const blockedTerms = ['margem', 'ebitda', 'lucro robusto', 'patrimônio', 'autonomia', 'distribuição'];
    
    const narrativeText = [
      narrative.fcoNarrative,
      narrative.fciNarrative,
      narrative.fcfNarrative,
      narrative.runwayNarrative,
      narrative.capitalDependencyNarrative,
      narrative.cashQualityNarrative,
      narrative.financingModeNarrative,
      narrative.fiduciaryDisclaimer
    ].join(' ').toLowerCase();

    blockedTerms.forEach(term => {
      assert.strictEqual(narrativeText.includes(term.toLowerCase()), false, `Termo de vazamento semântico bloqueado: '${term}' encontrado na narrativa da DFC.`);
    });
  });

  it('Deve utilizar estritamente terminologia de caixa', () => {
    const narrativeInput: any = {
      narrativeContext: { 
        institutionalStage: 'STRESSED' as any,
        confidenceLevel: 'LOW',
        organizationalMomentum: 'DECELERATING',
        governanceReadiness: 'LOW',
        contextualWarnings: []
      },
      fco: -100000,
      fci: 0,
      fcf: 200000,
      runwayMonths: 2
    };

    const narrative = buildDfcNarrative(narrativeInput);
    
    // Verifica se os termos chave de caixa estão lá
    assert.ok(narrative?.fcoNarrative.includes('fluxo operacional (FCO)'));
    assert.ok(narrative?.fciNarrative.includes('fluxo de investimentos (FCI)'));
    assert.ok(narrative?.fcfNarrative.includes('fluxo de financiamentos (FCF)'));
    assert.ok(narrative?.runwayNarrative.includes('runway'));
  });
});
