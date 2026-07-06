export class DLPACanonicalBindingAudit {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static validate(params: {
    engineOutput: any;
    adapterOutput: any;
    uiOutput?: any;
  }): {
    bindingStatus: 'CONSISTENT' | 'STALE_PAYLOAD' | 'LEGACY_FALLBACK' | 'UI_OVERRIDE';
    details: string[];
  } {
    const details: string[] = [];
    const { engineOutput, adapterOutput, uiOutput } = params;

    if (!engineOutput || !adapterOutput) {
      details.push('Engine output or adapter output is missing.');
      return { bindingStatus: 'STALE_PAYLOAD', details };
    }

    // 1. Verify Recovery Horizon
    const engHorizon = engineOutput.patrimonialRecoveryHorizon?.classification;
    const adHorizon = adapterOutput.executiveLayer?.patrimonialRecoveryHorizon?.classification;
    if (engHorizon !== adHorizon) {
      details.push(`Horizon mismatch: Engine (${engHorizon}) vs Adapter (${adHorizon})`);
    }

    // 2. Verify Recoverability
    const engRec = engineOutput.capitalRecoverability?.classification;
    const adRec = adapterOutput.executiveLayer?.capitalRecoverability?.classification;
    if (engRec !== adRec) {
      details.push(`Recoverability mismatch: Engine (${engRec}) vs Adapter (${adRec})`);
    }

    // 3. Verify CPS
    const engCps = engineOutput.capitalPreservationScore?.value ?? engineOutput.capitalPreservationScore?.score;
    const adCps = adapterOutput.executiveLayer?.capitalPreservationScore?.value ?? adapterOutput.executiveLayer?.capitalPreservationScore?.score;
    if (engCps !== adCps) {
      details.push(`CPS mismatch: Engine (${engCps}) vs Adapter (${adCps})`);
    }

    // 4. Verify Capital Status / Radar Status
    const engStatus = engineOutput.capitalPreservationStatus?.classification;
    const adStatus = adapterOutput.resolvedCapitalStatus;
    // Note: status might be resolved/overridden by DLPAGovernanceRadarEngine, but should still match taxonomia rules
    if (adStatus === 'Base de Capital em Expansão' && adapterOutput.executiveLayer?.capitalPreservationStatus?.value < 0.75) {
      details.push(`Capital status is legacy or healthy but preservation is under 75%: ${adStatus}`);
    }

    // Check if UI output overrides anything
    if (uiOutput) {
      if (uiOutput.cpsScore !== adCps) {
        return { bindingStatus: 'UI_OVERRIDE', details: [...details, 'UI overrode the CPS score.'] };
      }
      if (uiOutput.horizon !== adHorizon) {
        return { bindingStatus: 'UI_OVERRIDE', details: [...details, 'UI overrode the recovery horizon.'] };
      }
    }

    if (details.length > 0) {
      // If we detect stale references or mismatch, flag accordingly
      const isLegacy = details.some(d => d.toLowerCase().includes('legacy'));
      return {
        bindingStatus: isLegacy ? 'LEGACY_FALLBACK' : 'STALE_PAYLOAD',
        details
      };
    }

    return {
      bindingStatus: 'CONSISTENT',
      details: ['Payload is canonical, consistent, and cleanly bound to presentation layer.']
    };
  }
}
