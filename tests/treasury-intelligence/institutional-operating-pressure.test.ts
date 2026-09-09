// tests/treasury-intelligence/institutional-operating-pressure.test.ts

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { InstitutionalPressureRuntime } from '../../src/core/runtime/operating-pressure/InstitutionalPressureRuntime';
import { PressureRuntimeInput } from '../../src/core/runtime/operating-pressure/operating-pressure-types';
import { LongitudinalPressureMemoryEngine } from '../../src/core/runtime/operating-pressure/LongitudinalPressureMemoryEngine';
import { PressureNarrativeComposer } from '../../src/core/runtime/operating-pressure/PressureNarrativeComposer';

describe('Institutional Operating Pressure Governance Layer (RC-1.8A)', () => {
  beforeEach(() => {
    LongitudinalPressureMemoryEngine.clearMemoryForTests();
  });

  const baseInput: PressureRuntimeInput = {
    tenantId: 'test-tenant-1',
    correlationId: 'test-corr-1',
    historicalCycles: [],
    currentCycle: {
      revenue: 100000,
      prevRevenue: 100000,
      ebitda: 20000,
      prevEbitda: 20000,
      grossProfit: 60000,
      prevGrossProfit: 60000,
      sga: 35000,
      prevSga: 35000,
      inventory: 15000,
      prevInventory: 15000,
      workingCapital: 20000,
      prevWorkingCapital: 20000,
      ocf: 15000,
      prevOcf: 15000,
      availableCash: 25000,
      prevAvailableCash: 25000,
      runwayMonths: 24,
      shortTermDebt: 5000,
      totalDebt: 10000,
      payables: 8000,
      receivables: 12000
    }
  };

  test('Stable operations evaluation', () => {
    const output = InstitutionalPressureRuntime.evaluate(baseInput);

    assert.strictEqual(output.isAvailable, true);
    assert.strictEqual(output.overallPressureLevel, 'STABLE');
    assert.ok(output.pressureScore <= 25);
    assert.ok(output.pressureLineageHash.length > 0);
    assert.strictEqual(output.fiduciaryDisclosures.length, 1); // Only the baseline score disclosure
    assert.strictEqual(
      PressureNarrativeComposer.mapSeverityLabel(output.overallPressureLevel),
      'Estabilidade operacional'
    );
  });

  test('Operating pressure accumulation (Revenue falling + Inventory rising)', () => {
    const stressedInput: PressureRuntimeInput = {
      ...baseInput,
      currentCycle: {
        ...baseInput.currentCycle,
        revenue: 80000, // dropped
        inventory: 25000, // rose
        workingCapital: 30000 // rose (demand increased)
      }
    };

    const output = InstitutionalPressureRuntime.evaluate(stressedInput);

    assert.ok(output.pressureAccumulation.accumulationScore >= 50);
    assert.ok(output.pressureAccumulation.accumulatedFactors.some(f => f.includes('estoques')));
    assert.ok(output.pressureAccumulation.accumulatedFactors.some(f => f.includes('capital de giro')));
  });

  test('Operational fatigue evaluation (Stable gross profit, SG&A rising, EBITDA falling)', () => {
    const fatiguedInput: PressureRuntimeInput = {
      ...baseInput,
      currentCycle: {
        ...baseInput.currentCycle,
        grossProfit: 60000,
        prevGrossProfit: 60000,
        sga: 50000, // rose significantly
        ebitda: 5000, // dropped
        prevEbitda: 20000
      }
    };

    const output = InstitutionalPressureRuntime.evaluate(fatiguedInput);

    assert.ok(output.operationalFatigue.fatigueScore >= 70);
    assert.ok(output.operationalFatigue.warnings.some(w => w.includes('SG&A')));
  });

  test('Liquidity compression & cash burn velocity', () => {
    const compressedInput: PressureRuntimeInput = {
      ...baseInput,
      currentCycle: {
        ...baseInput.currentCycle,
        availableCash: 12000, // dropped from 25000 (more than 50% drop)
        prevAvailableCash: 25000,
        workingCapital: 10000, // compressed
        prevWorkingCapital: 20000
      }
    };

    const output = InstitutionalPressureRuntime.evaluate(compressedInput);

    assert.ok(output.liquidityCompression.compressionScore >= 60);
    assert.ok(output.liquidityCompression.deteriorationVelocity > 0.5);
    assert.strictEqual(output.liquidityCompression.compressionState, 'WARNING');
  });

  test('Treasury erosion & runway depletion', () => {
    const erodedInput: PressureRuntimeInput = {
      ...baseInput,
      currentCycle: {
        ...baseInput.currentCycle,
        ocf: -15000, // negative OCF
        prevOcf: 15000,
        runwayMonths: 4 // critical runway < 6
      }
    };

    const output = InstitutionalPressureRuntime.evaluate(erodedInput);

    assert.ok(output.treasuryErosion.erosionScore >= 75);
    assert.strictEqual(output.treasuryErosion.erosionState, 'CRITICAL_EROSION');
  });

  test('Funding fragility & debt rollover pressure', () => {
    const fragileInput: PressureRuntimeInput = {
      ...baseInput,
      currentCycle: {
        ...baseInput.currentCycle,
        shortTermDebt: 35000, // exceeds available cash of 25000
        totalDebt: 40000
      }
    };

    const output = InstitutionalPressureRuntime.evaluate(fragileInput);

    assert.ok(output.fundingFragility.fragilityScore >= 60);
    assert.strictEqual(output.fundingFragility.rolloverRiskLevel, 'HIGH');
    assert.ok(output.fundingFragility.warnings.some(w => w.includes('rolagem')));
  });

  test('Acute pressure level & non-alarmist narrative mapping', () => {
    // Combine multiple severe indicators to trigger ACUTE status (> 85 overall score)
    const acuteInput: PressureRuntimeInput = {
      ...baseInput,
      historicalCycles: [{ pressureScore: 60 }, { pressureScore: 60 }],
      currentCycle: {
        ...baseInput.currentCycle,
        revenue: 60000,
        prevRevenue: 100000,
        ebitda: -5000,
        prevEbitda: 20000,
        inventory: 40000,
        prevInventory: 15000,
        ocf: -25000,
        prevOcf: 15000,
        availableCash: 5000,
        prevAvailableCash: 25000,
        runwayMonths: 2,
        shortTermDebt: 30000,
        totalDebt: 40000,
        workingCapital: 5000,
        prevWorkingCapital: 25000
      }
    };

    const output = InstitutionalPressureRuntime.evaluate(acuteInput);

    assert.strictEqual(output.overallPressureLevel, 'ACUTE');
    assert.ok(output.pressureScore > 85);
    
    // Check non-alarmist name mapping
    const label = PressureNarrativeComposer.mapSeverityLabel(output.overallPressureLevel);
    assert.strictEqual(label, 'Pressão crítica acumulada');
    
    // Check that prohibited words are not used in narratives
    output.fiduciaryDisclosures.forEach(disc => {
      assert.strictEqual(disc.includes('falência'), false);
      assert.strictEqual(disc.includes('quebra'), false);
      assert.strictEqual(disc.includes('colapso inevitável'), false);
    });
  });

  test('Longitudinal memory append-only serialization limits', () => {
    // Run evaluation to append a record
    const output = InstitutionalPressureRuntime.evaluate(baseInput);

    const history = LongitudinalPressureMemoryEngine.getHistoricalPressures('test-tenant-1');
    assert.strictEqual(history.length, 1);
    
    const record = history[0];
    // Must contain allowed keys
    assert.ok(record.pressureSignals);
    assert.ok(record.evidenceLineage);
    assert.strictEqual(record.recurrenceCount, 0);
    assert.strictEqual(record.tenantId, 'test-tenant-1');
    assert.strictEqual(record.pressureHash, output.pressureLineageHash);

    // Assert NO narratives or subjective interpretations are serialized
    assert.strictEqual((record as any).thesis, undefined);
    assert.strictEqual((record as any).thesisSummary, undefined);
    assert.strictEqual((record as any).explainability, undefined);
    assert.strictEqual((record as any).fiduciaryDisclosures, undefined);
  });

  test('Tenant isolation in longitudinal memory', () => {
    const tenant1Input = { ...baseInput, tenantId: 'tenant-A' };
    const tenant2Input = { ...baseInput, tenantId: 'tenant-B' };

    InstitutionalPressureRuntime.evaluate(tenant1Input);
    InstitutionalPressureRuntime.evaluate(tenant2Input);

    const historyA = LongitudinalPressureMemoryEngine.getHistoricalPressures('tenant-A');
    const historyB = LongitudinalPressureMemoryEngine.getHistoricalPressures('tenant-B');

    assert.strictEqual(historyA.length, 1);
    assert.strictEqual(historyB.length, 1);
    assert.strictEqual(historyA[0].tenantId, 'tenant-A');
    assert.strictEqual(historyB[0].tenantId, 'tenant-B');
  });

  test('Fail-closed on undefined or empty inputs', () => {
    const output = InstitutionalPressureRuntime.evaluate(undefined as any);
    assert.strictEqual(output.isAvailable, false);
    assert.strictEqual(output.pressureScore, 0);
    assert.strictEqual(output.overallPressureLevel, 'STABLE');
  });
});
