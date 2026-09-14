import { ExecutiveIntent } from '../../executive-semantic-layer/src/IntentResolver';

export interface AnswerQualityReport {
  score: number;
  approved: boolean; // Limite de 90 pontos
  reasons: string[];
}

export class ExecutiveAnswerQualityValidator {
  /**
   * AR-GFC-COP-003, AR-GFC-COP-005, AR-GFC-COP-006
   * Camada de Autoavaliação da qualidade da resposta.
   * Determina o Intent Satisfaction Score.
   */
  static evaluate(intent: ExecutiveIntent, finalResponse: string): AnswerQualityReport {
    let score = 100;
    const reasons: string[] = [];
    
    // 1. Intent Satisfaction
    if (intent === ExecutiveIntent.PAGE_PURPOSE) {
      const lower = finalResponse.toLowerCase();
      // Espera-se que fale de uso estratégico ou decisões
      if (!lower.includes('estratégic') && !lower.includes('decis') && !lower.includes('visão')) {
        score -= 15;
        reasons.push("Não explica como a página apoia decisões.");
      }
    }
    
    // 2. Executive Language & Structure (Começo, Meio e Fim)
    const paragraphs = finalResponse.split('\\n').filter(p => p.trim().length > 0);
    if (paragraphs.length < 2) {
      score -= 15;
      reasons.push("Falta de estrutura (precisa ter contexto, utilidade e ação).");
    }
    
    if (finalResponse.toLowerCase().includes('olá') || finalResponse.toLowerCase().includes('tudo bem')) {
      score -= 20;
      reasons.push("Introduções coloquiais ou robóticas desnecessárias.");
    }
    
    // 3. Completeness
    if (finalResponse.length < 50) {
      score -= 20;
      reasons.push("Resposta muito superficial.");
    }

    return {
      score,
      approved: score >= 90,
      reasons
    };
  }
}
