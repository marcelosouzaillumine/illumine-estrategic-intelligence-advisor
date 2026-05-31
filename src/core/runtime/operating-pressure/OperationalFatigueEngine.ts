// src/core/runtime/operating-pressure/OperationalFatigueEngine.ts

import { PressureRuntimeInput, OperationalFatigueOutput } from './operating-pressure-types';

export class OperationalFatigueEngine {
  public static evaluate(input: PressureRuntimeInput): OperationalFatigueOutput {
    const current = input.currentCycle;
    const warnings: string[] = [];
    let score = 0;

    const currentRev = current.revenue || 1;
    const prevRev = current.prevRevenue || 1;

    const currentGrossMargin = current.grossProfit / currentRev;
    const prevGrossMargin = current.prevGrossProfit / prevRev;

    const currentSgaRatio = current.sga / currentRev;
    const prevSgaRatio = current.prevSga / prevRev;

    const currentEbitdaMargin = current.ebitda / currentRev;
    const prevEbitdaMargin = current.prevEbitda / prevRev;

    // 1. Gross Profit Margin is stable but SG&A rises
    const grossMarginStable = Math.abs(currentGrossMargin - prevGrossMargin) < 0.05 || currentGrossMargin >= prevGrossMargin;
    const sgaRises = currentSgaRatio > prevSgaRatio + 0.02;
    if (grossMarginStable && sgaRises) {
      score += 35;
      warnings.push('Margem bruta sob controle, mas custos fixos/SG&A subindo (fadiga de estrutura)');
    }

    // 2. EBITDA deterioration
    const ebitdaMarginDropped = currentEbitdaMargin < prevEbitdaMargin - 0.02;
    if (ebitdaMarginDropped) {
      score += 35;
      warnings.push('Redução na margem operacional EBITDA em relação ao ciclo anterior');
    }

    // 3. Absolute EBITDA negative or near zero
    if (current.ebitda <= 0) {
      score += 30;
      warnings.push('Geração de valor operacional (EBITDA) negativa ou zerada no ciclo');
    } else if (current.ebitda < current.revenue * 0.05) {
      score += 15;
      warnings.push('Margem EBITDA abaixo do limiar de segurança institucional (5%)');
    }

    // Calculate absorption ratio
    // operatingAbsorptionRatio = EBITDA / Gross Profit
    const operatingAbsorptionRatio = current.grossProfit > 0 ? current.ebitda / current.grossProfit : 0;

    if (operatingAbsorptionRatio < 0.1 && current.grossProfit > 0) {
      score += 10;
      warnings.push('Baixo índice de conversão de margem bruta em EBITDA (pressão de overhead)');
    }

    const fatigueScore = Math.min(Math.max(score, 0), 100);

    let fatigueLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (fatigueScore > 75) {
      fatigueLevel = 'CRITICAL';
    } else if (fatigueScore > 50) {
      fatigueLevel = 'HIGH';
    } else if (fatigueScore > 25) {
      fatigueLevel = 'MEDIUM';
    }

    return {
      fatigueScore,
      fatigueLevel,
      operatingAbsorptionRatio,
      warnings
    };
  }
}
