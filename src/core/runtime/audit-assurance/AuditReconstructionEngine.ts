// src/core/runtime/audit-assurance/AuditReconstructionEngine.ts
//
// Audit Reconstruction Engine
// Replays and validates execution records, applying the dual reconstruction tolerance standard.

export class AuditReconstructionEngine {
  /**
   * Verifies if a reconstructed run matches the original execution details using the dual standard.
   */
  public verifyReconstruction(
    original: any,
    reconstructed: any
  ): { verified: boolean; discrepancies: string[] } {
    const discrepancies: string[] = [];

    if (!original || !reconstructed) {
      return {
        verified: false,
        discrepancies: ['Não é possível comparar objetos nulos ou indefinidos']
      };
    }

    // Normalize volatile fields for both versions
    const normOriginal = this.normalize(original);
    const normReconstructed = this.normalize(reconstructed);

    // 1. Strict Identity Validation (bitwise/string equivalence)
    const strictKeysMap = [
      { key: 'sourceInputs', label: 'normalized source inputs' },
      { key: 'lineageHash', label: 'runtime lineage hashes' },
      { key: 'signature', label: 'evidence signatures' },
      { key: 'publicationHash', label: 'publication hashes' },
      { key: 'decisionHash', label: 'decision hashes' },
      { key: 'treasuryHash', label: 'treasury hashes' },
      { key: 'simulationHash', label: 'simulation hashes' }
    ];

    for (const entry of strictKeysMap) {
      const origVal = this.lookupValue(normOriginal, entry.key);
      const reconVal = this.lookupValue(normReconstructed, entry.key);

      if (origVal !== undefined || reconVal !== undefined) {
        const origStr = typeof origVal === 'object' ? JSON.stringify(origVal) : String(origVal);
        const reconStr = typeof reconVal === 'object' ? JSON.stringify(reconVal) : String(reconVal);

        if (origStr !== reconStr) {
          discrepancies.push(
            `Erro de Identidade Estrita para [${entry.label}]: original '${origStr}' vs reconstruído '${reconStr}'`
          );
        }
      }
    }

    // 2. Semantic Equivalence Validation (formatting/casing tolerated, meaning identical)
    const semanticKeysMap = [
      { key: 'metrics', label: 'metrics' },
      { key: 'severityClassification', label: 'severity classifications' },
      { key: 'severityState', label: 'severity classifications' },
      { key: 'assuranceClassification', label: 'assurance classifications' },
      { key: 'classification', label: 'assurance classifications' },
      { key: 'failClosedState', label: 'fail-closed states' },
      { key: 'failClosedPropagation', label: 'fail-closed states' },
      { key: 'decisionOutcome', label: 'decision outcomes' },
      { key: 'narrativeConclusions', label: 'narrative conclusions' },
      { key: 'disclosureRequirements', label: 'disclosure requirements' }
    ];

    for (const entry of semanticKeysMap) {
      const origVal = this.lookupValue(normOriginal, entry.key);
      const reconVal = this.lookupValue(normReconstructed, entry.key);

      if (origVal !== undefined || reconVal !== undefined) {
        if (!this.areSemanticallyEquivalent(origVal, reconVal)) {
          discrepancies.push(
            `Erro de Equivalência Semântica para [${entry.label}]: original '${JSON.stringify(origVal)}' vs reconstruído '${JSON.stringify(reconVal)}'`
          );
        }
      }
    }

    return {
      verified: discrepancies.length === 0,
      discrepancies
    };
  }

  /**
   * Looks up a key within an object, supporting nested resolution or checking sub-objects.
   */
  private lookupValue(obj: any, key: string): any {
    if (!obj || typeof obj !== 'object') {
      return undefined;
    }
    
    // Direct match
    if (key in obj) {
      return obj[key];
    }

    // Recursively look up in child properties (e.g. if field is inside evidencePackage or metrics)
    for (const prop of Object.keys(obj)) {
      if (obj[prop] && typeof obj[prop] === 'object') {
        const found = this.lookupValue(obj[prop], key);
        if (found !== undefined) {
          return found;
        }
      }
    }

    return undefined;
  }

  /**
   * Asserts whether two structures represent the same fiduciary/semantic meaning.
   */
  public areSemanticallyEquivalent(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == b) return true; // loose comparison for numbers/strings

    // Number comparisons: permit precision variance or string representations
    if (!isNaN(Number(a)) && !isNaN(Number(b)) && a !== null && b !== null && a !== '' && b !== '') {
      return Number(a) === Number(b);
    }

    // String comparisons: permit spacing, casing, and quote differences
    if (typeof a === 'string' && typeof b === 'string') {
      const clean = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
      return clean(a) === clean(b);
    }

    // Boolean comparison: permit 'true' / true / 1 conversions
    if (typeof a === 'boolean' || typeof b === 'boolean') {
      const toBool = (val: any) => {
        if (typeof val === 'string') return val.toLowerCase() === 'true';
        return !!val;
      };
      return toBool(a) === toBool(b);
    }

    // Array comparisons: permit different ordering (except strict inputs, handled elsewhere)
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, idx) => this.areSemanticallyEquivalent(val, sortedB[idx]));
    }

    // Object comparisons: match keys recursively
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(k => this.areSemanticallyEquivalent(a[k], b[k]));
    }

    return false;
  }

  /**
   * Standardizes volatile elements: timestamps, random/sequence IDs, execution durations, environment metadata.
   */
  public normalize(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      const normList = obj.map(item => this.normalize(item));
      // Sort string lists to avoid non-deterministic array order mismatches
      if (normList.every(item => typeof item === 'string')) {
        normList.sort();
      }
      return normList;
    }

    if (typeof obj === 'object') {
      const normObj: any = {};
      for (const key of Object.keys(obj)) {
        if (['timestamp', 'date', 'updatedAt', 'createdAt', 'time'].includes(key)) {
          normObj[key] = 'NORMALIZED_TIMESTAMP';
        } else if (['id', 'uuid', 'correlationId', 'auditId', 'taskId', 'eventId'].includes(key)) {
          normObj[key] = 'NORMALIZED_ID';
        } else if (['duration', 'durationMs', 'executionTime', 'elapsedTime'].includes(key)) {
          normObj[key] = 0;
        } else if (['environmentMetadata', 'env', 'meta', 'environment'].includes(key)) {
          normObj[key] = 'NORMALIZED_ENV';
        } else {
          normObj[key] = this.normalize(obj[key]);
        }
      }
      return normObj;
    }

    if (typeof obj === 'string') {
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (isoRegex.test(obj)) {
        return 'NORMALIZED_TIMESTAMP';
      }
    }

    return obj;
  }
}
