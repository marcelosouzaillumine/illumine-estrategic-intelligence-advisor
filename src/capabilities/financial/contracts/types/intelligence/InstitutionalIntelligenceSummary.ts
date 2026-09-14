import { InstitutionalIntelligenceReference } from '../../../../../types/intelligence/InstitutionalIntelligenceReference';

export interface InstitutionalIntelligenceSummary {
  reference: InstitutionalIntelligenceReference;
  historicalRecordCount: number;
  evidenceCount: number;
  causalRelationshipCount: number;
  strategicImpactCount: number;
  lastUpdated: string;
  hasStateAvailable: boolean;
  hasProvenanceAvailable: boolean;
}
