import { EvidenceId, RuleId, CapabilityId, Severity, EvidenceSource } from '@illumine/architecture-governance-types';
import { RelationshipGraph } from './SharedContracts';

export interface EvidenceContract {
  id: EvidenceId;
  ruleId: RuleId;
  capabilityId: CapabilityId;
  severity: Severity;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  source: EvidenceSource;
  affectedFiles: readonly string[];
  recommendation: string;
  owner: string;
  relationships: RelationshipGraph;
}
