import React from 'react';
import { AlertTriangle, ShieldCheck, FileCheck, ArrowUpRight } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { Button } from '../../../../components/ui/button';
import { DecisionProjection } from '../../../../contracts/governance/FiduciaryValidationProjection';
import { ExecutiveLineageTimeline } from '../../../../components/ui/executive-lineage-timeline';

export interface ExecutiveDecisionCardProps {
  decision: DecisionProjection;
  onInspect?: (id: string) => void;
  className?: string;
}

export function ExecutiveDecisionCard({
  decision,
  onInspect,
  className = ''
}: ExecutiveDecisionCardProps) {
  const isBlocked = decision.status === 'BLOCKED';
  const statusVariant = isBlocked ? 'critical' : decision.status === 'RESOLVED' ? 'success' : 'warning';

  return (
    <ExecutiveSurface 
      padding="lg" 
      radius="xl" 
      className={`space-y-6 hover:border-primary/40 transition-all duration-300 shadow-sm ${className}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <ExecutiveHeading as="h3" variant="submoduleTitle">
            {decision.title}
          </ExecutiveHeading>
          <div className="flex items-center gap-3 mt-2">
            <ExecutiveBadge variant={statusVariant}>
              {decision.status}
            </ExecutiveBadge>
            <ExecutiveBadge variant="success">
              {decision.confidenceScore}% Score de Confiança
            </ExecutiveBadge>
          </div>
        </div>

        {onInspect && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onInspect(decision.id)}
          >
            Inspecionar <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </div>

      <ExecutiveSurface 
        variant={isBlocked ? 'critical' : 'warning'} 
        padding="sm" 
        radius="lg" 
        className="flex items-start gap-2"
      >
        <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isBlocked ? 'text-critical' : 'text-warning'}`} />
        <ExecutiveText as="span" variant="bodyStandard" className="font-medium">
          {decision.reason}
        </ExecutiveText>
      </ExecutiveSurface>

      {/* Decision Lineage Timeline */}
      <div className="pt-2">
        <ExecutiveText as="div" variant="caption" className="text-muted-foreground uppercase font-bold tracking-wider mb-3">
          Trilha de Linhagem de Decisão (7 Etapas Auditáveis)
        </ExecutiveText>
        <ExecutiveLineageTimeline stages={decision.lineageStages} />
      </div>

      <div className="pt-3 border-t border-border flex justify-between items-center text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          Audit Hash: {decision.hash}
        </span>
        <span className="flex items-center gap-1 text-success font-medium">
          <FileCheck className="w-3.5 h-3.5" /> Estágio Auditado 100%
        </span>
      </div>
    </ExecutiveSurface>
  );
}
