import React from 'react';
import { SectorRiskPatternAnalyzer } from '../../services/FiduciaryRuntimeAdapter';
import { AlertTriangle, Info } from 'lucide-react';

export function SectorRiskPatternPanel({ sector }: { sector: string }) {
  const patterns = SectorRiskPatternAnalyzer.identifyPatterns(sector);

  if (patterns.length === 0) {
    return (
      <div className="p-4 text-xs text-muted-foreground flex items-center gap-2 bg-surface-container rounded border border-border">
        <Info size={14} /> Nenhum padrão de risco dominante detectado estatisticamente para este setor na amostra atual.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {patterns.map(p => (
        <div key={p.patternId} className="flex items-start gap-3 p-3 bg-background border border-border rounded">
          <AlertTriangle className={p.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'} size={16} />
          <div>
            <div className="text-sm font-medium text-foreground">{p.description}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Ocorrência no grupo: {p.occurrenceRate}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}
