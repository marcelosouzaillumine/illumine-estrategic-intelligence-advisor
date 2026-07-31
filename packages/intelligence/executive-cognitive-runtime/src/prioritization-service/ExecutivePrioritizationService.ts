import { ExecutiveDecisionPackage } from '../contracts/ExecutiveDecisionPackage';

export class ExecutivePrioritizationService {
  prioritize(pkg: ExecutiveDecisionPackage): ExecutiveDecisionPackage {
    return { ...pkg, recommendation: { impact: 'high', urgency: 'high', effort: 'low' } };
  }
}
