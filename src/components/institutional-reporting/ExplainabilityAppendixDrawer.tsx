// src/components/institutional-reporting/ExplainabilityAppendixDrawer.tsx

import React from 'react';
import { Microscope, Activity } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ExplainabilityAppendix } from '../../services/FiduciaryRuntimeAdapter';

export function ExplainabilityAppendixDrawer({ data }: { data: ExplainabilityAppendix }) {
  const { translateLabel: t } = useLanguage();
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Microscope size={14} /> Fiduciary Explainability Appendix
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-4">{t("panels.rationale_decomposition")}</span>
          <div className="space-y-4">
            {Object.entries(data.rationaleMap).map(([key, rationale]) => (
              <div key={key} className="bg-zinc-900/40 border border-zinc-800/80 p-3 rounded">
                <span className="text-[8px] text-blue-400 font-bold tracking-widest uppercase block mb-1">{key.replace(/_/g, ' ')}</span>
                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">{rationale}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-4">{t("panels.confidence_decomposition")}</span>
          <div className="space-y-3">
            {Object.entries(data.confidenceDecomposition).map(([key, confidence]) => (
              <div key={key} className="bg-zinc-900/40 border border-zinc-800/80 p-3 rounded flex items-center justify-between">
                <span className="text-[8px] text-emerald-400 font-bold tracking-widest uppercase">{key.replace(/_/g, ' ')}</span>
                <div className="flex items-center gap-2">
                  <Activity size={10} className="text-emerald-500" />
                  <span className="text-[10px] text-zinc-300 font-bold tracking-widest uppercase">{confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
