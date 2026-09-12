// src/core/runtime/publication-governance/ExportAuthorizationEngine.ts
//
// Export Authorization Engine
// Controls export gates, distinguishing internal visualization from formal publication / board packs.

import { CertificationClassification, PublicationArtifactType } from './publication-types';

export class ExportAuthorizationEngine {
  /**
   * Asserts whether a report artifact is eligible for export or internal visualization.
   */
  public static checkExportAuthorization(
    classification: CertificationClassification,
    artifactType: PublicationArtifactType,
    hasContradictions: boolean,
    hasMissingDisclosures: boolean,
    isInternalView: boolean
  ): { isAuthorized: boolean; rationale: string } {
    
    // Hard blocks under critical conditions
    if (classification === 'FAIL_CLOSED') {
      return { isAuthorized: false, rationale: 'EXPORT BLOCKED: Publication runtime is in FAIL_CLOSED state due to system validation error.' };
    }

    if (classification === 'BLOCKED') {
      return { isAuthorized: false, rationale: 'EXPORT BLOCKED: Artifact fails key fiduciary constraints and is flagged as BLOCKED.' };
    }

    if (hasContradictions) {
      return { isAuthorized: false, rationale: 'EXPORT BLOCKED: Unresolved runtime narrative contradictions detected.' };
    }

    if (hasMissingDisclosures) {
      return { isAuthorized: false, rationale: 'EXPORT BLOCKED: Missing required fiduciarily mandated disclosures.' };
    }

    // 1. Internal View boundary
    if (isInternalView) {
      if (classification === 'RESTRICTED') {
        return { 
          isAuthorized: true, 
          rationale: 'INTERNAL VIEW GRANTED: Publication allowed internally under restricted handling with warning banner.' 
        };
      }
      return { isAuthorized: true, rationale: 'INTERNAL VIEW GRANTED: Fully compliant or approved with disclosure.' };
    }

    // 2. Formal Export/Publication boundary (isInternalView === false)
    if (classification === 'RESTRICTED') {
      return { 
        isAuthorized: false, 
        rationale: `EXPORT BLOCKED: Restricted artifacts cannot be exported formally. Allowed only for internal visualization.` 
      };
    }

    // 3. Board Pack Standard
    if (artifactType === 'BOARD_PACK') {
      if (classification !== 'CERTIFIED' && classification !== 'CERTIFIED_WITH_DISCLOSURE') {
        return { 
          isAuthorized: false, 
          rationale: `BOARD PACK EXPORT BLOCKED: Elevated integrity standards require board packs to be CERTIFIED or CERTIFIED_WITH_DISCLOSURE. Got: ${classification}.` 
        };
      }
    }

    // Allowed for CERTIFIED and CERTIFIED_WITH_DISCLOSURE
    return {
      isAuthorized: true,
      rationale: 'EXPORT AUTHORIZED: Artifact complies with publication governance standards.'
    };
  }
}
