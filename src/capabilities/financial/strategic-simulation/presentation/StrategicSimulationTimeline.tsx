import React from 'react';
import { StrategicDecisionSimulator } from '../../../../services/FiduciaryRuntimeAdapter';
import { Clock } from 'lucide-react';

export function StrategicSimulationTimeline({ tenantId }: { tenantId: string }) {
  const sims = StrategicDecisionSimulator.getSimulations(tenantId);
  if (sims.length === 0) return null;

  const sim = sims[0];

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Timeline Projetada da Decisão</h3>
      </div>
      <div className="relative border-l border-border/50 ml-3 space-y-6 mt-4">
        <div className="relative pl-6">
          <div className="absolute w-3 h-3 bg-success-soft0 rounded-full -left-1.5 top-1.5 border-2 border-background"></div>
          <div className="text-xs text-muted-foreground font-mono">T+0 meses</div>
          <div className="text-sm font-medium text-foreground mt-1">Injeção de Liquidez (Venda Concluída)</div>
        </div>
        <div className="relative pl-6">
          <div className="absolute w-3 h-3 bg-critical-soft0 rounded-full -left-1.5 top-1.5 border-2 border-background"></div>
          <div className="text-xs text-muted-foreground font-mono">T+3 meses</div>
          <div className="text-sm font-medium text-foreground mt-1">Ruptura na Cadeia de Suprimentos</div>
        </div>
        <div className="relative pl-6">
          <div className="absolute w-3 h-3 bg-warning-soft0 rounded-full -left-1.5 top-1.5 border-2 border-background"></div>
          <div className="text-xs text-muted-foreground font-mono">T+6 meses</div>
          <div className="text-sm font-medium text-foreground mt-1">Risco de Quebra de Covenant ativado</div>
        </div>
        <div className="relative pl-6">
          <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 top-1.5 border-2 border-background"></div>
          <div className="text-xs text-muted-foreground font-mono">T+12 meses</div>
          <div className="text-sm font-medium text-foreground mt-1">Recuperação Parcial de Resiliência</div>
        </div>
      </div>
    </div>
  );
}
