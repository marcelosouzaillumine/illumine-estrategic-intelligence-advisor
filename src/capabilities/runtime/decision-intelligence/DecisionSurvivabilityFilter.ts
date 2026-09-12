import { ExecutiveDecisionObject } from './ExecutiveDecisionObject';
import { ConstitutionalGovernanceMetadata } from '../constitutional-governance/constitutional-types';

export class DecisionSurvivabilityFilter {
  public static validate(
    decision: ExecutiveDecisionObject,
    cglContext: ConstitutionalGovernanceMetadata | any
  ): {
    status: 'VALID' | 'SURVIVABILITY_CONFLICT';
    reason?: string;
  } {
    // Example constitutional survivability rules
    const isLiquidityCritical = cglContext?.fiduciaryEvidenceStatus === 'CRITICAL' || cglContext?.liquidityHealth === 'CRITICAL';

    if (isLiquidityCritical && decision.actionId === 'ACTION_EXPAND_CAPEX') {
      return {
        status: 'SURVIVABILITY_CONFLICT',
        reason: 'Cannot expand CAPEX during critical liquidity survivability crisis.'
      };
    }

    return { status: 'VALID' };
  }
}
