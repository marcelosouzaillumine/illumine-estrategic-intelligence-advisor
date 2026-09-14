export class DLPALegacyPayloadAudit {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static audit(payload: any): { valid: boolean; error?: string } {
    if (!payload) return { valid: true };

    const horizon = payload.executiveLayer?.patrimonialRecoveryHorizon || payload.patrimonialRecoveryHorizon;
    const rec = payload.executiveLayer?.capitalRecoverability || payload.capitalRecoverability;

    if (horizon && horizon.available === false) {
      if (horizon.years === 0 || horizon.value === 0) {
        return { valid: false, error: 'Legacy payload violation: years/value is 0 but recovery horizon is not available.' };
      }
      if (horizon.formatted === '0,0 anos') {
        return { valid: false, error: 'Legacy payload violation: formatted is "0,0 anos" but recovery horizon is not available.' };
      }
      if (rec && rec.classification === 'Alta') {
        return { valid: false, error: 'Legacy payload violation: recoverability is "Alta" but recovery horizon is not available.' };
      }
    }

    return { valid: true };
  }
}
