import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ExecutivePerspectiveViewData } from '../view-models/ExecutivePerspectiveViewData';

interface DominantRisksPanelProps {
  risks: ExecutivePerspectiveViewData['diagnosis']['dominantRisks'];
}

export function DominantRisksPanel({ risks }: DominantRisksPanelProps) {
  return (
    <div className="flex-1 space-y-4">
      <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
        <AlertTriangle size={14} /> Riscos Dominantes
      </h4>
      <ul className="space-y-2">
        {risks.length > 0 ? risks.map((risk) => (
          <li key={risk.id} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-rose-400 mt-1 shrink-0">•</span>
            <span>{risk.label}</span>
          </li>
        )) : (
          <li className="text-sm text-muted-foreground italic">Nenhum risco dominante identificado para o período analisado.</li>
        )}
      </ul>
    </div>
  );
}
