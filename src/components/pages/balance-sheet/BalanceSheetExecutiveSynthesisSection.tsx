import React, { useMemo } from 'react';
import { ExecutiveStrategicSemanticCards } from '../../ui/executive-strategic-semantic-cards';
import { ExecutiveDecisionSynthesisEngine } from '../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveAnalysisContext } from '../../../services/FiduciaryRuntimeAdapter';

export type BalanceSheetExecutiveSynthesisSectionProps = {
  executiveNarrative?: string;
  context?: ExecutiveAnalysisContext;
  selectedYear: number;
};

export const BalanceSheetExecutiveSynthesisSection = ({
  executiveNarrative,
  context,
  selectedYear
}: BalanceSheetExecutiveSynthesisSectionProps) => {
  const payload = useMemo(() => {
    if (context) {
      // Isolate context to the exact year
      const isolatedContext: ExecutiveAnalysisContext = {
        ...context,
        analysisYear: selectedYear,
        generatedAt: new Date().toISOString()
      };
      return ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(isolatedContext);
    }
    return null;
  }, [context, selectedYear]);

  if (!payload && !executiveNarrative) return null;

  if (payload) {
    return (
      <div className="w-full mt-12 mb-12">
        <ExecutiveStrategicSemanticCards payload={payload} selectedYear={selectedYear} />
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
