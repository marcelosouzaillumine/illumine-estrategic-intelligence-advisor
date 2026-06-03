export interface PropagationPayload {
  netIncome: number | null;
  capitalSocial: number | null;
  capitalPreservation: number | null;
  capitalErosion: number | null;
  governanceScore: number | null;
  governanceStatus: string | null;
}

export interface PropagationViolation {
  rule: 'CAPITAL_DASHBOARD_PROPAGATION_FAILURE' | 'UI_RENDER_MISMATCH';
  severity: 'CRITICAL';
  message: string;
  blocked: boolean;
}

export class CapitalGovernancePropagationAudit {
  public static audit(runtime: PropagationPayload, rendered: any): PropagationViolation[] {
    const violations: PropagationViolation[] = [];
    if (!rendered || rendered.netIncome === undefined) {
      return violations;
    }

    const keys: (keyof PropagationPayload)[] = [
      'netIncome',
      'capitalSocial',
      'capitalPreservation',
      'capitalErosion',
      'governanceScore',
      'governanceStatus'
    ];

    keys.forEach(key => {
      const runVal = runtime[key];
      const rendVal = rendered[key];

      if (runVal !== null && runVal !== undefined && rendVal !== null && rendVal !== undefined && rendVal !== 'NOT_OBSERVABLE') {
        let isMismatch = false;
        if (typeof runVal === 'number' && typeof rendVal === 'number') {
          if (Math.abs(runVal - rendVal) > 0.05) {
            isMismatch = true;
          }
        } else if (String(runVal).trim() !== String(rendVal).trim()) {
          isMismatch = true;
        }

        if (isMismatch) {
          violations.push({
            rule: 'CAPITAL_DASHBOARD_PROPAGATION_FAILURE',
            severity: 'CRITICAL',
            message: `CAPITAL_DASHBOARD_PROPAGATION_FAILURE: Mismatch on '${key}'. Runtime: ${runVal}, Rendered: ${rendVal}`,
            blocked: true
          });
          violations.push({
            rule: 'UI_RENDER_MISMATCH',
            severity: 'CRITICAL',
            message: `UI_RENDER_MISMATCH: Mismatch on '${key}'. Runtime: ${runVal}, Rendered: ${rendVal}`,
            blocked: true
          });
        }
      }
    });

    return violations;
  }
}
