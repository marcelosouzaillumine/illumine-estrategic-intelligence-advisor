import { ExecutiveAnalyticsResult } from '../executive-analytics-engine';

export interface NarrativeBlock {
  type: 'DIAGNOSTIC' | 'WARNING' | 'RECOMMENDATION' | 'EXECUTIVE_SUMMARY';
  content: string;
  sourceDiagnosticId?: string; // Vincula a narrativa à capacidade original
}

export interface ExecutiveNarrative {
  title: string;
  blocks: NarrativeBlock[];
  language: 'pt-BR' | 'en-US' | 'es-ES';
  targetAudience: 'BOARD' | 'INVESTOR' | 'BANK' | 'C_LEVEL';
}

/**
 * Traduz os resultados analíticos brutos em narrativas humanas.
 * Não realiza NENHUM cálculo, apenas formata a saída.
 */
export class ExecutiveNarrativeEngine {
  
  public static generateNarrative(
    analytics: ExecutiveAnalyticsResult, 
    language: 'pt-BR' | 'en-US' | 'es-ES' = 'pt-BR',
    audience: 'BOARD' | 'INVESTOR' | 'BANK' | 'C_LEVEL' = 'C_LEVEL'
  ): ExecutiveNarrative {
    const blocks: NarrativeBlock[] = [];

    for (const diag of analytics.diagnostics) {
      if (diag.capability === 'Liquidity') {
        let content = '';
        if (diag.status === 'HEALTHY' || diag.status === 'EXCELLENT') {
          content = 'A empresa apresenta uma liquidez robusta, demonstrando capacidade plena de honrar seus compromissos de curto prazo.';
        } else if (diag.status === 'CRITICAL') {
          content = 'Alerta: A empresa está com liquidez comprometida, indicando risco iminente de ruptura de caixa no curto prazo.';
        } else {
          content = diag.technicalConclusion;
        }

        blocks.push({
          type: 'DIAGNOSTIC',
          content,
          sourceDiagnosticId: diag.evidence.evidenceId
        });
      }
    }

    return {
      title: 'Síntese Executiva',
      blocks,
      language,
      targetAudience: audience
    };
  }
}
