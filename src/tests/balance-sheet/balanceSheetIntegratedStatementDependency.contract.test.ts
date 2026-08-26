import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { FiduciaryRuntimeAdapter } from '../../services/FiduciaryRuntimeAdapter';

describe('BalanceSheetIntegratedStatementDependency', () => {
  it('Should add narrative restrictions when evaluating BP without DRE/DFC', () => {
    const inputPayload = {
      clientProfile: { id: 'test', name: 'Test', segmento: 'Geral' },
      rawFinancialData: {
        bpSummary: {
          ativoTotal: 1000,
          passivoTotal: 600,
          patrimonioLiquido: 400
        },
        dreDataLength: 0
      },
      bpData: [{ type: 'Ativo', category: 'Ativo Total', val: 1000 }],
      dreData: [],
      dlpaData: [],
      cashFlowData: [],
      historicalCyclesCount: 1,
      isMockData: false
    };

    const execReport = FiduciaryRuntimeAdapter.generateExecutiveReport(inputPayload as any);
    
    assert.strictEqual(execReport.compliance.runtimeMode, 'BALANCE_SHEET_ONLY');
    assert.ok(execReport.compliance.narrativeRestrictions.includes('NÃO inferir colapso irreversível.'));
    assert.ok(execReport.compliance.narrativeRestrictions.includes('NÃO inferir turnaround estrutural.'));
  });
});
