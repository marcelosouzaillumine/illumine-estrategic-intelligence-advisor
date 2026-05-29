// src/components/war-gaming/InstitutionalPressureHeatmap.tsx

import React from 'react';
import { InstitutionalSurvivalThesis } from '../../core/runtime/war-gaming/war-gaming-types';
import { cn } from '../../lib/utils';

export function InstitutionalPressureHeatmap({ thesis }: { thesis: InstitutionalSurvivalThesis }) {
  if (!thesis) return null;

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm mt-8">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-100 pb-2">Institutional Thesis & Fiduciary Pressure</h3>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-xs font-bold text-slate-600 uppercase">Resilience Score</span>
          <span className={cn(
            "text-xl font-black",
            thesis.resilienceScore >= 80 ? "text-emerald-600" : (thesis.resilienceScore >= 50 ? "text-amber-500" : "text-rose-600")
          )}>
            {thesis.resilienceScore}/100
          </span>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-xs font-bold text-slate-600 uppercase">Sustainability Status</span>
          <span className={cn(
            "text-[10px] font-black uppercase px-2 py-1 rounded border",
            thesis.sustainabilityStatus === 'PRESERVADA' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
            (thesis.sustainabilityStatus === 'INSUSTENTÁVEL' ? "bg-rose-100 text-rose-700 border-rose-300" : "bg-amber-50 text-amber-700 border-amber-200")
          )}>
            {thesis.sustainabilityStatus}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-700 leading-relaxed italic border-l-2 border-slate-300 pl-3">
            "{thesis.thesisStatement}"
          </p>
        </div>

        {thesis.structuralDeteriorationEvidence.length > 0 && (
          <div className="mt-2 space-y-1">
            {thesis.structuralDeteriorationEvidence.map((e, i) => (
              <p key={i} className="text-[10px] font-medium text-slate-500 flex gap-2">
                <span className="text-rose-400">•</span> {e}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
