// src/core/runtime/publication-governance/PublicationGovernanceEngine.ts
//
// Publication Governance Engine
// Controls release gates and maps publication classifications and severities.

import { CertificationClassification, PublicationSeverity } from './publication-types';

export class PublicationGovernanceEngine {
  /**
   * Resolves final publication classification and severity based on validations.
   */
  public static resolveClassificationAndSeverity(
    isLineageBroken: boolean,
    isFailClosed: boolean,
    hasContradictions: boolean,
    hasMissingDisclosures: boolean,
    isRestrictedView: boolean
  ): { classification: CertificationClassification; severity: PublicationSeverity } {
    
    if (isFailClosed) {
      return { classification: 'FAIL_CLOSED', severity: 'FAIL_CLOSED' };
    }

    if (isLineageBroken || hasContradictions) {
      return { classification: 'BLOCKED', severity: 'BLOCKED' };
    }

    if (isRestrictedView) {
      return { classification: 'RESTRICTED', severity: 'RESTRICTED' };
    }

    if (hasMissingDisclosures) {
      return { classification: 'CERTIFIED_WITH_DISCLOSURE', severity: 'DISCLOSURE_REQUIRED' };
    }

    return {
      classification: 'CERTIFIED',
      severity: 'SAFE'
    };
  }
}
