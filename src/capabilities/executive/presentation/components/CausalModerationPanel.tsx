import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { ExecutivePerspectiveViewData } from '../view-models/ExecutivePerspectiveViewData';

interface CausalModerationPanelProps {
  moderationData: ExecutivePerspectiveViewData['causalModeration'];
}

export function CausalModerationPanel({ moderationData }: CausalModerationPanelProps) {
  if (!moderationData) return null;
  
  const { blockedFalsePositives, causalConflicts } = moderationData;
  if (blockedFalsePositives.length === 0 && causalConflicts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {blockedFalsePositives.length > 0 && (
        <div className="bg-critical-soft border border-rose-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-rose-600 mb-4">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Falsos Positivos Bloqueados</span>
          </div>
          <ul className="space-y-2">
            {blockedFalsePositives.map((fp, i) => (
              <li key={i} className="text-xs font-bold text-rose-900">• {fp}</li>
            ))}
          </ul>
        </div>
      )}

      {causalConflicts.length > 0 && (
        <div className="bg-warning-soft border border-amber-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-amber-600 mb-4">
            <AlertTriangle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Conflitos Causais Resolvidos</span>
          </div>
          <ul className="space-y-2">
            {causalConflicts.map((cc, i) => (
              <li key={i} className="text-xs font-bold text-amber-900">• {cc}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
