export type ClaimContextLimits = {
  blockMaturity: boolean;
  blockStability: boolean;
  blockTrend: boolean;
  blockSustainability: boolean;
};

export class InstitutionalClaimBoundary {
  /**
   * Determina os limites de alegações permitidas (claims) com base na densidade
   * histórica e no grau de confiança estratégica.
   */
  public static resolveLimits(historicalCycles: number, strategicConfidence: string): ClaimContextLimits {
    const limits: ClaimContextLimits = {
      blockMaturity: false,
      blockStability: false,
      blockTrend: false,
      blockSustainability: false
    };

    if (historicalCycles <= 1) {
      limits.blockMaturity = true;
      limits.blockStability = true;
      limits.blockTrend = true;
      limits.blockSustainability = true;
    } else if (historicalCycles === 2) {
      limits.blockMaturity = true;
      limits.blockStability = true; // 2 anos é comparação pontual, não estabilidade
      limits.blockTrend = true; // A rigor, tendência requer >= 3 pontos
    }

    if (strategicConfidence === 'LIMITED_CONTEXT' || strategicConfidence === 'UNVERIFIABLE') {
      limits.blockMaturity = true;
      limits.blockStability = true;
      limits.blockSustainability = true;
    }

    return limits;
  }

  /**
   * Filtra afirmações narrativas bloqueando *optimism leakage* se os limites
   * estruturais assim o exigirem.
   */
  public static sanitizeOptimismLeakage(text: string, limits: ClaimContextLimits): string {
    let sanitized = text;

    if (limits.blockMaturity) {
      sanitized = sanitized.replace(/maturidade\s+operacional|maturidade\s+estrutural/gi, 'estágio operacional corrente');
      sanitized = sanitized.replace(/operação\s+madura/gi, 'operação');
    }

    if (limits.blockStability) {
      sanitized = sanitized.replace(/estabilidade\s+consolidada/gi, 'estabilização corrente');
      sanitized = sanitized.replace(/estabilidade\s+estrutural/gi, 'nível estrutural');
    }

    if (limits.blockTrend) {
      sanitized = sanitized.replace(/tendência\s+consolidada|tendência\s+definitiva/gi, 'indício de comportamento');
    }

    if (limits.blockSustainability) {
      sanitized = sanitized.replace(/crescimento\s+sustentável/gi, 'expansão em avaliação');
    }

    return sanitized;
  }
}
