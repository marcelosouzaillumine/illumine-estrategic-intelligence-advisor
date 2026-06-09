import { BalanceSheetGovernanceOutput } from './BalanceSheetGovernanceOutput';

export class BalanceSheetPresentationLeakAudit {
  static audit(output: any): { hasLeak: boolean; leaks: string[] } {
    const leaks: string[] = [];

    if (output.blockingState?.isBlocked) {
      if (output.executiveNarrative) leaks.push('executiveNarrative');
      if (output.boardNarrative) leaks.push('boardNarrative');
      if (output.patrimonialThesis) leaks.push('patrimonialThesis');
      if (output.executivePlan) leaks.push('executivePlan');
      if (output.recommendations && output.recommendations.length > 0) leaks.push('recommendations');
    }

    return {
      hasLeak: leaks.length > 0,
      leaks
    };
  }
}
