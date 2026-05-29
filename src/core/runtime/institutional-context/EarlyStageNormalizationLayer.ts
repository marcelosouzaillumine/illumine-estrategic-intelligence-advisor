export type EarlyStageNormalizationInput = {
  lifecycleStage: string;
  historicalCyclesCount: number;
  ativoTotal: number;
  ativoCirculante: number;
  passivoCirculante: number;
  patrimonioLiquido: number;
  capitalSocial?: number;
  estoque?: number;
  fornecedores?: number;
  ebitda?: number | null;
  lucroLiquido?: number | null;
};

export type EarlyStageNormalizationFactors = {
  isEarlyStage: boolean;
  estoquePenaltyMultiplier: number;
  supplierPenaltyMultiplier: number;
  ebitdaPenaltyMultiplier: number;
  netLossPenaltyMultiplier: number;
  autonomyBoostMultiplier: number;
  workingCapitalBoostMultiplier: number;
  equityPositiveBoostMultiplier: number;
  maxAutonomyBoostPoints: number;
};

export const EarlyStageNormalizationLayer = {
  normalizeFactors(input: EarlyStageNormalizationInput): EarlyStageNormalizationFactors {
    const isEarlyStage =
      input.lifecycleStage === "STRUCTURING_OPERATION" ||
      input.lifecycleStage === "INITIAL_OPERATION" ||
      input.historicalCyclesCount < 2;

    if (!isEarlyStage) {
      return {
        isEarlyStage: false,
        estoquePenaltyMultiplier: 1,
        supplierPenaltyMultiplier: 1,
        ebitdaPenaltyMultiplier: 1,
        netLossPenaltyMultiplier: 1,
        autonomyBoostMultiplier: 1,
        workingCapitalBoostMultiplier: 1,
        equityPositiveBoostMultiplier: 1,
        maxAutonomyBoostPoints: 0,
      };
    }

    return {
      isEarlyStage: true,
      estoquePenaltyMultiplier: 0.65,
      supplierPenaltyMultiplier: 0.80,
      ebitdaPenaltyMultiplier: 0.70,
      netLossPenaltyMultiplier: 0.60,
      autonomyBoostMultiplier: 1.20,
      workingCapitalBoostMultiplier: 1.10,
      equityPositiveBoostMultiplier: 1.15,
      maxAutonomyBoostPoints: 8,
    };
  }
};
