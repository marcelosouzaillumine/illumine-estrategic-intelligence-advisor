export type InstitutionalBusinessProfile = {
  segmentoOperacional: string;
  subsetorOperacional?: string;
  modeloOperacional?: string;
  intensidadeEstoque?: 
    | "LOW"
    | "MODERATE"
    | "HIGH";
  intensidadeCapital?: 
    | "LIGHT"
    | "MODERATE"
    | "INTENSIVE";
  perfilCicloFinanceiro?: 
    | "SHORT"
    | "MODERATE"
    | "LONG";
  perfilMargem?: 
    | "LOW_MARGIN"
    | "MODERATE_MARGIN"
    | "HIGH_MARGIN";
  perfilEscalabilidade?: 
    | "LOCAL"
    | "REGIONAL"
    | "SCALABLE";
  dependenciaCapitalGiro?: 
    | "LOW"
    | "MODERATE"
    | "HIGH";
  criticidadeOperacional?: 
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "MISSION_CRITICAL";
};
