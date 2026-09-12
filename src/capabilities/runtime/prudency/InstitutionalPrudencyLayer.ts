import { LongitudinalIntelligenceGuard } from '../../core/runtime/coherence/LongitudinalIntelligenceGuard';

export interface PrudencyReason {
  title: string;
  severity: 'moderate' | 'high';
  description: string;
  category?: 'historical_density' | 'institutional_maturity' | 'liquidity' | 'longitudinal_validation';
}

export interface PrudencyOutput {
  rawScores: {
    financial: number;
    operational: number;
    governance: number;
    structural: number;
    composite: number;
  };
  adjustedScores: {
    financial: number;
    operational: number;
    governance: number;
    structural: number;
    composite: number;
    evolutionScore: number | null;
  };
  scores: {
    financial: number;
    operational: number;
    governance: number;
    structural: number;
    composite: number;
    evolutionScore: number | null;
  };
  prudencyApplied: boolean;
  prudencyReasons: PrudencyReason[];
  maxCompositeScore: number;
  rawCompositeScore: number;
  adjustedCompositeScore: number;
  rawEvolutionScore: number | null;
  adjustedEvolutionScore: number | null;
  maturityConfidence: "LOW" | "MODERATE" | "HIGH";
  narrativeRestrictions: string[];
  advisoryRestrictions: string[];
  blockedClaims: string[];
}

