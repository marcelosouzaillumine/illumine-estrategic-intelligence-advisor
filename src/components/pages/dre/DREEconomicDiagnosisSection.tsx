import React from 'react';
import { Activity } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { DREEconomicDiagnosisViewModel } from './view-models';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveNarrative } from '../../ui/executive-narrative';

interface Props {
  viewModel: DREEconomicDiagnosisViewModel;
}

export function DREEconomicDiagnosisSection({ viewModel }: Props) {
  const { t } = useLanguage();

  return (
    <ExecutiveSurface padding="xl" radius="xl" className="flex flex-col mb-10">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="text-secondary w-6 h-6" />
        <div>
          <h4 className="text-lg font-bold text-primary">{t('dre.diagnosis.title')}</h4>
          <p className="text-sm text-secondary">{t('dre.diagnosis.subtitle')}</p>
        </div>
      </div>

      <div className="flex flex-col 2xl:flex-row gap-6 items-stretch">
        {/* Core Metrics Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExecutiveMetricCard
            label={t('dre.diagnosis.value_creation')}
            value={<span className="text-[16px] leading-snug">{viewModel.valueCreationAssessment}</span>}
            tone="neutral"
          />
          <ExecutiveMetricCard
            label={t('dre.diagnosis.primary_constraint')}
            value={<span className="text-[16px] leading-snug">{viewModel.primaryConstraint}</span>}
            tone="critical"
          />
          <ExecutiveMetricCard
            label={t('dre.diagnosis.recoverability')}
            value={<span className="text-[16px] leading-snug">{viewModel.recoverabilityAssessment}</span>}
            tone="warning"
          />
          <ExecutiveMetricCard
            label={t('dre.diagnosis.strategic_priority')}
            value={<span className="text-[16px] leading-snug">{viewModel.strategicPriority}</span>}
            tone="success"
          />
        </div>
        
        {/* Featured Outlook Panel */}
        <ExecutiveSurface variant="info" padding="lg" radius="lg" className="w-full lg:w-1/3 flex flex-col justify-center">
          <ExecutiveNarrative variant="insight" title={t('dre.diagnosis.outlook_directional')}>
            <span className="font-semibold">{viewModel.boardOutlook}</span>
          </ExecutiveNarrative>
        </ExecutiveSurface>
      </div>
    </ExecutiveSurface>
  );
}
