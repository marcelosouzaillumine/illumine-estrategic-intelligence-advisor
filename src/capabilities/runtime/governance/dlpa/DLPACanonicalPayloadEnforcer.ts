import { DLPALegacyFieldScanner } from './DLPALegacyFieldScanner';

export class DLPACanonicalPayloadEnforcer {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static enforce(payload: any): {
    status: 'CANONICAL' | 'LEGACY_DETECTED' | 'UI_OVERRIDE_DETECTED';
    normalizedPayload: any;
  } {
    if (!payload) {
      return { status: 'CANONICAL', normalizedPayload: payload };
    }

    // 1. Scan for legacy fields
    const scanStatus = DLPALegacyFieldScanner.scan(payload);
    if (scanStatus === 'LEGACY_PAYLOAD_DETECTED') {
      return { status: 'LEGACY_DETECTED', normalizedPayload: payload };
    }

    // 2. Scan for UI overrides / shadow bindings (e.g. if visual thresholds are overridden)
    // We compare resolved values in executiveLayer against expected canonical shapes
    const exec = payload.executiveLayer;
    if (exec) {
      const cps = exec.capitalPreservationScore;
      const radar = payload.resolvedCapitalStatus || payload.capitalStatus;
      
      // If we detect hardcoded UI overrides on score or status (like mismatch with components)
      if (cps && cps.components) {
        const expectedScore = Math.round(
          (cps.components.remanescenteScore || 0) * 0.45 +
          (cps.components.dependencyScore || 0) * 0.30 +
          (cps.components.distributionScore || 0) * 0.10 +
          (cps.components.horizonScore || 0) * 0.15
        );
        
        // A mismatch between computed components and the actual score signifies UI override
        if (Math.abs(cps.score - expectedScore) > 1) {
          return { status: 'UI_OVERRIDE_DETECTED', normalizedPayload: payload };
        }
      }
    }

    return { status: 'CANONICAL', normalizedPayload: payload };
  }
}
