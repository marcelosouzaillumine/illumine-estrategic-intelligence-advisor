import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

describe('BalanceSheetExecutiveViewModelBuilder - Archetype Contracts', () => {

  it('Archetype: CRITICAL_LIQUIDITY_STRESS (e.g. 2022 profile)', () => {
    const rawReport = {
      patrimonialIntelligenceReport: { assessments: {}, indicators: [] },
      rawFinancialData: {
        financialIndicators: [],
        bpSummary: {
          ativoTotal: 1000,
          passivoCirculante: 800,
          passivoTotal: 900,
          patrimonioLiquido: 100,
          caixaEquivalentes: 50,
          ativoCirculante: 400
        }
      },
      context: { analysisYear: 2022 }
    };

    const vm = BalanceSheetExecutiveViewModelBuilder.build(rawReport);
    
    // Checks for STRESS archetype
    assert.strictEqual(vm.decisionPanels.protection?.statusLabel, 'Proteção Comprometida');
    assert.strictEqual(vm.decisionPanels.liquidity?.statusLabel, 'Liquidez Crítica');
    assert.strictEqual(vm.decisionPanels.liquidity?.statusBadgeVariant, 'critical');
    
    // No "Em Avaliação" allowed if data is present
    assert.notStrictEqual(vm.decisionPanels.capitalStructure?.statusLabel, 'Em Avaliação');
    
    // Check executive plan
    assert.ok(vm.planFinanceiro.acao.includes('Suspender saídas não essenciais') || vm.planOperacional.acao.includes('Suspender saídas não essenciais') || vm.planGovernanca.acao.includes('Suspender saídas não essenciais'), 'Missing immediate action');
  });

  it('Archetype: RECOVERY_OR_RECOMPOSITION (e.g. 2023 profile)', () => {
    const rawReport = {
      patrimonialIntelligenceReport: { assessments: {}, indicators: [] },
      rawFinancialData: {
        bpSummary: {
          ativoTotal: 1000,
          passivoCirculante: 300,
          passivoTotal: 600,
          patrimonioLiquido: 400,
          caixaEquivalentes: 350,
          ativoCirculante: 600,
          capitalGiroLiquido: 300
        }
      },
      context: { analysisYear: 2023 }
    };

    const vm = BalanceSheetExecutiveViewModelBuilder.build(rawReport);
    
    // Checks for RECOVERY archetype
    assert.strictEqual(vm.decisionPanels.protection?.statusLabel, 'Proteção Preservada');
    assert.strictEqual(vm.decisionPanels.liquidity?.statusLabel, 'Liquidez Confortável');
  });

  it('Archetype: EXPANSION_WITH_DISCIPLINE (e.g. 2024 profile)', () => {
    const rawReport = {
      patrimonialIntelligenceReport: { assessments: {}, indicators: [] },
      rawFinancialData: {
        bpSummary: {
          ativoTotal: 10000,
          passivoCirculante: 2000,
          passivoTotal: 2500,
          patrimonioLiquido: 7500,
          caixaEquivalentes: 3500,
          ativoCirculante: 6000,
          capitalGiroLiquido: 4000
        }
      },
      context: { analysisYear: 2024 }
    };

    // Need to trigger hasMaterialGrowth: facts.workingCapitalNeed > 0
    // so let's pass a direct indicator
    const vm = BalanceSheetExecutiveViewModelBuilder.build(rawReport, 'safe', 2024, undefined, [
      { metricName: 'Necessidade de Capital de Giro', value: 500, family: 'Capital de Giro' }
    ]);
    
    // Checks for EXPANSION archetype
    assert.ok(vm.decisionPanels.liquidity?.statusLabel.includes('Liquidez'));
    assert.strictEqual(vm.decisionPanels.capitalStructure?.statusLabel, 'Estrutura Muito Sólida');
  });

  it('Archetype: EXCESS_LIQUIDITY_OPTIMIZATION (e.g. 2025 profile)', () => {
    const rawReport = {
      patrimonialIntelligenceReport: { assessments: {}, indicators: [] },
      rawFinancialData: {
        bpSummary: {
          ativoTotal: 1000,
          passivoCirculante: 100,
          passivoTotal: 150,
          patrimonioLiquido: 850,
          caixaEquivalentes: 500,
          ativoCirculante: 800
        }
      },
      context: { analysisYear: 2025 }
    };

    const vm = BalanceSheetExecutiveViewModelBuilder.build(rawReport);
    
    // Checks for OPTIMIZATION archetype
    assert.strictEqual(vm.decisionPanels.protection?.statusLabel, 'Proteção Preservada');
    assert.strictEqual(vm.decisionPanels.liquidity?.statusLabel, 'Liquidez Excedente');
    assert.strictEqual(vm.decisionPanels.capitalEfficiency?.statusLabel, 'Eficiência Monitorada');
  });

  it('Memory completeness & formatting in STRESS archetype', () => {
    const rawReport = {
      patrimonialIntelligenceReport: { assessments: {}, indicators: [] },
      rawFinancialData: {
        financialIndicators: [],
        bpSummary: {
          ativoTotal: 1000,
          passivoCirculante: 800,
          passivoTotal: 900,
          patrimonioLiquido: 100,
          caixaEquivalentes: 50,
          ativoCirculante: 400
        }
      },
      context: { analysisYear: 2022 }
    };

    const vm = BalanceSheetExecutiveViewModelBuilder.build(rawReport, 'safe', 2022, undefined, [
      { metricName: 'Capital de Giro Líquido', value: 21021.98 },
      { metricName: 'Necessidade de Capital de Giro', value: 9157.00 },
      { metricName: 'Saldo de Tesouraria', value: 11864.98 }
    ]);

    const vmStr = JSON.stringify(vm.technicalLayer);
    
    assert.ok(vmStr.includes('R$ 21.022') || vmStr.includes('R$ 21.022') || vmStr.includes('21.021,98'));
    assert.ok(vmStr.includes('R$ 9.157') || vmStr.includes('R$ 9.157') || vmStr.includes('9.157,00'));
    assert.ok(vmStr.includes('R$ 11.865') || vmStr.includes('R$ 11.865') || vmStr.includes('11.864,98'));

    assert.ok(!vmStr.includes('21021.98'));
    assert.ok(!vmStr.includes('9157.00') && !vmStr.includes('9157"'));
    assert.ok(!vmStr.includes('11864.98'));
  });

});
