import React from 'react';
import { Target, Flag, Layers } from 'lucide-react';
import { StrategicOrchestration, ExecutiveCommandThesis } from '../../core/runtime/executive-command/executive-command-types';
import { useLanguage } from '../../contexts/LanguageContext';

interface InstitutionalPrioritySurfaceProps {
  orchestration: StrategicOrchestration;
  thesis: ExecutiveCommandThesis;
}

export function InstitutionalPrioritySurface({ orchestration, thesis }: InstitutionalPrioritySurfaceProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
        <Target size={14} />
        {t('priority.title')}
      </h3>

      <div className="mb-6 pb-6 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{t('priority.primary_focus')}</span>
          <span className="text-[9px] px-2 py-0.5 rounded border bg-zinc-900 border-zinc-700 text-zinc-300 font-bold uppercase tracking-widest">
            {orchestration.primaryFocus.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed font-bold">
          {orchestration.orchestrationNarrative}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2 mb-3">
            <Layers size={12} /> {t('priority.structural_posture')}
          </span>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {thesis.thesisStatement}
          </p>
          <div className="mt-2 text-[9px] uppercase tracking-widest text-zinc-600 font-bold">
            {t('priority.defined_posture')} <span className="text-zinc-300">{thesis.structuralPosture}</span>
          </div>
        </div>

        {orchestration.immediateActionsRetained.length > 0 && (
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2 mb-3">
              <Flag size={12} /> {t('priority.immediate_actions')}
            </span>
            <ul className="space-y-2">
              {orchestration.immediateActionsRetained.map((action, idx) => (
                <li key={idx} className="text-[10px] text-zinc-400 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5">›</span> {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}
