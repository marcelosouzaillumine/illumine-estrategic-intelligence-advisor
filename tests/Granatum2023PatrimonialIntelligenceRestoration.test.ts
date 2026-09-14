import { test } from 'node:test';
import assert from 'node:assert';
import { BalanceSheetAnalyticalContextIntegrityGuard } from '../src/capabilities/runtime/governance/bp/BalanceSheetAnalyticalContextIntegrityGuard';
import { BalanceSheetPatrimonialIntelligenceEngine } from '../src/capabilities/runtime/governance/bp/BalanceSheetPatrimonialIntelligenceEngine';

test('Granatum 2023 Patrimonial Governance Restoration', async (t) => {
  await t.test('analyticalContextIntegrity remains valid when technical data is present', () => {
    const mockSummary = {
      exerciseYear: 2023,
      ativoTotal: 100000,
      passivoTotal: 50000,
      patrimonioLiquido: 50000
    } as any;

    const mockIndicators = [
      { metricName: 'Liquidez Corrente', value: 2, classification: 'Forte', severity: 'HEALTHY', confidence: 100, evidence: null, rationale: '', lineageHash: '123', family: 'Liquidity', format: 'number' },
      { metricName: 'Endividamento Geral', value: 0.5, classification: 'Controlado', severity: 'HEALTHY', confidence: 100, evidence: null, rationale: '', lineageHash: '123', family: 'Solvency', format: 'percent' },
      { metricName: 'Autonomia Financeira', value: 0.5, classification: 'Alta', severity: 'HEALTHY', confidence: 100, evidence: null, rationale: '', lineageHash: '123', family: 'Solvency', format: 'percent' },
      { metricName: 'Loss Absorption Capacity', value: 60, classification: 'Excelente', severity: 'HEALTHY', confidence: 100, evidence: null, rationale: '', lineageHash: '123', family: 'Preservation', format: 'percent' }
    ] as any;

    const patrimonialIntelligence = BalanceSheetPatrimonialIntelligenceEngine.generate(mockSummary, mockIndicators);
    
    // Validar se Inteligência Patrimonial aparece (gerada corretamente)
    assert.strictEqual(patrimonialIntelligence.solvencyReading.includes('Estrutura passiva confortável'), true);
    assert.strictEqual(patrimonialIntelligence.liquidityReading.includes('Alta disponibilidade'), true);
    assert.strictEqual(patrimonialIntelligence.capitalStructureReading.includes('suportada majoritariamente por capital próprio'), true);

    const rawAnalyticalContext = {
      clientContext: {
        clientName: 'Granatum',
        segment: 'Tecnologia',
        businessStage: 'Scale-up',
        operatingProfile: 'Asset-Light',
        companySize: 'Enterprise',
        assumptions: []
      },
      patrimonialIntelligence,
      isAvailable: true,
      missingFields: []
    };

    const integrityGuard = BalanceSheetAnalyticalContextIntegrityGuard.validate(rawAnalyticalContext);
    
    // analyticalContextIntegrity não é invalidado
    assert.strictEqual(integrityGuard.isValid, true);
  });

  await t.test('analyticalContextIntegrity is false when context is missing', () => {
    const integrityGuard = BalanceSheetAnalyticalContextIntegrityGuard.validate(undefined);
    assert.strictEqual(integrityGuard.isValid, false);
    assert.deepStrictEqual(integrityGuard.violations, ['MISSING_ANALYTICAL_CONTEXT']);
  });
});
