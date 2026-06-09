import { InstitutionalNode, InstitutionalNodeType } from "../../types/knowledge-graph/InstitutionalNode";

export class InstitutionalNodeBuilder {
  private nodeType?: InstitutionalNodeType;
  private title?: string;
  private description?: string;
  private confidenceLevel: InstitutionalNode["confidenceLevel"] = "VERIFIED";

  ofType(type: InstitutionalNodeType): this {
    this.nodeType = type;
    return this;
  }

  withTitle(title: string): this {
    this.title = title;
    return this;
  }

  withDescription(description: string): this {
    this.description = description;
    return this;
  }

  withConfidence(level: InstitutionalNode["confidenceLevel"]): this {
    this.confidenceLevel = level;
    return this;
  }

  build(): InstitutionalNode {
    if (!this.nodeType || !this.title || !this.description) {
      throw new Error("Missing required fields to build InstitutionalNode");
    }
    return {
      nodeId: `KNODE-${crypto.randomUUID()}`,
      nodeType: this.nodeType,
      title: this.title,
      description: this.description,
      confidenceLevel: this.confidenceLevel,
      createdAt: new Date().toISOString()
    };
  }
}
