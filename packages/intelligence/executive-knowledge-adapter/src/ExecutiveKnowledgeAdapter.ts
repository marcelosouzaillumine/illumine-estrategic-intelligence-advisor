export interface CanonicalKnowledge {
  pagePurpose?: string;
  businessValue?: string;
  kpis?: Record<string, string>;
  insights?: string[];
  risks?: string[];
  recommendations?: string[];
  rawOutput?: string;
}

export class ExecutiveKnowledgeAdapter {
  /**
   * Transforma o conhecimento bruto devolvido pelo Agente Especialista
   * em um formato canônico institucional.
   * Independente se o agente é Financeiro, Governança ou RH,
   * a saída sempre será normalizada nesta interface.
   */
  static normalize(agentOutput: string): CanonicalKnowledge {
    // Mocking an extraction from the agent output.
    // In production, the agent might return a JSON or we use NLP to extract fields.
    
    return {
      pagePurpose: "Central de monitoramento e análise de indicadores-chave do domínio selecionado.",
      businessValue: "Assegura que a liderança obtenha visibilidade imediata para fundamentar decisões estratégicas e táticas.",
      kpis: {
        "Indicador Principal": "Métrica vital de saúde operacional.",
      },
      insights: [
        "Os dados atuais demonstram conformidade com as diretrizes do conselho.",
        "Existe uma estabilidade estrutural que protege contra choques externos."
      ],
      risks: [
        "Variações imprevistas no cenário macroeconômico podem pressionar a margem."
      ],
      recommendations: [
        "Estabelecer ciclos quinzenais de revisão de cenários.",
        "Aprofundar a análise preditiva na aba de simulações."
      ],
      rawOutput: agentOutput
    };
  }
}
