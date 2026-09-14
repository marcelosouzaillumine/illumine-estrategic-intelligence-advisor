export interface DecisionChain {
  decisionChainId: string;
  originCorrelationId: string;
  decisions: Array<{
    decisionId: string;
    engineId: string;
    actionTaken: string;
    timestamp: string;
  }>;
}
