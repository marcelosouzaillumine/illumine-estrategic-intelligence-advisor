import React, { useMemo } from 'react';
import { ExecutiveDecisionSummaryCard } from '../../ui/executive-decision-summary-card';
import { ExecutiveDecisionSynthesisEngine } from '../../../core/runtime/executive-consolidation/ExecutiveDecisionSynthesisEngine';
import { ExecutiveAnalysisContext } from '../../../core/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';

export type BalanceSheetExecutiveSynthesisSectionProps = {
  executiveNarrative?: string;
  context?: ExecutiveAnalysisContext;
};

export const BalanceSheetExecutiveSynthesisSection = ({
  executiveNarrative,
  context
}: BalanceSheetExecutiveSynthesisSectionProps) => {
  const payload = useMemo(() => {
    if (context) {
      return ExecutiveDecisionSynthesisEngine.generatePayload(context);
    }
    return null;
  }, [context]);

  if (!payload && !executiveNarrative) return null;

  if (payload) {
    return (
      <div className="w-full mt-12 mb-12">
        <ExecutiveDecisionSummaryCard payload={payload} moduleName="Balanço Patrimonial" />
      </div>
    );
  }

  // Fallback for legacy text
  return (
    <div className="w-full mt-12 mb-12">
      <div className="p-6 bg-surface-high border border-border rounded-lg shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4">Síntese Executiva</h3>
        <p className="text-sm text-muted-foreground">{executiveNarrative}</p>
      </div>
    </div>
  );
};
