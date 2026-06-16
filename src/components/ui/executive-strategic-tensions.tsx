import React from 'react';
import { cn } from '../../lib/utils';
import { StrategicTension } from '../../core/runtime/executive-consolidation/ExecutiveStrategicTensionEngine';
import { ExecutiveHeading } from './executive-heading';
import { ExecutiveText } from './executive-typography';
import { AlertCircle, Lightbulb, ShieldAlert } from 'lucide-react';

export interface ExecutiveStrategicTensionsProps {
  tensions: StrategicTension[];
  className?: string;
}

export function ExecutiveStrategicTensions({ tensions, className }: ExecutiveStrategicTensionsProps) {
  if (!tensions || tensions.length === 0) return null;

  const getIcon = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return <ShieldAlert className="w-5 h-5 text-critical" />;
      case 'WARNING': return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'OPPORTUNITY': return <Lightbulb className="w-5 h-5 text-success" />;
      default: return <AlertCircle className="w-5 h-5 text-info" />;
    }
  };

  const getColorClass = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-critical/5 border-critical/30';
      case 'WARNING': return 'bg-warning/5 border-warning/30';
      case 'OPPORTUNITY': return 'bg-success/5 border-success/30';
      default: return 'bg-info/5 border-info/30';
    }
  };

  return (
    <div className={cn("w-full mb-12", className)}>
      {tensions.length > 1 && (
        <ExecutiveHeading as="h3" variant="sectionTitle" className="mb-6">
          Tensões Estratégicas
        </ExecutiveHeading>
      )}

      <div className="flex flex-col gap-4">
        {tensions.map((tension, idx) => (
          <div key={idx} className={cn("p-6 rounded-xl border flex items-start gap-4", getColorClass(tension.severity))}>
            <div className="mt-1">
              {getIcon(tension.severity)}
            </div>
            <div className="flex flex-col flex-1">
              <ExecutiveText variant="submoduleTitle" className="mb-2 font-bold">
                {tension.title}
              </ExecutiveText>
              <ExecutiveText variant="bodyLarge" className="text-executive-secondary mb-3">
                {tension.description}
              </ExecutiveText>
              <div className="flex gap-2">
                {tension.dimensionsInvolved.map((dim, dIdx) => (
                  <span key={dIdx} className="text-[11px] font-medium uppercase tracking-wider px-2 py-1 bg-surface border border-border rounded text-executive-muted">
                    {dim}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
