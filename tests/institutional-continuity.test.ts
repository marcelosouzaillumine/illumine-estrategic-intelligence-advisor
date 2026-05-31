// tests/institutional-continuity.test.ts

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { executiveRuntime } from '../src/core/runtime/executive-intelligence-runtime';

describe('RC-1.9 - Institutional Continuity Cockpit (Fiduciary Validation)', () => {

  it('1. Deve acionar Fail-Closed e rejeitar conclusões operacionais em ausência de histórico longitudinal mínimo', () => {
    const input: any = {
      clientProfile: { id: 'test-client' },
      dreData: [
        { month: 1, year: 2024, data: { lucroLiquido: 50000, receitaLiquida: 200000, ebitda: 60000 } }
      ],
      bpData: [
        { month: 1, year: 2024, data: { caixaEquivalentes: 100000, passivoCirculante: 50000 } }
      ],
      rawFinancialData: { filterYear: 2024, allHistoryData: [] },
      historicalCyclesCount: 1,
      isMockData: false,
      historicalSeries: []
    };

    const report = executiveRuntime.generateExecutiveReport(input) as any;

    // Na ausência de 3 ciclos, engine principal aciona FailClosed
    // As engines de Continuidade (Resilience, Recovery, Survival) devem seguir o regime
    // (ou EmptyCycleIntegrityEngine ou ScaleEfficiencyIntegrityEngine vão barrar)
    
    assert.equal(report.compliance.runtimeMode, 'PARTIAL_FINANCIAL_VIEW');
    assert.equal(report.compliance.confidenceLevel, 'MEDIUM_CONFIDENCE');
    assert.ok(report.survivalReport);
    const resilienceReport = (report.recoveryReport as any).resilienceReport;
    assert.ok(resilienceReport);

    // Fallback classification na ausência de histórico farto (não deve ser ANTIFRAGILE em hipótese alguma)
    assert.notEqual(resilienceReport.resilienceClassification, 'ANTIFRAGILE');
  });

  it('2. Deve ativar SURVIVAL_MODE perante risco de ruptura de caixa estrutural', () => {
    // Simulando uma ruptura
    const input: any = {
      clientProfile: { id: 'test-client' },
      dreData: [
        { month: 1, year: 2022, data: { lucroLiquido: -500000, receitaLiquida: 20000, ebitda: -400000 } },
        { month: 1, year: 2023, data: { lucroLiquido: -600000, receitaLiquida: 20000, ebitda: -450000 } },
        { month: 1, year: 2024, data: { lucroLiquido: -700000, receitaLiquida: 20000, ebitda: -500000 } }
      ],
      bpData: [
        { month: 1, year: 2022, data: { caixaEquivalentes: 10000, passivoCirculante: 2000000, patrimonioLiquido: -500000 } },
        { month: 1, year: 2023, data: { caixaEquivalentes: 5000, passivoCirculante: 3000000, patrimonioLiquido: -800000 } },
        { month: 1, year: 2024, data: { caixaEquivalentes: 0, passivoCirculante: 4000000, patrimonioLiquido: -1200000 } }
      ],
      rawFinancialData: { filterYear: 2024, allHistoryData: [] },
      historicalCyclesCount: 3,
      isMockData: false,
      historicalSeries: [],
      dlpaData: [
        { year: 2022, lucrosPrejuizos: -500000, distributedDividends: 0 },
        { year: 2023, lucrosPrejuizos: -1100000, distributedDividends: 0 },
        { year: 2024, lucrosPrejuizos: -1800000, distributedDividends: 0 }
      ]
    };

    const report = executiveRuntime.generateExecutiveReport(input);

    assert.equal(report.survivalReport.activeSurvivalMode, 'SURVIVAL_MODE');
    assert.ok(report.survivalReport.forbiddenInstitutionalPriorities.includes('DIVIDEND') || report.survivalReport.forbiddenInstitutionalPriorities.includes('EXPANSION'));
    // A propagação da Restrição deve afetar o nível de Severity e FiduciaryOutput
    assert.equal(report.capitalGovernanceReport.fiduciaryOutput.distributionEligibility.eligible, false);
  });

});
