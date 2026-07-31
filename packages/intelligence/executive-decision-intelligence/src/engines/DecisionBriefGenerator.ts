import { ExecutiveDecisionBrief, StrategicAlternative, ScenarioAnalysis, RiskExposure } from '../models/ExecutiveDecisionBrief';
import { ExecutiveDecisionContext } from '../models/ExecutiveDecisionContext';

export class DecisionBriefGenerator {
  generate(
    context: ExecutiveDecisionContext, 
    alternatives: StrategicAlternative[],
    scenarios: ScenarioAnalysis[],
    risks: RiskExposure[],
    recommendation: { recommendedAlternativeId: string, rationale: string }
  ): ExecutiveDecisionBrief {
    return {
      briefId: `BRIEF-${Date.now()}`,
      decisionStatement: context.context.problemStatement,
      currentSituation: `Context: ${context.context.businessArea} - Objective: ${context.context.strategicObjective}`,
      evidenceBase: context.evidence.sources,
      strategicAlternatives: alternatives,
      scenarioAnalysis: scenarios,
      risks: risks,
      recommendation: recommendation,
      decisionAuthority: context.executive.role,
      expectedOutcome: 'Pending executive review',
      reviewPointDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days default
    };
  }
}
