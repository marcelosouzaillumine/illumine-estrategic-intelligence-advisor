import React from 'react';
import { BalanceSheetLiquiditySection } from '../BalanceSheetLiquiditySection';
import { BalanceSheetCapitalStructureSection } from '../BalanceSheetCapitalStructureSection';
import { BalanceSheetWorkingCapitalSection } from '../BalanceSheetWorkingCapitalSection';
import { BalanceSheetAssetQualitySection } from '../BalanceSheetAssetQualitySection';

export const FinancialDiagnosisRoot = ({ context }: any) => {
  const { pureViewModel } = context.intelligence.financialPosition;
  return (
    <div className="space-y-8">
      <BalanceSheetLiquiditySection indicators={pureViewModel?.diagnosis?.liquidity || []} />
      <BalanceSheetCapitalStructureSection indicators={pureViewModel?.diagnosis?.capitalStructure || []} />
      <BalanceSheetWorkingCapitalSection indicators={pureViewModel?.diagnosis?.workingCapital || []} />
      <BalanceSheetAssetQualitySection indicators={pureViewModel?.diagnosis?.assetQuality || []} />
    </div>
  );
};
