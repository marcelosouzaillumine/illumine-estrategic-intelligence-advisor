export interface ExecutiveLifecycleContext {
  executiveTitle: string;
  executiveBadge: string;
  executiveDescription: string;
}

export class ExecutiveLifecycleContextResolver {
  /**
   * Resolves the executive context based on the lifecycle stage.
   * 
   * NOTE: This resolver is designed to be reusable across the entire platform, including:
   * DFC, DLPA, CGE, Board Pack, CDIL, and ISE.
   * 
   * It relies solely on `lifecycleStage` and `lifecycleLabel` for generating the executive text.
   * Fields like `semanticSource` and `canonicalRoot` are explicitly avoided here, as they belong 
   * to the audit layer and should not influence executive presentation.
   */
  public static resolve(lifecycleStage?: string, lifecycleLabel?: string): ExecutiveLifecycleContext {
    if (!lifecycleStage || !lifecycleLabel) {
      return {
        executiveTitle: 'Contexto Empresarial',
        executiveBadge: 'Contexto empresarial não classificado',
        executiveDescription: 'Os dados disponíveis não permitem determinar com segurança o estágio empresarial.'
      };
    }

    const descriptions: Record<string, string> = {
      'INITIAL_CAPITALIZATION': 'A instituição encontra-se em fase de estruturação e tração inicial, com elevada dependência de capital para sustentar operações e formação de caixa.',
      'SCALING_PHASE': 'A instituição está em fase de ganho de escala operacional, com desafios de alavancagem de crescimento e conversão de caixa.',
      'MATURITY': 'A instituição atingiu consolidação estrutural, operando em estágio de maturidade com fluxo operacional estruturado.',
      'DECLINE': 'A instituição apresenta sinais de retração ou deterioração em seu estágio de vida, requerendo revisão de rotas de liquidez.',
      'TURNAROUND': 'A instituição encontra-se em regime de reestruturação estratégica ou turnaround financeiro e operacional.',
      'UNKNOWN': 'Estágio de maturidade atual não identificado, em zona de transição, ou com dados mistos insuficientes.'
    };

    return {
      executiveTitle: 'Contexto Empresarial',
      executiveBadge: lifecycleLabel,
      executiveDescription: descriptions[lifecycleStage] || descriptions['UNKNOWN']
    };
  }
}
