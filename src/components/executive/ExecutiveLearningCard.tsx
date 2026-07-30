import React from 'react';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { Brain, History, Check } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';

export interface ExecutiveLearningCardProps {
  readonly context: ExecutiveDecisionContext;
}

export const ExecutiveLearningCard: React.FC<ExecutiveLearningCardProps> = ({ context }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Layer 8 — Registro de Aprendizado & Acompanhamento de Decisão
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success" className="flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Loop Ativo</span>
        </ExecutiveBadge>
      </div>

      <div className="p-3 bg-surface-container/30 rounded border border-border/40 text-xs">
        <div className="flex items-center gap-2 text-foreground font-medium mb-1">
          <History className="w-4 h-4 text-primary shrink-0" />
          <span>Feedback de Resultado do Digital Twin ({context.companyName})</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Esta decisão será monitorada continuamente em relação aos balancetes dos próximos 90 dias. Os desvios reais vs projetados alimentarão a calibração automática dos modelos preditivos do conselho.
        </p>
      </div>
    </ExecutiveSurface>
  );
};
