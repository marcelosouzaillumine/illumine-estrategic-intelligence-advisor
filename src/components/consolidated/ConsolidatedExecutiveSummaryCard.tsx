import React from 'react';
import { Target } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function ConsolidatedExecutiveSummaryCard({ narrative }: { narrative: string }) {
  const { t } = useLanguage();
  return (
    <div className="bg-slate-900 text-white rounded-[32px] p-8 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-all duration-700 group-hover:scale-110" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
          <Target size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white/90 uppercase tracking-widest">{t('summary.executive_summary')}</h3>
          <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mt-0.5">{t('summary.diagnostico_consolidado')}</p>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-md relative z-10">
        <p className="text-sm md:text-base font-medium leading-relaxed text-white/90">
          {narrative}
        </p>
      </div>
    </div>
  );
}