export const InstitutionalPrudencyLayer = {
  capEvolutionScore(score: number | null, cycles: number): number | null {
    if (cycles < 2) return null;
    if (cycles === 2) return Math.min(score ?? 0, 55);
    if (cycles === 3) return Math.min(score ?? 0, 70);
    if (cycles === 4) return Math.min(score ?? 0, 85);
    return Math.min(score ?? 0, 100);
  },

  resolveCompositeCap(context: any): number {
    let cap = 100;
    if (context.historicalCyclesCount <= 1) cap = 65;
    else if (context.historicalCyclesCount === 2) cap = 75;
    else if (context.historicalCyclesCount === 3) cap = 85;
    else if (context.historicalCyclesCount === 4) cap = 90;
    
    if (context.businessStage === "STRUCTURING_OPERATION") {
      cap = Math.min(cap, 75);
    }
    return cap;
  },

  applyPrudency(
    rawScores: { financial: number; operational: number; governance: number; structural: number; composite: number },
    rawEvolutionScore: number | null,
    context: any
  ): PrudencyOutput {
    const prudencyReasons: PrudencyReason[] = [];
    const cycles = context.historicalCyclesCount || 1;
    const longitudinalGuard = LongitudinalIntelligenceGuard.evaluate(cycles);
    
    // 1. Evolution Cap and Hiding
    let evolutionScore = rawEvolutionScore;
    if (longitudinalGuard.evolutionScoreHidden) {
      evolutionScore = null;
      prudencyReasons.push({
        title: "Evolução Histórica Restrita",
        severity: "high",
        description: longitudinalGuard.institutionalDisclosure || "A maturidade estrutural da operação possui apenas um exercício contábil.",
        category: "historical_density"
      });
    } else {
      evolutionScore = this.capEvolutionScore(rawEvolutionScore, cycles);
      if (cycles <= 2) {
        prudencyReasons.push({
          title: "Baixa densidade histórica disponível",
          severity: "moderate",
          description: longitudinalGuard.institutionalDisclosure || "A maturidade estrutural da operação ainda não possui validação longitudinal suficiente.",
          category: "historical_density"
        });
      }
    }

    // 2. Composite Hard Cap and Recalibration
    const cap = this.resolveCompositeCap(context);
    let rawCompositeScore = rawScores.composite;
    
    // Recalibrate composite score if evolution score is hidden
    if (longitudinalGuard.evolutionScoreHidden) {
      // In the original, the raw composite score is just passed. We should assume the external caller or here we recalculate the raw.
      // But since the actual weights are not known here, the recalculation happens outside or we just adjust the components.
      // Let's pass the flag outward.
    }
    
    const adjustedCompositeScore = Math.min(rawCompositeScore, cap);
    const prudencyApplied = adjustedCompositeScore < rawCompositeScore || cycles <= 2 || context.businessStage === "STRUCTURING_OPERATION" || longitudinalGuard.evolutionScoreHidden;

    if (context.businessStage === "STRUCTURING_OPERATION" && !prudencyReasons.some(r => r.category === "institutional_maturity")) {
      prudencyReasons.push({
        title: "Operação ainda em fase de estruturação institucional",
        severity: "moderate",
        description: "O modelo de negócio carece de comprovação de escala e estabilidade corporativa contínua.",
        category: "institutional_maturity"
      });
    }

    if (adjustedCompositeScore < rawCompositeScore && !prudencyReasons.some(r => r.category === "historical_density")) {
      prudencyReasons.push({
        title: "Baixa densidade histórica disponível",
        severity: "moderate",
        description: "Score contido para evitar a comunicação de consolidação estrutural irreal.",
        category: "historical_density"
      });
    }

    // 3. Liquidity Exuberance Control
    if (rawScores.financial >= 95 && cycles < 3 && context.businessStage === "STRUCTURING_OPERATION") {
      prudencyReasons.push({
        title: "Liquidez atual sem validação longitudinal consolidada",
        severity: "high",
        description: "Excesso de liquidez sem tração correspondente de governança ou maturidade comercial.",
        category: "liquidity"
      });
    }

    let maturityConfidence: "LOW" | "MODERATE" | "HIGH" = "HIGH";
    if (cycles <= 2 || context.businessStage === "STRUCTURING_OPERATION") {
      maturityConfidence = "LOW";
    } else if (cycles === 3) {
      maturityConfidence = "MODERATE";
    }

    let narrativeRestrictions: string[] = [];
    let advisoryRestrictions: string[] = [];
    let blockedClaims: string[] = [];

    if (cycles === 1) {
      narrativeRestrictions.push('Omitir inferências evolutivas ou comparações temporais.');
      advisoryRestrictions.push('Evitar prescrições baseadas em crescimento histórico.');
      blockedClaims.push('maturidade consolidada', 'tendência estrutural', 'estabilidade histórica', 'crescimento sustentável');
    } else if (cycles === 2) {
      narrativeRestrictions.push('Limitar conclusões sobre consolidação; usar linguagem condicional para evolução.');
      advisoryRestrictions.push('Manter foco em estabilização de ciclo imediato, não em expansão agressiva baseada no passado.');
      blockedClaims.push('maturidade consolidada', 'tendência inquestionável', 'resiliência comprovada');
    }

    if (context.businessStage === "STRUCTURING_OPERATION") {
      blockedClaims.push('operação madura', 'liderança de mercado garantida');
    }

    // Remover duplicatas baseadas no título
    let uniqueReasons = Array.from(
      new Map(prudencyReasons.map(item => [item.title, item])).values()
    );

    return {
      rawScores: { ...rawScores },
      adjustedScores: {
        financial: rawScores.financial,
        operational: rawScores.operational,
        governance: rawScores.governance,
        structural: rawScores.structural,
        composite: adjustedCompositeScore,
        evolutionScore
      },
      scores: {
        financial: rawScores.financial,
        operational: rawScores.operational,
        governance: rawScores.governance,
        structural: rawScores.structural,
        composite: adjustedCompositeScore,
        evolutionScore
      },
      prudencyApplied,
      prudencyReasons: uniqueReasons,
      maxCompositeScore: cap,
      rawCompositeScore,
      adjustedCompositeScore,
      rawEvolutionScore,
      adjustedEvolutionScore: evolutionScore,
      maturityConfidence,
      narrativeRestrictions,
      advisoryRestrictions,
      blockedClaims
    };
  }
};
