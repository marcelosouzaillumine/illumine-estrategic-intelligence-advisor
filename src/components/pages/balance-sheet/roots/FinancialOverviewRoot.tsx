import React from 'react';
import { ExecutiveDiagnosticSummarySection } from '../../../ui/executive-diagnostic-summary-section';

export const FinancialOverviewRoot = ({ context }: any) => {
  const { pureViewModel } = context.intelligence.financialPosition;
  return (
    <ExecutiveDiagnosticSummarySection 
      className="mb-8"
      status={{ label: 'Balanço Patrimonial', variant: pureViewModel?.overview?.healthStatus === 'HEALTHY' ? 'success' : 'neutral' }}
      question="O que a estrutura patrimonial indica sobre a situação atual da organização?"
      observation={pureViewModel?.overview?.observation || "Estrutura patrimonial apresentada para interpretação fiduciária."}
      evidence={pureViewModel?.overview?.evidence || ""}
      financialMeaning={pureViewModel?.overview?.financialMeaning || ""}
    />
  );
};
