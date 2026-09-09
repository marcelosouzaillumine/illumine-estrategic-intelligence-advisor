// tests/institutional-operating-pressure.test.ts

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalPressureRuntime } from '../src/core/runtime/operating-pressure/InstitutionalPressureRuntime';
import { LongitudinalPressureMemoryEngine } from '../src/core/runtime/operating-pressure/LongitudinalPressureMemoryEngine';

describe('RC-1.8A - Institutional Operating Pressure Governance', () => {

  beforeEach(() => {
    LongitudinalPressureMemoryEngine.clearMemoryForTests();
  });

  const validBaseline = {
    tenantId: 'TENANT-123',
    currentCycle: {
      revenue: 500000,
      ebitda: 50000,
      availableCash: 100000,
      ocf: 40000,
      shortTermDebt: 20000,
      totalDebt: 80000
    },
    historicalCycles: [
      { overallPressureLevel: 'MODERATE', pressureScore: 35 },
      { overallPressureLevel: 'STABLE', pressureScore: 15 }
    ]
  } as any;

  it('Deve retornar estado não-opiniativo (EmptyOutput) caso falte ciclo corrente', () => {
    const invalidInput = { tenantId: 'TENANT-123' } as any;
    const result = InstitutionalPressureRuntime.evaluate(invalidInput);
    
    assert.equal(result.isAvailable, false);
    assert.equal(result.overallPressureLevel, 'STABLE');
    assert.equal(result.pressureScore, 0);
  });

  it('Deve propagar erosão de caixa elevando a severidade da fadiga operacional de forma encadeada', () => {
    const stressInput = {
      tenantId: 'TENANT-123',
      currentCycle: {
        revenue: 400000,
        prevRevenue: 500000,
        ebitda: -10000,
        prevEbitda: 30000,
        availableCash: 5000,
        prevAvailableCash: 80000,
        ocf: -15000,
        prevOcf: 20000,
        shortTermDebt: 50000,
        totalDebt: 100000,
        inventory: 150000,
        prevInventory: 100000,
        workingCapital: 120000,
        prevWorkingCapital: 100000,
        receivables: 180000,
        grossProfit: 100000,
        prevGrossProfit: 150000,
        sga: 110000,
        prevSga: 90000
      },
      historicalCycles: [
        { overallPressureLevel: 'CRITICAL', pressureScore: 75 }
      ]
    } as any;

    const result = InstitutionalPressureRuntime.evaluate(stressInput);
    
    assert.equal(result.isAvailable, true);
    assert.ok(result.pressureScore > 50, 'Pressure score should be elevated (above 50)'); // High pressure
    
    // Check if the propagation engine captured the causal link
    const propagation = result.propagation.propagationChain;
    assert.ok(propagation.length > 0, 'Deve ter cadeias ativadas de propagação');
    
    // Funding fragility should be elevated due to high short-term debt and negative OCF
    assert.ok(result.fundingFragility.fragilityScore > 25, 'Fragilidade de funding deve subir sob erosão severa');
  });

  it('Geração do lineage hash deve ser puramente baseada na evidence lineage', () => {
    const result1 = InstitutionalPressureRuntime.evaluate(validBaseline);
    const result2 = InstitutionalPressureRuntime.evaluate(validBaseline);

    assert.ok(result1.pressureLineageHash);
    // Deve ser determinístico
    assert.equal(result1.pressureLineageHash, result2.pressureLineageHash);
  });

  it('Memória longitudinal deve registrar instâncias de forma fiduciária sem interpretação de texto', () => {
    InstitutionalPressureRuntime.evaluate(validBaseline);
    const memory = LongitudinalPressureMemoryEngine.getHistoricalPressures('TENANT-123');
    
    assert.equal(memory.length, 1);
    assert.equal(memory[0].tenantId, 'TENANT-123');
    assert.ok(memory[0].pressureHash);
    
    // Garantir que a narrativa / interpretação textual não está no record
    const recordAny: any = memory[0];
    assert.equal(recordAny.thesis, undefined);
    assert.equal(recordAny.fiduciaryDisclosures, undefined);
    assert.equal(recordAny.explainability, undefined);
    assert.ok(recordAny.evidenceLineage !== undefined);
  });

});
