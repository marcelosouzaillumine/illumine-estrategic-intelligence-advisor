import fs from 'fs';
import path from 'path';

const contractsDir = path.join(process.cwd(), 'packages/architecture-governance-contracts/src');

const entities = {
  'CapabilityContract': `import { CapabilityId, WaveId, SemanticVersion, Lifecycle, CertificationStatus, Risk, CapabilityType } from '@illumine/architecture-governance-types';
import { ArchitectureScore, CapabilityScore, RelationshipGraph } from './SharedContracts';

export interface CapabilityContract {
  id: CapabilityId;
  name: string;
  version: SemanticVersion;
  owner: string;
  domain: string;
  wave: WaveId;
  introducedWave: WaveId;
  lastModifiedWave: WaveId;
  maturity: number;
  lifecycle: Lifecycle;
  strategicImportance: CapabilityType;
  certificationStatus: CertificationStatus;
  
  scores: CapabilityScore;
  architectureScore: ArchitectureScore;
  
  dependencies: CapabilityId[];
  relationships: RelationshipGraph;
  
  certificationHistory: string[];
}
`,
  'RuleContract': `import { RuleId, RuleCategory, Severity } from '@illumine/architecture-governance-types';

export interface RuleContract {
  id: RuleId;
  version: string;
  category: RuleCategory;
  severity: Severity;
  description: string;
  constitutionalReference?: string;
  adrReference?: string;
  autoFixSupported: boolean;
}
`,
  'EvidenceContract': `import { EvidenceId, RuleId, CapabilityId, Severity, EvidenceSource } from '@illumine/architecture-governance-types';
import { RelationshipGraph } from './SharedContracts';

export interface EvidenceContract {
  id: EvidenceId;
  ruleId: RuleId;
  capabilityId: CapabilityId;
  severity: Severity;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  source: EvidenceSource;
  affectedFiles: string[];
  recommendation: string;
  owner: string;
  relationships: RelationshipGraph;
}
`,
  'FindingContract': `import { EvidenceContract } from './EvidenceContract';
import { Risk, CapabilityId } from '@illumine/architecture-governance-types';

export interface FindingContract {
  id: string;
  evidences: EvidenceContract[];
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  effort: 'HIGH' | 'MEDIUM' | 'LOW';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  risk: Risk;
  estimatedHours: number;
  affectedCapabilities: CapabilityId[];
  blockedRelease: boolean;
}
`,
  'CertificationContract': `import { CertificationId, CertificationStatus, GateResult } from '@illumine/architecture-governance-types';

export interface CertificationContract {
  id: CertificationId;
  targetId: string;
  scope: 'Platform' | 'Capability' | 'Release' | 'AI' | 'Security' | 'Data';
  version: string;
  issuedAt: Date;
  expiresAt: Date;
  score: number;
  status: CertificationStatus;
  gateResult: GateResult;
  seal: string;
}
`,
  'ReleaseContract': `import { ReleaseId, CertificationId } from '@illumine/architecture-governance-types';

export interface ReleaseContract {
  id: ReleaseId;
  version: string;
  releaseType: 'Major' | 'Minor' | 'Patch' | 'Hotfix';
  build: string;
  certificationId: CertificationId;
  approvedBy: string[];
  deployedAt: Date;
}
`,
  'BaselineContract': `import { BaselineId, CertificationId, SemanticVersion } from '@illumine/architecture-governance-types';
import { FindingContract } from './FindingContract';

export interface BaselineContract {
  id: BaselineId;
  version: SemanticVersion;
  baselineType: 'Major' | 'Minor' | 'Hotfix' | 'Certification';
  parentBaseline?: BaselineId;
  previousCertification?: CertificationId;
  issuedAt: Date;
  health: number;
  risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  technicalDebt: number;
  findings: FindingContract[];
}
`,
  'HistoryContract': `import { BaselineId } from '@illumine/architecture-governance-types';

export interface HistoryContract {
  baselineId: BaselineId;
  delta: number;
  improvements: number;
  regressions: number;
  comparisonWithPrevious: string;
  comparisonWithBaseline: string;
  improvementPercentage: number;
  changeSummary: string;
}
`,
  'SharedContracts': `
export interface ArchitectureHealthScore {
  score: number;
  classification: string;
  delta: number;
}

export interface ArchitectureScore {
  health: ArchitectureHealthScore;
  risk: string;
  trend: string;
  architecture: number;
  product: number;
  ai: number;
  security: number;
  performance: number;
  scalability: number;
  governance: number;
  data: number;
  ux: number;
  commercial: number;
}

export interface CapabilityScore {
  health: number;
  risk: string;
  complexity: number;
  maturity: number;
  certification: number;
}

export interface RelationshipGraph {
  type: string;
  direction: 'INCOMING' | 'OUTGOING' | 'BIDIRECTIONAL';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  strength: number;
  origin: string;
  target: string;
  metadata: Record<string, any>;
}
`,
  'EventsContract': `import { CapabilityId, ReleaseId, EvidenceId, BaselineId } from '@illumine/architecture-governance-types';

export interface CapabilityCertifiedEvent {
  capabilityId: CapabilityId;
  timestamp: Date;
}

export interface ReleaseCertifiedEvent {
  releaseId: ReleaseId;
  timestamp: Date;
}

export interface FindingCreatedEvent {
  findingId: string;
  timestamp: Date;
}

export interface EvidenceRegisteredEvent {
  evidenceId: EvidenceId;
  timestamp: Date;
}

export interface BaselineCreatedEvent {
  baselineId: BaselineId;
  timestamp: Date;
}
`
};

for (const [name, content] of Object.entries(entities)) {
  fs.writeFileSync(path.join(contractsDir, `${name}.ts`), content);
}

const indexContent = Object.keys(entities).map(e => `export * from './${e}';`).join('\n') + '\n';
fs.writeFileSync(path.join(contractsDir, 'index.ts'), indexContent);

console.log('Contracts package bootstrapped.');
