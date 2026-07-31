import { ExecutiveDecisionContext } from '../models/ExecutiveDecisionContext';

export class ExecutiveDecisionContextEngine {
  buildContext(input: any): ExecutiveDecisionContext {
    return {
      decisionId: input.decisionId || `DEC-${Date.now()}`,
      executive: input.executive || {
        name: 'Unknown Executive',
        role: 'Unknown Role',
        authorityLevel: 'NONE'
      },
      context: input.context || {
        businessArea: 'Unknown Area',
        problemStatement: 'Not defined',
        strategicObjective: 'Not defined'
      },
      evidence: input.evidence || {
        sources: [],
        confidenceLevel: 'LOW'
      },
      urgency: input.urgency || {
        level: 'low'
      },
      stakeholders: input.stakeholders || [],
      constraints: input.constraints || {}
    };
  }
}
