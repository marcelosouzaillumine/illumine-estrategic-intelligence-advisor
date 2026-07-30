import { DecisionCommandEnvelope, WorkflowRiskLevel } from '@illumine/executive-contracts';

export class DecisionCommandEnvelopeResolver {
  public static createEnvelope(
    decisionId: string,
    sourceAgent: string,
    riskLevel: WorkflowRiskLevel,
    expectedOutcome: string
  ): DecisionCommandEnvelope {
    const requiredApproval =
      riskLevel === 'LOW' ? 'AUTOMATIC' : riskLevel === 'MEDIUM' ? 'MANAGER' : riskLevel === 'HIGH' ? 'EXECUTIVE' : 'BOARD';

    return {
      decisionId,
      sourceAgent,
      confidenceScore: 98.5,
      impactedDomains: ['FINANCIAL'],
      expectedOutcome,
      riskLevel,
      requiredApproval,
      expirationDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date().toISOString()
    };
  }
}
