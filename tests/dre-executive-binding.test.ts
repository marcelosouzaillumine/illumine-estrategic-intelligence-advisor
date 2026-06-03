import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DREExecutiveDataMapper } from '../src/core/runtime/dre/DREExecutiveDataMapper';
import { EconomicBurnRateEngine } from '../src/core/runtime/dre/EconomicBurnRateEngine';
import { BreakEvenAnalysisEngine } from '../src/core/runtime/dre/BreakEvenAnalysisEngine';

describe('DRE Executive Binding Integration', () => {
  test('should correctly map Granatum 2022 raw DRE payload through the mapper', () => {
    // These represent the actual Granatum 2022 computed DRE metrics
    const netRevenue = 156969.54;
    const cogs = -70026.22;
    const adminExpenses = -157385.83;
    const netProfit = -68548.88;
    const grossProfit = 86943.32;
    const ebitda = -68548.88; // simplified
    const breakEvenRevenue = 284148.12;

    const payload = {
      netRevenue,
      cogs,
      adminExpenses,
      ebitda,
      netProfit,
      breakEvenRevenue,
      grossProfit
    };

    const mapped = DREExecutiveDataMapper.map(payload);

    // Baseline validation
    assert.strictEqual(mapped.netRevenue.value, 156969.54);
    assert.strictEqual(mapped.cogs.value, -70026.22);
    assert.strictEqual(mapped.adminExpenses.value, -157385.83);
    assert.strictEqual(mapped.netProfit.value, -68548.88);
    assert.strictEqual(mapped.breakEvenRevenue.value, 284148.12);

    // Derived values validation
    const breakEvenGap = 284148.12 - 156969.54;
    assert.ok(Math.abs(mapped.breakEvenGap.value - 127178.58) < 0.01);

    // Tracking verification
    assert.strictEqual(mapped.netRevenue.source, 'payload.netRevenue');
  });

  test('should process the mapped payload correctly through engines', () => {
    const netRevenue = 156969.54;
    const cogs = -70026.22;
    const adminExpenses = -157385.83;
    const netProfit = -68548.88;
    const grossProfit = 86943.32;
    const ebitda = -68548.88; // simplified
    const breakEvenRevenue = 284148.12;

    const payload = {
      netRevenue,
      cogs,
      adminExpenses,
      ebitda,
      netProfit,
      breakEvenRevenue,
      grossProfit
    };

    const mapped = DREExecutiveDataMapper.map(payload);

    // Call engines directly to bypass runtime governance quarantine (which requires full lineage/metadata)
    const economicBurnRate = EconomicBurnRateEngine.evaluate(mapped);
    const breakEvenAnalysis = BreakEvenAnalysisEngine.evaluate(mapped);
    
    // Ensure engines were executed correctly
    assert.ok(economicBurnRate);
    assert.ok(Math.abs(economicBurnRate.annualEconomicBurn - 68548.88) < 0.01);
    assert.ok(Math.abs(economicBurnRate.monthlyEconomicBurn - 5712.41) < 0.01);
    
    assert.ok(breakEvenAnalysis);
    assert.ok(Math.abs(breakEvenAnalysis.breakEvenGap - 127178.58) < 0.01);
  });
});
