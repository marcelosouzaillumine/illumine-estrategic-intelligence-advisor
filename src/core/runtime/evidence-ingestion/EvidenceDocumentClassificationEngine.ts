import { InstitutionalEvidenceInput } from './InstitutionalEvidenceTypes';

export class EvidenceDocumentClassificationEngine {
  public static validate(input: InstitutionalEvidenceInput) {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    let duplicateEvidenceDetected = false;
    let conflictingEvidenceDetected = false;

    // Map by document type and hash
    const hashSet = new Set<string>();
    const typeCount: Record<string, number> = {};

    for (const doc of input.uploadedDocuments) {
      if (!doc.hash || doc.hash.trim() === '') {
        issues.push(`CRITICAL: Document ${doc.id} missing hash signature.`);
      }

      if (hashSet.has(doc.hash)) {
        duplicateEvidenceDetected = true;
        issues.push(`WARNING: Duplicate document detected by hash: ${doc.hash}`);
      } else {
        hashSet.add(doc.hash);
      }

      typeCount[doc.type] = (typeCount[doc.type] || 0) + 1;
    }

    // Check for conflicting evidence (e.g., multiple BP or DRE in the same period for same company)
    // For simplicity, if there are multiple documents of the same core type without distinction
    const coreTypes = ['BP', 'DRE', 'DFC', 'DLPA'];
    for (const coreType of coreTypes) {
      if (typeCount[coreType] > 1) {
        conflictingEvidenceDetected = true;
        issues.push(`CRITICAL: Conflicting evidence detected. Multiple documents of type ${coreType}.`);
      }
    }

    // Check if we have the minimum required
    if (!typeCount['BP']) {
      issues.push('CRITICAL: Missing Balance Sheet (BP) evidence.');
    }
    if (!typeCount['DRE']) {
      issues.push('CRITICAL: Missing Income Statement (DRE) evidence.');
    }

    return {
      duplicateEvidenceDetected,
      conflictingEvidenceDetected,
      issues,
      recommendations
    };
  }
}
