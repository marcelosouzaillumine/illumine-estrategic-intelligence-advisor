import { CrossStatementTension } from './CrossStatementPropagationEngine';
import { BoardDecision } from '../executive-prioritization/BoardTop3DecisionEngine';

export class CrossStatementPresentationGuard {
  /**
   * Bloqueia a renderização da string legada de fallback "Nenhuma tensão detectada"
   * se houver qualquer risco cruzado ou fiduciário acionado.
   */
  public static canRenderFallback(
    tensions: CrossStatementTension[], 
    badiScore: number, 
    boardTop3: BoardDecision[]
  ): boolean {
    if (tensions.length > 0) return false;
    if (badiScore >= 70) return false;
    if (boardTop3.length > 0) return false;
    
    return true;
  }

  /**
   * Valida se a tensão possui fonte canônica permitida para renderização no nível
   */
  public static canRenderTension(tension: CrossStatementTension, densityLevel: string): boolean {
    if (densityLevel === 'BOARD' || densityLevel === 'EXECUTIVE') {
      return tension.source === 'CANONICAL_PROPAGATION';
    }
    return true; // DEBUG ou TECHNICAL permitem ver SYNTHETIC_GUARD
  }
}
