import React from 'react';
import { ExecutiveEmptyState } from '../../../ui/executive-empty-state';

export const FinancialSignalsRoot = ({ context }: any) => {
  return (
    <ExecutiveEmptyState 
      title="Intelligence Signals"
      description="Sinais vitais e anomalias estatísticas serão compilados aqui."
    />
  );
};
