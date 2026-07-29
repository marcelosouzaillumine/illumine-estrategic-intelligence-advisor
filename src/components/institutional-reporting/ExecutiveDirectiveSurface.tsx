import React from 'react';
import { Megaphone, BookOpen } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ExecutiveDirectiveSection } from '../../services/FiduciaryRuntimeAdapter';
// src/components/institutional-reporting/ExecutiveDirectiveSurface.tsx


export function ExecutiveDirectiveSurface({ data }: { data: ExecutiveDirectiveSection }) {
  const { translateLabel: t } = useLanguage();
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Megaphone size={14} /> Active Executive Directives
      </h2>
      
      {data.activeDirectives.length === 0 ? (
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">NO ACTIVE DIRECTIVES</span>
      ) : (
        <div className="space-y-4">
          {data.activeDirectives.map((d, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800/80 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-blue-400 font-bold tracking-widest uppercase">{d.category}</span>
                <span className="text-[8px] text-zinc-500 font-bold tracking-widest uppercase">{d.severity}</span>
              </div>
              <p className="text-xs text-zinc-300 font-semibold">{d.statement}</p>
              {data.boardResolutions.includes(d.statement) && ( // simple mock check for board resolutions append
                <div className="mt-3 pt-3 border-t border-zinc-800/50 flex items-center gap-2">
                  <BookOpen size={10} className="text-emerald-500" />
                  <span className="text-[8px] text-emerald-400 uppercase tracking-widest font-bold">{t("panels.formalized_board_resolution")}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
