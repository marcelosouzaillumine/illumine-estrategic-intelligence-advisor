import React from 'react';
import { cn } from '../../../../lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';

export interface ExecutiveActionCardProps {
  category: string;
  timeline: string;
  action: React.ReactNode;
  metadata?: {
    priority: "alta" | "média" | "baixa";
    expectedImpact: "alto" | "médio" | "baixo";
    dependencies?: string[];
    strategicObjective?: string;
  };
  className?: string;
}

export function ExecutiveActionCard({
  category,
  timeline,
  action,
  metadata,
  className
}: ExecutiveActionCardProps) {
  return (
    <ExecutiveSurface
      padding="none"
      className={cn("flex flex-col items-start justify-start p-5 rounded-[20px] shadow-sm border border-border/50 h-full bg-surface-container/20", className)}
    >
      <div className="w-full flex items-center justify-between mb-3 gap-2">
        <h5 className="text-[11px] font-bold uppercase tracking-[0.08em] text-foreground min-w-0 truncate">{category}</h5>
        <span className="shrink-0 inline-flex items-center h-5 px-2 bg-surface-container border border-border/60 rounded text-[9px] font-bold uppercase tracking-[0.06em] text-foreground/80">
          {timeline}
        </span>
      </div>
      <div className="text-[13px] leading-[1.6] text-foreground/85 flex-1 w-full">
        {action}
        
        {metadata && (
          <div className="mt-4 pt-4 border-t border-border/50 w-full flex flex-col gap-2">
            {metadata.strategicObjective && (
              <div className="text-[11px] leading-[1.4] text-executive-secondary">
                <span className="font-semibold text-executive-primary">Objetivo:</span> {metadata.strategicObjective}
              </div>
            )}
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-executive-muted">
                Prioridade: <span className={cn("font-bold", metadata.priority === 'alta' ? 'text-critical' : metadata.priority === 'média' ? 'text-warning' : 'text-success')}>{metadata.priority}</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-executive-muted">
                Impacto: <span className="text-executive-primary font-bold">{metadata.expectedImpact}</span>
              </span>
            </div>
            {metadata.dependencies && metadata.dependencies.length > 0 && (
              <div className="text-[10px] text-executive-muted mt-1 leading-[1.4]">
                <span className="font-medium">Dependências:</span> {metadata.dependencies.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </ExecutiveSurface>
  );
}
