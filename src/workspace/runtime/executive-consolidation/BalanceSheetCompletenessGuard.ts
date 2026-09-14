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
      
      if (!panel || !panel.observation || !panel.evidence) {
        throw new Error(`[BP Constitutional Violation] Fiduciary panel missing required diagnostic fields for dimension: ${panelKey}`);
      }
    });

    return viewModel;
  }
}
