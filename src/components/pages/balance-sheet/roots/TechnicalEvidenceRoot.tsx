import React from 'react';
import { ExecutiveAccordion } from '../../../ui/executive-accordion';
import { BalanceSheetTechnicalLayerSection } from '../BalanceSheetTechnicalLayerSection';

export const TechnicalEvidenceRoot = ({ context }: any) => {
  const { pureViewModel } = context.intelligence.financialPosition;
  return (
    <ExecutiveAccordion
      variant="analytics"
      defaultExpanded={false}
      title="Memória Analítica e Evidências Técnicas (Contabilidade Bruta)"
      subtitle="Análises horizontais, verticais, tabelas estruturais e visualizações técnicas."
    >
      <div className="space-y-12 mt-6">
        <BalanceSheetTechnicalLayerSection viewModel={pureViewModel?.technicalEvidence || []} />
      </div>
    </ExecutiveAccordion>
  );
};
