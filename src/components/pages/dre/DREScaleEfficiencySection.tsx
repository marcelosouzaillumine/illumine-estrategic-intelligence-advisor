import React from 'react';
import { cn } from '../../../lib/utils';
import { useLanguage } from '../../../contexts/LanguageContext';
import { 
  DREScaleEfficiencyViewModel, 
  DREEarningsQualityAssessmentViewModel 
} from './view-models';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveDecisionSummary } from '../../ui/executive-decision-summary';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';

interface Props {
  scaleVM?: DREScaleEfficiencyViewModel;
  qualityVM?: DREEarningsQualityAssessmentViewModel;
}

export function DREScaleEfficiencySection({ scaleVM, qualityVM }: Props) {
  const { t } = useLanguage();

  if (!scaleVM && !qualityVM) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
      {scaleVM && (
        <ExecutiveSurface padding="lg" radius="lg" className="flex flex-col h-full justify-between gap-8">
          <ExecutiveDecisionSummary
            label={t('dre.scale.subtitle')}
            theme={scaleVM.classificationLabel}
            severityLabel="Escala"
            severityTone={
              scaleVM.toneClass?.includes('emerald') ? 'success' : 
              scaleVM.toneClass?.includes('rose') ? 'critical' : 'neutral'
            }
            reasonLabel="Análise"
            reason={scaleVM.description}
          />
          
          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 mt-auto">
            <ExecutiveMetricCard
              label="Crescimento de Receita"
              value={
                <span className={cn("font-semibold", scaleVM.recGrowthTone === 'success' ? "text-emerald-600" : "text-rose-600")}>
                  {scaleVM.recGrowthFormatted}
                </span>
              }
            />
            <ExecutiveMetricCard
              label="Crescimento de EBITDA"
              value={
                <span className={cn("font-semibold", scaleVM.ebitdaGrowthTone === 'success' ? "text-emerald-600" : "text-rose-600")}>
                  {scaleVM.ebitdaGrowthFormatted}
                </span>
              }
            />
          </div>
        </ExecutiveSurface>
      )}

      {qualityVM && (
        <ExecutiveSurface padding="lg" radius="lg" className="flex flex-col h-full justify-between gap-8">
          <ExecutiveDecisionSummary
            label="Qualidade Contábil do Resultado"
            theme={qualityVM.classificationTitle}
            severityLabel="Qualidade"
            severityTone={qualityVM.classificationTone}
            reasonLabel="Análise"
            reason={qualityVM.rationale}
          />
          
          {qualityVM.classificationTone !== 'neutral' && (
            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border/40">
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500/80 transition-all" style={{ width: `${qualityVM.recurringRevenueWeight}%` }} />
                <div className="h-full bg-rose-500/80 transition-all" style={{ width: `${qualityVM.nonRecurringWeight}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-semibold tracking-wide uppercase text-foreground/60">
                <span>Operacional: {qualityVM.recurringRevenueWeight.toFixed(0)}%</span>
                <span>Extraordinário: {qualityVM.nonRecurringWeight.toFixed(0)}%</span>
              </div>
            </div>
          )}
        </ExecutiveSurface>
      )}
    </div>
  );
}
