import { AIAllowedContext, AIGroundingReference } from './AIGovernanceTypes';

export class AIResponseGroundingEngine {
  /**
   * Extrai a prova fiduciária de que o contexto entregue à LLM é válido.
   */
  static extractGrounding(contexts: AIAllowedContext[]): AIGroundingReference[] {
    if (contexts.length === 0) {
      throw new Error('INSUFFICIENT_GROUNDED_CONTEXT');
    }

    return contexts.map(ctx => ({
      sourceType: ctx.payload.type || 'REPORT',
      sourceId: ctx.contextId,
      executionId: ctx.payload.executionId || 'EXEC-UNKNOWN',
      lineageHash: ctx.lineageHash,
      confidence: ctx.payload.confidence || 'HIGH',
      timestamp: new Date().toISOString()
    }));
  }
}
