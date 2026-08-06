// src/core/runtime/decision-policy/ContextualSeverityEngine.ts
//
// Contextual Severity Engine

import { DecisionSeverity } from '../decision-intelligence/decision-types';
import { PolicyContext } from './policy-types';

export class ContextualSeverityEngine {
  /**
   * Modulates validation severity based on the active policy context and materiality,
   * while keeping constitutional and key fiduciarily destructive actions non-bypassable.
   */
  public static adjustSeverity(
    baseSeverity: DecisionSeverity,
    violations: string[],
    policyContext: PolicyContext
  ): DecisionSeverity {
    // 1. Non-bypassable check: If severity is CONSTITUTIONAL_VIOLATION, it must remain blocked.
    if (baseSeverity === 'CONSTITUTIONAL_VIOLATION') {
      return 'CONSTITUTIONAL_VIOLATION';
    }

    // 2. Identify if any violation represents a non-bypassable constitutional safeguard
    const hasNonBypassableViolation = violations.some(v => {
      const lower = v.toLowerCase();
      return (
        lower.includes('constitucional') ||
        lower.includes('prejuízo') ||
        lower.includes('lucro líquido') ||
        lower.includes('erosão patrimonial') ||
        lower.includes('lineage hash') ||
        lower.includes('rastreabilidade') ||
        lower.includes('matemática') ||
        lower.includes('safeguard') ||
        lower.includes('bypass') ||
        lower.includes('sem contexto') ||
        lower.includes('contexto institucional')
      );
    });

    if (hasNonBypassableViolation) {
      return baseSeverity;
    }

    // 3. Apply materiality-based flexibility
    if (!policyContext.materiality.isMaterial) {
      if (baseSeverity === 'UNSUSTAINABLE') {
        return 'CRITICAL'; // Downgrade from unsustainable block to warning
      }
      if (baseSeverity === 'CRITICAL' || baseSeverity === 'HIGH_RISK') {
        return 'ATTENTION';
      }
      return 'SAFE';
    }

    // 4. Apply profile-specific severity offsets
    const profile = policyContext.activeProfile;

    if (profile === 'TURNAROUND') {
      // Turnarounds allow higher temporary debt/leverage exposure
      if (baseSeverity === 'UNSUSTAINABLE') {
        const isDebtRelated = violations.some(v => v.toLowerCase().includes('dívida') || v.toLowerCase().includes('debt') || v.toLowerCase().includes('leverage'));
        if (isDebtRelated) {
          return 'CRITICAL'; // Downgrade block to warning to allow restructuring
        }
      }
    }

    if (profile === 'HYPER_GROWTH') {
      // Hyper Growth has higher tolerance for CAPEX/expansion warnings
      if (baseSeverity === 'UNSUSTAINABLE') {
        const isCapexOrExp = violations.some(v => v.toLowerCase().includes('capex') || v.toLowerCase().includes('expansão') || v.toLowerCase().includes('expansion'));
        if (isCapexOrExp) {
          return 'CRITICAL';
        }
      }
    }

    return baseSeverity;
  }
}
