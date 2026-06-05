import React from 'react';
import { GovernanceDeteriorationIndex } from '../../services/FiduciaryRuntimeAdapter';
import { TrendingDown } from 'lucide-react';

export function GovernanceTrendPanel({ tenantId }: { tenantId: string }) {
  // Passamos um score mockado do consolidado
  const trend = GovernanceDeteriorationIndex.calculateIndex(tenantId, 0.82);

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="text-rose-500" />
        <h3 className="text-sm font-semibold text-foreground">Governance Risk Index</h3>
      </div>
      <div className="flex items-end gap-4">
        <div className="text-4xl font-bold text-foreground">
          {Math.round(trend.currentScore * 100)}<span className="text-lg text-muted-foreground">/100</span>
        </div>
        <div className="mb-1">
          <span className="text-xs bg-rose-500/10 text-rose-500 font-bold px-2 py-1 rounded">
            {trend.trendDirection}
          </span>
        </div>
      </div>
      <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
        Historico recente: 
        <span className="font-mono">{Math.round(trend.historicalScores[0]*100)} &rarr; {Math.round(trend.historicalScores[1]*100)} &rarr; {Math.round(trend.historicalScores[2]*100)}</span>
      </div>
    </div>
  );
}
