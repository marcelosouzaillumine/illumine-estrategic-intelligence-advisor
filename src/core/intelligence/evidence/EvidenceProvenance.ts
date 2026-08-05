import { EvidenceType } from './EvidenceType';

export interface EvidenceProvenance {
  sourceType: EvidenceType;
  sourceId: string; // Identifier of the origin system or context
  collectedAt: Date;
  collectedBy: string; // Agent, system, or user that extracted this evidence
  reliabilityScore: number; // 0-100 trust in this specific source
}
