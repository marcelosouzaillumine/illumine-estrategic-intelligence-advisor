import { InstitutionalCausalityProfile } from './types';

export class ExecutivePriorityCascadeResolver {
  public static resolve(
    advisory: { executiveSummary: string; actionMatrix: string[]; priorityFocus: string },
    profile: InstitutionalCausalityProfile
  ): { executiveSummary: string; actionMatrix: string[]; priorityFocus: string } {
    if (profile.historicalDensityRequirement === 'INSUFFICIENT' || profile.confidenceProfile.globalConfidence === 0) {
      return advisory;
    }

    const hasCriticalStrain = profile.propagationVectors.some(v => v.severity === 'HIGH' || v.severity === 'CRITICAL');

    if (!hasCriticalStrain) {
      return advisory;
    }

    const priorityItems: string[] = [
      'Preservação e reforço imediato de liquidez estrutural.',
      'Reforço patrimonial por meio de capitalização proporcional.',
      'Mitigação e redução da dependência de fornecedores operacionais.',
      'Otimização do ciclo financeiro e eficiência de capital de giro.'
    ];

    const currentMatrix = [...advisory.actionMatrix];
    const filteredMatrix = currentMatrix.filter(item => {
      const lower = item.toLowerCase();
      return !lower.includes('distribui') && !lower.includes('dividendo') && !lower.includes('expansão') && !lower.includes('investir em crescimento');
    });

    const resolvedMatrix = Array.from(new Set([...priorityItems, ...filteredMatrix]));

    return {
      executiveSummary: advisory.executiveSummary,
      actionMatrix: resolvedMatrix,
      priorityFocus: 'Liquidez estrutural, capitalização e autonomia fiduciária.'
    };
  }
}
