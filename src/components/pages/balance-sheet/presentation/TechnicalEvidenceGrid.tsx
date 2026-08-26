import React from 'react';
import { BalanceSheetTechnicalLayerSection } from '../BalanceSheetTechnicalLayerSection';
import { BalanceSheetStructuralTablesSection } from '../legacy/BalanceSheetStructuralTablesSection';

export const TechnicalEvidenceGrid = ({ viewModel }: { viewModel: any }) => {
  if (!viewModel) return null;

  return (
    <div className="space-y-12 mt-6">
      <BalanceSheetStructuralTablesSection viewModel={viewModel.structuralTables} />
      <BalanceSheetTechnicalLayerSection viewModel={viewModel} />
    </div>
  );
};
