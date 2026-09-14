import { SessionEvent, SessionContext } from './ExecutiveSessionIntelligence';
import { ExecutiveRelationshipState } from './ExecutiveRelationshipState';

export interface ExecutiveInteractionScore {
  relevance: number;
  novelty: number;
  impact: number;
  urgency: number;
  personalization: number;
  confidence: number;
  totalScore: number;
}

export interface InteractionDecision {
  mode: 'SILENT_MODE' | 'EXECUTIVE_BRIEFING' | 'CRITICAL_ALERT';
  reasoning: string;
  score?: ExecutiveInteractionScore;
}

export class ExecutiveInteractionDecisionEngine {
  /**
   * Calcula o Score Multidimensional de Interação
   */
  private static calculateScore(context: SessionContext, state: ExecutiveRelationshipState): ExecutiveInteractionScore {
    // Heurísticas básicas baseadas nos dados fornecidos pelo Context Engine
    let relevance = 0;
    let novelty = context.noveltyScore || 0;
    let impact = 0;
    let urgency = context.urgencyScore || 0;
    let personalization = 50; // Base baseline
    let confidence = context.confidenceScore || 90; // Em geral, alta

    if (context.event === SessionEvent.CRITICAL_EVENT) {
      impact = 100; urgency = 100; relevance = 100; novelty = 100;
    } else if (context.event === SessionEvent.LONG_ABSENCE) {
      impact = 80; novelty = 90; relevance = 80;
    } else if (context.event === SessionEvent.FIRST_ACCESS_OF_DAY) {
      if (context.changes && context.changes > 0) novelty = 80;
      if (context.recommendations && context.recommendations > 0) impact = 70;
      if (context.criticalAlerts && context.criticalAlerts > 0) urgency = 90;
      relevance = 60; 
    }

    // Se houve cruzamento com o perfil (mock simples)
    if (context.recipientIdentified) {
      personalization = 100;
    }

    const totalScore = (
      (impact * 0.30) +
      (relevance * 0.25) +
      (novelty * 0.15) +
      (urgency * 0.15) +
      (personalization * 0.10) +
      (confidence * 0.05)
    );

    return {
      relevance, novelty, impact, urgency, personalization, confidence, totalScore
    };
  }

  /**
   * AR-GFC-ERI-006: Executive Interaction Value Validation
   * O gate validador exigirá 4 propriedades inegociáveis.
   */
  private static validateGovernanceGate(context: SessionContext): boolean {
    if (context.isCriticalOverride) return true; // Exceção explícita
    
    if (!context.contextDescription || 
        !context.impactDescription || 
        !context.recipientIdentified || 
        !context.potentialAction) {
      return false;
    }
    return true;
  }

  static decide(context: SessionContext, state: ExecutiveRelationshipState): InteractionDecision {
    if (!context) {
      return {
        mode: 'SILENT_MODE',
        reasoning: 'System Safeguard: Context is undefined.'
      };
    }

    // 1. Cenário 7: Executive Value Override (Critical Alert bypassa regras se urgente)
    if (context.isCriticalOverride || context.event === SessionEvent.CRITICAL_EVENT) {
      return {
        mode: 'CRITICAL_ALERT',
        reasoning: 'Executive Value Override: Alerta crítico urgente supera políticas de silêncio.'
      };
    }

    // 2. Cenário 6: False Positive Protection (Não há novidades nem recomendações)
    if (!context.changes && !context.criticalAlerts && !context.recommendations && context.event !== SessionEvent.LONG_ABSENCE) {
      return {
        mode: 'SILENT_MODE',
        reasoning: 'False Positive Protection: Nenhuma mudança ou risco que justifique interação estrutural.'
      };
    }

    // 3. Calcula o Executive Interaction Intelligence Score
    const score = this.calculateScore(context, state);

    // 4. Valida AR-GFC-ERI-006 (Executive Value Minimum)
    const passedGate = this.validateGovernanceGate(context);
    if (!passedGate) {
      return {
        mode: 'SILENT_MODE',
        reasoning: 'AR-GFC-ERI-006: Requisitos obrigatórios de Contexto, Impacto, Ação ou Recipiente ausentes. FORCE SILENT_MODE.',
        score
      };
    }

    // 5. Aplica a régua de interação
    if (score.totalScore < 60) {
      return {
        mode: 'SILENT_MODE',
        reasoning: `Score insuficiente (${score.totalScore.toFixed(1)}). Silêncio mantido.`,
        score
      };
    } else if (score.totalScore >= 80) {
      return {
        mode: 'EXECUTIVE_BRIEFING',
        reasoning: `Score alto (${score.totalScore.toFixed(1)}). Briefing executivo justificado.`,
        score
      };
    } else {
      // Entre 60 e 80: Avalia se o contexto justifica (soft briefing)
      // Para fins da plataforma, vamos disparar o briefing apenas se houver novidade.
      if (score.novelty > 70) {
         return { mode: 'EXECUTIVE_BRIEFING', reasoning: `Score intermediário (${score.totalScore.toFixed(1)}) mas com alta novidade. Briefing autorizado.`, score };
      }
      return { mode: 'SILENT_MODE', reasoning: `Score intermediário (${score.totalScore.toFixed(1)}) sem novidade suficiente. Silêncio mantido.`, score };
    }
  }
}
