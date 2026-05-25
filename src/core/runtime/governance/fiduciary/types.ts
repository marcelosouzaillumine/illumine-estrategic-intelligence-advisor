// src/core/runtime/governance/fiduciary/types.ts

export type ConflictType = 
  | 'Partes Relacionadas'
  | 'Interesse Financeiro Direto'
  | 'Vínculo Familiar'
  | 'Atuação em Concorrente'
  | 'Vínculo Político/Regulatório'
  | 'Outro';

export type ConflictSeverity = 'Baixa' | 'Média' | 'Alta' | 'Impeditiva';

export type FiduciaryDeclarationStatus = 'Pendente' | 'Declarado sem Conflito' | 'Conflito Declarado' | 'Recusado/Omitido';

export type RelatedPartyRelationshipType = 
  | 'Holding Controladora'
  | 'Subsidiária'
  | 'Coligada'
  | 'Joint Venture'
  | 'Sócio/Acionista'
  | 'Diretor/Conselheiro'
  | 'Familiar Próximo'
  | 'Empresa de Familiar';

export interface RelatedParty {
  partyId: string;
  tenantId: string;
  name: string;
  taxId?: string; // CNPJ / CPF
  relationshipType: RelatedPartyRelationshipType;
  linkedUserId?: string; // If the related party is a system user (director/partner)
  notes: string;
  declaredAt: string;
  declaredBy: string; // UserId
}

export interface RelatedPartyTransaction {
  transactionId: string;
  tenantId: string;
  partyId: string;
  description: string;
  amount: number;
  date: string;
  status: 'Proposta' | 'Em Análise' | 'Aprovada' | 'Rejeitada' | 'Executada';
  approvedBy?: string[]; // Array of UserIds
  decisionLineageHash?: string;
}

export interface ConflictDisclosure {
  disclosureId: string;
  tenantId: string;
  userId: string;
  decisionId?: string; // Can be tied to a specific decision, or be a general annual disclosure
  type: ConflictType;
  severity: ConflictSeverity;
  description: string;
  declaredAt: string;
  status: FiduciaryDeclarationStatus;
  relatedPartyId?: string;
}

export interface FiduciaryDecisionContext {
  decisionId: string;
  tenantId: string;
  entityId?: string;
  groupId?: string;
  title: string;
  description: string;
  proposedBy: string; // UserId
  amountImpact?: number;
  isSensitive: boolean;
  requiresBoardApproval: boolean;
}

export interface VotingRestriction {
  userId: string;
  restrictionReason: string;
  isMandatoryAbstention: boolean;
}

export interface FiduciaryValidationResult {
  isApprovedToProceed: boolean;
  warnings: string[];
  blocks: string[];
  votingRestrictions: VotingRestriction[];
  confidenceScore: number;
}

export interface FiduciaryAuditTrail {
  auditId: string;
  tenantId: string;
  decisionId: string;
  action: 'VALIDATION_REQUESTED' | 'CONFLICT_DETECTED' | 'DECISION_BLOCKED' | 'DECISION_CLEARED' | 'RESTRICTION_APPLIED';
  timestamp: string;
  details: string;
  lineageHash: string;
}

export interface FiduciaryApprovalGate {
  gateId: string;
  decisionContext: FiduciaryDecisionContext;
  validationStatus: FiduciaryValidationResult;
  declaredConflicts: ConflictDisclosure[];
  relatedPartyCheck: {
    hasRelatedParties: boolean;
    transactionsEnvolved: RelatedPartyTransaction[];
  };
  approverIdentity: string; // UserId requesting the gate clearance
  decisionLineageHash: string;
  auditTrail: FiduciaryAuditTrail[];
  createdAt: string;
}
