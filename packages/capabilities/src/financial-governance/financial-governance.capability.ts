/**
 * Illumine OS™ Institutional Capability Registry
 * Capability: Financial Governance Capability (CFDI v2.1)
 */

export interface CapabilityDeclaration {
  capability: string;
  version: string;
  contracts: string[];
  runtimeRules: {
    certificationRequired: boolean;
    syntheticDataAllowed: boolean;
    graduatedProtection: boolean;
  };
  dependencies: string[];
  healthStatus: 'HEALTHY' | 'DEGRADED' | 'SUSPENDED';
}

export const FINANCIAL_GOVERNANCE_CAPABILITY: CapabilityDeclaration = {
  capability: 'Financial Governance',
  version: '2.1.0',
  contracts: [
    'CanonicalFinancialEntry',
    'FinancialStatementType',
    'FinancialLineageMetadata',
    'FinancialIntegrityContract',
    'CertifiedFinancialDataset',
    'FinancialDecisionPermissionMatrix',
    'FinancialDecisionTrustSignal',
    'FinancialGovernanceContract'
  ],
  runtimeRules: {
    certificationRequired: true,
    syntheticDataAllowed: false,
    graduatedProtection: true
  },
  dependencies: ['DataFoundation', 'PersistenceAdapter', 'FirestoreAdapter'],
  healthStatus: 'HEALTHY'
};
