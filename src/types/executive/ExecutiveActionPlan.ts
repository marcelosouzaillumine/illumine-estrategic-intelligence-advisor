export interface ExecutiveActionStep {
  domain: string; // e.g. "Financeiro", "Operacional"
  horizon: string; // e.g. "Curto Prazo", "Médio Prazo", "Longo Prazo"
  description: string;
  isPrimaryStep?: boolean;
}

export interface ExecutiveActionPlan {
  status: "MONITORAMENTO" | "EXECUÇÃO" | "ATENÇÃO" | "CONCLUÍDO" | string;
  strategicObjective: string;
  executiveSummary: string;
  primaryDriver: string;
  confidence: "ALTA" | "MÉDIA" | "BAIXA" | string;
  steps: ExecutiveActionStep[];
}
