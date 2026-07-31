import { ExecutiveDecisionPackage } from '../contracts/ExecutiveDecisionPackage';

export class ExecutiveMemoryService {
  enrich(pkg: ExecutiveDecisionPackage): ExecutiveDecisionPackage {
    return { ...pkg, state: 'MEMORY_ENRICHED', memory: { precedents: [] } };
  }
}
