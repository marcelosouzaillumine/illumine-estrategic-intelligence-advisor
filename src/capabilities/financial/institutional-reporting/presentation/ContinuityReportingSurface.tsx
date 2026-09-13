import React from 'react';
import { HeartPulse, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { ContinuitySection } from '../../../../services/FiduciaryRuntimeAdapter';
// src/components/institutional-reporting/ContinuityReportingSurface.tsx


export function ContinuityReportingSurface({ data }: { data: ContinuitySection }) {
  const { translateLabel: t } = useLanguage();
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <HeartPulse size={14} /> Continuity & Survival Report
      </h2>
      
      <div className="flex items-center gap-8 mb-6">
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.resilience_status")}</span>
          <span className="text-lg text-emerald-400 font-bold uppercase tracking-widest block">
            {data.resilienceStatus}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.antifragility_score")}</span>
          <span className="text-lg text-blue-400 font-bold uppercase tracking-widest block">
            {data.antifragilityScore.toFixed(0)}
          </span>
        </div>
      </div>

      {data.survivalOverlays.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded">
          <h3 className="text-[9px] text-rose-500 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
            <ShieldAlert size={12} /> Survival Overlays & Restrictions Active
          </h3>
          <ul className="space-y-1">
            {data.survivalOverlays.map((overlay, i) => (
              <li key={i} className="text-[10px] text-rose-300/80 font-bold tracking-widest uppercase">
                • {overlay.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
