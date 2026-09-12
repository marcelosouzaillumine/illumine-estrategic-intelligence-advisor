import { ConstitutionalGovernanceDashboardOutput } from './constitutional-dashboard-types';
import { ConstitutionalAxiomDisclosureEngine } from './ConstitutionalAxiomDisclosureEngine';
import { ConstitutionalRestrictionDisclosureEngine } from './ConstitutionalRestrictionDisclosureEngine';
import { ConstitutionalEnforcementDisclosureEngine } from './ConstitutionalEnforcementDisclosureEngine';
import { ConstitutionalConfidenceDisclosureEngine } from './ConstitutionalConfidenceDisclosureEngine';
import { ConstitutionalLineageDisclosureEngine } from './ConstitutionalLineageDisclosureEngine';

export class ConstitutionalGovernanceDashboardEngine {
  /**
   * Aggregates constitutional outputs, fiduciary restrictions, runtime enforcement,
   * quarantine information, and lineage from certified runtime outputs.
   * Performs aggregation only. No constitutional decisions.
   */
  public static generate(runtimeOutput: any): ConstitutionalGovernanceDashboardOutput {
    const isQuarantined = runtimeOutput?.status === 'CONSTITUTIONAL_QUARANTINE';
    const isFailed = runtimeOutput?.status === 'FAILED';
    const runtimeConfidence = runtimeOutput?.canonicalState?.confidence;
    
    let constitutionalStatus: 'COMPLIANT' | 'ATTENTION' | 'RESTRICTED' | 'VIOLATED' | 'FAIL_CLOSED' = 'COMPLIANT';
    if (isQuarantined || isFailed || runtimeConfidence === 'BLOCKED') {
      constitutionalStatus = 'FAIL_CLOSED';
    } else if (runtimeOutput?.canonicalState?.restrictions?.length > 0) {
      constitutionalStatus = 'RESTRICTED';
    } else if (runtimeOutput?.canonicalState?.warnings?.length > 0) {
      constitutionalStatus = 'ATTENTION';
    }

    const axiomStatus = ConstitutionalAxiomDisclosureEngine.extractAxioms(runtimeOutput);
    const restrictions = ConstitutionalRestrictionDisclosureEngine.extractRestrictions(runtimeOutput);
    const enforcementActions = ConstitutionalEnforcementDisclosureEngine.extractEnforcementActions(runtimeOutput);
    const confidenceBreakdown = ConstitutionalConfidenceDisclosureEngine.extractConfidence(runtimeOutput);
    const lineageInformation = ConstitutionalLineageDisclosureEngine.extractLineage(runtimeOutput);

    const quarantineState = isQuarantined ? {
      isQuarantined: true,
      reason: runtimeOutput.constitutionalSection?.quarantineReason || 'Quarentena Constitucional Ativa',
      activatedAt: new Date().toISOString(),
      suppressedSystems: ['Executive Timeline', 'Causality Explorer', 'Narrative Engine']
    } : undefined;

    return {
      constitutionalStatus,
      axiomStatus,
      restrictions,
      enforcementActions,
      overrides: [],
      quarantineState,
      confidenceBreakdown,
      lineageInformation,
      constitutionalNarrative: isQuarantined 
        ? 'Acesso bloqueado por violação constitucional.' 
        : 'Plataforma operando dentro dos limites fiduciários certificados.'
    };
  }
}
