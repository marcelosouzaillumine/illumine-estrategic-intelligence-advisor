import React from 'react';
import { Network, ArrowRight } from 'lucide-react';
import { DependencyAnalysis } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { useLanguage } from '../../contexts/LanguageContext';
import { useExecutiveFormatter } from '../../core/localization';

export function IntercompanyDependencyMap({ dependencies }: { dependencies: DependencyAnalysis[] }) {
  const { t } = useLanguage();
  const formatter = useExecutiveFormatter();
  if (!dependencies || dependencies.length === 0) return null;

  return (
    <ExecutiveSurface className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <Network size={20} className="text-primary" />
        </div>
        <div>
          <ExecutiveHeading as="h3" variant="submoduleTitle" className="uppercase tracking-widest">
            Mapa de Dependência
          </ExecutiveHeading>
          <ExecutiveText variant="caption" className="text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
            Laços Estruturais Intercompany
          </ExecutiveText>
        </div>
      </div>
      
      <div className="space-y-4">
        {dependencies.map((dep, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-border bg-muted/20 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 shrink-0 whitespace-nowrap">
                <ExecutiveText variant="caption" className="font-bold uppercase text-primary whitespace-nowrap">
                  {t(`executive:dependency.${dep.dependencyType}`, dep.dependencyType)}
                </ExecutiveText>
              </span>

              {dep.materialityPercentage > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-card border border-border shrink-0">
                  <ExecutiveText variant="caption" className="font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    Materialidade: {formatter.percentage(dep.materialityPercentage / 100, { maximumFractionDigits: 0 })}
                  </ExecutiveText>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 rounded-xl bg-card border border-border/80 shadow-xs">
              <div className="px-3 py-1.5 rounded-lg bg-surface-container border border-border/60 flex items-center">
                <ExecutiveText variant="caption" className="font-bold text-slate-800 dark:text-slate-100">
                  {dep.sourceEntityId}
                </ExecutiveText>
              </div>

              <div className="flex items-center text-primary px-1 shrink-0">
                <ArrowRight size={16} strokeWidth={2.5} />
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-surface-container border border-border/60 flex items-center">
                <ExecutiveText variant="caption" className="font-bold text-slate-800 dark:text-slate-100">
                  {dep.targetEntityId}
                </ExecutiveText>
              </div>
            </div>

            <ExecutiveText variant="bodyStandard" className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {dep.description}
            </ExecutiveText>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
}

