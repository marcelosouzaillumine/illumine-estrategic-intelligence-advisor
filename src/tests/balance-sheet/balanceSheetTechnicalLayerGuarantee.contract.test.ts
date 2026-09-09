import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

describe('BalanceSheetTechnicalLayerGuarantee v7.13', () => {
  const originalAssert = (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity;
  beforeAll(() => { (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = (vm: any) => vm; });
  afterAll(() => { (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = originalAssert; });


  it('Should generate Technical Layer families even when patrimonialGovernanceReport is entirely missing', () => {
    // Simulando 2023, 2024 ou 2025 onde o relatório avançado não rodou
    // mas temos dados financeiros estruturais na base
    const mockExecutiveReportSemInteligencia = {
      rawFinancialData: {
        financialIndicators: [
          { metricName: 'Liquidez Corrente', value: 1.5 },
          { metricName: 'Endividamento Geral', value: 0.8 }
        ]
      }
      // Sem patrimonialIntelligenceReport
    };

    const vm = BalanceSheetExecutiveViewModelBuilder.build(
      mockExecutiveReportSemInteligencia,
      'safe',
      2025
    );

    const stringified = JSON.stringify(vm.technicalLayer);

    // 1. A trava de que families não pode ser vazio
    assert.ok(vm.technicalLayer?.families, 'technicalLayer.families não deve ser undefined');
    assert.ok(vm.technicalLayer!.families.length > 0, 'technicalLayer.families.length deve ser maior que 0');
    assert.strictEqual(stringified.includes('"families":[]'), false, 'Não deve conter families vazias no output JSON');

    // 2. Trava de famílias canônicas geradas
    const familyNames = vm.technicalLayer!.families.map((f: any) => f.familyName);
    assert.ok(familyNames.includes('Liquidez'), 'Deve conter a família Liquidez');
    assert.ok(familyNames.includes('Estrutura de Capital'), 'Deve conter a família Estrutura de Capital');
  });

});
