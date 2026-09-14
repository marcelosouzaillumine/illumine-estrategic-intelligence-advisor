import { ArchitectureDecision, DecisionContext } from '../models/index';
import { DecisionPolicyCatalog } from '../policies/DecisionPolicyCatalog';

export class DecisionBoardEngine {
  private catalog = new DecisionPolicyCatalog();

  generateDecision(context: DecisionContext, riskExposureLevel: string): ArchitectureDecision {
    const rule = this.catalog.getRule('DEC-POL-001');
    const outcome = rule ? rule.getDecisionOutcome(riskExposureLevel) : 'NO_ACTION';

    return {
      id: `DEC-${Date.now()}`, // mock
      subject: 'Architecture Capability', // mock
      contextHash: context.contextHash,
      evidence: [], // mock for now
      narrative: `Context analyzed resulting in exposure ${riskExposureLevel}. Formal board decision is ${outcome}.`,
      policyVersion: this.catalog.version,
      decisionOutcome: outcome,
      generatedAt: new Date().toISOString()
    };
  }
}
