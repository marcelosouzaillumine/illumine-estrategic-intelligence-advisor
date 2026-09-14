// src/core/runtime/constitutional-governance/ConstitutionalRestrictionEngine.ts
//
// Constitutional Restriction Engine
// Translates constitutional governance states and metadata into fiduciarily actionable operational restrictions.

import { ConstitutionalGovernanceMetadata } from './constitutional-types';
import { FiduciaryRestriction } from '../institutional-reporting/institutional-reporting-types';

export interface ConstitutionalRestrictionResult {
  restrictions: FiduciaryRestriction[];
  isBlocked: boolean;
  isQuarantined: boolean;
  trajectoryConfidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  scoreCeiling: number;
}

export class ConstitutionalRestrictionEngine {
  /**
   * Translates a constitutional governance metadata state into strict operational restrictions and score ceilings.
   */
  public static translateRestrictions(metadata: ConstitutionalGovernanceMetadata): ConstitutionalRestrictionResult {
    const restrictions: FiduciaryRestriction[] = [];
    let isBlocked = false;
    let isQuarantined = false;
    let trajectoryConfidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED' = 'HIGH';
    let scoreCeiling = 100;

    const integrityState = metadata.integrityState;

    // Helper to add restrictions
    const addRestriction = (
      type: FiduciaryRestriction['restrictionType'],
      desc: string,
      affected: string[] = ['all']
    ) => {
      restrictions.push({
        restrictionType: type,
        description: desc,
        affectedRuntimes: affected
      });
    };

    // 1. MISSING_CONSTITUTIONAL_LINEAGE check
    const isMissingLineage =
      !metadata.constitutionalLineageHash ||
      metadata.constitutionalLineageHash === '' ||
      metadata.constitutionalLineageHash === 'placeholder-hash' ||
      metadata.constitutionalLineageHash === 'hash-fallback' ||
      metadata.constitutionalLineageHash === 'SEED-CONSTITUTIONAL-LINEAGE-HASH';

    if (isMissingLineage) {
      addRestriction('UNVERIFIABLE_LINEAGE', 'CRÍTICO: Assinatura ou linhagem constitucional ausente ou não verificada.');
      isBlocked = true;
      trajectoryConfidence = 'BLOCKED';
      scoreCeiling = Math.min(scoreCeiling, 0); // MISSING_CONSTITUTIONAL_LINEAGE score ceiling: 0
    }

    // 2. AXIOM_VIOLATION check
    const hasAxiomViolation = integrityState === 'AXIOM_VIOLATION' || metadata.axiomViolations.length > 0;
    if (hasAxiomViolation) {
      addRestriction('FAIL_CLOSED', `VIOLAÇÃO CONSTITUCIONAL: Quebra de axioma fiduciário fundamental. Detalhes: ${metadata.axiomViolations.join('; ')}`);
      isBlocked = true;
      isQuarantined = true;
      trajectoryConfidence = 'BLOCKED';
      scoreCeiling = Math.min(scoreCeiling, 0); // AXIOM_VIOLATION score ceiling: 0
    }

    // 3. FORBIDDEN_OVERRIDE_ATTEMPT check
    const hasForbiddenOverride = metadata.overrideAttempts.some(
      a => a.authorizationStatus === 'ATTEMPTED_FORBIDDEN'
    );
    if (hasForbiddenOverride) {
      addRestriction('RESTRICTED_ACCESS', 'RESTRIÇÃO CRÍTICA: Detectada tentativa de override proibido em regras inalteráveis.');
      isQuarantined = true;
      trajectoryConfidence = 'LOW';
      scoreCeiling = Math.min(scoreCeiling, 10); // FORBIDDEN_OVERRIDE_ATTEMPT score ceiling: 10
    }

    // 4. CONSTITUTIONAL_CONFLICT check
    const hasConflict = integrityState === 'CONSTITUTIONAL_CONFLICT' || metadata.detectedConflicts.length > 0;
    if (hasConflict) {
      addRestriction('FAIL_CLOSED', `QUARENTENA DE MIGRAÇÃO: Conflito lógico ou contradição fiduciária ativa entre Doutrina e Política.`);
      isQuarantined = true;
      trajectoryConfidence = 'LOW';
      scoreCeiling = Math.min(scoreCeiling, 20); // CONSTITUTIONAL_CONFLICT score ceiling: 20
    }

    // 5. INCOMPATIBLE_RUNTIME_TRANSITION check
    const hasIncompatibility = Object.values(metadata.compatibilityStatus).includes(false);
    if (hasIncompatibility) {
      addRestriction('RESTRICTED_ACCESS', 'QUARENTENA DE MIGRAÇÃO: Módulos do ecossistema incompatíveis com a matriz de runtime ativa.');
      isQuarantined = true;
      trajectoryConfidence = 'LOW';
      scoreCeiling = Math.min(scoreCeiling, 20); // INCOMPATIBLE_RUNTIME_TRANSITION score ceiling: 20
    }

    // 6. GOVERNANCE_EROSION_DETECTED check
    // If there are warnings of erosion or multiple overrides
    const auditLogs = metadata.auditRecords || [];
    const overrideRecords = auditLogs.filter(r => r.type === 'OVERRIDE_ATTEMPT');
    const hasErosion = overrideRecords.length >= 3 || overrideRecords.some(r => r.overrideAttempt?.authorizationStatus === 'UNAUTHORIZED');
    if (hasErosion) {
      addRestriction('RESTRICTED_ACCESS', 'CONFIANÇA OPERACIONAL RESTRITA: Sinais de erosão ou repetidas solicitações de override fiduciário.');
      trajectoryConfidence = 'MODERATE';
      scoreCeiling = Math.min(scoreCeiling, 30); // GOVERNANCE_EROSION_DETECTED score ceiling: 30
    }

    // 7. DOCTRINE_DRIFT check
    // If there's high frequency of policy updates or mismatch versions
    const hasDrift = integrityState === 'POLICY_DRIFT' || auditLogs.filter(r => r.type === 'POLICY_UPDATE').length >= 5;
    if (hasDrift) {
      addRestriction('RESTRICTED_ACCESS', 'CONFIANÇA OPERACIONAL RESTRITA: Desvio constante (drift) fiduciário de política.');
      trajectoryConfidence = 'MODERATE';
      scoreCeiling = Math.min(scoreCeiling, 30); // DOCTRINE_DRIFT score ceiling: 30
    }

    // If fail-closed state was resolved but not mapped above, ensure fail-closed limits are enforced
    if (integrityState === 'CONSTITUTIONAL_FAIL_CLOSED') {
      addRestriction('FAIL_CLOSED', 'CRÍTICO: Travamento fail-closed forçado pela camada constitucional.');
      isBlocked = true;
      isQuarantined = true;
      trajectoryConfidence = 'BLOCKED';
      scoreCeiling = Math.min(scoreCeiling, 0);
    }

    return {
      restrictions,
      isBlocked,
      isQuarantined,
      trajectoryConfidence,
      scoreCeiling
    };
  }
}
