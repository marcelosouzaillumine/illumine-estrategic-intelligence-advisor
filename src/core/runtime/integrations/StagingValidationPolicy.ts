import { StagingValidationWarning, DatasetType } from './IntegrationGovernanceTypes';

export interface StagingValidationPolicy {
  policyId: string;
  version: string;
  statementType: DatasetType | 'BALANCESHEET_DRE_CASHFLOW' | 'TRANSACTIONS';
  tolerance: number; // For materiality threshold
  requiredChecks: string[];
  warningMappings: Record<string, StagingValidationWarning>;
  blockingRules: StagingValidationWarning[];
}

export const ACTIVE_STAGING_POLICY: StagingValidationPolicy = {
  policyId: 'ILLUMINE_STAGING_VALIDATION_V1',
  version: '1.0.0',
  statementType: 'FULL_FINANCIAL_STATEMENTS',
  tolerance: 0.0005, // 0.05% materiality threshold for rounding
  requiredChecks: [
    'BP_BALANCE',
    'DRE_HIERARCHY',
    'CASHFLOW_RECONCILIATION',
    'ORPHAN_ACCOUNTS',
    'DUPLICATE_ACCOUNTS',
    'SIGN_INVERSION'
  ],
  warningMappings: {
    'BP_BALANCE_ERROR': 'INVALID_BALANCE_SHEET',
    'MATERIALITY_ERROR': 'MATERIALITY_THRESHOLD_EXCEEDED',
    'HIERARCHY_ERROR': 'HIERARCHY_BREAK',
    'CASHFLOW_ERROR': 'CASHFLOW_MISMATCH',
    'DUPLICATE_ERROR': 'DUPLICATE_ACCOUNT',
    'ORPHAN_ERROR': 'ORPHAN_ACCOUNT',
    'SIGN_ERROR': 'SIGN_INVERSION',
    'INCOMPLETE_ERROR': 'INCOMPLETE_DATASET',
    'LOW_CONFIDENCE': 'LOW_IMPORT_CONFIDENCE',
    'POLICY_MISMATCH': 'POLICY_VERSION_MISMATCH'
  },
  blockingRules: [
    'INVALID_BALANCE_SHEET',
    'HIERARCHY_BREAK',
    'CASHFLOW_MISMATCH',
    'INCOMPLETE_DATASET',
    'POLICY_VERSION_MISMATCH',
    'MATERIALITY_THRESHOLD_EXCEEDED',
    'SIGN_INVERSION' // Blocking unless auto-corrected
  ]
};

export const TRANSACTIONAL_STAGING_POLICY: StagingValidationPolicy = {
  policyId: 'ILLUMINE_TRANSACTIONAL_VALIDATION_V1',
  version: '1.0.0',
  statementType: 'TRANSACTIONS_MIXED',
  tolerance: 0,
  requiredChecks: [
    'TRANSACTION_AMOUNT',
    'TRANSACTION_DATE',
    'TRANSACTION_ENTITY',
    'TRANSACTION_TYPE',
    'DUPLICATE_TRANSACTION'
  ],
  warningMappings: {
    'AMOUNT_ERROR': 'INVALID_TRANSACTION_AMOUNT',
    'DATE_ERROR': 'INVALID_TRANSACTION_DATE',
    'ENTITY_ERROR': 'MISSING_ENTITY',
    'TYPE_ERROR': 'MISSING_TRANSACTION_TYPE',
    'DUPLICATE_ERROR': 'DUPLICATE_TRANSACTION',
    'DUE_DATE_ERROR': 'MISSING_DUE_DATE',
    'COUNTERPARTY_ERROR': 'MISSING_COUNTERPARTY',
    'UNMAPPED_ERROR': 'UNMAPPED_TRANSACTION_ACCOUNT'
  },
  blockingRules: [
    'INVALID_TRANSACTION_AMOUNT',
    'MISSING_ENTITY',
    'INVALID_TRANSACTION_DATE',
    'MISSING_TRANSACTION_TYPE',
    'DUPLICATE_TRANSACTION'
  ]
};
