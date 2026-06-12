import React, { useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { DREExecutiveAdvisorySectionViewModel } from './view-models';
import { ExecutiveStrategicSemanticCards } from '../../ui/executive-strategic-semantic-cards';
import { ExecutiveDecisionSynthesisEngine } from '../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveAnalysisContext } from '../../../services/FiduciaryRuntimeAdapter';

interface Props {
  viewModel?: DREExecutiveAdvisorySectionViewModel;
  context?: ExecutiveAnalysisContext;
  selectedYear: number;
}

export function DREExecutiveAdvisorySection({ viewModel, context, selectedYear }: Props) {
  const { t } = useLanguage();

  const payload = useMemo(() => {
    if (context) {
      const isolatedContext: ExecutiveAnalysisContext = {
        ...context,
        analysisYear: selectedYear,
        generatedAt: new Date().toISOString()
      };
      return ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(isolatedContext);
    }
    return null;
  }, [context, selectedYear]);

  if (!payload && !viewModel) return null;

  if (payload) {
    return (
      <div className="mb-10 mt-10">
        <ExecutiveStrategicSemanticCards payload={payload} selectedYear={selectedYear} />
      </div>
    );
  }

  // Fallback para legado
  return (
    <div className="mb-10 mt-10">
      <div className="p-6 bg-surface-high border border-border rounded-lg shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4">{t('dre.advisory.title')}</h3>
        <p className="text-sm text-muted-foreground">{viewModel?.simpleAdvisoryText}</p>
      </div>
    </div>
  );
}
