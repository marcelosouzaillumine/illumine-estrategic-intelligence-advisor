import { GovernanceSignal } from '../signal-hierarchy/types';

export class CausalDependencyResolver {
  public resolveDependencies(signal: GovernanceSignal, context: GovernanceSignal[]) {
    return context.filter(s => s.id !== signal.id);
  }
}
