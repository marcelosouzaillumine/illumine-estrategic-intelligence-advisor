import { JourneyRouteResolver, JourneyRouteInfo } from './journey-route-resolver.service';
import { getRandomMessage } from '../data/concierge-language-library';
import { DomainRegistry } from '../intelligence/diagnostics/core/domain-registry';

export interface ConciergeLeadContext {
  audience?: string;
  context?: string;
  challenge?: string;
}

export interface ExecutiveRecommendationResult {
  focusKey: string;
  journeyId: string;
  synthesisText: string;
  recommendationText: string;
  valueText: string;
  route: JourneyRouteInfo;
}

export class ExecutiveJourneyRecommendationEngine {
  /**
   * Maps a collected context to an Executive Focus domain dynamically.
   */
  private static determineFocus(context: Partial<ConciergeLeadContext>): string {
    if (context.audience === 'advisor') return 'advisor_network';
    if (context.audience === 'client') return 'client_access';

    const intent = context.context || context.challenge;
    if (!intent) return '360';

    // Map common legacy intents to domains
    const legacyMap: Record<string, string> = {
      'financial_predictability': 'financial',
      'operational_challenges': 'operational',
      'growth': 'commercial',
      'strategic_transformation': 'institutional'
    };

    const mappedIntent = legacyMap[intent] || intent;
    
    const registry = DomainRegistry.getInstance();
    if (registry.getDomain(mappedIntent as any)) {
      return mappedIntent;
    }

    return '360';
  }

  /**
   * Maps a focus domain to an official Illumine Journey ID.
   */
  private static mapFocusToJourneyId(focus: string): string {
    if (focus === 'advisor_network') return 'advisor-network';
    if (focus === 'client_access') return 'client-access';
    if (focus === '360') return 'executive-360';
    return `${focus}-intelligence`;
  }

  /**
   * Generates a complete recommendation based on the executive context.
   */
  public static generateRecommendation(context: Partial<ConciergeLeadContext>): ExecutiveRecommendationResult {
    const focusKey = this.determineFocus(context);
    const journeyId = this.mapFocusToJourneyId(focusKey);
    const route = JourneyRouteResolver.resolve(journeyId);

    // If it is advisor or client, synthesis logic might just use the recommendation text
    // as per user rule "Advisor e Cliente devem terminar a conversa com uma recomendação contextual"
    const isSpecialAudience = focusKey === 'advisor_network' || focusKey === 'client_access';
    
    // We get texts from the library
    let synthesisText = getRandomMessage(`syn-${focusKey}`);
    if (!synthesisText && !isSpecialAudience) {
      synthesisText = getRandomMessage(`syn-360`); // fallback
    }

    const recommendationText = getRandomMessage(`rec-${focusKey}`);
    const valueText = getRandomMessage(`val-${focusKey}`);

    return {
      focusKey,
      journeyId,
      synthesisText,
      recommendationText,
      valueText,
      route
    };
  }
}
