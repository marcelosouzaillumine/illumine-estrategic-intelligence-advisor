import React from 'react';
import { TrendingDown, TrendingUp, Clock } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { PredictionContract } from '@illumine/executive-contracts';

export interface ForecastCardProps {
  readonly prediction: PredictionContract;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ prediction }) => {
  const isUp = prediction.trend === 'UPWARD';

  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          {isUp ? <TrendingUp className="w-4 h-4 text-success" /> : <TrendingDown className="w-4 h-4 text-warning" />}
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Projeção Preditiva ({prediction.metricCode} — {prediction.horizonDays}d)
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={prediction.probabilityPercent >= 80 ? 'success' : 'warning'}>
          Probabilidade: {prediction.probabilityPercent}%
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-2">
        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Valor Atual</span>
          <span className="font-bold text-foreground text-base">{prediction.currentValue}%</span>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Valor Previsto ({prediction.horizonDays} dias)</span>
          <span className="font-bold text-primary text-base">{prediction.expectedValue}%</span>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Intervalo de Confiança</span>
          <span className="font-bold text-foreground text-base">{prediction.confidenceInterval.min}% a {prediction.confidenceInterval.max}%</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/30">
        <span className="font-semibold text-foreground">Fator Dominante: </span>
        <span>{prediction.dominantFactor}</span>
      </div>
    </ExecutiveSurface>
  );
};
