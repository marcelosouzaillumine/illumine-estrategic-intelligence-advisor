/**
 * CanonicalInstitutionalTaxonomyRegistry
 * 
 * Nova Single Source of Truth para nomenclaturas institucionais do Executive Advisory Runtime.
 * Toda nova engine deve consumir este registry para evitar o drift semântico entre a UI,
 * a narrativa e o engine.
 */
export const CanonicalInstitutionalTaxonomyRegistry: Record<string, string> = {
  // Business Stages / Maturidade
  "STAGE_INITIAL": "Operação Inicial",
  "STAGE_STRUCTURING": "Operação em Estruturação",
  "STAGE_MATURE": "Operação Madura",
  "STAGE_CONSOLIDATED": "Operação Consolidada",
  "STAGE_RECOVERY": "Operação em Recuperação",
  "STAGE_SCALING": "Operação em Escala",
  "STAGE_EXPANDING": "Operação em Expansão",

  // Operational Models
  "MODEL_ASSET_LIGHT": "Operação com baixa dependência de ativos imobilizados",
  "MODEL_INVENTORY_HEAVY": "Operação Intensiva em Estoques",
  "MODEL_PROJECT_BASED": "Operação Baseada em Projetos",
  "MODEL_SERVICE_HEAVY": "Operação Intensiva em Serviços",

  // Strategic Traits & Sensitivities
  "TRAIT_INVENTORY_HEAVY": "Intensivo em Estoques",
  "TRAIT_ASSET_LIGHT": "Leve em Ativos Imobilizados",
  "TRAIT_SUPPLIER_DEPENDENCY": "Dependência de Fornecedores",
  "TRAIT_OPERATIONAL_LEVERAGE": "Alavancagem Operacional",
  "TRAIT_WORKING_CAPITAL_PRESSURE": "Pressão de Capital de Giro",
  "TRAIT_OPERATIONAL_CASH_CYCLE": "Ciclo de Caixa Operacional",
  "TRAIT_FIXED_COST_BURDEN": "Peso de Custo Fixo",
  "TRAIT_CONTRIBUTION_MARGIN_PRESSURE": "Pressão de Margem de Contribuição",

  // Confidence & Context
  "CONTEXT_LIMITED": "Contexto Parcial",
  "CONTEXT_GENERIC": "Segmento Genérico",
  "CONTEXT_INFERRED": "Segmento Inferido",
  "CONTEXT_EXACT": "Segmento Exato",

  // Strategic Executive Terms
  "TERM_BREAKEVEN": "Ponto de Equilíbrio",
  "TERM_UNIT_ECONOMICS": "Economia Unitária",

  // Sections
  "SECTION_EXECUTIVE_FINANCIAL_ANALYTICS": "Inteligência Financeira Executiva",
  "SECTION_LIQUIDITY_WATERFALL": "Estrutura de Liquidez e Capital de Giro",
  "SECTION_BOARD": "Conselho",
  "SECTION_DEFAULT": "Inadimplência Operacional",
  "SECTION_KPI": "Indicador-Chave"
};

/**
 * Helper para resolver a tradução canônica. Caso a chave não exista,
 * retorna a própria chave ou um fallback para evitar crashes.
 */
export const getCanonicalTerm = (key: string, fallback?: string): string => {
  return CanonicalInstitutionalTaxonomyRegistry[key] || fallback || key;
};
