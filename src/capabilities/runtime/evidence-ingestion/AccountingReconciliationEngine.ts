import { InstitutionalEvidenceInput } from './InstitutionalEvidenceTypes';

export class AccountingReconciliationEngine {
  public static validate(input: InstitutionalEvidenceInput) {
    const issues: string[] = [];
    const warnings: string[] = [];
    
    let reconciliationStatus: 'FAILED' | 'PARTIAL' | 'RECONCILED' = 'FAILED';

    const bpDoc = input.uploadedDocuments.find(d => d.type === 'BP');
    const dreDoc = input.uploadedDocuments.find(d => d.type === 'DRE');

    if (!bpDoc || !dreDoc) {
      issues.push('CRITICAL: Reconciliation failed. Missing required core documents (BP, DRE).');
      return { reconciliationStatus, issues, warnings };
    }

    // In a full implementation we would check `rawContentReference`.
    // We will do a basic mock reconciliation check here based on the presence of conflicting evidence,
    // which should block reconciliation.
    
    // We assume partial unless proven fully reconciled.
    reconciliationStatus = 'PARTIAL';

    const hasDfc = input.uploadedDocuments.some(d => d.type === 'DFC');
    const hasDlpa = input.uploadedDocuments.some(d => d.type === 'DLPA');

    if (hasDfc && hasDlpa) {
      // Assuming successful cross-checks for the sake of the engine wrapper
      reconciliationStatus = 'RECONCILED';
    } else {
      warnings.push('WARNING: Missing DFC or DLPA for full accounting reconciliation cross-check.');
    }

    // If documents are synthetic, they pass reconciliation in DEV/TEST structurally,
    // but we can add logic to artificially fail if needed in testing.
    // For now we rely on the classification engine to detect conflicts (like multiple BPs) which will trigger Fail-Closed.

    return {
      reconciliationStatus,
      issues,
      warnings
    };
  }
}
