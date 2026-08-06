// @ts-nocheck
import React from 'react';
import { ExecutiveEvidenceGrid } from '../../ui/executive-evidence-grid';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveDiagnosticPanel } from '../../ui/executive-diagnostic-panel';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { FinancialIndicator } from '../../../core/experience/contracts/FinancialPositionPureViewModel';

export type BalanceSheetLiquiditySectionProps = {
  indicators: FinancialIndicator[];
};

export const BalanceSheetLiquiditySection = ({ indicators }: BalanceSheetLiquiditySectionProps) => {
  if (!indicators || indicators.length === 0) {
    return null;
  }

  // Map pure financial indicators to the evidence grid format
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
        <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">Inteligência de Liquidez</ExecutiveHeading>
        <ExecutiveEvidenceGrid metrics={mappedMetrics as any} />
      </ExecutiveSurface>
    </div>
  );
};
