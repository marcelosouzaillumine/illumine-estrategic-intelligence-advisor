// src/core/runtime/constitutional-governance/GovernanceOverrideEngine.ts
//
// Governance Override Engine
// Controls administrative bypasses, validates role legitimacy, prevents axiom weakening,
// and ensures absolute auditability by tracking all attempts (approved, rejected, forbidden, unauthorized).

import { ConstitutionalOverrideAttempt, ConstitutionalAuditRecord } from './constitutional-types';
import { sha256 } from '../../../platform/crypto/sha256';

export class GovernanceOverrideEngine {
  private overrideHistory: ConstitutionalOverrideAttempt[] = [];

  /**
   * Evaluates an administrative override attempt.
   * Generates a complete ConstitutionalOverrideAttempt and its corresponding ConstitutionalAuditRecord.
   */
  public evaluateOverrideAttempt(params: {
    actor: string;
    role: string;
    reason: string;
    target: string; // The policy key, threshold, or axiom key being targeted
    affectedDoctrineOrPolicy: string;
    constitutionalLineageHash: string;
  }): {
    isApproved: boolean;
    attempt: ConstitutionalOverrideAttempt;
    auditRecord: ConstitutionalAuditRecord;
  } {
    const timestamp = new Date().toISOString();
    const overrideId = `OVR-${sha256(`${params.actor}|${params.target}|${timestamp}`).substring(0, 16).toUpperCase()}`;

    let authorizationStatus: ConstitutionalOverrideAttempt['authorizationStatus'] = 'APPROVED';

    // 1. Axioms are strictly NON-OVERRIDABLE (Axiom Supremacy)
    const isAxiomTarget = params.target.toLowerCase().includes('axiom') || [
      'survivability_supremacy',
      'fail_closed_doctrine',
      'fiduciary_neutrality',
      'lineage_integrity',
      'deterministic_explainability',
      'treasury_preservation_priority',
      'disclosure_transparency',
      'audit_reconstructability'
    ].includes(params.target.toLowerCase());

    if (isAxiomTarget) {
      authorizationStatus = 'ATTEMPTED_FORBIDDEN';
    } else {
      // 2. Role validation
      // Only SovereignBoard and FiduciaryOfficer roles can override standard policies/thresholds.
      const authorizedRoles = ['SovereignBoard', 'FiduciaryOfficer'];
      if (!authorizedRoles.includes(params.role)) {
        authorizationStatus = 'UNAUTHORIZED';
      } else if (!params.reason || params.reason.trim().length < 10) {
        // Overrides require a substantial reason description
        authorizationStatus = 'REJECTED';
      }
    }

    const attempt: ConstitutionalOverrideAttempt = {
      overrideId,
      actor: params.actor,
      role: params.role,
      timestamp,
      reason: params.reason,
      target: params.target,
      authorizationStatus,
      affectedDoctrineOrPolicy: params.affectedDoctrineOrPolicy,
      constitutionalLineageHash: params.constitutionalLineageHash
    };

    this.overrideHistory.push(attempt);

    // Generate Audit Record (Refinement 2 - Mandatory audit record for every attempt)
    const auditRecord: ConstitutionalAuditRecord = {
      recordId: `AUD-OVR-${sha256(overrideId + '|' + timestamp).substring(0, 16).toUpperCase()}`,
      timestamp,
      type: 'OVERRIDE_ATTEMPT',
      details: `Tentativa de override fiduciário. Alvo: '${params.target}'. Status: ${authorizationStatus}. Motivo: ${params.reason}`,
      actor: params.actor,
      role: params.role,
      overrideAttempt: attempt,
      constitutionalLineageHash: params.constitutionalLineageHash
    };

    return {
      isApproved: authorizationStatus === 'APPROVED',
      attempt,
      auditRecord
    };
  }

  /**
   * Returns the history of all override attempts.
   */
  public getOverrideHistory(): ConstitutionalOverrideAttempt[] {
    return [...this.overrideHistory];
  }
}
