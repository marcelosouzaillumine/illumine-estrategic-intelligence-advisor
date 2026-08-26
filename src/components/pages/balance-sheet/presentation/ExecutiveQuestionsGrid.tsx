import React from 'react';
import { BalanceSheetExecutiveQuestionsSection } from '../BalanceSheetExecutiveQuestionsSection';

export const ExecutiveQuestionsGrid = ({ triggers }: { triggers: any[] }) => {
  if (!triggers || triggers.length === 0) return null;

  return (
    <BalanceSheetExecutiveQuestionsSection triggers={triggers} />
  );
};
