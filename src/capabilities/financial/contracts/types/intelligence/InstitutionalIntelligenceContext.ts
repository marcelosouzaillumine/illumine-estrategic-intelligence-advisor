import { InstitutionalObject } from '../../../../../types/intelligence/InstitutionalObject';
import { InstitutionalProvenance } from '../../../../../types/intelligence/InstitutionalProvenance';

export interface IntelligenceState {
  status: string;
  metrics: Record<string, number | string>;
  lastUpdated: string;
}

export interface IntelligenceHistoricalRecord {
  timestamp: string;
  eventType: string;
  description: string;
  snapshotId?: string;
}

export interface IntelligenceEvidenceLink {
  evidenceId: string;
  title: string;
  type: string;
  validity: string;
}

export interface IntelligenceCausalRelationship {
  relationshipId: string;
  targetId: string;
  targetType: string;
  targetTitle: string;
  relationshipType: string;
}

export interface IntelligenceStrategicImpact {
  impactId: string;
  domain: string;
  description: string;
  severity?: string; // Read-only from source, not computed here
}

export interface InstitutionalIntelligenceContext {
  object: InstitutionalObject;
  provenance: InstitutionalProvenance | null;
  state: IntelligenceState | null;
  history: IntelligenceHistoricalRecord[];
  evidence: IntelligenceEvidenceLink[];
  causality: IntelligenceCausalRelationship[];
  impacts: IntelligenceStrategicImpact[];
}
