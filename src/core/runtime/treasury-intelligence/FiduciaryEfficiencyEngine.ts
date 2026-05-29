// src/core/runtime/treasury-intelligence/FiduciaryEfficiencyEngine.ts

import { FiduciaryEfficiencyOutput } from './types';

export interface EfficiencyEvaluationInput {
  baseEfficiencyScore: number;
  runwayMonths: number;
  resilienceScore: number;
  isSurvivabilityDegraded: boolean;
  isLiquidityFragile: boolean;
  isTreasuryExhausted: boolean;
  idleCashRatio: number; // proporção de caixa ocioso sobre Ativo Total
  costOfDebtRatio: number; // custo financeiro sobre lucro operacional
}

export class FiduciaryEfficiencyEngine {
  /**
   * Evaluates the fiduciary efficiency of capital allocation.
   * Ensures efficiency is strictly adjusted for survivability and continuity constraints
   * to prevent disconnected efficiency interpretations.
   */
  public static evaluate(input: EfficiencyEvaluationInput): FiduciaryEfficiencyOutput {
    const {
      baseEfficiencyScore,
      runwayMonths,
      resilienceScore,
      isSurvivabilityDegraded,
      isLiquidityFragile,
      isTreasuryExhausted,
      idleCashRatio,
      costOfDebtRatio
    } = input;

    const inefficientAllocationPatterns: string[] = [];
    let adjustedScore = baseEfficiencyScore;

    // 1. Degradation for high return with survivability deterioration
    if (isSurvivabilityDegraded) {
      adjustedScore -= 25;
      inefficientAllocationPatterns.push(
        'HIGH_RETURN_WITH_SURVIVABILITY_DETERIORATION: Retorno nominal positivo acompanhado de degradação estrutural de sobrevivência.'
      );
    }

    // 2. Degradation for profitable growth with treasury exhaustion
    if (isTreasuryExhausted || runwayMonths < 6) {
      adjustedScore -= 30;
      inefficientAllocationPatterns.push(
        'PROFITABLE_GROWTH_WITH_TREASURY_EXHAUSTION: Crescimento nominal lucrativo ocorrendo sob exaustão de caixa preditiva.'
      );
    }

    // 3. Degradation for expansion with liquidity fragility
    if (isLiquidityFragile) {
      adjustedScore -= 20;
      inefficientAllocationPatterns.push(
        'EXPANSION_WITH_LIQUIDITY_FRAGILITY: Investimento/expansão financiada sob quadro crítico de fragilidade de liquidez.'
      );
    }

    // 4. Degradation for low operational resilience
    if (resilienceScore < 50) {
      adjustedScore -= 15;
      inefficientAllocationPatterns.push(
        'RESILIENCE_MISMATCH: Eficiência alocativa inconsistente com a resiliência operacional básica.'
      );
    }

    // 5. Inefficient patterns detection (idle cash and high debt cost)
    if (idleCashRatio > 0.4) {
      adjustedScore -= 10;
      inefficientAllocationPatterns.push(
        'IDLE_CASH_DESTRUCTION: Excesso de saldo de caixa ocioso sem destinação estratégica ou rentabilidade operacional.'
      );
    }

    if (costOfDebtRatio > 0.3) {
      adjustedScore -= 10;
      inefficientAllocationPatterns.push(
        'DESTRUCTIVE_FINANCING_COST: Despesas financeiras de captação consomem parcela excessiva do resultado operacional.'
      );
    }

    adjustedScore = Math.round(Math.max(adjustedScore, 0) * 10) / 10;

    // Silent cash destruction is detected when there's a material gap between nominal and adjusted efficiency
    const silentCashDestructionDetected = adjustedScore < baseEfficiencyScore * 0.75;

    return {
      efficiencyScore: baseEfficiencyScore,
      survivabilityAdjustedEfficiency: adjustedScore,
      silentCashDestructionDetected,
      inefficientAllocationPatterns
    };
  }
}
