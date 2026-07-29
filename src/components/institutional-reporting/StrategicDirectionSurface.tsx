import React from 'react';
import { Compass, Route, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { StrategicDirectionSection } from '../../services/FiduciaryRuntimeAdapter';
// src/components/institutional-reporting/StrategicDirectionSurface.tsx


export function StrategicDirectionSurface({ data }: { data: StrategicDirectionSection }) {
  const { translateLabel: t } = useLanguage();
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Compass size={14} /> Strategic Direction
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900/40 p-3 rounded border border-zinc-800/80">
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.strategic_posture")}</span>
          <span className="text-xs text-blue-400 font-bold uppercase tracking-widest block">{data.strategicPosture.replace(/_/g, ' ')}</span>
        </div>
        <div className="bg-zinc-900/40 p-3 rounded border border-zinc-800/80">
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.primary_vector")}</span>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest block">{data.primaryVector.replace(/_/g, ' ')}</span>
        </div>
        <div className="bg-zinc-900/40 p-3 rounded border border-zinc-800/80">
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.longitudinal_trajectory")}</span>
          <span className="text-xs text-zinc-300 font-bold uppercase tracking-widest block flex items-center gap-2">
            <Route size={12} className="text-zinc-500" />
            {data.trajectoryContinuity.replace(/_/g, ' ')}
          </span>
        </div>
        <div className={`p-3 rounded border ${data.expansionSustainability ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-orange-950/20 border-orange-900/50'}`}>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.expansion_sustainability")}</span>
          <span className={`text-xs font-bold uppercase tracking-widest block ${data.expansionSustainability ? 'text-emerald-400' : 'text-orange-400'}`}>
            {data.expansionSustainability ? 'SUSTAINABLE' : 'UNSUSTAINABLE/STRAINED'}
          </span>
        </div>
      </div>

      {data.strategicContradictions.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded">
          <h3 className="text-[9px] text-rose-500 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
            <AlertOctagon size={12} /> Strategic Contradictions
          </h3>
          <ul className="space-y-1">
            {data.strategicContradictions.map((c, i) => (
              <li key={i} className="text-[10px] text-rose-300/80 font-bold tracking-widest uppercase">
                • {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
