import React, { useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { DREExecutiveAdvisorySectionViewModel } from './view-models';
import { ExecutiveStrategicSemanticCards } from '../../ui/executive-strategic-semantic-cards';
import { ExecutiveStrategicDiagnosisPayload } from '../../../services/FiduciaryRuntimeAdapter';

interface Props {
  viewModel?: DREExecutiveAdvisorySectionViewModel;
  selectedYear: number;
}

export function DREExecutiveAdvisorySection({ viewModel, selectedYear }: Props) {
  const { t } = useLanguage();

  const payload = useMemo((): ExecutiveStrategicDiagnosisPayload | null => {
    if (viewModel) {
      return {
        analysisYear: selectedYear,
        generatedAt: new Date().toISOString(),
        currentSituation: viewModel.currentSituation,
        strategicPriority: viewModel.strategicPriority,
        outlook: viewModel.operationalOutlook,
        priorityRecommendation: viewModel.primaryRecommendation,
        severityState: viewModel.severityState,
        recommendationPriority: viewModel.recommendationPriority,
        primaryDriver: viewModel.primaryEconomicDriver,
        dominantStrength: viewModel.dominantStrength,
        secondaryAttention: viewModel.secondaryAttention
      };
    }
    return null;
  }, [viewModel, selectedYear]);

  if (!payload && !viewModel) return null;

  if (payload) {
    return (
      <div className="mb-10 mt-10">
        <ExecutiveStrategicSemanticCards payload={payload} selectedYear={selectedYear} />
      </div>
    );
  }

  return null;
}
