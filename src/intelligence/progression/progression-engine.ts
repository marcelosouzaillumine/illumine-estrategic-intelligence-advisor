import { ProgressionEngineContract, ProgressionRecommendation } from './progression-types';
import { ExecutiveProfilePortfolio } from '../executive-profile/portfolio-types';
import { ExecutiveProfileRecord } from '../executive-profile/profile-types';
import { DomainRegistry } from '../diagnostics/core/domain-registry';
import { ExecutiveDomainGraph } from './executive-domain-graph';
import { DiagnosticDomain } from '../diagnostics/core/diagnostic-types';

export class ExecutiveProgressionEngine implements ProgressionEngineContract {
  
  public getNextExecutiveJourney(
    currentPortfolio: ExecutiveProfilePortfolio | null,
    latestProfile: ExecutiveProfileRecord | null
  ): ProgressionRecommendation {
    
    const registry = DomainRegistry.getInstance();
    const coreFoundations = registry.getCoreFoundations();
    const firstCore = coreFoundations.length > 0 ? coreFoundations[0].domain : 'executive360';
    
    // Default fallback if no profile exists
    if (!latestProfile || !currentPortfolio) {
      return {
        recommendedJourney: `${firstCore}-governance`,
        reason: `O ponto de partida recomendado para construir a inteligência executiva da organização.`,
        expectedEvolution: `Estruturação da capacidade fundacional de ${coreFoundations[0]?.name || firstCore}.`
      };
    }

    const graph = ExecutiveDomainGraph.getInstance();
    const completedDomains = Object.keys(currentPortfolio.domains)
      .filter(k => currentPortfolio.domains[k as DiagnosticDomain]?.status === 'completed') as DiagnosticDomain[];
      
    const suggestion = graph.suggestNext(completedDomains);

    if (suggestion) {
      const domainMeta = registry.getDomain(suggestion.target);
      return {
        recommendedJourney: `${suggestion.target}-governance`,
        reason: suggestion.reason,
        expectedEvolution: `Fortalecimento das capacidades de ${domainMeta?.name || suggestion.target}.`
      };
    }

    // Default next step if mapping is undefined or all complete
    return {
      recommendedJourney: 'executive360-governance',
      reason: 'Sua organização mapeou os principais domínios estratégicos. O próximo passo é o ciclo 360.',
      expectedEvolution: 'Otimização transversal contínua.'
    };
  }
}

export const ProgressionEngine = new ExecutiveProgressionEngine();
