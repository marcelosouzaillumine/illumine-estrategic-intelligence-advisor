// src/core/runtime/constitutional-governance/RuntimePolicyEngine.ts
//
// Runtime Policy Engine
// Governs thresholds, propagation rules, severity limits, and checks for policy compliance.

import { RuntimePolicy } from './constitutional-types';

export class RuntimePolicyEngine {
  private activePolicy: RuntimePolicy;

  constructor(initialPolicy?: RuntimePolicy) {
    this.activePolicy = initialPolicy || {
      policyVersion: '1.0.0',
      thresholds: {
        minAvailableCash: 50000,
        maxLeverageRatio: 3.5,
        minEbitdaMargin: 0.10
      },
      propagationRules: ['ebitda_warning -> block_holding_capex'],
      severityEscalationLimits: {
        criticalLimit: 3,
        warningLimit: 5
      },
      survivabilityMinimums: {
        projectedRunwayMonths: 3
      },
      treasuryRestrictions: ['block_dividend_distributions', 'limit_intercompany_loans'],
      predictiveBlockingRules: ['runway_collapse_tendency -> block_expansion_credit'],
      publicationCertificationPolicies: ['block_unauthorized_board_packs', 'require_disclosure_on_restricted'],
      assuranceVetoRules: ['broken_lineage -> force_fail_closed', 'tampered_signature -> force_fail_closed']
    };
  }

  /**
   * Returns the current active policy structure.
   */
  public getActivePolicy(): RuntimePolicy {
    return {
      ...this.activePolicy,
      thresholds: { ...this.activePolicy.thresholds },
      propagationRules: [...this.activePolicy.propagationRules],
      severityEscalationLimits: { ...this.activePolicy.severityEscalationLimits },
      survivabilityMinimums: { ...this.activePolicy.survivabilityMinimums },
      treasuryRestrictions: [...this.activePolicy.treasuryRestrictions],
      predictiveBlockingRules: [...this.activePolicy.predictiveBlockingRules],
      publicationCertificationPolicies: [...this.activePolicy.publicationCertificationPolicies],
      assuranceVetoRules: [...this.activePolicy.assuranceVetoRules]
    };
  }

  /**
   * Updates the active policy configuration (e.g. after a valid constitutional migration).
   */
  public updatePolicy(newPolicy: RuntimePolicy): void {
    this.activePolicy = newPolicy;
  }

  /**
   * Evaluates runtime variables against thresholds, survivability minimums, and veto rules.
   */
  public evaluateState(state: {
    availableCash?: number;
    leverageRatio?: number;
    projectedRunwayMonths?: number;
    hasBrokenLineage?: boolean;
    hasTamperedSignature?: boolean;
  }): {
    isViolated: boolean;
    violations: string[];
    vetoTriggered: boolean;
  } {
    const violations: string[] = [];
    let vetoTriggered = false;

    // 1. Verify Cash Thresholds
    if (state.availableCash !== undefined && state.availableCash < this.activePolicy.thresholds.minAvailableCash) {
      violations.push(
        `POLÍTICA: Posição de caixa disponível (R$ ${state.availableCash}) violou o piso de segurança fiduciário (R$ ${this.activePolicy.thresholds.minAvailableCash}).`
      );
    }

    // 2. Verify Leverage Ratio
    if (state.leverageRatio !== undefined && state.leverageRatio > this.activePolicy.thresholds.maxLeverageRatio) {
      violations.push(
        `POLÍTICA: O índice de alavancagem (${state.leverageRatio}) superou o teto prudencial de governança (${this.activePolicy.thresholds.maxLeverageRatio}).`
      );
    }

    // 3. Verify Survivability Minimums
    if (
      state.projectedRunwayMonths !== undefined &&
      state.projectedRunwayMonths < this.activePolicy.survivabilityMinimums.projectedRunwayMonths
    ) {
      violations.push(
        `POLÍTICA: O runway projetado (${state.projectedRunwayMonths} meses) está abaixo do piso constitucional de sobrevivência (${this.activePolicy.survivabilityMinimums.projectedRunwayMonths} meses).`
      );
    }

    // 4. Verify Assurance Veto Rules (Lineage / Signatures)
    if (state.hasBrokenLineage && this.activePolicy.assuranceVetoRules.includes('broken_lineage -> force_fail_closed')) {
      violations.push('VETO POLÍTICO: Quebra de lineage detectada. Travamento fail-closed ativado.');
      vetoTriggered = true;
    }

    if (state.hasTamperedSignature && this.activePolicy.assuranceVetoRules.includes('tampered_signature -> force_fail_closed')) {
      violations.push('VETO POLÍTICO: Assinatura fiduciária corrompida. Travamento fail-closed ativado.');
      vetoTriggered = true;
    }

    return {
      isViolated: violations.length > 0,
      violations,
      vetoTriggered
    };
  }
}
