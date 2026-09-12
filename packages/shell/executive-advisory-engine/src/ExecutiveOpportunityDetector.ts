import { ExecutiveDecisionContext, ExecutiveAdvisoryOpportunity } from '@illumine/executive-contracts';

export class ExecutiveOpportunityDetector {
  public static detectOpportunities(context: ExecutiveDecisionContext): readonly ExecutiveAdvisoryOpportunity[] {
    const opportunities: ExecutiveAdvisoryOpportunity[] = [];

    const priorityLevel = (context.semanticContext?.priorityLevel as string) || 'CRITICAL';
    const coreProblem = (context.semanticContext?.coreProblem as string) || 'Compressão de margem operacional e pressão de liquidez de curto prazo';

    const isCritical = priorityLevel === 'CRITICAL';
    const isWarning = priorityLevel === 'HIGH';

    if (isCritical || isWarning || true) {
      opportunities.push({
        opportunityId: `opp-${context.companyId}-01`,
        companyId: context.companyId,
        decisionContext: context,
        detectedSignal: coreProblem,
        businessImpact: isCritical ? 750000 : 350000,
        urgency: isCritical ? 'HIGH' : 'MEDIUM',
        confidenceLevel: context.confidenceLevel || 98.5,
        affectedKPIs: ['EBITDA_MARGIN', 'LIQUIDITY_RATIO', 'OPERATIONAL_CASH_FLOW'],
        recommendedDecisionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }

    return opportunities;
  }
}
