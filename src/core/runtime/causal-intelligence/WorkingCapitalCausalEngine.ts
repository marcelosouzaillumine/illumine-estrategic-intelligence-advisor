// src/core/runtime/causal-intelligence/WorkingCapitalCausalEngine.ts

import { HistoricalCycleData } from '../institutional-memory/types';
import { extractCycleMetrics } from '../institutional-causality/types';

export class WorkingCapitalCausalEngine {
  public static evaluate(
    historicalCycles: HistoricalCycleData[],
    currentReceivables: number,
    currentInventory: number,
    currentWorkingCapitalVariation: number
  ): {
    receivablesTrend: 'GROWING' | 'STABLE' | 'DECREASING';
    inventoryTrend: 'GROWING' | 'STABLE' | 'DECREASING';
    workingCapitalDrainSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    rationale: string;
  } {
    if (historicalCycles.length < 2) {
      return {
        receivablesTrend: 'STABLE',
        inventoryTrend: 'STABLE',
        workingCapitalDrainSeverity: 'LOW',
        rationale: 'Falta de histórico suficiente para traçar tendências de capital de giro.'
      };
    }

    const sortedCycles = [...historicalCycles].sort((a, b) => a.year - b.year);
    const prevCycle = sortedCycles[sortedCycles.length - 2];
    const prevMetrics = extractCycleMetrics(prevCycle);

    const prevReceivables = prevMetrics.clientes || 0;
    const prevInventory = prevMetrics.estoques || 0;

    const recGrowth = prevReceivables > 0 ? (currentReceivables - prevReceivables) / prevReceivables : 0;
    const invGrowth = prevInventory > 0 ? (currentInventory - prevInventory) / prevInventory : 0;

    const receivablesTrend = recGrowth > 0.05 ? 'GROWING' : recGrowth < -0.05 ? 'DECREASING' : 'STABLE';
    const inventoryTrend = invGrowth > 0.05 ? 'GROWING' : invGrowth < -0.05 ? 'DECREASING' : 'STABLE';

    let severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    let rationale = 'Comportamento do capital de giro dentro dos limites estruturais operacionais.';

    if (currentWorkingCapitalVariation > 0) {
      if (receivablesTrend === 'GROWING' && inventoryTrend === 'GROWING') {
        severity = 'CRITICAL';
        rationale = 'Dreno crítico de capital de giro causado pelo acúmulo simultâneo de estoques e contas a receber.';
      } else if (receivablesTrend === 'GROWING') {
        severity = 'HIGH';
        rationale = 'Dreno elevado de liquidez concentrado na expansão de contas a receber (prazos a clientes).';
      } else if (inventoryTrend === 'GROWING') {
        severity = 'HIGH';
        rationale = 'Retenção elevada de recursos em estoques de baixa rotação, comprometendo liquidez imediata.';
      } else {
        severity = 'MODERATE';
        rationale = 'Pressão moderada de capital de giro sem vetor de acúmulo óbvio nos ativos circulantes primários.';
      }
    }

    return {
      receivablesTrend,
      inventoryTrend,
      workingCapitalDrainSeverity: severity,
      rationale
    };
  }
}
