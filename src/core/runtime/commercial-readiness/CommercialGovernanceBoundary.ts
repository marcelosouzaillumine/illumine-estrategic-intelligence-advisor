import { PlanTierName } from './CommercialReadinessTypes';

export class CommercialGovernanceBoundary {
  /**
   * Enforces that commercial rules are strictly subordinated to fiduciaries.
   * Hierarquia de precedência:
   * 1. Runtime Compliance
   * 2. Tenant Sovereignty
   * 3. Disclosure Enforcement
   * 4. Lineage Integrity
   * 5. Confidence Integrity
   * 6. Violation Visibility
   * 7. Advisor Ethical Boundaries
   * 8. Commercial Plan Rules
   * 9. Branding / White-label
   * 10. UI Preferences
   */
  public static assertSubordination(
    plan: PlanTierName,
    originalConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED',
    displayedConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED',
    originalSeverity: 'WARNING' | 'CRITICAL' | 'INFO',
    displayedSeverity: 'WARNING' | 'CRITICAL' | 'INFO',
    originalViolationsCount: number,
    displayedViolationsCount: number,
    disclosureSuppressed: boolean,
    whiteLabelBannerRemoved: boolean
  ): void {
    // 1. Disclosure Enforcement: plan cannot hide disclosure
    if (disclosureSuppressed) {
      throw new Error('[COMMERCIAL-GOV-001]: Institutional disclosure cannot be suppressed by any commercial tier.');
    }

    // 2. White-label boundary: banner removal is forbidden
    if (whiteLabelBannerRemoved) {
      throw new Error('[COMMERCIAL-GOV-002]: White-label configuration cannot remove the mandatory RuntimeDisclosureBanner.');
    }

    // 3. Violation Visibility: cannot hide active violations
    if (displayedViolationsCount < originalViolationsCount) {
      throw new Error('[COMMERCIAL-GOV-003]: Commercial configuration cannot filter or hide active runtime violations.');
    }

    // 4. Severity Integrity: cannot downgrade severity
    if (originalSeverity === 'CRITICAL' && displayedSeverity !== 'CRITICAL') {
      throw new Error('[COMMERCIAL-GOV-004]: Commercial rules cannot downgrade CRITICAL severity to lower states.');
    }
    if (originalSeverity === 'WARNING' && displayedSeverity === 'INFO') {
      throw new Error('[COMMERCIAL-GOV-005]: Commercial rules cannot downgrade WARNING severity to INFO.');
    }

    // 5. Confidence Integrity: branding or rules cannot mask LOW confidence
    if (originalConfidence === 'LOW' && displayedConfidence !== 'LOW') {
      throw new Error('[COMMERCIAL-GOV-006]: Branding and commercial parameters cannot mask LOW confidence states.');
    }
    if (originalConfidence === 'UNVERIFIED' && displayedConfidence !== 'UNVERIFIED') {
      throw new Error('[COMMERCIAL-GOV-007]: Unverified confidence states cannot be masked as healthy.');
    }
  }
}
