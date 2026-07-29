import { CapabilityManifest, Maturity, Stability, AgentDomainContext, ExecutiveOpinion, BoardReportProjection } from '@illumine/executive-contracts';
import { DecisionModelProjector, ExecutiveCaseAggregate } from '@illumine/executive-domain';
import { Confidence } from '@illumine/core-primitives';

export class ExecutiveAdvisorCapability {
  public static readonly manifest: CapabilityManifest = {
    id: 'cap-executive-advisor',
    name: 'Executive Board Digital Advisory Master Capability',
    version: '1.0.0',
    maturity: Maturity.CERTIFIED,
    stability: Stability.CANONICAL,
    dependencies: {
      dependencyContracts: ['BoardReportProjection', 'ExecutiveOpinion', 'ExecutiveCaseAggregate'],
      dependencyCapabilities: []
    },
    cognitiveProfile: {
      reasoning: true,
      prediction: true,
      recommendation: true,
      explanation: true
    },
    governance: {
      explainabilityScore: 99,
      confidenceThreshold: 0.95
    }
  };

  public static generateBoardReport(caseAggregate: ExecutiveCaseAggregate, opinions: ExecutiveOpinion[]): BoardReportProjection {
    return DecisionModelProjector.projectToBoardReport(caseAggregate, opinions);
  }
}
