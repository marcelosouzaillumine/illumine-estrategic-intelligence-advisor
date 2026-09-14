export interface ComplianceBaseContract {
  tenantId: string;
  auditTrail: ComplianceAuditTrail[];
  lineageHash: string;
  createdAt: string;
  updatedAt: string;
  confidenceScore: number;
}

export type WhistleblowingSeverity = 'Baixa' | 'Média' | 'Alta' | 'Crítica' | 'Sistêmica';

export type WhistleblowingCategory = 
  | 'assédio'
  | 'fraude'
  | 'corrupção'
  | 'conflito ético'
  | 'discriminação'
  | 'violação fiduciária'
  | 'violação financeira'
  | 'vazamento de dados'
  | 'conduta antiética'
  | 'conflito de interesse ocultado';

export type ComplianceCaseStatus = 
  | 'Registrado'
  | 'Em Triagem'
  | 'Investigação Ativa'
  | 'Aguardando Comitê'
  | 'Concluído com Sanção'
  | 'Arquivado por Insuficiência'
  | 'Arquivado como Improcedente';

export type ComplianceRiskLevel = 'Baixo' | 'Moderado' | 'Alto' | 'Extremo';

export interface AnonymousProtectionLayer {
  isAnonymous: boolean;
  encryptionKeyHash?: string;
  communicationToken?: string; // Token to allow anon communication
  shieldedIdentityHash?: string; // If identified, we still shield it from direct access
}

export interface WhistleblowingReport extends ComplianceBaseContract {
  reportId: string;
  category: WhistleblowingCategory;
  severity: WhistleblowingSeverity;
  status: ComplianceCaseStatus;
  description: string;
  evidenceLinks: string[]; // Mock links
  protectionLayer: AnonymousProtectionLayer;
  riskLevel: ComplianceRiskLevel;
}

export interface EthicsInvestigation extends ComplianceBaseContract {
  investigationId: string;
  reportId: string;
  investigatorIds: string[];
  findings: string;
  recommendedAction: string;
  status: 'Iniciada' | 'Em Andamento' | 'Concluída';
}

export interface EthicsCommitteeDecision extends ComplianceBaseContract {
  decisionId: string;
  investigationId: string;
  committeeDecisionHash: string;
  evidenceRegistry: string[];
  decisionAuditTrail: ComplianceAuditTrail[];
  responsibleReviewers: string[]; // User IDs
  fiduciaryContext: string;
  sanctionApplied?: string;
  recommendations: string;
}

export interface ComplianceViolation extends ComplianceBaseContract {
  violationId: string;
  reportId?: string;
  decisionId?: string;
  violationType: string;
  severity: WhistleblowingSeverity;
  involvedParties: string[];
  impactDescription: string;
}

export interface ConductCodeDocument extends ComplianceBaseContract {
  documentId: string;
  title: string;
  version: string;
  type: 'Código de Conduta' | 'Política Anticorrupção' | 'Política de Segurança' | 'Política ESG' | 'Política de Governança' | 'Política de Conflito de Interesse';
  contentHash: string;
  isRequired: boolean;
  validUntil: string;
}

export interface ConductCodeAcceptance extends ComplianceBaseContract {
  acceptanceId: string;
  documentId: string;
  userId: string;
  acceptedVersion: string;
  expiresAt: string;
  isCompliant: boolean;
}

export interface ESGMetric {
  metricId: string;
  name: string;
  value: number;
  unit: string;
  targetValue?: number;
}

export interface ESGIndicator extends ComplianceBaseContract {
  indicatorId: string;
  pillar: 'Ambiental' | 'Social' | 'Governança';
  metrics: ESGMetric[];
  overallHealth: 'Saudável' | 'Atenção' | 'Crítico';
}

export interface ESGScore extends ComplianceBaseContract {
  scoreId: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  consolidatedScore: number;
}

export interface InstitutionalIntegrityScore extends ComplianceBaseContract {
  scoreId: string;
  integrityScore: number; // 0 a 100
  complianceGaps: number;
  openWhistleblowingReports: number;
  activeViolations: number;
  esgAlignment: number;
  trend: 'Melhorando' | 'Estável' | 'Deteriorando';
}

export interface ComplianceAuditTrail {
  auditId: string;
  action: string;
  actorHash: string; // Shielded actor identity
  timestamp: string;
  details: string;
}
