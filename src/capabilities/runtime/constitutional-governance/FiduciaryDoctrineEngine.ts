// src/core/runtime/constitutional-governance/FiduciaryDoctrineEngine.ts
//
// Fiduciary Doctrine Engine
// Controls doctrine lifecycle, versions, supersessions, and compatibility verification.

import { FiduciaryDoctrine } from './constitutional-types';
import { sha256 } from '../../../workspace/runtime/executive/types';

export class FiduciaryDoctrineEngine {
  private activeDoctrine: FiduciaryDoctrine;
  private readonly doctrineHistory: FiduciaryDoctrine[] = [];

  constructor(initialDoctrine?: FiduciaryDoctrine) {
    this.activeDoctrine = initialDoctrine || {
      doctrineVersion: '1.0.0',
      ruleset: {
        requireLongitudinalCycles: 3,
        failClosedOnLowConfidence: true,
        treasuryReserveThreshold: 50000,
        dividendDistributionAllowed: false
      },
      doctrineLineageHash: 'DOC-SHA256-INITIAL-FIDUCIARY-DOCTRINE-SIGNATURE',
      compatibilityReferences: ['1.0.0', '1.1.0'],
      propagationScope: ['compliance', 'decision-governance', 'publication-governance', 'audit-assurance'],
      migrationRequirements: ['initialize-axioms']
    };
    this.doctrineHistory.push(this.activeDoctrine);
  }

  /**
   * Returns the current active doctrine ruleset.
   */
  public getActiveDoctrine(): FiduciaryDoctrine {
    return {
      ...this.activeDoctrine,
      ruleset: { ...this.activeDoctrine.ruleset },
      compatibilityReferences: [...this.activeDoctrine.compatibilityReferences],
      propagationScope: [...this.activeDoctrine.propagationScope],
      migrationRequirements: [...this.activeDoctrine.migrationRequirements]
    };
  }

  /**
   * Returns the entire history of published and superseded doctrines.
   */
  public getDoctrineHistory(): FiduciaryDoctrine[] {
    return this.doctrineHistory.map(d => ({
      ...d,
      ruleset: { ...d.ruleset },
      compatibilityReferences: [...d.compatibilityReferences],
      propagationScope: [...d.propagationScope],
      migrationRequirements: [...d.migrationRequirements]
    }));
  }

  /**
   * Publishes a new doctrine, superseding the current active one and linking it in the lineage chain.
   */
  public publishDoctrine(newDoctrine: Omit<FiduciaryDoctrine, 'doctrineLineageHash'>): FiduciaryDoctrine {
    // Generate deterministic hash including the previous doctrine's hash (supersession chain validation)
    const payload = [
      newDoctrine.doctrineVersion,
      JSON.stringify(newDoctrine.ruleset),
      newDoctrine.compatibilityReferences.join(','),
      newDoctrine.propagationScope.join(','),
      newDoctrine.migrationRequirements.join(','),
      this.activeDoctrine.doctrineLineageHash
    ].join('|');

    const doctrineLineageHash = `DOC-SHA256-${sha256(payload).substring(0, 32)}`;

    const published: FiduciaryDoctrine = {
      ...newDoctrine,
      doctrineLineageHash
    };

    this.activeDoctrine = published;
    this.doctrineHistory.push(published);

    return published;
  }

  /**
   * Validates if the active doctrine is compatible with a specific runtime target version.
   */
  public isCompatible(runtimeVersion: string): boolean {
    return this.activeDoctrine.compatibilityReferences.includes(runtimeVersion);
  }
}
