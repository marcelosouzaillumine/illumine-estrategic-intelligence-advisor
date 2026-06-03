import { SemanticConstitutionalGuard } from './SemanticConstitutionalGuard';
import { SemanticLineageReport, SemanticLineagePayload } from './SemanticLineageReport';
import { ConstitutionalSemanticAuthorityRegistry } from './ConstitutionalSemanticAuthorityRegistry';
import { SemanticDeterminismValidator } from './SemanticDeterminismValidator';

export interface SemanticComplianceReport {
  constitutionalAuthority: string;
  constitutionalVersion: string;
  semanticProtocolVersion: string;
  complianceStatus: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
  semanticLineageHash: string;
  violations: string[];
}

export class SemanticComplianceAuditRuntime {
  public static evaluate(
    semanticSource: string,
    renderedContent: string,
    lineagePayload: SemanticLineagePayload,
    semanticScope: 'EXECUTIVE' | 'TECHNICAL_AUDIT' = 'EXECUTIVE'
  ): SemanticComplianceReport {
    
    // 1. Generate Deterministic Hash (without timestamp)
    const semanticLineageHash = SemanticLineageReport.generateHash(lineagePayload);

    // 2. Protect against Semantic Drift
    // If ELSA evaluates the exact same context/version, the hash MUST be identical.
    // We pass the payload hash as context, and semanticLineageHash as result to simulate this.
    const contextHash = `${lineagePayload.analysisYear}_${lineagePayload.lifecycleStage}`;
    SemanticDeterminismValidator.validate(
      contextHash, 
      semanticLineageHash, 
      ConstitutionalSemanticAuthorityRegistry.PROTOCOL_VERSION
    );

    // 3. Guard Validation (supports COMPLIANT, WARNING, NON_COMPLIANT)
    const validationResult = SemanticConstitutionalGuard.validateSemanticAuthority(
      semanticSource,
      renderedContent,
      true, // strict mode (throws on CRITICAL violations)
      semanticScope
    );

    return {
      constitutionalAuthority: ConstitutionalSemanticAuthorityRegistry.APPROVED_AUTHORITIES[0],
      constitutionalVersion: ConstitutionalSemanticAuthorityRegistry.CONSTITUTIONAL_VERSION,
      semanticProtocolVersion: ConstitutionalSemanticAuthorityRegistry.PROTOCOL_VERSION,
      complianceStatus: validationResult.status,
      semanticLineageHash,
      violations: validationResult.violations
    };
  }
}
