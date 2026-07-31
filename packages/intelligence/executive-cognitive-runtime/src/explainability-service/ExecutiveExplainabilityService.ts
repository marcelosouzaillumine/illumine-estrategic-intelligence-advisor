import { ExecutiveDecisionPackage } from '../contracts/ExecutiveDecisionPackage';

export class ExecutiveExplainabilityService {
  explain(pkg: ExecutiveDecisionPackage): ExecutiveDecisionPackage {
    return { ...pkg, explainability: { tree: [] } };
  }
}
