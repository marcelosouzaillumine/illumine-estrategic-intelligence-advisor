import { ExecutiveRelationshipState } from './ExecutiveRelationshipState';
import { SessionContext } from './ExecutiveSessionIntelligence';
import { ExecutiveInteractionDecisionEngine } from './ExecutiveInteractionDecisionEngine';
import { ExecutiveBriefingGenerator } from './ExecutiveBriefingGenerator';
import { ExecutiveRelationshipPolicy } from './ExecutiveRelationshipPolicy';
import { ExecutiveIdentityContext } from '../../executive-identity-context/src/ExecutiveIdentityContext';

export class ExecutiveRelationshipEngine {
  // Simulação do Estado em Memória (Na produção viria do Context Engine + DB)
  private static currentState: ExecutiveRelationshipState = {
    userIdentity: 'exec_user',
    operationalRole: 'CLIENT',
    executivePersona: 'CEO',
    companyContext: 'master_tenant',
    lastAccess: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Ontem
    lastInteraction: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    journeyStage: 'ACTIVE',
    activeRecommendations: 2,
    unresolvedItems: 0,
    relevantChanges: 1,
    communicationPreference: 'direct',
    interactionMode: 'PROACTIVE'
  };

  /**
   * Ponto de entrada do ERI. Ouve eventos da Sessão e decide se gera um Briefing.
   * AR-GFC-ERI-007 exige que a Identidade seja passada e validada aqui.
   */
  static evaluateEvent(identity: ExecutiveIdentityContext, context: SessionContext): string | null {
    if (!identity) {
      throw new Error('AR-GFC-ERI-007: Nenhuma interação ERI pode ocorrer sem identidade resolvida.');
    }

    // Valida Política Anti-Spam
    if (!ExecutiveRelationshipPolicy.enforcePolicy(this.currentState.lastInteraction)) {
      return null;
    }

    // 1. Interpreta a necessidade de interagir
    const decision = ExecutiveInteractionDecisionEngine.decide(context, this.currentState);

    // 2. Se a decisão for Silêncio, não retorna nada (SILENT_MODE).
    if (decision.mode === 'SILENT_MODE') {
      return null;
    }

    // 3. Caso contrário, gera a experiência adequada (Executive Briefing ou Alerta)
    const briefing = ExecutiveBriefingGenerator.generateBriefing(identity, context);
    
    // Atualiza memória
    this.currentState.lastInteraction = new Date().toISOString();
    
    return briefing;
  }
}
