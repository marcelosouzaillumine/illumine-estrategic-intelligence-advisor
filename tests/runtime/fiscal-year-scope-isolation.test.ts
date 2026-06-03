import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalExecutionContext } from '../../src/runtime/InstitutionalExecutionContext';
import { executiveRuntime } from '../../src/core/runtime/executive-intelligence-runtime';

describe('Fiscal Year Scope Isolation Framework (FYSIF) v1.0', () => {
  const mockHistoricalData = [
    { year: 2021, val: 100, category: 'Receita', type: 'DRE' },
    { year: 2022, val: 200, category: 'Receita', type: 'DRE' },
    { year: 2023, val: 300, category: 'Receita', type: 'DRE' },
    { year: 2024, val: 400, category: 'Receita', type: 'DRE' }
  ];

  it('InstitutionalExecutionContext blocks future data leakage', () => {
    const input: any = {
      rawFinancialData: {
        filterYear: 2022,
        allHistoryData: [...mockHistoricalData]
      }
    };

    InstitutionalExecutionContext.create(input);

    const filteredData = input.rawFinancialData.allHistoryData;
    assert.strictEqual(filteredData.length, 2);
    assert.strictEqual(filteredData.some((d: any) => d.year === 2021), true);
    assert.strictEqual(filteredData.some((d: any) => d.year === 2022), true);
    assert.strictEqual(filteredData.some((d: any) => d.year > 2022), false);
  });

  it('ExecutiveIntelligenceRuntime blocks future data leakage', () => {
    const rawData: any = {
      bpData: [{ year: 2022, category: 'Caixa', type: 'Ativo', val: 100 }],
      dreData: [{ year: 2022, category: 'Receita', type: 'DRE', val: 100 }],
      rawFinancialData: {
        filterYear: 2022,
        allHistoryData: [...mockHistoricalData]
      },
      historicalSeries: [...mockHistoricalData]
    };

    // We just want to check if the data gets isolated correctly in the mutation logic.
    // generateExecutiveReport will mutate rawData and run the report.
    try {
      executiveRuntime.generateExecutiveReport(rawData);
    } catch (e) {
      // Ignorando erros de validação subjacentes dos engines para focar apenas na mutação
    }

    const filteredHistory = rawData.rawFinancialData.allHistoryData;
    assert.strictEqual(filteredHistory.length, 2);
    assert.strictEqual(filteredHistory.some((d: any) => d.year > 2022), false);

    const filteredSeries = rawData.historicalSeries;
    assert.strictEqual(filteredSeries.length, 2);
    assert.strictEqual(filteredSeries.some((d: any) => d.year > 2022), false);
  });
});
