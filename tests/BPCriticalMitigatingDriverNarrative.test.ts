import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ExecutiveNarrativeBuilder, ExecutiveNarrativeContext } from '../src/core/runtime/executive-consolidation/ExecutiveNarrativeBuilder';

describe('BPCriticalMitigatingDriverNarrative - v3.2 Hotfix', () => {
  it('Should use prudential language for mitigating drivers in CRITICAL scenarios', () => {
    const context: ExecutiveNarrativeContext = {
      module: 'BP',
      institutionalState: 'CRITICAL',
      severity: 'CRITICAL',
      strategicStage: 'stabilization',
      dominantDriver: {
        id: 'LIQUIDITY_REAL' as any,
        shortLabel: 'Liquidez',
        narratives: {
          critical: 'esgotamento agudo das reservas de caixa',
          warning: '',
          healthy: ''
        },
        strategicPriority: {
          critical: '', warning: '', healthy: ''
        },
        priorityRecommendation: {
          critical: '', warning: '', healthy: ''
        }
      } as any,
      mitigatingDriver: {
        id: 'FINANCIAL_AUTONOMY' as any,
        shortLabel: 'Autonomia',
        narratives: {
          critical: '',
          warning: '',
          healthy: 'estrutura de capital altamente independente e sólida'
        },
        strategicPriority: {
          critical: '', warning: '', healthy: ''
        },
        priorityRecommendation: {
          critical: '', warning: '', healthy: ''
        }
      } as any
    };

    const text = ExecutiveNarrativeBuilder.buildSituacaoAtual(context);

    // 1. A narrativa deve conter "alguma margem de absorção" ou "parcialmente preservada".
    assert.ok(
      text.includes('alguma margem de absorção') || text.includes('parcialmente preservada'),
      'Deve conter linguagem prudencial para o mitigating driver'
    );

    // 2. Não pode conter linguagem excessivamente positiva do mitigating driver original
    assert.ok(!text.includes('altamente independente'), 'Não deve vazar linguagem altamente positiva');
    assert.ok(!text.includes('sólida'), 'Não deve vazar linguagem de solidez');
    assert.ok(!text.includes('robusta'), 'Não deve vazar narrativa robusta');
    assert.ok(!text.includes('excelente'), 'Não deve vazar excelência');

    // 3. O driver dominante ainda deve ser o foco
    assert.ok(text.includes('esgotamento agudo das reservas de caixa'), 'O driver dominante deve estar presente');
    assert.ok(text.includes('fragilidade dominante de liquidez'), 'Deve referenciar o dominant driver');
  });
});
