import { EvidenceContract } from './EvidenceContract';
import { Risk, CapabilityId } from '@illumine/architecture-governance-types';

export interface FindingContract {
  id: string;
  evidences: readonly EvidenceContract[];
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  effort: 'HIGH' | 'MEDIUM' | 'LOW';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  risk: Risk;
  estimatedHours: number;
  affectedCapabilities: readonly CapabilityId[];
  blockedRelease: boolean;
}
