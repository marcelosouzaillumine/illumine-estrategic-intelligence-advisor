import React from 'react';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { FinancialIndicator } from '../../../core/experience/contracts/FinancialPositionPureViewModel';
import { ExecutiveEvidenceGrid } from '../../ui/executive-evidence-grid';
import { ExecutiveSurface } from '../../ui/executive-surface';

export type BalanceSheetCapitalStructureSectionProps = {
  indicators: FinancialIndicator[];
};

export const BalanceSheetCapitalStructureSection = ({ indicators }: BalanceSheetCapitalStructureSectionProps) => {
  if (!indicators || indicators.length === 0) return null;

  const mappedMetrics = indicators.map(i => ({
    label: i.name,
    value: String(i.value),
    status: i.classification === 'CRITICAL' ? 'critical' : (i.classification === 'WARNING' ? 'warning' : 'success'),
    trend: 'neutral',
    insight: i.financialMeaning
  }));

  return (
    <div className="mb-10 animate-executive-fade relative">
      <ExecutiveSurface variant="default" elevation="sm" className="p-6 md:p-8 mb-6 rounded-[24px]">
        <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">Inteligência de Estrutura de Capital</ExecutiveHeading>
        <ExecutiveEvidenceGrid metrics={mappedMetrics as any} />
      </ExecutiveSurface>
    </div>
  );
};
