import { describe, it } from 'node:test';
import assert from 'node:assert';
import { LegacyDFCAdapter } from '../../runtime/adapters/LegacyDFCAdapter';
import { FiduciaryCashIntelligenceRuntime } from '../../capabilities/financial/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime';

describe('DFC Reconciliation Contract', () => {
  it('Deve emitir DFC_RECONCILIATION_MISMATCH no LegacyDFCAdapter se o Caixa Final estimado divergir do Caixa Final real do BP', async () => {
    const context: any = {
      input: {
        rawFinancialData: {
          filterYear: 2025,
          allHistoryData: [
            { year: 2025, docType: 'dre', conta: 'Lucro Líquido', val: 50000 },
            { year: 2025, docType: 'bp', entryType: 'ativo', category: 'Caixa e Equivalentes', val: 800000 }, // Caixa muito maior que a geração teórica
            { year: 2025, docType: 'bp', entryType: 'ativo', category: 'Ativo Total', val: 1000000 }, // Para o gap ser relevante
            { year: 2024, docType: 'bp', entryType: 'ativo', category: 'Caixa e Equivalentes', val: 100000 }
          ]
        }
      }
    };

    const result = await LegacyDFCAdapter.execute(context);
    const violations = result.violations || [];
    
    const mismatchViolation = violations.find(v => v.rule === 'DFC_RECONCILIATION_MISMATCH');
    assert.ok(mismatchViolation, 'Deve emitir DFC_RECONCILIATION_MISMATCH quando a soma do fluxo de caixa difere da variação patrimonial do disponível');
  });

  it('Deve bloquear a avaliação no FiduciaryCashGovernanceRuntime via FAIL_CLOSED se a reconciliação for inconciliável', () => {
    const result = FiduciaryCashIntelligenceRuntime.evaluate(
      [], // dfcData
      100000, // dreNetIncome
      200000, // dreEbitda
      10000, // bpCashEquivalentsStart
      900000, // bpCashEquivalentsEnd (Diferença absurda de 890k)
      50000, // fco
      10000, // fci
      10000, // fcf
      0, 0, 0, 900000, 0, 0, 2, 12, 0, 50000, 0, 500000
    );

    assert.strictEqual(result.reconciliationAlerts.reconciliationStatus, 'CASH_RECONCILIATION_FAIL_CLOSED');
    assert.strictEqual(result.liquidityClassification.classification, 'CONTINUITY_RISK');
    assert.ok(result.blockedConclusions.includes('HEALTHY_LIQUIDITY'));
  });
});
