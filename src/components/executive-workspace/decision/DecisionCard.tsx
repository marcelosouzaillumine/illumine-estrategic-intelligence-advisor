import React from 'react';
import { DecisionContext } from '../../../workspace/types';
import { ExecutiveCard } from '../foundation/ExecutiveCard';
import { ExecutiveStatus } from '../foundation/ExecutiveStatus';
import { ExecutiveAction } from '../foundation/ExecutiveAction';
import { ExecutiveBadge } from '../foundation/ExecutiveBadge';
import { ShieldCheck, Clock, AlertCircle, ArrowRight, User } from 'lucide-react';

interface DecisionCardProps {
  decision: DecisionContext;
  title: string;
}

export function DecisionCard({ decision, title }: DecisionCardProps) {
  return (
    <ExecutiveCard className="p-5 flex flex-col gap-4">
      {/* Header: Title and Status */}
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <ExecutiveStatus status={decision.status} />
      </div>

      {/* Meta row: Urgency, Priority, Confidence */}
      <div className="flex flex-wrap gap-2 text-xs">
        <ExecutiveBadge variant={decision.urgency === 'immediate' ? 'destructive' : 'secondary'} className="flex gap-1 items-center">
          <Clock className="w-3 h-3" /> {decision.urgency}
        </ExecutiveBadge>
        <ExecutiveBadge variant={decision.priority === 'critical' ? 'destructive' : 'outline'} className="flex gap-1 items-center">
          <AlertCircle className="w-3 h-3" /> {decision.priority}
        </ExecutiveBadge>
        <ExecutiveBadge variant="primary" className="flex gap-1 items-center">
          <ShieldCheck className="w-3 h-3" /> conf: {decision.confidence}
        </ExecutiveBadge>
      </div>

      {/* Body: Context, Evidence, Impact */}
      <div className="flex flex-col gap-3 my-2 text-sm text-muted-foreground border-l-2 border-primary/20 pl-4">
        <div>
          <strong className="text-foreground block mb-1">Contexto</strong>
          <p>{decision.context}</p>
        </div>
        <div>
          <strong className="text-foreground block mb-1">Evidências ({decision.origin})</strong>
          <ul className="list-disc pl-4 space-y-1">
            {decision.evidence.map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong className="text-foreground block mb-1">Impacto</strong>
          <p>{decision.impact}</p>
        </div>
      </div>

      {/* Conclusion: Recommendation & Owner */}
      <div className="bg-primary/5 rounded-lg p-4 mt-2 border border-primary/10">
        <div className="flex justify-between items-start mb-2">
          <strong className="text-primary text-sm flex items-center gap-1.5">
            Recomendação
          </strong>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="w-3 h-3" /> {decision.owner}
          </span>
        </div>
        <p className="text-sm text-foreground mb-4">{decision.recommendation}</p>
        
        {/* Action */}
        <ExecutiveAction variant="primary" size="sm" icon={ArrowRight}>
          {decision.action}
        </ExecutiveAction>
      </div>
    </ExecutiveCard>
  );
}
