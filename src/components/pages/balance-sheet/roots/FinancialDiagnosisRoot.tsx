import React from 'react';
import { DiagnosisGrid } from '../presentation/DiagnosisGrid';

export const FinancialDiagnosisRoot = ({ context }: any) => {
  const { pureViewModel } = context.intelligence.financialPosition;
  return (
    <DiagnosisGrid viewModel={pureViewModel?.diagnosis} />
  );
};
