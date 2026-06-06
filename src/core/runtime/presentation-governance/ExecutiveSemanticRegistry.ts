// src/core/runtime/presentation-governance/ExecutiveSemanticRegistry.ts

/**
 * Central registry for semantic sovereignty.
 * Defines prohibited terms (Level 1), translatable terms (Level 2) and technical-only terms (Level 3).
 */
export class ExecutiveSemanticRegistry {
  // Level 1 – prohibited in BOARD/EXECUTIVE
  static readonly PROHIBITED: Set<string> = new Set([
    'runtime',
    'FULL_FINANCIAL_VIEW',
    'HIGH_CONFIDENCE',
    'ENGINE',
    'MODULE',
    'RUNTIME',
    'PIPELINE',
    'ORCHESTRATOR',
    'BADI',
    'EQE',
    'CDIL',
    'EFSI',
    'EFOS',
    'DFC_CONTINUITY_PRESSURE',
    'CAPITAL_DESTRUCTION',
    'DRE_DFC_DLPA',
    'EXECUTIVE_STRATEGIC_SNAPSHOT',
    // Additional terms from user request
    'Canonical',
    'Canônico',
    'Métricas Canônicas',
    'Score Calculado',
    'Score Fiduciário Ajustado',
    'Debug Mode',
    'chain',
    'severity',
    'sourceModule',
    'runtimeMetadata'
  ]);

  // Level 2 – translatable to institutional language
  static readonly TRANSLATIONS: Record<string, string> = {
    'Board Attention Demand Index': 'Nível de Atenção Exigida',
    'BADI': 'Nível de Atenção Exigida',
    'Cross-Statement Tensions': 'Interdependências Financeiras Relevantes',
    'Score Calculado': 'Avaliação Inicial',
    'Score Fiduciário Ajustado': 'Avaliação Institucional',
    'Executive Strategic Snapshot': 'Síntese Estratégica do Exercício',
    'Métricas Canônicas Válidas': 'Indicadores Consolidados Validados',
    'Runway': 'Capacidade de Sustentação Financeira',
    'Cadeia': 'Relação identificada',
    // add any other Level 2 mappings as needed
  };

  // Level 3 – technical only, may appear in TECHNICAL view
  static readonly TECHNICAL: Set<string> = new Set([
    'engineId',
    'sourceModule',
    'lineage',
    'runtimeMetadata',
    'debugPayload',
    'rawScore',
    'adjustmentReason',
    'causalChainId'
  ]);

  static isProhibited(term: string): boolean {
    return ExecutiveSemanticRegistry.PROHIBITED.has(term);
  }

  static translate(term: string): string | undefined {
    return ExecutiveSemanticRegistry.TRANSLATIONS[term];
  }

  static isTechnical(term: string): boolean {
    return ExecutiveSemanticRegistry.TECHNICAL.has(term);
  }
}
