import { ConstitutionalRestriction } from './constitutional-dashboard-types';

export class ConstitutionalRestrictionDisclosureEngine {
  public static extractRestrictions(runtimeOutput: any): ConstitutionalRestriction[] {
    const restrictions: ConstitutionalRestriction[] = [];
    const canonicalRestr = runtimeOutput?.canonicalState?.restrictions || [];

    canonicalRestr.forEach((r: any) => {
      restrictions.push({
        type: 'Governance Restriction',
        level: r.type === 'BLOCKED_BY_GOVERNANCE' ? 'BLOCKED' : 'CRITICAL',
        description: r.reason || 'Restrição fiduciária ativa.',
        origin: r.source || 'Runtime Enforcement'
      });
    });

    if (runtimeOutput?.status === 'CONSTITUTIONAL_QUARANTINE') {
      restrictions.push({
        type: 'Constitutional Restriction',
        level: 'BLOCKED',
        description: runtimeOutput.constitutionalSection?.quarantineReason || 'Quarentena Constitucional Ativa',
        origin: 'Constitutional Guard'
      });
    }

    return restrictions;
  }
}
