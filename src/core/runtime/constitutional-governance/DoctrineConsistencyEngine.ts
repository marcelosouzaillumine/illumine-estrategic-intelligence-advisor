// src/core/runtime/constitutional-governance/DoctrineConsistencyEngine.ts
//
// Doctrine Consistency Engine
// Validates cross-runtime policy and doctrine configurations to detect logical conflicts,
// thresholds mismatches, or regulatory contradictions.

import { FiduciaryDoctrine, RuntimePolicy } from './constitutional-types';

export class DoctrineConsistencyEngine {
  /**
   * Scans an active doctrine and runtime policy for cross-layer conflicts or structural contradictions.
   */
  public verifyConsistency(
    doctrine: FiduciaryDoctrine,
    policy: RuntimePolicy
  ): { isConsistent: boolean; conflicts: string[] } {
    const conflicts: string[] = [];

    // 1. Threshold Contradiction: Policy minAvailableCash must be >= Doctrine treasuryReserveThreshold
    const minCash = policy.thresholds.minAvailableCash;
    const doctrineReserve = Number(doctrine.ruleset.treasuryReserveThreshold || 0);

    if (minCash < doctrineReserve) {
      conflicts.push(
        `CONFLITO: O piso de caixa da política (R$ ${minCash}) é menor do que a reserva de tesouraria exigida pela doutrina (R$ ${doctrineReserve}).`
      );
    }

    // 2. Safeguard Conflict: If doctrine enforces fail-closed on low confidence, policy must have veto rules for broken lineage
    const docFailClosed = doctrine.ruleset.failClosedOnLowConfidence;
    const policyVetoRules = policy.assuranceVetoRules || [];
    const hasBrokenLineageVeto = policyVetoRules.some(r => r.includes('broken_lineage'));

    if (docFailClosed === true && !hasBrokenLineageVeto) {
      conflicts.push(
        `CONFLITO: A doutrina exige fail-closed sob baixa confiança, mas a política não possui uma regra de veto para quebra de lineage ('broken_lineage').`
      );
    }

    // 3. Dividend Contradiction: If doctrine prohibits dividend distributions, policy treasury restrictions must include 'block_dividend_distributions'
    const docDividendAllowed = doctrine.ruleset.dividendDistributionAllowed;
    const policyTreasuryRestrictions = policy.treasuryRestrictions || [];
    const blocksDividends = policyTreasuryRestrictions.includes('block_dividend_distributions');

    if (docDividendAllowed === false && !blocksDividends) {
      conflicts.push(
        `CONFLITO: A doutrina proíbe distribuição de dividendos, mas as restrições de tesouraria da política não incluem 'block_dividend_distributions'.`
      );
    }

    // 4. Propagation Coherence: Ensure all modules in doctrine propagation scope are accounted for in policy domains
    const scope = doctrine.propagationScope || [];
    if (scope.includes('publication-governance') && (!policy.publicationCertificationPolicies || policy.publicationCertificationPolicies.length === 0)) {
      conflicts.push(
        `AVISO: Escopo de propagação doutrinária exige 'publication-governance', mas nenhuma política de certificação de publicação está configurada.`
      );
    }

    if (scope.includes('audit-assurance') && (!policy.assuranceVetoRules || policy.assuranceVetoRules.length === 0)) {
      conflicts.push(
        `AVISO: Escopo de propagação doutrinária exige 'audit-assurance', mas nenhuma regra de veto de assurance está configurada.`
      );
    }

    return {
      isConsistent: conflicts.length === 0,
      conflicts
    };
  }
}
