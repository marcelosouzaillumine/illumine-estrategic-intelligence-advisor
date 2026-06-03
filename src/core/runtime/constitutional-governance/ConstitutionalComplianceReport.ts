import { SemanticComplianceReport } from './SemanticComplianceAuditRuntime';

export interface ConstitutionalComplianceReport {
  constitutionalAuthority: string;
  protocols: {
    SCCF: SemanticComplianceReport | 'PASS' | 'WARNING' | 'FAIL';
    FCF: 'PASS' | 'WARNING' | 'FAIL';
    TCF: 'PASS' | 'WARNING' | 'FAIL';
    CCF: 'PASS' | 'WARNING' | 'FAIL';
    LCF: 'PASS' | 'WARNING' | 'FAIL';
    ACF: 'PASS' | 'WARNING' | 'FAIL';
    EDCF?: 'PASS' | 'WARNING' | 'FAIL';
    SCP?: 'PASS' | 'WARNING' | 'FAIL';
    SSCP?: 'PASS' | 'WARNING' | 'FAIL';
  };
  protocolViolations: Record<string, string[]>;
  constitutionalIntegrity: 'VALID' | 'WARNING' | 'INVALID';
  validatedAt: string;
  constitutionalHash: string; // Excludes validatedAt
}
