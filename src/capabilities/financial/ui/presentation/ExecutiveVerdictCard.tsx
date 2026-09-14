import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { cn } from '../../../../lib/utils';
import { TechnicalAssessment } from '../../../../../packages/shell/executive-intelligence-layer/src/contracts/TechnicalAssessment';

interface ExecutiveVerdictCardProps {
  assessment: TechnicalAssessment;
  className?: string;
}

export function ExecutiveVerdictCard({ assessment, className }: ExecutiveVerdictCardProps) {
  
  const getStatusConfig = () => {
    switch (assessment.executiveState) {
      case 'HEALTHY':
        return { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' };
      case 'ATTENTION':
        return { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' };
      case 'STRESSED':
        return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
      case 'CRITICAL':
        return { icon: ShieldAlert, color: 'text-critical', bg: 'bg-critical/10', border: 'border-critical/20' };
      default:
        return { icon: HelpCircle, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <ExecutiveSurface className={cn("p-6 flex flex-col gap-4", config.bg, config.border, className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-6 h-6", config.color)} />
          <ExecutiveHeading as="h3" variant="submoduleTitle" className={config.color}>
            Executive Verdict
          </ExecutiveHeading>
        </div>
        <div className="text-right">
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase tracking-widest block mb-1">
            Confidence
          </ExecutiveText>
          <span className="font-bold text-lg">{(assessment.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
      <div className="mt-2">
        <ExecutiveText variant="bodyLarge" className="font-medium text-foreground">
          {assessment.executiveVerdict}
        </ExecutiveText>
      </div>
    </ExecutiveSurface>
  );
}
