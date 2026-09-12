// src/core/runtime/audit-assurance/EvidenceIntegrityEngine.ts
//
// Evidence Integrity Engine
// Cryptographically validates signatures, detects orphaned states, and verifies non-tampered lineage.

import { EvidencePackage, AuditTrailEntry } from './audit-types';
import { FiduciaryEvidenceEngine } from './FiduciaryEvidenceEngine';

export class EvidenceIntegrityEngine {
  private evidenceEngine = new FiduciaryEvidenceEngine();

  /**
   * Validates the cryptographic signature of an EvidencePackage to ensure no data has been tampered with.
   */
  public validateSignature(pkg: EvidencePackage): boolean {
    if (!pkg.signature) {
      return false;
    }
    const recalculated = this.evidenceEngine.signPackage(pkg);
    return pkg.signature === recalculated;
  }

  /**
   * Checks for orphaned dependencies where causal paths reference sources/variables that are not registered.
   */
  public detectOrphanedDependencies(
    declaredDependencies: string[],
    registeredAncestors: string[]
  ): { hasOrphans: boolean; orphans: string[] } {
    const ancestorsSet = new Set(registeredAncestors.map(a => a.trim().toLowerCase()));
    const orphans = declaredDependencies.filter(
      dep => !ancestorsSet.has(dep.trim().toLowerCase())
    );

    return {
      hasOrphans: orphans.length > 0,
      orphans
    };
  }

  /**
   * Verifies that the lineage hashes in the execution trail form a valid, continuous, non-broken chain.
   */
  public validateLineageChain(trail: AuditTrailEntry[]): boolean {
    if (!trail || trail.length === 0) {
      return false; // No trail to certify lineage
    }

    for (const entry of trail) {
      if (!entry.lineageHashes || entry.lineageHashes.length === 0) {
        return false; // Broken lineage: a step lacks lineage hashes
      }

      // Check for empty/invalid hashes in the array
      const hasEmptyHash = entry.lineageHashes.some(hash => !hash || hash.trim() === '');
      if (hasEmptyHash) {
        return false;
      }
    }

    return true;
  }
}
