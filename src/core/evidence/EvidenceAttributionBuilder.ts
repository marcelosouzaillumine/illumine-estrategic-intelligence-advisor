import { EvidenceAttribution } from "../../types/evidence/EvidenceAttribution";
import { EvidenceReference } from "../../types/evidence/EvidenceReference";

export class EvidenceAttributionBuilder {
  private outputId?: string;
  private engineId?: string;
  private evidenceReferences: EvidenceReference[] = [];
  private weight: number = 1.0;
  private relevanceScore: number = 0.0;
  private decisionChainId?: string;

  forOutput(outputId: string): this {
    this.outputId = outputId;
    return this;
  }

  fromEngine(engineId: string): this {
    this.engineId = engineId;
    return this;
  }

  addEvidence(evidence: EvidenceReference): this {
    this.evidenceReferences.push(evidence);
    return this;
  }

  setMetrics(weight: number, relevanceScore: number): this {
    this.weight = weight;
    this.relevanceScore = relevanceScore;
    return this;
  }

  linkTrace(decisionChainId: string): this {
    this.decisionChainId = decisionChainId;
    return this;
  }

  build(): EvidenceAttribution {
    if (!this.outputId || !this.engineId) {
      throw new Error("Cannot build attribution without outputId and engineId");
    }
    
    return {
      attributionId: `ATTR-${crypto.randomUUID()}`,
      outputId: this.outputId,
      engineId: this.engineId,
      evidenceReferences: [...this.evidenceReferences],
      weight: this.weight,
      relevanceScore: this.relevanceScore,
      decisionChainId: this.decisionChainId
    };
  }
}
