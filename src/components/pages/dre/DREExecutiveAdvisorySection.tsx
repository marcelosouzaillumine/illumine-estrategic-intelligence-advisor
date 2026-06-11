import React, { useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { DREExecutiveAdvisorySectionViewModel } from './view-models';
import { ExecutiveDecisionSummaryCard } from '../../ui/executive-decision-summary-card';
import { ExecutiveDecisionSynthesisEngine } from '../../../core/runtime/executive-consolidation/ExecutiveDecisionSynthesisEngine';
import { ExecutiveAnalysisContext } from '../../../core/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';

interface Props {
  viewModel?: DREExecutiveAdvisorySectionViewModel;
  context?: ExecutiveAnalysisContext;
}

export function DREExecutiveAdvisorySection({ viewModel, context }: Props) {
  const { t } = useLanguage();

  const payload = useMemo(() => {
    if (context) {
      return ExecutiveDecisionSynthesisEngine.generatePayload(context);
    }
    return null;
  }, [context]);

  if (!payload && !viewModel) return null;

  if (payload) {
    return (
      <div className="mb-10 mt-10">
        <ExecutiveDecisionSummaryCard payload={payload} moduleName="Demonstração do Resultado" />
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
