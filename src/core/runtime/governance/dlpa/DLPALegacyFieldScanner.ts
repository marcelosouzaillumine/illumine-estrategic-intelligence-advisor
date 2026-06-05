export class DLPALegacyFieldScanner {
  public static scan(payload: any): 'CANONICAL' | 'LEGACY_PAYLOAD_DETECTED' {
    if (!payload) return 'CANONICAL';

    // 1. Scan for legacy property keys in root or nested executive layer
    const legacyKeys = [
      'legacyRecoveryYears',
      'legacyRecoveryClassification',
      'legacyHorizonScore',
      'legacyCpsScore'
    ];

    for (const key of legacyKeys) {
      if (key in payload || (payload.executiveLayer && key in payload.executiveLayer)) {
        return 'LEGACY_PAYLOAD_DETECTED';
      }
    }

    // 2. Scan for specific legacy value configurations under unavailable/Non Estimable horizons
    const horizon = payload.executiveLayer?.patrimonialRecoveryHorizon || payload.patrimonialRecoveryHorizon;
    const rec = payload.executiveLayer?.capitalRecoverability || payload.capitalRecoverability;

    if (horizon) {
      const isUnavailable = horizon.available === false || horizon.classification === 'Não Estimável';
      if (isUnavailable) {
        if (horizon.years === 0 || horizon.value === 0) {
          return 'LEGACY_PAYLOAD_DETECTED';
        }
        if (horizon.formatted === '0,0 anos') {
          return 'LEGACY_PAYLOAD_DETECTED';
        }
        if (rec && (rec.classification === 'Alta' || rec.classification === 'Alta Recuperabilidade')) {
          return 'LEGACY_PAYLOAD_DETECTED';
        }
      }
    }

    return 'CANONICAL';
  }
}
