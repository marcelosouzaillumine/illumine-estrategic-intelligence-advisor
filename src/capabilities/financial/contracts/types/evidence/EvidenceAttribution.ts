import { EvidenceReference } from "../../../../../types/evidence/EvidenceReference";

export interface EvidenceAttribution {
  attributionId: string;
  outputId: string;
  engineId: string;
  evidenceReferences: EvidenceReference[];
  weight: number;
  relevanceScore: number;
  
  // Traceability integration
  decisionChainId?: string;
}
