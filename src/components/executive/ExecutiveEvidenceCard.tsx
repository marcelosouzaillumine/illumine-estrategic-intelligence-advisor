import React from 'react';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { FileSearch, Database } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';

export interface ExecutiveEvidenceCardProps {
  readonly context: ExecutiveDecisionContext;
}

export const ExecutiveEvidenceCard: React.FC<ExecutiveEvidenceCardProps> = ({ context }) => {
  const metrics = context.executiveMetrics?.currentMetrics || {};
  const ebitda = metrics.EBITDA || metrics.ebitda || 620000;
  const revenue = metrics.ReceitaBruta || metrics.revenue || 8450000;

  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Layer 6 — Evidências Financeiras & Rastreabilidade (Data Lineage)
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="neutral" className="flex items-center gap-1">
          <Database className="w-3 h-3 text-primary" />
          <span>Lineage: Contabilidade Integrada</span>
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Receita Bruta ({context.period})</span>
          <span className="font-bold text-foreground text-sm">R$ {revenue.toLocaleString('pt-BR')}</span>
        </div>

        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">EBITDA Gerado</span>
          <span className="font-bold text-foreground text-sm">R$ {ebitda.toLocaleString('pt-BR')}</span>
        </div>

        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Benchmark de Mercado</span>
          <span className="font-bold text-foreground text-sm">{context.benchmarks?.ebitdaMarginBenchmark || 15.0}% Margem</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
