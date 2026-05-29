// src/core/runtime/publication-governance/publication-types.ts
//
// Publication Governance Framework Types

export type PublicationArtifactType =
  | 'EXECUTIVE_PDF'
  | 'BOARD_PACK'
  | 'ADVISORY_REPORT'
  | 'STRATEGIC_RECOMMENDATION'
  | 'TREASURY_INTELLIGENCE'
  | 'PREDICTIVE_INTELLIGENCE'
  | 'GOVERNANCE_SUMMARY'
  | 'RISK_REPORT'
  | 'SIMULATION_COMPARISON';

export type CertificationClassification =
  | 'CERTIFIED'
  | 'CERTIFIED_WITH_DISCLOSURE'
  | 'RESTRICTED'
  | 'BLOCKED'
  | 'FAIL_CLOSED';

export type PublicationSeverity =
  | 'SAFE'
  | 'DISCLOSURE_REQUIRED'
  | 'SENSITIVE'
  | 'RESTRICTED'
  | 'BLOCKED'
  | 'FAIL_CLOSED';

export interface PublicationMetadata {
  artifactId: string;
  artifactType: PublicationArtifactType;
  certification: CertificationClassification;
  severity: PublicationSeverity;
  integrityScore: number;         // 0-100
  consistencyScore: number;       // 0-100
  complianceScore: number;        // 0-100
  lineageScore: number;           // 0-100
  disclosureScore: number;        // 0-100
  certificationGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  missingDisclosures: string[];
  warnings: string[];
  isExportable: boolean;
  exportSignature: string;
  lineageHash: string;
  timestamp: string;
}
