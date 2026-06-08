export const ExecutivePresentationDictionary = {
  severities: {
    CRITICAL: "Atenção máxima",
    WARNING: "Ponto de atenção",
    NORMAL: "Situação controlada",
    INFO: "Informação relevante",
    UNDETERMINED: "Análise inconclusiva",
    HIGH: "Impacto elevado",
    MEDIUM: "Impacto moderado",
    LOW: "Impacto reduzido"
  },
  sections: {
    DFC_CAUSAL_INTELLIGENCE: "Inteligência causal do fluxo de caixa",
    BP_EQUITY_STRUCTURE: "Estrutura patrimonial",
    BP_EQUITY_ALERT: "Alerta de estrutura patrimonial",
    DRE_EARNINGS_QUALITY: "Qualidade do resultado",
    ESG_GOVERNANCE_MATURITY: "Maturidade de governança",
    EFSI: "Indicador de Estabilidade Financeira Institucional",
    CDIL: "Nível de Risco Causal",
    OPERATING_PRESSURE: "Pressão operacional",
    SYSTEMIC_HEATMAP: "Mapa de calor sistêmico"
  },
  modes: {
    TECHNICAL: "Visão técnica",
    EXECUTIVE: "Visão executiva",
    BOARD: "Visão para conselho"
  },
  status: {
    ACTIVE: "Em andamento",
    RESOLVED: "Concluído",
    PENDING: "Aguardando análise"
  }
} as const;

export type DictionaryContext = keyof typeof ExecutivePresentationDictionary;
