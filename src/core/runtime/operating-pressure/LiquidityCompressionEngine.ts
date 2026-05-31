// src/core/runtime/operating-pressure/LiquidityCompressionEngine.ts

import { PressureRuntimeInput, LiquidityCompressionOutput } from './operating-pressure-types';

export class LiquidityCompressionEngine {
  public static evaluate(input: PressureRuntimeInput): LiquidityCompressionOutput {
    const current = input.currentCycle;
    const strainFactors: string[] = [];
    let score = 0;

    // 1. Cash contraction velocity
    const cashDrop = current.availableCash < current.prevAvailableCash;
    let deteriorationVelocity = 0;
    if (cashDrop && current.prevAvailableCash > 0) {
      deteriorationVelocity = (current.prevAvailableCash - current.availableCash) / current.prevAvailableCash;
      if (deteriorationVelocity > 0.3) {
        score += 35;
        strainFactors.push(`Rápida contração do saldo disponível em caixa (-${(deteriorationVelocity * 100).toFixed(1)}%)`);
      } else if (deteriorationVelocity > 0.1) {
        score += 20;
        strainFactors.push(`Redução moderada do saldo disponível em caixa (-${(deteriorationVelocity * 100).toFixed(1)}%)`);
      }
    }

    // 2. Working Capital compression
    const wcCompressed = current.workingCapital < current.prevWorkingCapital;
    if (wcCompressed && current.prevWorkingCapital > 0) {
      const wcDropVelocity = (current.prevWorkingCapital - current.workingCapital) / current.prevWorkingCapital;
      if (wcDropVelocity > 0.2) {
        score += 30;
        strainFactors.push('Compressão acentuada do capital de giro circulante');
      } else if (wcDropVelocity > 0.05) {
        score += 15;
        strainFactors.push('Redução gradual do capital de giro de suporte');
      }
    }

    // 3. Liquidity distortion diagnostics from Patrimonial Report
    if (input.patrimonialReport?.patrimonialDiagnosis) {
      const diagnoses = input.patrimonialReport.patrimonialDiagnosis;
      const isDistorted = diagnoses.some((d: any) => d.code === 'APPARENT_LIQUIDITY_DISTORTED_BY_INVENTORY');
      if (isDistorted) {
        score += 25;
        strainFactors.push('Liquidez aparente distorcida por excesso de estoques (qualidade de liquidez sob pressão)');
      }
    }

    // 4. Receivables accumulation vs available cash
    if (current.receivables > current.availableCash * 2) {
      score += 10;
      strainFactors.push('Elevada concentração de liquidez futura em contas a receber frente ao caixa disponível');
    }

    const compressionScore = Math.min(Math.max(score, 0), 100);

    let compressionState: 'NORMAL' | 'WARNING' | 'COMPRESSED' = 'NORMAL';
    if (compressionScore > 65) {
      compressionState = 'COMPRESSED';
    } else if (compressionScore > 35) {
      compressionState = 'WARNING';
    }

    return {
      compressionScore,
      deteriorationVelocity,
      compressionState,
      strainFactors
    };
  }
}
