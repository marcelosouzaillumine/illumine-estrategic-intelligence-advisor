import { InstitutionalEvidenceInput } from './InstitutionalEvidenceTypes';

export class FiduciaryEvidenceValidationEngine {
  public static validate(input: InstitutionalEvidenceInput) {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    let evidenceIntegrityStatus: 'INVALID' | 'PARTIAL' | 'VALIDATED' = 'INVALID';
    let temporalConsistencyStatus: 'INCONSISTENT' | 'PARTIAL' | 'VALIDATED' = 'INCONSISTENT';

    if (input.uploadedDocuments.length === 0) {
      issues.push('CRITICAL: Cannot validate empty evidence set.');
      return { evidenceIntegrityStatus, temporalConsistencyStatus, issues, recommendations };
    }

    let allHashesValid = true;
    let allMetadataValid = true;
    const periods = new Set<string>();

    for (const doc of input.uploadedDocuments) {
      if (!doc.hash || doc.hash.length < 16) {
        allHashesValid = false;
        issues.push(`CRITICAL: Invalid hash for document ${doc.id}`);
      }
      
      if (!doc.metadata || !doc.metadata.period) {
        allMetadataValid = false;
        issues.push(`CRITICAL: Missing metadata (period) for document ${doc.id}`);
      } else {
        periods.add(doc.metadata.period);
      }

      if (doc.isSyntheticMock && input.environmentConfiguration.environmentType === 'PRODUCTION') {
        issues.push('CRITICAL: Synthetic mock evidence injected into production environment.');
      }
    }

    if (allHashesValid && allMetadataValid) {
      evidenceIntegrityStatus = 'VALIDATED';
    } else if (allHashesValid || allMetadataValid) {
      evidenceIntegrityStatus = 'PARTIAL';
    }

    // Temporal consistency: Documents of core types should align in periods or present a contiguous history
    if (periods.size > 1) {
       temporalConsistencyStatus = 'PARTIAL';
       recommendations.push('Ensure multiple period evidence is contiguous and longitudinal.');
    } else if (periods.size === 1) {
       temporalConsistencyStatus = 'VALIDATED';
    }

    return {
      evidenceIntegrityStatus,
      temporalConsistencyStatus,
      issues,
      recommendations
    };
  }
}
