import React from 'react';
import { BalanceSheetExecutiveQuestionsSection } from '../BalanceSheetExecutiveQuestionsSection';

export const ExecutiveQuestionsRoot = ({ context }: any) => {
  const { pureViewModel } = context.intelligence.financialPosition;
  return (
    <BalanceSheetExecutiveQuestionsSection 
      triggers={pureViewModel?.executiveQuestions || []}
    />
  );
};
