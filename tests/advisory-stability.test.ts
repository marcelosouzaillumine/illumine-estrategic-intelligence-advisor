import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { CalibrationEngine } from '../src/core/runtime/calibration/CalibrationEngine';
import { executiveRuntime } from '../src/core/runtime/executive-intelligence-runtime';
import { StagingValidationEngine } from '../src/capabilities/runtime/integrations/StagingValidationEngine';
import { ImportedDataset } from '../src/capabilities/runtime/integrations/IntegrationGovernanceTypes';
import { NON_SUPPRESSIBLE_WARNINGS } from '../src/core/runtime/calibration/CalibrationTypes';

describe('Phase 9: Advisory Stability & Non-Suppressible Warnings Tests', () => {
  beforeEach(() => {
    CalibrationEngine.resetToDefault();
  });

  const createMockPayload = () => ({
    isMockData: false,
    historicalCyclesCount: 3,
    rawFinancialData: {
      segmentoEmpresa: 'Default',
      prevPl: 800,
      bpSummary: {
        ativoTotal: 1000,
        ativoCirculante: 600,
        passivoCirculante: 600,
        passivoTotal: 600,
        patrimonioLiquido: 400,
        caixaEquivalentes: 20,
        estoques: 300,
      }
    },
    bpData: [
      { accountId: '1', value: 1000 },
      { accountId: '1.1', value: 600 },
      { accountId: '1.1.1', value: 20 },
      { accountId: '1.1.2', value: 300 },
      { accountId: '2', value: 600 },
      { accountId: '2.1', value: 600 },
      { accountId: '3', value: 400 }
    ],
    dreData: [
      { category: 'RECEITA BRUTA', value: 1200 },
      { category: 'DEDUÇÕES', value: -200 },
      { category: 'RECEITA LÍQUIDA', value: 1000 },
      { category: 'CUSTOS VARIÁVEIS', value: -500 },
      { category: 'EBITDA', value: 300 },
      { category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: 50 }
    ],
    cashFlowData: [
      { initialCash: 120, finalCash: 120, operatingFlow: 0, investingFlow: 0, financingFlow: 0 }
    ]
  });

  it('1. Deve modular a verbosidade da narrativa de aconselhamento', () => {
    const payload = createMockPayload();

    // Medium Verbosity
    const reportMed = executiveRuntime.generateExecutiveReport(payload);
    const textMed = reportMed.advisory.executiveSummary;

    // Low Verbosity
    CalibrationEngine.updateParameter('advisoryVerbosity', 'low', 'usr_test', 'Ajustando verbosidade para painel executivo clean');
    const reportLow = executiveRuntime.generateExecutiveReport(payload);
    const textLow = reportLow.advisory.executiveSummary;

    // High Verbosity
    CalibrationEngine.updateParameter('advisoryVerbosity', 'high', 'usr_test', 'Ajustando verbosidade para analistas seniores');
    const reportHigh = executiveRuntime.generateExecutiveReport(payload);
    const textHigh = reportHigh.advisory.executiveSummary;

    assert.ok(textLow.length <= textMed.length);
    assert.ok(textHigh.length >= textMed.length);
    assert.ok(textHigh.includes('Calibração regulada sob perfil de'));
  });

  it('2. Deve rejeitar supressão de warnings fiduciários críticos', () => {
    for (const criticalWarn of NON_SUPPRESSIBLE_WARNINGS) {
      assert.throws(() => {
        CalibrationEngine.updateParameter(
          'suppressedWarnings',
          [criticalWarn],
          'usr_test',
          `Tentativa de suprimir warning critico ${criticalWarn}`
        );
      }, new RegExp(`Tentativa ilegal de suprimir alertas críticos: ${criticalWarn}`));
    }
  });

  it('3. Deve permitir supressão de warnings não-críticos e filtrá-los no StagingValidationEngine', () => {
    const dataset: ImportedDataset = {
      importId: 'TEST-SUPPRESS',
      connectorId: 'MANUAL_CSV',
      tenantId: 'TENANT-1',
      workspaceId: 'WS-1',
      rawPayloadSize: 1000,
      extractedRecords: 10,
      trustLevel: 'UNVERIFIED',
      status: 'APPROVED',
      violations: [],
      submittedBy: 'tester',
      submittedAt: new Date().toISOString(),
      parsedData: {
        bp: { ativo: 1000, passivo: 600, pl: 500 }, // Diff 100 is material (>50) but let's cause MATERIALITY_THRESHOLD_EXCEEDED
        accountList: [
          { id: '1', name: 'Ativo' },
          { id: '1', name: 'Ativo Duplicado' } // Duplicate account
        ]
      },
      lineage: {
        tenantId: 'TENANT-1',
        workspaceId: 'WS-1',
        connectorId: 'MANUAL_CSV',
        importId: 'TEST-1',
        datasetHash: 'hash',
        sourceHash: 'hash',
        mappingVersion: '1.0',
        timestamp: new Date().toISOString()
      }
    };

    // Before suppression: should have DUPLICATE_ACCOUNT and INVALID_BALANCE_SHEET
    StagingValidationEngine.validateDataset(dataset);
    assert.ok(dataset.blockingWarnings?.includes('DUPLICATE_ACCOUNT'));
    assert.ok(dataset.blockingWarnings?.includes('INVALID_BALANCE_SHEET'));

    // Suppress DUPLICATE_ACCOUNT (which is non-critical)
    CalibrationEngine.updateParameter(
      'suppressedWarnings',
      ['DUPLICATE_ACCOUNT'],
      'usr_test',
      'Supressao de duplicidade para testes do sandbox fiduciario'
    );

    // Re-validate
    StagingValidationEngine.validateDataset(dataset);
    assert.ok(!dataset.blockingWarnings?.includes('DUPLICATE_ACCOUNT'));
    // INVALID_BALANCE_SHEET is critical and MUST NOT be suppressed
    assert.ok(dataset.blockingWarnings?.includes('INVALID_BALANCE_SHEET'));
  });
});
