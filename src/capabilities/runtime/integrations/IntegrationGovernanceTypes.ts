export type SourceTrustLevel = 'UNVERIFIED' | 'LOW' | 'MEDIUM' | 'HIGH' | 'INSTITUTIONAL';
export type ImportStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION' | 'PUBLISHED' | 'VALIDATED' | 'REVERTED' | 'ARCHIVED';
export type ConnectorType = 'MANUAL_CSV' | 'MANUAL_XLSX' | 'API_ERP' | 'API_BANKING' | 'MOCK_CONNECTOR';

export interface IngestionLineageReference {
  tenantId: string;
  workspaceId: string;
  connectorId: string;
  importId: string;
  datasetHash: string;
  sourceHash: string;
  mappingVersion: string;
  timestamp: string;
}

export interface ExternalConnector {
  connectorId: string;
  name: string;
  type: ConnectorType;
  tenantScope: string[];
  baseTrustLevel: SourceTrustLevel;
  isActive: boolean;
}

export interface DataQualityViolation {
  violationId: string;
  rule: string;
  severity: 'WARNING' | 'BLOCKER';
  message: string;
  field?: string;
}

export type StagingValidationWarning = 
  | 'INVALID_BALANCE_SHEET'
  | 'HIERARCHY_BREAK'
  | 'SIGN_INVERSION'
  | 'DUPLICATE_ACCOUNT'
  | 'ORPHAN_ACCOUNT'
  | 'LOW_IMPORT_CONFIDENCE'
  | 'INCOMPLETE_DATASET'
  | 'CASHFLOW_MISMATCH'
  | 'POLICY_VERSION_MISMATCH'
  | 'MATERIALITY_THRESHOLD_EXCEEDED'
  | 'MISSING_DUE_DATE'
  | 'INVALID_TRANSACTION_AMOUNT'
  | 'MISSING_ENTITY'
  | 'MISSING_COUNTERPARTY'
  | 'INVALID_TRANSACTION_DATE'
  | 'DUPLICATE_TRANSACTION'
  | 'MISSING_TRANSACTION_TYPE'
  | 'UNMAPPED_TRANSACTION_ACCOUNT';

export type DatasetType =
  | 'BALANCE_SHEET'
  | 'INCOME_STATEMENT'
  | 'CASH_FLOW'
  | 'FULL_FINANCIAL_STATEMENTS'
  | 'TRANSACTIONS_PAYABLES'
  | 'TRANSACTIONS_RECEIVABLES'
  | 'TRANSACTIONS_MIXED';


export interface ImportedDataset {
  importId: string;
  datasetType?: DatasetType;
  connectorId: string;
  tenantId: string;
  workspaceId: string;
  rawPayloadSize: number;
  extractedRecords: number;
  trustLevel: SourceTrustLevel;
  status: ImportStatus;
  lineage: IngestionLineageReference;
  violations: DataQualityViolation[];
  stagingValidationPassed?: boolean;
  promotedToRuntime?: boolean;
  blockingWarnings?: StagingValidationWarning[];
  policyVersion?: string;
  parsedData?: any; // To hold parsed data for staging validation
  submittedBy: string;
  submittedAt: string;
}

export interface ImportPublicationRecord {
  publicationId: string;
  importId: string;
  targetRuntimeVersion: string;
  publishedBy: string;
  publishedAt: string;
  lineageReference: IngestionLineageReference;
  reverted?: boolean;
  revertedAt?: string;
  revertedBy?: string;
  reversionJustification?: string;
}

export interface ConnectorAuditRecord {
  auditId: string;
  tenantId: string;
  importId?: string;
  connectorId?: string;
  event: 'IMPORT_RECEIVED' | 'IMPORT_VALIDATED' | 'IMPORT_REJECTED' | 'IMPORT_REVIEW_REQUIRED' | 'IMPORT_APPROVED' | 'IMPORT_PUBLISHED' | 'IMPORT_FAILED' | 'IMPORT_REVERTED';
  actorId: string;
  timestamp: string;
  details?: string;
}

export interface RollbackAuditEntry {
  rollbackId: string;
  importId?: string;
  tenantId: string;
  scope: 'DATASET' | 'PROMOTION' | 'SNAPSHOT';
  actorId: string;
  justification: string;
  timestamp: string;
  previousStatus: ImportStatus;
  policyApproved: boolean;
}

