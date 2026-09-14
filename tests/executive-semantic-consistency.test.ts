import { describe, it } from 'node:test';
import assert from 'node:assert';
import { TechnicalLayerBuilder } from '../src/workspace/runtime/executive-consolidation/builders/TechnicalLayerBuilder';
import { BalanceSheetExecutiveFacts } from '../src/workspace/runtime/executive-consolidation/BalanceSheetExecutiveFactsBuilder';
import { BalanceSheetExecutiveViewModelBuilder } from '../src/workspace/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

describe('Executive Semantic Consistency', () => {
  const dummyResolveLabel = (key: string) => key;

  it('Should override indicators with Decision Panel status if present', () => {
    const panels = {
      liquidity: { statusLabel: 'Liquidez Excedente', statusBadgeVariant: 'success' },
      capitalStructure: { statusLabel: 'Estrutura Patrimonial Muito Sólida', statusBadgeVariant: 'success' }
    };

    const indicators = [
      { metricName: 'Liquidez Corrente', value: 3.5 },
      { metricName: 'Autonomia Financeira', value: 0.8 }
    ];

    const facts = { totalAssets: 1000, currentLiabilities: 100 } as BalanceSheetExecutiveFacts;

    const families = TechnicalLayerBuilder.build(indicators, dummyResolveLabel, panels, facts, 'EXCESS_LIQUIDITY_OPTIMIZATION');

    const liqFamily = families.find(f => f.familyName === 'Liquidez');
    const strucFamily = families.find(f => f.familyName === 'Estrutura de Capital');
    
    assert.strictEqual(liqFamily.indicators.find((i: any) => i.label === 'Liquidez Corrente').classificationLabel, 'Liquidez Excedente');
    assert.strictEqual(strucFamily.indicators.find((i: any) => i.label === 'Autonomia Financeira').classificationLabel, 'Estrutura Patrimonial Muito Sólida');
  });

  it('Should strictly map INSUFFICIENT_DATA to semantic null equivalent and fallback to facts if missing', () => {
    // Endividamento Geral and Dívida Financeira are omitted from indicators. 
    const indicators: any[] = [];
    const facts = { debtRatio: 0.50 } as BalanceSheetExecutiveFacts; // debtRatio provided

    const families = TechnicalLayerBuilder.build(indicators, dummyResolveLabel, {}, facts);

    const structFamily = families.find(f => f.familyName === 'Estrutura de Capital');
    
    // Fallback to facts
    assert.strictEqual(structFamily.indicators.find((i: any) => i.label === 'Endividamento Geral').value, '50,0%');
    
    // Explicit omission / no proxy
    assert.strictEqual(structFamily.indicators.find((i: any) => i.label === 'Dívida Financeira sobre Patrimônio Líquido').classificationLabel, 'Não aplicável ao cenário atual');
  });

  it('Anti-Enum Leak: should not leak HIGH, MEDIUM, LOW, CRITICAL in the full view model', () => {
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
    const vmStr = JSON.stringify(vm);

    assert.ok(!/\bHIGH\b/.test(vmStr), 'Leaked HIGH');
    assert.ok(!/\bMEDIUM\b/.test(vmStr), 'Leaked MEDIUM');
    assert.ok(!/\bLOW\b/.test(vmStr), 'Leaked LOW');
    assert.ok(!/\bHEALTHY\b/.test(vmStr), 'Leaked HEALTHY');
    assert.ok(!/\bNEUTRAL\b/.test(vmStr), 'Leaked NEUTRAL');
    assert.ok(!/\bWARNING\b/.test(vmStr), 'Leaked WARNING');
  });
  
  it('Should guarantee all 4 minimum families are present regardless of indicator data', () => {
    const rawReport = {
      patrimonialIntelligenceReport: { assessments: {}, indicators: [] },
      rawFinancialData: {
        financialIndicators: [],
        bpSummary: {}
      },
      context: { analysisYear: 2022 }
    };

    const vm = BalanceSheetExecutiveViewModelBuilder.build(rawReport);
    const families = vm.technicalLayer.families;

    assert.ok(families.find(f => f.familyName === 'Liquidez'));
    assert.ok(families.find(f => f.familyName === 'Capital de Giro'));
    assert.ok(families.find(f => f.familyName === 'Estrutura de Capital'));
    assert.ok(families.find(f => f.familyName === 'Imobilização / Qualidade Estrutural'));
    
    // Check that purposes are not generic
    const anyGenericPurpose = families.flatMap(f => f.indicators).some(i => i.purpose === 'Avaliação derivada da posição financeira estrutural consolidada.');
    assert.strictEqual(anyGenericPurpose, false, 'Leaked generic purpose');
  });

  it('Should not duplicate labels in technical layer', () => {
    const indicators = [
      { metricName: 'Liquidez Corrente', value: 3.5 },
      { metricName: 'Liquidez Corrente', value: 3.5 }, // Intentional duplicate
      { metricName: 'Relação Dívida / Patrimônio Líquido', value: 0.8 },
      { metricName: 'Relação Dívida / Patrimônio Líquido', value: 0.8 } // Intentional duplicate
    ];
    
    const families = TechnicalLayerBuilder.build(indicators, dummyResolveLabel, {}, {} as any);
    const allIndicators = families.flatMap(f => f.indicators);
    const labels = allIndicators.map(i => i.label);
    const uniqueLabels = new Set(labels);

    assert.strictEqual(labels.length, uniqueLabels.size, 'Duplicate labels found in technical layer');
    assert.strictEqual(labels.length, 16, 'Should strictly render 16 canonical indicators');
  });

  it('Anti-Enum Leak: should not leak "Saudável", "Neutro", "Excelente" in technical layer', () => {
    const indicators = [
      { metricName: 'Liquidez Corrente', value: 3.5, classification: 'Saudável' },
      { metricName: 'Autonomia Financeira', value: 0.8, classification: 'Excelente' },
      { metricName: 'Capital de Giro Líquido', value: 100, classification: 'Neutro' }
    ];
    
    const families = TechnicalLayerBuilder.build(indicators, dummyResolveLabel, {}, {} as any);
    const vmStr = JSON.stringify(families);

    // If decision panels are missing, the builder might use raw classification if not careful.
    // However, it should be mapped properly or dropped.
    // Actually, if decision panels are absent, the canonical registry does not block the string 'Saudável' explicitly if passed directly as classification,
    // but the builder replaces it if it's INSUFFICIENT_DATA or decisionPanels are present.
    // Let's assert they are not leaked.
    // Wait, the instruction says: "Saudável", "Neutro", "Excelente" não podem reaparecer por herança bruta.
    
    // If decisionPanels are provided but empty, or missing, it should not leak.
    const forbidden = ['Saudável', 'Neutro', 'Excelente'];
    for (const word of forbidden) {
       assert.ok(!vmStr.includes(`"${word}"`), `Leaked ${word}`);
    }
  });
});
