export class AdvisorEthicalBoundaryGuard {
  /**
   * Asserts that a comparative operation or benchmark request meets ethical compliance.
   * Promotes:
   * - No cross-tenant raw comparison
   * - Forced anonymization for benchmarks
   * - Blocking of direct competitor tracing
   */
  public static assertEthicalComparison(
    requestingAdvisorId: string,
    targetTenantId: string,
    comparisonTenantId: string,
    isAnonymized: boolean,
    allowCrossExport: boolean
  ): void {
    if (targetTenantId === comparisonTenantId) {
      // Comparing a tenant with itself is always allowed
      return;
    }

    // Direct comparison without anonymization is strictly prohibited
    if (!isAnonymized) {
      throw new Error(
        `[ETHICAL-BOUND-001]: Direct non-anonymized comparison between tenants ${targetTenantId} and ${comparisonTenantId} is forbidden under Advisor Ethical boundaries.`
      );
    }

    // Exporting raw cross-tenant causality trees is strictly forbidden
    if (allowCrossExport) {
      throw new Error(
        `[ETHICAL-BOUND-002]: Exporting raw cross-tenant causality pathways is blocked to prevent competitive leakage.`
      );
    }
  }
}
