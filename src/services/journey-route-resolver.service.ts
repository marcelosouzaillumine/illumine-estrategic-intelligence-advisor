import { DomainRegistry } from '../intelligence/diagnostics/core/domain-registry';

export interface JourneyRouteInfo {
  routeKey: string;
  path: string;
}

export class JourneyRouteResolver {
  /**
   * Resolves a logical journey ID to a physical route in the application dynamically.
   */
  static resolve(journeyId: string): JourneyRouteInfo {
    const domainPrefix = journeyId.replace('-governance', '');
    const registry = DomainRegistry.getInstance();
    const meta = registry.getDomain(domainPrefix as any);

    if (meta) {
      return {
        routeKey: journeyId,
        path: `/diagnostico?domain=${domainPrefix}`
      };
    }

    // Default Fallbacks
    if (journeyId === 'executive-360') {
      return { routeKey: 'executive-360', path: '/diagnostico' };
    }
    if (journeyId === 'advisor-network') {
      return { routeKey: 'advisor-network', path: '/advisor-network' };
    }
    if (journeyId === 'client-access') {
      return { routeKey: 'client-access', path: '/login' };
    }

    return { routeKey: 'executive-360', path: '/diagnostico' };
  }
}
