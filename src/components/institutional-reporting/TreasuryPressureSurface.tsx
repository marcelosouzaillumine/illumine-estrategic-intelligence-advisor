// src/components/institutional-reporting/TreasuryPressureSurface.tsx

import React from 'react';
import { Landmark, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { TreasurySection } from '../../services/FiduciaryRuntimeAdapter';

export function TreasuryPressureSurface({ data }: { data: TreasurySection }) {
  const { translateLabel: t } = useLanguage();
  const isStressed = data.treasuryStressStatus === 'STRESSED' || data.treasuryStressStatus === 'CRITICAL';

  return (
    <div className={`border p-6 rounded-lg font-mono ${isStressed ? 'bg-orange-950/20 border-orange-900/50' : 'bg-zinc-950 border-zinc-800'}`}>
      <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Landmark size={14} /> Treasury & Pressure Report
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.stress_status")}</span>
          <span className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isStressed ? 'text-orange-400' : 'text-emerald-400'}`}>
            {isStressed && <AlertTriangle size={12} />}
            {data.treasuryStressStatus}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.liquidity_compression")}</span>
          <span className="text-xs text-zinc-300 font-bold uppercase tracking-widest block">
            {data.liquidityCompressionLevel.replace(/_/g, ' ')}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.funding_fragility")}</span>
          <span className="text-xs text-zinc-300 font-bold uppercase tracking-widest block">
            {data.fundingFragility}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.runway_sustainability")}</span>
          <span className={`text-xs font-bold uppercase tracking-widest block ${data.runwaySustainability ? 'text-emerald-400' : 'text-rose-400'}`}>
            {data.runwaySustainability ? 'SUSTAINABLE' : 'UNSUSTAINABLE'}
          </span>
        </div>
      </div>
    </div>
  );
}
