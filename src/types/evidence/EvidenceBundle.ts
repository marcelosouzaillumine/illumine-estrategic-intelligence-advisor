import { EvidenceReference } from "./EvidenceReference";

export interface EvidenceBundle {
  bundleId: string;
  correlationId: string;
  lineageId: string;
  evidenceReferences: EvidenceReference[];
  generatedAt: string;
}
