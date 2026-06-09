import test from 'node:test';
import assert from 'node:assert';
import { ClientExecutiveFinancialDataAdapter } from '../src/services/ClientExecutiveFinancialDataAdapter';

test('ClientExecutiveFinancialDataAdapter - fetchTimelineData (Empty State)', async (t) => {
  const result = await ClientExecutiveFinancialDataAdapter.fetchTimelineData({
    clientId: 'client-123',
    selectedYear: 2024,
    _testOverride: {
      getDocsForQuery: async () => [] // Returns empty array for all collections
    }
  });

  assert.deepStrictEqual(result.availableYears, []);
  assert.strictEqual(result.selectedYear, 2024);
  assert.strictEqual(result.selectedPeriodInput, null);
  assert.deepStrictEqual(result.historicalInputs, []);
  assert.deepStrictEqual(result.projectedScenarioInputs, []);
});

test('ClientExecutiveFinancialDataAdapter - fetchTimelineData (Historical and Projections)', async (t) => {
  const result = await ClientExecutiveFinancialDataAdapter.fetchTimelineData({
    clientId: 'client-123',
    selectedYear: 2024,
    historyWindow: 2,
    projectionWindow: 3,
    _testOverride: {
      getDocsForQuery: async (collectionName: string) => {
        if (collectionName === 'modeling_inputs') {
          return [
            { year: 2022, bpData: [] },
            { year: 2023, bpData: [] },
            { year: 2024, rawFinancialData: { prevPl: 100 } }
          ];
        }
        if (collectionName === 'institutional_scenarios') {
          return [
            { id: 'scen-1', status: 'approved' }
          ];
        }
        if (collectionName === 'scenario_impacts') {
          return [
            { scenarioId: 'scen-1', revenueImpact: 500 }
          ];
        }
        return [];
      }
    }
  });

  // Verify historical
  assert.deepStrictEqual(result.availableYears, [2022, 2023, 2024]);
  assert.strictEqual(result.selectedYear, 2024);
  assert.strictEqual(result.historicalInputs.length, 3);
  assert.strictEqual(result.historicalRange.startYear, 2022);
  assert.strictEqual(result.historicalRange.endYear, 2024);

  // Verify projection
  assert.strictEqual(result.projectedScenarioInputs.length, 1);
  assert.strictEqual(result.projectedScenarioInputs[0].year, 2025);
  assert.strictEqual(result.projectedScenarioInputs[0].scenarioId, 'scen-1');
  assert.strictEqual(result.projectionRange.startYear, 2025);
  assert.strictEqual(result.projectionRange.endYear, 2027); // 2024 + 3
});
