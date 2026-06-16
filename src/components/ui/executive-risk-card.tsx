import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveHeading } from './executive-heading';
import { ExecutiveText } from './executive-typography';
import { ExecutiveBadge, ExecutiveBadgeVariant } from './executive-badge';

export interface ExecutiveRiskCardProps {
  label?: string;
  title: string;
  badgeLabel?: string;
  severity: "critical" | "warning" | "attention" | "info" | "success" | "neutral";
  status?: string;
  description?: string;
  className?: string;
}

export function ExecutiveRiskCard({
  label,
  title,
  badgeLabel,
  severity,
  status,
  description,
  className
}: ExecutiveRiskCardProps) {
  
  // Mapeamento semântico da severidade para o tom do ExecutiveBadge
  const mapSeverityToVariant = (s: string): ExecutiveBadgeVariant => {
    switch (s) {
      case 'critical': return 'critical';
      case 'warning': return 'warning';
      case 'attention': return 'attention';
      case 'success': return 'success';
      case 'info': return 'info';
      default: return 'neutral';
    }
  };



  return (
    <ExecutiveSurface 
      padding="none" 
      variant="default"
      elevation="none"
      className={cn("flex flex-col p-5 bg-card border border-border/60 rounded-2xl w-full", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          {label && (
            <ExecutiveText as="span" variant="microLabel" className="text-executive-muted">
              {label}
            </ExecutiveText>
          )}
          <ExecutiveHeading as="h4" variant="submoduleTitle">
            {title}
          </ExecutiveHeading>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          {status && (
            <ExecutiveText as="span" variant="microLabel" className="text-executive-muted">
              {status}
            </ExecutiveText>
          )}
          {badgeLabel && (
            <ExecutiveBadge variant={mapSeverityToVariant(severity)}>
              {badgeLabel}
            </ExecutiveBadge>
          )}
        </div>
      </div>
      
      {description && (
        <div className="mt-3 pt-3 flex flex-col" // @allow-margin
      >
          <ExecutiveText as="p" variant="bodyStandard" className="text-executive-secondary">
            {description}
          </ExecutiveText>
        </div>
      )}
    </ExecutiveSurface>
  );
}
