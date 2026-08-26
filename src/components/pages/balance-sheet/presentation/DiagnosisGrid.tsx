import React from 'react';
import { BalanceSheetLiquiditySection } from '../BalanceSheetLiquiditySection';
import { BalanceSheetCapitalStructureSection } from '../BalanceSheetCapitalStructureSection';
import { BalanceSheetWorkingCapitalSection } from '../BalanceSheetWorkingCapitalSection';
import { BalanceSheetAssetQualitySection } from '../BalanceSheetAssetQualitySection';

export const DiagnosisGrid = ({ viewModel }: { viewModel: any }) => {
  if (!viewModel) return null;

  return (
    <div className="space-y-8">
      <BalanceSheetLiquiditySection indicators={viewModel.liquidity || []} />
      <BalanceSheetCapitalStructureSection indicators={viewModel.capitalStructure || []} />
      <BalanceSheetWorkingCapitalSection indicators={viewModel.workingCapital || []} />
      <BalanceSheetAssetQualitySection indicators={viewModel.assetQuality || []} />
    </div>
  );
};
