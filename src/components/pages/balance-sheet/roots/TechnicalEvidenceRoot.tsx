import React from 'react';
import { ExecutiveAccordion } from '../../../ui/executive-accordion';
import { TechnicalEvidenceGrid } from '../presentation/TechnicalEvidenceGrid';
import { ExecutiveAnalyticalMissing } from '../../../ui/executive-analytical-missing';

export const TechnicalEvidenceRoot = ({ context }: any) => {
  const { pureViewModel } = context.intelligence.financialPosition;
  const evidence = pureViewModel?.technicalEvidence;
  if (!evidence || !evidence.available) {
    const fallbackReason = evidence?.availabilityReason || {
      type: "INCOMPLETE_DATA_SOURCE",
      title: "Technical Evidence Unavailable",
      explanation: "Insufficient metrics to construct the structural analytical tables.",
      impact: "Low-level structural inspection cannot be rendered."
    };
    return <ExecutiveAnalyticalMissing reason={fallbackReason} className="my-8" />;
  }

  return (
    <ExecutiveAccordion
      variant="analytics"
      defaultExpanded={false}
      title="Memória Analítica e Evidências Técnicas (Contabilidade Bruta)"
      subtitle="Análises horizontais, verticais, tabelas estruturais e visualizações técnicas."
    >
      <TechnicalEvidenceGrid viewModel={evidence} />
    </ExecutiveAccordion>
  );
};
