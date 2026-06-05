import React from 'react';
import { GitMerge } from 'lucide-react';
import { CrossEntityCausality } from '../../services/FiduciaryRuntimeAdapter';

export function RiskPropagationPanel({ causalities }: { causalities: CrossEntityCausality[] }) {
  if (!causalities || causalities.length === 0) return null;

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
          <GitMerge size={20} className="text-orange-500" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Causalidade Estrutural</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Mapeamento Causa-Efeito</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {causalities.map((causal, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-700">
                Origem: {causal.primaryEntityId}
              </span>
              <span className="text-[9px] font-bold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                {causal.causalityType.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              {causal.description}
            </p>
            {causal.financialEvidence && (
              <div className="mt-2 text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200">
                <strong>Evidência:</strong> {causal.financialEvidence.metric} ({causal.financialEvidence.context})
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
