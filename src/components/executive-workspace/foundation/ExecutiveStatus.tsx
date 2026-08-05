import React from 'react';
import { DecisionStatus } from '../../../workspace/types';
import { CheckCircle2, AlertTriangle, XCircle, Info, MinusCircle } from 'lucide-react';

interface ExecutiveStatusProps {
  status: DecisionStatus;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export function ExecutiveStatus({ status, label, showIcon = true, className = '' }: ExecutiveStatusProps) {
  const config = {
    success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    critical: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    neutral: { icon: MinusCircle, color: 'text-muted-foreground', bg: 'bg-muted/50', border: 'border-border' }
  };

  const curr = config[status] || config.neutral;
  const Icon = curr.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${curr.color} ${curr.bg} ${curr.border} ${className}`}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {label && <span>{label}</span>}
    </div>
  );
}
