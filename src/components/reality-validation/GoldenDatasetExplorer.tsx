import React from 'react';
import { Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { GoldenDatasetProfile } from '../../core/runtime/reality-validation/RealityValidationTypes';

const PRESSURE_COLORS: Record<string, string> = {
  CRITICAL: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
  HIGH: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  LOW: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
};

interface Props {
  datasets: GoldenDatasetProfile[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function GoldenDatasetExplorer({ datasets, selectedId, onSelect }: Props) {
  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-5">
        <Layers className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Golden Dataset Explorer</h3>
        <span className="ml-auto text-xs text-muted-foreground">{datasets.length} datasets ativos</span>
      </div>
      <div className="space-y-3">
        {datasets.map(ds => (
          <button
            key={ds.datasetId}
            onClick={() => onSelect(ds.datasetId)}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              selectedId === ds.datasetId
                ? 'border-primary bg-primary/10'
                : 'border-border/50 bg-background hover:border-primary/50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold text-foreground">{ds.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                ds.complexityScore > 0.9 ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' : 'text-amber-500 bg-amber-500/10 border-amber-500/30'
              }`}>
                {(ds.complexityScore * 100).toFixed(0)}% COMPLEXIDADE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ds.description}</p>
            <div className="flex gap-2 flex-wrap">
              {ds.entities.slice(0, 3).map(e => (
                <span key={e.entityId} className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PRESSURE_COLORS[e.liquidityPressure]}`}>
                  {e.role}
                </span>
              ))}
              {ds.entities.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{ds.entities.length - 3} entidades</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
