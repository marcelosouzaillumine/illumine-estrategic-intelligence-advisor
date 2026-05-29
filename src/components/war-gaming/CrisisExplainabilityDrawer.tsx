// src/components/war-gaming/CrisisExplainabilityDrawer.tsx

import React from 'react';
import { CrisisExplainabilityProfile } from '../../core/runtime/war-gaming/war-gaming-types';

export function CrisisExplainabilityDrawer({ profile }: { profile: CrisisExplainabilityProfile }) {
  if (!profile) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-slate-300">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-2">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Explainability & Lineage</h3>
        <span className="text-[9px] font-mono text-slate-600 bg-slate-800 px-2 py-0.5 rounded">
          {profile.lineageHash}
        </span>
      </div>
      
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Institutional Stress Rationale</span>
          <p className="text-xs font-medium text-slate-300 leading-relaxed mt-1">
            {profile.institutionalStressExplanation}
          </p>
        </div>

        {profile.brokenConstraints.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-rose-500 uppercase">Broken Constraints</span>
            <ul className="mt-1 space-y-1">
              {profile.brokenConstraints.map((c, i) => (
                <li key={i} className="text-xs font-medium text-rose-400 flex items-center gap-2">
                  <span className="w-1 h-1 bg-rose-500 rounded-full"></span> {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800">
          <span className="text-[10px] font-bold text-amber-500 uppercase block mb-2">Fiduciary Disclosures</span>
          {profile.fiduciaryWarnings.map((w, i) => (
            <p key={i} className="text-[10px] text-amber-600/80 italic leading-tight">
              {w}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
