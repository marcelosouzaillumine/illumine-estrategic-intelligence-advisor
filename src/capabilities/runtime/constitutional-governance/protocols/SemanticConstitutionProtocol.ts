import { ConstitutionalProtocol, ValidationResult } from '../ConstitutionalProtocolDefinition';
import { SemanticComplianceAuditRuntime } from '../SemanticComplianceAuditRuntime';

export class SemanticConstitutionProtocol implements ConstitutionalProtocol {
  public protocolId = 'SCCF';
  public protocolName = 'Semantic Constitutional Compliance Framework';
  public protocolVersion = 'SCCF-1.0';
  public authorityLevel = 'SUPREME';

  public validate(context: any): ValidationResult {
    const { semanticSource, renderedContent, semanticLineagePayload, semanticScope } = context;
    
    // Leverage the already robust SemanticComplianceAuditRuntime
    const sccfReport = SemanticComplianceAuditRuntime.evaluate(
      semanticSource || 'LEGACY',
      renderedContent || '',
      semanticLineagePayload || {},
      semanticScope || 'EXECUTIVE'
    );

    // Map complianceStatus (COMPLIANT/WARNING/NON_COMPLIANT) to CGL (PASS/WARNING/FAIL)
    const statusMap = {
      COMPLIANT: 'PASS',
      WARNING: 'WARNING',
      NON_COMPLIANT: 'FAIL'
    } as const;

    return {
      status: statusMap[sccfReport.complianceStatus] || 'FAIL',
      violations: sccfReport.violations,
      payload: sccfReport
    };
  }
}
