// src/core/runtime/operating-pressure/PressureAccumulationEngine.ts

import { PressureRuntimeInput, PressureAccumulationOutput } from './operating-pressure-types';

export class PressureAccumulationEngine {
  public static evaluate(input: PressureRuntimeInput): PressureAccumulationOutput {
    const current = input.currentCycle;
    const accumulatedFactors: string[] = [];
    let score = 0;

    // 1. Revenue compression vs Inventory accumulation
    const revenueDropped = current.revenue < current.prevRevenue;
    const inventoryIncreased = current.inventory > current.prevInventory;
    if (revenueDropped && inventoryIncreased) {
      score += 30;
      accumulatedFactors.push('Compressão de receita com acúmulo de estoques (pressão sobre giro)');
    } else if (revenueDropped) {
      score += 15;
      accumulatedFactors.push('Redução de receita líquida em relação ao ciclo anterior');
    } else if (inventoryIncreased) {
      score += 10;
      accumulatedFactors.push('Aumento de capital imobilizado em estoques');
    }

    // 2. Working Capital demand
    const wcIncreased = current.workingCapital > current.prevWorkingCapital;
    if (wcIncreased) {
      score += 25;
      accumulatedFactors.push('Aumento na necessidade de capital de giro circulante');
    }

    // 3. Receivables vs Revenue growth
    const revGrowth = current.prevRevenue > 0 ? (current.revenue - current.prevRevenue) / current.prevRevenue : 0;
    const recGrowth = current.prevWorkingCapital > 0 ? (current.receivables - current.workingCapital) / current.workingCapital : 0; // standard proxy if previous receivables isn't explicit
    if (current.receivables > current.workingCapital * 0.5 && revGrowth <= 0) {
      score += 20;
      accumulatedFactors.push('Concentração elevada de contas a receber sob receita estagnada');
    }

    // 4. Persistence over historical cycles
    let persistenceTrend: 'STABLE' | 'DEGRADED' | 'ACCUMULATING' = 'STABLE';
    const pastPressureCount = input.historicalCycles ? input.historicalCycles.filter(h => h.pressureScore > 50).length : 0;
    if (pastPressureCount >= 2) {
      score += 25;
      persistenceTrend = 'ACCUMULATING';
      accumulatedFactors.push('Histórico persistente de estresse financeiro operacional nos últimos ciclos');
    } else if (pastPressureCount === 1 || score > 40) {
      persistenceTrend = 'DEGRADED';
    }

    // Cap the score at 100
    const accumulationScore = Math.min(Math.max(score, 0), 100);

    return {
      accumulationScore,
      persistenceTrend,
      accumulatedFactors
    };
  }
}
