import { EvidenceReference } from "../../../../../types/evidence/EvidenceReference";

export interface EvidenceBundle {
  bundleId: string;
  correlationId: string;
  lineageId: string;
  evidenceReferences: EvidenceReference[];
  generatedAt: string;
}
