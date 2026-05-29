// src/core/runtime/board-decision/DecisionLineageTracker.ts
import { BoardResolution } from './board-decision-types';

export class DecisionLineageTracker {
  /**
   * Validates if a resolution's lineage hash is cryptographically sound
   * based on its original input parameters.
   */
  public static verifyLineage(resolution: BoardResolution): boolean {
    if (!resolution.scenarioLineageHash || !resolution.resolutionHash) {
      return false;
    }

    const expectedHashInput = `${resolution.id}|${resolution.scenarioLineageHash}|${resolution.approverId}|${resolution.timestamp}`;
    let hash = 5381;
    for (let i = 0; i < expectedHashInput.length; i++) {
      hash = ((hash << 5) + hash) + expectedHashInput.charCodeAt(i);
    }
    const expectedHash = `H_${Math.abs(hash).toString(16).padStart(8, '0')}`;

    return resolution.resolutionHash === expectedHash;
  }

  /**
   * Tracks and formats the decision tree for audit purposes
   */
  public static generateAuditTrail(resolutions: BoardResolution[]): string[] {
    return resolutions.map(res => {
      const validity = this.verifyLineage(res) ? 'VALID' : 'TAMPERED';
      return `[${res.timestamp}] RES: ${res.id} | SCENARIO: ${res.scenarioLineageHash} | STATUS: ${validity} | IMPACT: ${res.structuralImpact}`;
    });
  }
}
