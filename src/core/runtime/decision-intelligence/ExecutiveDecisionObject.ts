export interface ExecutiveDecisionObject {
  decisionId: string;
  actionId: string;
  actionSource: 'CAR';
  category:
    | 'LIQUIDITY'
    | 'WORKING_CAPITAL'
    | 'TREASURY'
    | 'PROFITABILITY'
    | 'GOVERNANCE'
    | 'SURVIVABILITY';
  priority:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'CRITICAL';
  urgency:
    | 'SHORT_TERM'
    | 'IMMEDIATE'
    | 'STRATEGIC';
  constitutionalStatus:
    | 'VALID'
    | 'BLOCKED';
  recommendedAction: string;
  rationale: string[];
  supportingMetrics: string[];
  lineageReferences: string[];
  constitutionalProtocols: string[];
}
