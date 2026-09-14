export enum SemanticCategory {
  VERY_WEAK = 'VERY_WEAK',
  WEAK = 'WEAK',
  MODERATE = 'MODERATE',
  STRONG = 'STRONG',
  VERY_STRONG = 'VERY_STRONG'
}

export function normalizeClassification(rawOutput: string): SemanticCategory {
  if (!rawOutput) return SemanticCategory.MODERATE;
  
  const v = rawOutput.toUpperCase();
  
  // VERY STRONG
  if (v.includes('VERY STRONG') || v.includes('EXCELENTE') || v.includes('ALTA MATURIDADE') || v.includes('MUITO FORTE')) {
    return SemanticCategory.VERY_STRONG;
  }
  
  // STRONG
  if (v.includes('STRONG') || v.includes('FORTE') || v.includes('ROBUSTO') || v.includes('ELEVADO') || v.includes('SÓLIDA') || v.includes('SÓLIDO') || v.includes('ROBUSTA')) {
    return SemanticCategory.STRONG;
  }
  
  // VERY WEAK
  if (v.includes('VERY WEAK') || v.includes('CRÍTICO') || v.includes('INSOLVÊNCIA') || v.includes('ESTÁGIO INICIAL') || v.includes('SEVERE') || v.includes('LIMITAÇÕES SEVERAS')) {
    return SemanticCategory.VERY_WEAK;
  }
  
  // WEAK
  if (v.includes('WEAK') || v.includes('FRACO') || v.includes('BAIXO') || v.includes('LIMITADA') || v.includes('LIMITADO')) {
    return SemanticCategory.WEAK;
  }
  
  // MODERATE (Fallback and explicit matches)
  return SemanticCategory.MODERATE;
}

export function getCategoryNumericValue(category: SemanticCategory): number {
  switch (category) {
    case SemanticCategory.VERY_STRONG: return 5;
    case SemanticCategory.STRONG: return 4;
    case SemanticCategory.MODERATE: return 3;
    case SemanticCategory.WEAK: return 2;
    case SemanticCategory.VERY_WEAK: return 1;
    default: return 3;
  }
}
