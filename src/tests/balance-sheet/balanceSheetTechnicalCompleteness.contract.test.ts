import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetExecutiveFactsBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveFactsBuilder';

describe('BalanceSheetTechnicalCompleteness Contract', () => {
  it('should derive liquidityReal and equityQuality when primary indicators are missing but accounting data exists', () => {
    const mockReport = {
      rawFinancialData: {
        bpSummary: {
          ativoCirculante: 100000,
          passivoCirculante: 50000,
          estoques: 20000,
          patrimonioLiquido: 500000,
          lucrosPrejuizosAcumulados: 100000,
          capitalSocial: 300000 // > 5% of PL
        }
      }
    };

    const facts = BalanceSheetExecutiveFactsBuilder.build(mockReport);
    
    // (100000 - 20000) / 50000 = 1.6
    assert.ok(facts.liquidezReal !== undefined);
    assert.strictEqual(Math.round(facts.liquidezReal * 10) / 10, 1.6);
    
    // 100000 / 500000 = 0.2
    assert.ok(facts.qualidadePatrimonioLiquido !== undefined);
    assert.strictEqual(Math.round((facts.qualidadePatrimonioLiquido as number) * 10) / 10, 0.2);
  });

  it('should flag equityQuality as LIMITED_EVIDENCE when capitalSocial is anomalous', () => {
    const mockReport = {
      rawFinancialData: {
        bpSummary: {
          ativoCirculante: 100000,
          passivoCirculante: 50000,
          estoques: 20000,
          patrimonioLiquido: 500000,
          lucrosPrejuizosAcumulados: 100000,
          capitalSocial: 1 // capital anômalo
        }
      }
    };

    const facts = BalanceSheetExecutiveFactsBuilder.build(mockReport);
    
    assert.strictEqual(facts.qualidadePatrimonioLiquido, 'LIMITED_EVIDENCE');
  });

  it('should not throw or fail when accounting data is completely missing', () => {
    const facts = BalanceSheetExecutiveFactsBuilder.build({});
    assert.strictEqual(facts.liquidezReal, undefined);
    assert.strictEqual(facts.qualidadePatrimonioLiquido, undefined);
  });
});
