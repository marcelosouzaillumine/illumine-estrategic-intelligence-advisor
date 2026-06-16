import React, { useMemo } from 'react';
import { ExecutiveStrategicSemanticCards } from '../../ui/executive-strategic-semantic-cards';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
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
        <ExecutiveHeading as="h3" variant="moduleTitle" className="mb-4">Síntese Executiva</ExecutiveHeading>
        <ExecutiveText as="div" variant="moduleSubtitle">{executiveNarrative || 'Nenhuma narrativa disponível para este exercício.'}</ExecutiveText>
      </div>
    </div>
  );
};
