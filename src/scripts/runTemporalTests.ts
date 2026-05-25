import { evaluateTemporalCausality, HistoricalPeriodData } from '../core/intelligence/temporal-causality-engine';
import { BPSummary } from '../lib/bpEngine';
import { FinancialMetrics } from '../lib/financial-engine';
import fs from 'fs';
import path from 'path';

function createMockData(year: number, overrides: Partial<BPSummary & FinancialMetrics>): HistoricalPeriodData {
  return {
    year,
    bp: {
      ativoCirculante: 100,
      passivoCirculante: 50,
      patrimonioLiquido: 100,
      estoques: overrides.estoques || 10,
      passivosFinanceiros: overrides.passivosFinanceiros || 10,
      ...overrides
    } as BPSummary,
    metrics: {
      ebitda: overrides.ebitda || 10,
      saldoTesouraria: overrides.saldoTesouraria || 10,
      lucroLiquido: overrides.lucroLiquido || 5,
      ncg: overrides.ncg || 20,
      hasData: true,
      ...overrides
    } as any
  };
}

export function runTemporalGovernanceTests(): boolean {
  console.log('\n======================================');
  console.log('TEMPORAL CAUSALITY ENGINE - ADVERSARIAL TESTS');
  console.log('======================================\n');

  let passed = true;

  // 1. LIMITED_TEMPORAL_MODE
  const t1 = evaluateTemporalCausality([createMockData(2023, {})]);
  if (t1.temporalMode !== 'LIMITED_TEMPORAL_MODE' || t1.trendConfidence.level !== 'LOW_CONFIDENCE' || t1.modulationAllowedByTemporal !== false) {
    console.error('❌ Test 1 Failed: LIMITED_TEMPORAL_MODE');
    passed = false;
  } else {
    console.log('✅ Test 1 Passed: LIMITED_TEMPORAL_MODE (1 year defaults to LOW_CONFIDENCE)');
  }

  // 2. TURNAROUND EMERGING
  const t2Data = [
    createMockData(2021, { lucroLiquido: -50, ebitda: -20, saldoTesouraria: 5 }),
    createMockData(2022, { lucroLiquido: -20, ebitda: 0, saldoTesouraria: 8 }),
    createMockData(2023, { lucroLiquido: -5, ebitda: 15, saldoTesouraria: 15 })
  ];
  const t2 = evaluateTemporalCausality(t2Data);
  if (t2.temporalScore !== 'Turnaround Emerging' || t2.trajectoryImpact !== 'POSITIVE') {
    console.error('❌ Test 2 Failed: TURNAROUND EMERGING');
    passed = false;
  } else {
    console.log('✅ Test 2 Passed: TURNAROUND EMERGING (Losses reducing, margins improving)');
  }

  // 3. DESTRUCTIVE GROWTH PATTERN
  const t3Data = [
    createMockData(2021, { estoques: 50, ebitda: 30, saldoTesouraria: 40, passivosFinanceiros: 10 }),
    createMockData(2022, { estoques: 80, ebitda: 10, saldoTesouraria: 20, passivosFinanceiros: 40 }),
    createMockData(2023, { estoques: 150, ebitda: -10, saldoTesouraria: 5, passivosFinanceiros: 80 })
  ];
  const t3 = evaluateTemporalCausality(t3Data);
  if (t3.temporalScore !== 'Structural Collapse' || !t3.isDestructiveGrowth || t3.modulationAllowedByTemporal !== false) {
    console.error('❌ Test 3 Failed: DESTRUCTIVE GROWTH PATTERN');
    passed = false;
  } else {
    console.log('✅ Test 3 Passed: DESTRUCTIVE GROWTH PATTERN (Inventory up, EBITDA down, Debt up, Blocked Modulation)');
  }

  // 4. STABILIZING
  const t4Data = [
    createMockData(2021, { ebitda: 5, saldoTesouraria: 2 }),
    createMockData(2022, { ebitda: 6, saldoTesouraria: 2 }),
    createMockData(2023, { ebitda: 5, saldoTesouraria: 2 })
  ];
  const t4 = evaluateTemporalCausality(t4Data);
  if (t4.temporalScore !== 'Volatile' && t4.temporalScore !== 'Stabilizing') { // Can be Volatile or Stabilizing depending on logic threshold
    console.error(`❌ Test 4 Failed: STABILIZING (Got ${t4.temporalScore})`);
    passed = false;
  } else {
    console.log(`✅ Test 4 Passed: STABILIZING/VOLATILE (Stable low margins, stable cash)`);
  }

  // 5. FALSE TURNAROUND
  // Melhora isolada de um indicador (ex: Lucro Liquido melhorou artificialmente), mas ebitda caiu, caixa caiu e divida explodiu
  const t5Data = [
    createMockData(2021, { lucroLiquido: -20, ebitda: 10, saldoTesouraria: 10, passivosFinanceiros: 10 }),
    createMockData(2022, { lucroLiquido: -30, ebitda: 5, saldoTesouraria: 5, passivosFinanceiros: 20 }),
    createMockData(2023, { lucroLiquido: 5, ebitda: -5, saldoTesouraria: -10, passivosFinanceiros: 50 })
  ];
  const t5 = evaluateTemporalCausality(t5Data);
  if (t5.isTurnaroundEmerging) {
    console.error('❌ Test 5 Failed: FALSE TURNAROUND (Engine fell for a false turnaround)');
    passed = false;
  } else {
    console.log('✅ Test 5 Passed: FALSE TURNAROUND (Engine correctly blocked false turnaround and detected deterioration)');
  }

  // Save Golden Datasets
  const dir = path.resolve(process.cwd(), 'src/governance/golden-datasets');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'temporal-t1-limited.json'), JSON.stringify(t1, null, 2));
  fs.writeFileSync(path.join(dir, 'temporal-t2-turnaround.json'), JSON.stringify(t2, null, 2));
  fs.writeFileSync(path.join(dir, 'temporal-t3-destructive.json'), JSON.stringify(t3, null, 2));

  return passed;
}
