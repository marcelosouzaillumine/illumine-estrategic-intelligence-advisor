/**
 * ExecutivePresentationLabelRegistry
 * 
 * Central registry for DFC executive dashboard presentation titles and labels.
 * Decouples presentation text from the UI components.
 */
export class ExecutivePresentationLabelRegistry {
  private static readonly LABELS: Record<string, string> = {
    'DFC_EXECUTIVE_SUMMARY': 'Resumo Executivo de Caixa',
    'DFC_SNAPSHOT_TITLE': 'Resumo Executivo de Caixa',
    'DFC_DIAGNOSIS_TITLE': 'Diagnóstico Executivo',
    'DFC_RUNWAY_TITLE': 'Horizonte de Sobrevivência',
    'DFC_BOARD_ADVISORY_TITLE': 'Advisory do Conselho',
    'DFC_RECONCILIATION_SUMMARY_TITLE': 'Reconciliação BP × DFC',
    'DFC_BOARD_PRIORITIES_TITLE': 'Prioridades do Conselho',
    'DFC_CAUSAL_INTELLIGENCE_TITLE': 'Inteligência Causal de Caixa',
    'DFC_EARLY_WARNING_TITLE': 'Painel de Alertas Prévios',
    'DFC_SCENARIO_SIMULATION_TITLE': 'Mecanismo de Simulação de Cenários',
    'DFC_TECHNICAL_LAYER_TITLE': 'Camada Técnica',
    'DFC_EQE_SUMMARY_EXECUTIVE': 'Qualidade da Geração Econômica',
    'DFC_EQE_SUMMARY_TECHNICAL': 'Qualidade do Lucro — Camada Técnica EQE',
    'DFC_CONTEXT_TITLE': 'Contexto Empresarial',
    'DFC_CQS_SUMMARY_TITLE': 'Health Score de Caixa (CQS)',
    'DFC_REVENUE_CASH_CONVERSION_TITLE': 'Conversão Receita → Caixa',
    'DFC_SHAREHOLDER_DEPENDENCY_TITLE': 'Dependência dos Sócios',
    'DFC_EFSI_TITLE': 'Sustentabilidade da Tesouraria',
  };

  /**
   * Retrieves the mapped executive presentation text for the given registry key.
   */
  public static getLabel(key: string): string {
    return this.LABELS[key] ?? key;
  }
}
