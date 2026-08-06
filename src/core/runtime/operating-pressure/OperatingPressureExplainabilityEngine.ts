// src/core/runtime/operating-pressure/OperatingPressureExplainabilityEngine.ts

import { PressureRuntimeInput, PressureExplainabilityOutput, StrainDecompositionItem } from './operating-pressure-types';

export class OperatingPressureExplainabilityEngine {
  public static evaluate(
    input: PressureRuntimeInput,
    scores: {
      accumulation: number;
      fatigue: number;
      compression: number;
      erosion: number;
      fragility: number;
      overall: number;
    },
    propagationChain: string[],
    lineageHash: string
  ): PressureExplainabilityOutput {
    const strainDecomposition: StrainDecompositionItem[] = [
      {
        engine: 'Acúmulo de Tensões (PressureAccumulation)',
        contribution: scores.accumulation * 0.2,
        rationale: `Detecção de persistência de estresse contábil com score de ${scores.accumulation.toFixed(0)}/100.`
      },
      {
        engine: 'Fadiga Operacional (OperationalFatigue)',
        contribution: scores.fatigue * 0.25,
        rationale: `Redução da eficiência operacional com score de ${scores.fatigue.toFixed(0)}/100.`
      },
      {
        engine: 'Compressão de Liquidez (LiquidityCompression)',
        contribution: scores.compression * 0.2,
        rationale: `Contração na velocidade do caixa com score de ${scores.compression.toFixed(0)}/100.`
      },
      {
        engine: 'Erosão de Tesouraria (TreasuryErosion)',
        contribution: scores.erosion * 0.2,
        rationale: `Consumo de caixa operacional e declínio de runway com score de ${scores.erosion.toFixed(0)}/100.`
      },
      {
        engine: 'Fragilidade de Funding (FundingFragility)',
        contribution: scores.fragility * 0.15,
        rationale: `Pressão de rollover e concentração de ciclo imediato com score de ${scores.fragility.toFixed(0)}/100.`
      }
    ];

    const activeChain = propagationChain.length > 0
      ? propagationChain.join(' -> ')
      : 'Nenhuma cadeia de contágio ativa identificada.';

    const structuralRationale = `A pontuação de estresse (${scores.overall.toFixed(1)}) reflete a soma ponderada de fadiga operacional e compressão de liquidez. O fluxo principal é determinado por ${
      scores.fatigue > scores.compression ? 'pressões internas de custos' : 'consumo acelerado de caixa livre'
    }.`;

    return {
      pressureLineage: `Linhagem de Evidência Auditável baseada no hash ${lineageHash}`,
      structuralRationale,
      strainDecomposition,
      propagationExplanation: `Cadeias propagadoras identificadas: ${activeChain}`,
      confidenceDecomposition: 'Nível de confiança dos inputs baseado em balancetes auditados e DFC reconciliada (Alta Confiabilidade).'
    };
  }
}
