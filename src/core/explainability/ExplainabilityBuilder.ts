import { ExplainabilityChain } from "../../types/explainability/ExplainabilityChain";
import { ExplainabilityNode } from "../../types/explainability/ExplainabilityNode";

export class ExplainabilityBuilder {
  private outputId?: string;
  private engineId?: string;
  private correlationId?: string;
  private nodes: ExplainabilityNode[] = [];

  forOutput(outputId: string): this {
    this.outputId = outputId;
    return this;
  }

  fromEngine(engineId: string): this {
    this.engineId = engineId;
    return this;
  }

  withCorrelation(correlationId: string): this {
    this.correlationId = correlationId;
    return this;
  }

  addNode(node: Omit<ExplainabilityNode, "nodeId">): this {
    this.nodes.push({
      ...node,
      nodeId: `NODE-${crypto.randomUUID()}`
    });
    return this;
  }

  build(): ExplainabilityChain {
    if (!this.outputId || !this.engineId) {
      throw new Error("Cannot build explainability chain without outputId and engineId");
    }

    return {
      chainId: `CHAIN-${crypto.randomUUID()}`,
      outputId: this.outputId,
      engineId: this.engineId,
      correlationId: this.correlationId,
      nodes: [...this.nodes],
      generatedAt: new Date().toISOString()
    };
  }
}
