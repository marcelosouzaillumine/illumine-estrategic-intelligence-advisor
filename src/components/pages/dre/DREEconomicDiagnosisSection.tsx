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
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <div className="w-10 h-10 rounded-xl bg-surface-container/30 border border-border flex items-center justify-center text-muted-foreground">
          <Activity size={20} />
        </div>
        <div>
          <h4 className="text-xl font-black text-primary">{t('dre.diagnosis.title')}</h4>
          <p className="text-secondary">{t('dre.diagnosis.subtitle')}</p>
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
            value={<span className="text-[16px] leading-snug text-rose-700">{viewModel.primaryConstraint}</span>}
            tone="critical"
          />
          <ExecutiveMetricCard
            label={t('dre.diagnosis.recoverability')}
            value={<span className="text-[16px] leading-snug text-amber-700">{viewModel.recoverabilityAssessment}</span>}
            tone="warning"
          />
          <ExecutiveMetricCard
            label={t('dre.diagnosis.strategic_priority')}
            value={<span className="text-[16px] leading-snug text-emerald-700">{viewModel.strategicPriority}</span>}
            tone="success"
          />
        </div>
        
        {/* Featured Outlook Panel */}
        <ExecutiveSurface variant="info" padding="lg" radius="lg" className="w-full 2xl:w-[420px] flex flex-col justify-center">
          <ExecutiveNarrative variant="insight" title={t('dre.diagnosis.outlook_directional')}>
            <span className="font-semibold">{viewModel.boardOutlook}</span>
          </ExecutiveNarrative>
        </ExecutiveSurface>
      </div>
    </ExecutiveSurface>
  );
}
