import React from 'react';
import { Activity, ShieldAlert } from 'lucide-react';
import { SystemicRisk } from '../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../lib/utils';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { useLanguage } from '../../contexts/LanguageContext';

export function SystemicRisksPanel({ risks }: { risks: SystemicRisk[] }) {
  const { t } = useLanguage();
  if (!risks || risks.length === 0) {
    return (
      <ExecutiveSurface className="p-8">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <ExecutiveHeading as="h3" variant="submoduleTitle" className="uppercase tracking-widest">
            Risco Sistêmico
          </ExecutiveHeading>
        </div>
        <ExecutiveText variant="bodyStandard" className="text-slate-700 dark:text-slate-300 font-medium">
          Nenhum risco sistêmico de asfixia detectado na estrutura topológica atual.
        </ExecutiveText>
      </ExecutiveSurface>
    );
  }

  return (
    <ExecutiveSurface className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
        <ExecutiveHeading as="h3" variant="submoduleTitle" className="uppercase tracking-widest">
          Risco Sistêmico e Contágio
        </ExecutiveHeading>
      </div>
      <div className="space-y-4">
        {risks.map((risk, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 shrink-0 whitespace-nowrap">
                <ExecutiveText variant="caption" className="font-bold uppercase text-rose-700 dark:text-rose-300 whitespace-nowrap">
                  {t(`executive:systemicRisk.${risk.riskType}`, risk.riskType.replace(/_/g, ' '))}
                </ExecutiveText>
              </span>
              <ExecutiveText 
                variant="caption" 
                className={cn(
                  "font-bold uppercase shrink-0 whitespace-nowrap",
                  risk.severity === 'CRITICAL' || risk.severity === 'SEVERE' ? 'text-rose-700 dark:text-rose-300' : 'text-amber-700 dark:text-amber-400'
                )}
              >
                {t(`executive:severity.${risk.severity}`, risk.severity)}
              </ExecutiveText>
            </div>
            <ExecutiveText variant="bodyStandard" className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {risk.description}
            </ExecutiveText>
            {risk.potentialDominoEffect && (
              <div className="flex items-center gap-2 mt-2 pt-3 border-t border-rose-500/20">
                <ShieldAlert size={14} className="text-rose-600 dark:text-rose-400 shrink-0" />
                <ExecutiveText variant="caption" className="font-bold text-rose-700 dark:text-rose-300 uppercase tracking-widest">
                  ALERTA: Potencial Efeito Dominó (Gatilho: {risk.triggerEntityId})
                </ExecutiveText>
              </div>
            )}
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
}

