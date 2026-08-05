import { BalanceSheetExecutiveViewModel } from '../../../types/executive/BalanceSheetExecutiveViewModel';

export class BalanceSheetCompletenessGuard {
  public static enforce(
    viewModel: BalanceSheetExecutiveViewModel,
    facts?: any,
    mode: 'strict' | 'safe' | 'unsafe' = 'strict'
  ): BalanceSheetExecutiveViewModel {
    if (mode === 'unsafe') return viewModel;
    const requiredPanels = [
      'protection',
      'liquidity',
      'capitalStructure',
      'workingCapital',
      'assetQuality',
      'capitalEfficiency',
    ] as const;

    requiredPanels.forEach(panelKey => {
      const panel = viewModel.analysisPanels[panelKey as keyof typeof viewModel.analysisPanels];
      const isMissingOrEmpty = !panel || !panel.statusLabel || !panel.opinion || panel.statusLabel.includes('Dados Insuficientes') || panel.statusLabel.includes('Neutro');
      
      if (isMissingOrEmpty) {
        console.log(facts);
        const debugFactsStr = facts ? JSON.stringify(facts) : 'No facts passed to Guard';
        console.error('DEBUG_GUARD_EXEC_REPORT:', JSON.stringify(viewModel, null, 2));
        throw new Error(`[BP Constitutional Violation] Required decision panel '${panelKey}' is missing or empty. Debug Facts: ${debugFactsStr}`);
      }
    });

    return viewModel;
  }
}
