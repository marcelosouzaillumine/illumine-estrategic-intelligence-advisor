import { ExecutiveDecisionPackage } from '../contracts/ExecutiveDecisionPackage';

export class ExecutiveReasoningService {
  reason(pkg: ExecutiveDecisionPackage): ExecutiveDecisionPackage {
    return { ...pkg, state: 'REASONED', reasoning: { Observation: '', Hypothesis: '', Evidence: '' } };
  }
}
