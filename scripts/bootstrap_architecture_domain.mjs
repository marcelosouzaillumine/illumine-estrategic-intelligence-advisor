import fs from 'fs';
import path from 'path';

const domainDir = path.join(process.cwd(), 'packages/architecture-governance-domain/src');
const entitiesDir = path.join(domainDir, 'entities');

fs.mkdirSync(entitiesDir, { recursive: true });

const entities = {
  'CapabilityEntity': `import { CapabilityContract, CapabilityScore, ArchitectureScore, RelationshipGraph } from '@illumine/architecture-governance-contracts';
import { CapabilityId, WaveId, SemanticVersion, Lifecycle, CertificationStatus, CapabilityType } from '@illumine/architecture-governance-types';

export class CapabilityEntity implements CapabilityContract {
  constructor(
    public readonly id: CapabilityId,
    public readonly name: string,
    public readonly version: SemanticVersion,
    public readonly owner: string,
    public readonly domain: string,
    public readonly wave: WaveId,
    public readonly introducedWave: WaveId,
    public readonly lastModifiedWave: WaveId,
    public readonly maturity: number,
    public readonly lifecycle: Lifecycle,
    public readonly strategicImportance: CapabilityType,
    public readonly certificationStatus: CertificationStatus,
    public readonly scores: CapabilityScore,
    public readonly architectureScore: ArchitectureScore,
    public readonly dependencies: CapabilityId[],
    public readonly relationships: RelationshipGraph,
    public readonly certificationHistory: string[]
  ) {}
}
`,
  'RuleEntity': `import { RuleContract } from '@illumine/architecture-governance-contracts';
import { RuleId, RuleCategory, Severity } from '@illumine/architecture-governance-types';

export class RuleEntity implements RuleContract {
  constructor(
    public readonly id: RuleId,
    public readonly version: string,
    public readonly category: RuleCategory,
    public readonly severity: Severity,
    public readonly description: string,
    public readonly autoFixSupported: boolean,
    public readonly constitutionalReference?: string,
    public readonly adrReference?: string
  ) {}
}
`,
  'EvidenceEntity': `import { EvidenceContract, RelationshipGraph } from '@illumine/architecture-governance-contracts';
import { EvidenceId, RuleId, CapabilityId, Severity, EvidenceSource } from '@illumine/architecture-governance-types';

export class EvidenceEntity implements EvidenceContract {
  constructor(
    public readonly id: EvidenceId,
    public readonly ruleId: RuleId,
    public readonly capabilityId: CapabilityId,
    public readonly severity: Severity,
    public readonly confidence: 'HIGH' | 'MEDIUM' | 'LOW',
    public readonly source: EvidenceSource,
    public readonly affectedFiles: string[],
    public readonly recommendation: string,
    public readonly owner: string,
    public readonly relationships: RelationshipGraph
  ) {}
}
`,
  'FindingEntity': `import { FindingContract, EvidenceContract } from '@illumine/architecture-governance-contracts';
import { Risk, CapabilityId } from '@illumine/architecture-governance-types';

export class FindingEntity implements FindingContract {
  constructor(
    public readonly id: string,
    public readonly evidences: EvidenceContract[],
    public readonly impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    public readonly effort: 'HIGH' | 'MEDIUM' | 'LOW',
    public readonly priority: 'P0' | 'P1' | 'P2' | 'P3',
    public readonly risk: Risk,
    public readonly estimatedHours: number,
    public readonly affectedCapabilities: CapabilityId[],
    public readonly blockedRelease: boolean
  ) {}
}
`,
  'CertificationEntity': `import { CertificationContract } from '@illumine/architecture-governance-contracts';
import { CertificationId, CertificationStatus, GateResult } from '@illumine/architecture-governance-types';

export class CertificationEntity implements CertificationContract {
  constructor(
    public readonly id: CertificationId,
    public readonly targetId: string,
    public readonly scope: 'Platform' | 'Capability' | 'Release' | 'AI' | 'Security' | 'Data',
    public readonly version: string,
    public readonly issuedAt: Date,
    public readonly expiresAt: Date,
    public readonly score: number,
    public readonly status: CertificationStatus,
    public readonly gateResult: GateResult,
    public readonly seal: string
  ) {}
}
`,
  'ReleaseEntity': `import { ReleaseContract } from '@illumine/architecture-governance-contracts';
import { ReleaseId, CertificationId } from '@illumine/architecture-governance-types';

export class ReleaseEntity implements ReleaseContract {
  constructor(
    public readonly id: ReleaseId,
    public readonly version: string,
    public readonly releaseType: 'Major' | 'Minor' | 'Patch' | 'Hotfix',
    public readonly build: string,
    public readonly certificationId: CertificationId,
    public readonly approvedBy: string[],
    public readonly deployedAt: Date
  ) {}
}
`,
  'BaselineEntity': `import { BaselineContract, FindingContract } from '@illumine/architecture-governance-contracts';
import { BaselineId, CertificationId, SemanticVersion } from '@illumine/architecture-governance-types';

export class BaselineEntity implements BaselineContract {
  constructor(
    public readonly id: BaselineId,
    public readonly version: SemanticVersion,
    public readonly baselineType: 'Major' | 'Minor' | 'Hotfix' | 'Certification',
    public readonly issuedAt: Date,
    public readonly health: number,
    public readonly risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW',
    public readonly technicalDebt: number,
    public readonly findings: FindingContract[],
    public readonly parentBaseline?: BaselineId,
    public readonly previousCertification?: CertificationId
  ) {}
}
`,
  'HistoryEntity': `import { HistoryContract } from '@illumine/architecture-governance-contracts';
import { BaselineId } from '@illumine/architecture-governance-types';

export class HistoryEntity implements HistoryContract {
  constructor(
    public readonly baselineId: BaselineId,
    public readonly delta: number,
    public readonly improvements: number,
    public readonly regressions: number,
    public readonly comparisonWithPrevious: string,
    public readonly comparisonWithBaseline: string,
    public readonly improvementPercentage: number,
    public readonly changeSummary: string
  ) {}
}
`
};

for (const [name, content] of Object.entries(entities)) {
  fs.writeFileSync(path.join(entitiesDir, `${name}.ts`), content);
}

const indexContent = Object.keys(entities).map(e => `export * from './entities/${e}';`).join('\n') + '\n';
fs.writeFileSync(path.join(domainDir, 'index.ts'), indexContent);

console.log('Domain package bootstrapped.');
