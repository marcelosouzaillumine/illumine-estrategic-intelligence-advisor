import { InstitutionalEvidenceInput } from './InstitutionalEvidenceTypes';

export class InstitutionalEvidenceIngestionEngine {
  public static validate(input: InstitutionalEvidenceInput) {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    let tenantIsolationStatus: 'UNSAFE' | 'ISOLATED' | 'VALIDATED' = 'UNSAFE';

    if (!input.tenantIsolationRuntime || !input.tenantIsolationRuntime.tenantId) {
      issues.push('CRITICAL: Evidence ingestion blocked. Missing tenant isolation context.');
      return { status: tenantIsolationStatus, issues, recommendations };
    }

    if (input.tenantIsolationRuntime.hasCrossTenantAccess) {
      issues.push('CRITICAL: Cross-tenant evidence contamination detected.');
      return { status: tenantIsolationStatus, issues, recommendations };
    }

    // Check if any document belongs to another tenant
    const foreignDocs = input.uploadedDocuments.filter(d => d.metadata.tenantId !== input.tenantIsolationRuntime.tenantId);
    if (foreignDocs.length > 0) {
      issues.push(`CRITICAL: Found ${foreignDocs.length} documents belonging to a different tenant.`);
      return { status: tenantIsolationStatus, issues, recommendations };
    }

    tenantIsolationStatus = 'ISOLATED';

    if (input.environmentConfiguration.environmentType === 'PRODUCTION') {
      if (input.tenantIsolationRuntime.isProductionTenant) {
        tenantIsolationStatus = 'VALIDATED';
      } else {
        issues.push('CRITICAL: Non-production tenant operating in production environment.');
        tenantIsolationStatus = 'UNSAFE';
      }
    } else {
      tenantIsolationStatus = 'VALIDATED';
    }

    if (input.uploadedDocuments.length === 0) {
      issues.push('CRITICAL: No evidence documents uploaded.');
    }

    return {
      status: tenantIsolationStatus,
      issues,
      recommendations
    };
  }
}
