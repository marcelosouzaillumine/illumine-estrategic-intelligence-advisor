// src/core/runtime/constitutional-governance/RuntimeCompatibilityEngine.ts
//
// Runtime Compatibility Engine
// Manages and verifies the compatibility matrix across the ten core domains of the Governance/EFOS system.

export class RuntimeCompatibilityEngine {
  private compatibilityMatrix: Record<string, Record<string, boolean>>;

  constructor() {
    const coreDomains = [
      'compliance',
      'decision_intelligence',
      'policy_materiality',
      'behavioral_intelligence',
      'predictive_intelligence',
      'strategic_simulation',
      'advisory_narrative',
      'publication_governance',
      'audit_assurance',
      'treasury_intelligence'
    ];

    this.compatibilityMatrix = {};
    for (const d1 of coreDomains) {
      this.compatibilityMatrix[d1] = {};
      for (const d2 of coreDomains) {
        // By default, all core domains are compatible.
        this.compatibilityMatrix[d1][d2] = true;
      }
    }
  }

  /**
   * Returns a copy of the active compatibility matrix.
   */
  public getCompatibilityMatrix(): Record<string, Record<string, boolean>> {
    const copy: Record<string, Record<string, boolean>> = {};
    for (const domain of Object.keys(this.compatibilityMatrix)) {
      copy[domain] = { ...this.compatibilityMatrix[domain] };
    }
    return copy;
  }

  /**
   * Updates compatibility between two specific domains.
   */
  public setCompatibility(domainA: string, domainB: string, isCompatible: boolean): void {
    if (this.compatibilityMatrix[domainA] && this.compatibilityMatrix[domainB]) {
      this.compatibilityMatrix[domainA][domainB] = isCompatible;
      this.compatibilityMatrix[domainB][domainA] = isCompatible;
    }
  }

  /**
   * Validates framework-wide compatibility across all domains in the matrix.
   */
  public validateFrameworkCompatibility(): { isFullyCompatible: boolean; incompatiblePairs: string[] } {
    const incompatiblePairs: string[] = [];
    const domains = Object.keys(this.compatibilityMatrix);

    for (let i = 0; i < domains.length; i++) {
      for (let j = i + 1; j < domains.length; j++) {
        const d1 = domains[i];
        const d2 = domains[j];
        if (!this.compatibilityMatrix[d1][d2]) {
          incompatiblePairs.push(`${d1} <-> ${d2}`);
        }
      }
    }

    return {
      isFullyCompatible: incompatiblePairs.length === 0,
      incompatiblePairs
    };
  }
}
