// src/core/runtime/constitutional-governance/ConstitutionalMigrationEngine.ts
//
// Constitutional Migration Engine
// Validates policy and doctrine transitions, ensuring no downgrades of core fiduciary safeties.

import { FiduciaryDoctrine, RuntimePolicy } from './constitutional-types';

export class ConstitutionalMigrationEngine {
  /**
   * Validates if a proposed policy or doctrine migration is safe and does not downgrade fiduciary standards.
   */
  public validateMigrationSafety(
    currentDoctrine: FiduciaryDoctrine,
    proposedDoctrine: FiduciaryDoctrine,
    currentPolicy: RuntimePolicy,
    proposedPolicy: RuntimePolicy
  ): { isSafe: boolean; blockReasons: string[] } {
    const blockReasons: string[] = [];

    // 1. Weakens fail-closed safeguards check
    const curFailClosed = currentDoctrine.ruleset.failClosedOnLowConfidence;
    const proposedFailClosed = proposedDoctrine.ruleset.failClosedOnLowConfidence;
    if (curFailClosed === true && proposedFailClosed !== true) {
      blockReasons.push('MIGRATION_BLOCKED: A migração proposta desativa ou enfraquece a salvaguarda fail-closed.');
    }

    // 2. Reduces lineage requirements check
    if (proposedDoctrine.propagationScope.length < currentDoctrine.propagationScope.length) {
      blockReasons.push('MIGRATION_BLOCKED: A migração proposta reduz as exigências de propagação de lineage.');
    }

    // 3. Suppresses disclosure obligations check
    const curCertificationPolicies = currentPolicy.publicationCertificationPolicies || [];
    const proposedCertificationPolicies = proposedPolicy.publicationCertificationPolicies || [];
    const suppressedDisclosure = curCertificationPolicies.some(
      cur => cur.includes('disclosure') && !proposedCertificationPolicies.some(p => p.includes('disclosure'))
    );
    if (suppressedDisclosure) {
      blockReasons.push('MIGRATION_BLOCKED: A migração suprime obrigações mandatórias de disclosure.');
    }

    // 4. Lowers survivability minimums check
    const curMinRunway = currentPolicy.survivabilityMinimums?.projectedRunwayMonths ?? 3;
    const proposedMinRunway = proposedPolicy.survivabilityMinimums?.projectedRunwayMonths ?? 3;
    if (proposedMinRunway < curMinRunway) {
      blockReasons.push(
        `MIGRATION_BLOCKED: Tentativa de reduzir o piso mínimo de sobrevivência de ${curMinRunway} para ${proposedMinRunway} meses.`
      );
    }

    // 5. Downgrades treasury rupture protections check
    if (proposedPolicy.treasuryRestrictions.length < currentPolicy.treasuryRestrictions.length) {
      blockReasons.push('MIGRATION_BLOCKED: A migração enfraquece restrições ativas de tesouraria.');
    }

    // 6. Compromises audit reconstructability check
    const curVetoRules = currentPolicy.assuranceVetoRules || [];
    const proposedVetoRules = proposedPolicy.assuranceVetoRules || [];
    const curReconstructVeto = curVetoRules.some(r => r.includes('lineage') || r.includes('signature'));
    const proposedReconstructVeto = proposedVetoRules.some(r => r.includes('lineage') || r.includes('signature'));

    if (curReconstructVeto && !proposedReconstructVeto) {
      blockReasons.push('MIGRATION_BLOCKED: A migração compromete a auditabilidade e a reconstituição lógica dos registros.');
    }

    return {
      isSafe: blockReasons.length === 0,
      blockReasons
    };
  }
}
