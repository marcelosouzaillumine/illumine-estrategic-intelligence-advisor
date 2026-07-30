import { ExecutiveContextEnvelope } from '@illumine/executive-contracts';

export class ExecutiveContextEnrichment {
  public static enrichContext(baseContext: ExecutiveContextEnvelope): ExecutiveContextEnvelope {
    return {
      ...baseContext,
      strategicObjectives: [...baseContext.strategicObjectives, 'Conformidade Fiduciária Transversal'],
      wisdomReferenceIds: [...baseContext.wisdomReferenceIds, 'wisdom-causal-03']
    };
  }
}
