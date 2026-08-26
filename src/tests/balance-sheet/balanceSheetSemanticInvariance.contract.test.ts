import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

describe('BalanceSheetSemanticInvariance v7.15', () => {
  it('Should not contain excess semantics in EXPANSION_WITH_DISCIPLINE scenario (Case 2024)', () => {
    // Simulando fatos de 2024: Liquidez alta, mas com crescimento e NCG
    const rawReport2024 = {
      context: { analysisYear: 2024, stage: 'Expansão' },
      patrimonialIntelligenceReport: {},
      rawFinancialData: {
        financialMetrics: {
          'Liquidez Corrente': 1.8,
          'Liquidez Imediata': 1.6,
          'Autonomia Financeira': 0.75,
          'Variação do Ativo Total': 15,
          'Variação da NCG': 20,
          'Variação do Passivo Circulante': 12,
        },
        bpSummary: {
          ativoTotal: 11500,
          passivoTotal: 2875,
          passivoCirculante: 1500,
          patrimonioLiquido: 8625,
          ativoCirculante: 2700,
          necessidadeCapitalGiro: 500,
          capitalGiroLiquido: 1200,
          ativoNaoCirculante: 8800
        }
      }
    };

    const viewModel = BalanceSheetExecutiveViewModelBuilder.build(rawReport2024, 'safe', 2024, rawReport2024.rawFinancialData.bpSummary, []);

    const stringifiedVM = JSON.stringify(viewModel).toLowerCase();

    // Palavras bloqueadas em cenário de expansão
    const forbiddenTerms = [
      'excesso estrutural de liquidez',
      'capital parado',
      'ocioso',
      'distribuição extraordinária',
      'recompra',
      'excedentes'
    ];

    forbiddenTerms.forEach(term => {
      if (stringifiedVM.includes(term.toLowerCase())) {
        throw new Error(`Semantic Invariance Violation: Found forbidden term "${term}" in EXPANSION_WITH_DISCIPLINE scenario.`);
      }
    });

    // Validar termos esperados
    const expectedTerms = [
      'estratégica',
      'expansão',
      'crescimento',
      'disciplina'
    ];

    let foundExpected = 0;
    expectedTerms.forEach(term => {
      if (stringifiedVM.includes(term.toLowerCase())) {
        foundExpected++;
      }
    });

    if (foundExpected === 0) {
      throw new Error(`Semantic Invariance Violation: Expected terms not found in EXPANSION_WITH_DISCIPLINE scenario.`);
    }
  });

  it('Should classify as EXCESS_LIQUIDITY_OPTIMIZATION in mature, stable scenario (Case 2025)', () => {
    // Simulando fatos de 2025: Liquidez altíssima, estabilizado, sem crescimento (matured)
    const rawReport2025 = {
      context: { analysisYear: 2025, stage: 'Maturidade' },
      patrimonialIntelligenceReport: {},
      rawFinancialData: {
        financialMetrics: {
          'Liquidez Corrente': 3.5,
          'Liquidez Imediata': 2.5,
          'Autonomia Financeira': 0.85,
          'Variação do Ativo Total': 1,
          'Variação da NCG': -5,
          'Variação do Passivo Circulante': 0,
        },
        bpSummary: {
          ativoTotal: 10000,
          passivoTotal: 1500,
          passivoCirculante: 1000,
          patrimonioLiquido: 8500,
          ativoCirculante: 3500,
          necessidadeCapitalGiro: 0,
          capitalGiroLiquido: 2500,
          ativoNaoCirculante: 6500
        }
      }
    };

    const viewModel = BalanceSheetExecutiveViewModelBuilder.build(rawReport2025, 'safe', 2025, rawReport2025.rawFinancialData.bpSummary, []);

    const stringifiedVM = JSON.stringify(viewModel).toLowerCase();

    // Palavras esperadas em cenário de otimização (idle capital)
    const expectedTerms = [
      'excesso estrutural de liquidez',
      'excedentes',
      'otimização'
    ];

    let foundExpected = 0;
    expectedTerms.forEach(term => {
      if (stringifiedVM.includes(term.toLowerCase())) {
        foundExpected++;
      }
    });

    if (foundExpected === 0) {
      throw new Error(`Semantic Invariance Violation: Expected terms not found in EXCESS_LIQUIDITY_OPTIMIZATION scenario.`);
    }
  });
});
