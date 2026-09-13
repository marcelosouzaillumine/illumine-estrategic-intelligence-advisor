import React from 'react';
import { Brain, TrendingUp } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { LearningRecordContract } from '@illumine/executive-contracts';

export interface LearningInsightCardProps {
  readonly record: LearningRecordContract;
}

export const LearningInsightCard: React.FC<LearningInsightCardProps> = ({ record }) => {
  return (
    <ExecutiveSurface className="p-3 mb-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Aprendizado Decisório Extraído
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Entregue: {record.deltaPercent}% da Meta
        </ExecutiveBadge>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        {record.varianceReason} (Fator de Calibração: {record.calibrationFactor}x).
      </p>
    </ExecutiveSurface>
  );
};
