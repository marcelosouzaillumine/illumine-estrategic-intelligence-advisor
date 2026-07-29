export interface KPIExplanationResult {
  readonly summary: string; // Layer 1 (5s read)
  readonly evidences: string[]; // Layer 2 (Evidences)
  readonly recommendations: string[]; // Layer 3 (Recommendations)
}

export class KPIExplanationEngine {
  public static explainMetric(metricCode: string, value: number): KPIExplanationResult {
    return {
      summary: `A variação em ${metricCode} (${value}) decorre de oscilação em custos de insumo e margem comercial.`,
      evidences: [`CMV +8%`, `Despesas logísticas +12%`, `Volume de vendas -4%`],
      recommendations: [`Revisar tabela de preços`, `Renegociar contratos com fornecedores`]
    };
  }
}

export class KPIQuestionResolver {
  public static getKPIQuestions(metricCode: string): string[] {
    return [
      `Por que o ${metricCode} mudou?`,
      `Como o ${metricCode} é calculado?`,
      `Quais fatores influenciaram o ${metricCode}?`,
      `Quais decisões devo tomar para o ${metricCode}?`,
      `Simular cenários para ${metricCode}`
    ];
  }
}

export class KPIIntelligenceTrigger {
  public static triggerForKPI(metricCode: string, value: number): KPIExplanationResult {
    return KPIExplanationEngine.explainMetric(metricCode, value);
  }
}
