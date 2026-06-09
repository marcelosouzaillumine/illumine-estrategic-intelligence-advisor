import { ExplainabilityNode } from "./ExplainabilityNode";

export interface ExplainabilityChain {
  chainId: string;
  outputId: string;
  engineId: string;
  nodes: ExplainabilityNode[];
  generatedAt: string;
  correlationId?: string;
  decisionChainId?: string;
}
