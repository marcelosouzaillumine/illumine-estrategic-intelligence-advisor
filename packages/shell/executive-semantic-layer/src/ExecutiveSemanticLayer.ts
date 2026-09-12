import { ExecutiveIntent } from './IntentResolver';
import { CanonicalKnowledge } from '../../executive-knowledge-adapter/src/ExecutiveKnowledgeAdapter';

export interface SemanticInterpretation {
  intent: ExecutiveIntent;
  interpretedContent: string;
}

export class ExecutiveSemanticLayer {
  /**
   * Camada responsável por interpretar o conhecimento canônico
   * à luz da intenção original do usuário.
   */
  static interpret(intent: ExecutiveIntent, knowledge: CanonicalKnowledge): SemanticInterpretation {
    let interpreted = '';
    
    // A camada semântica extrai cirurgicamente apenas as partes relevantes
    // da CanonicalKnowledge de acordo com a Intenção do usuário.
    switch (intent) {
      case ExecutiveIntent.PAGE_PURPOSE:
        interpreted = `${knowledge.pagePurpose || ''} ${knowledge.businessValue || ''}`;
        break;
      case ExecutiveIntent.KPI_EXPLANATION:
        interpreted = Object.entries(knowledge.kpis || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join('\\n');
        break;
      case ExecutiveIntent.RISK_ANALYSIS:
        interpreted = (knowledge.risks || []).join('\\n');
        break;
      case ExecutiveIntent.RECOMMENDATION:
        interpreted = (knowledge.recommendations || []).join('\\n');
        break;
      case ExecutiveIntent.EXECUTIVE_SUMMARY:
        interpreted = [
          knowledge.pagePurpose,
          ...(knowledge.insights || []),
          ...(knowledge.recommendations || [])
        ].filter(Boolean).join('\\n');
        break;
      default:
        interpreted = `${knowledge.pagePurpose || ''} ${knowledge.businessValue || ''}`;
        break;
    }
    
    // Removed simulated leak injection to allow real output

    return {
      intent,
      interpretedContent: interpreted
    };
  }
}
