import React from 'react';
import { Network, Zap, Waves, GitMerge } from 'lucide-react';
import { OperationalFrictionEvent } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveBadge } from '../ui/executive-badge';

interface OperationalFrictionMapProps {
  frictions: OperationalFrictionEvent[];
}

export function OperationalFrictionMap({ frictions }: OperationalFrictionMapProps) {
  if (frictions.length === 0) {
    return (
      <ExecutiveSurface radius="xl" padding="xl" className="text-center flex flex-col items-center justify-center h-full min-h-[200px]">
        <Network size={24} className="text-muted-foreground mb-3" />
        <ExecutiveText variant="microLabel" className="text-muted-foreground">
          Fluxo Institucional Sem Atrito
        </ExecutiveText>
      </ExecutiveSurface>
    );
  }

  return (
    <ExecutiveSurface radius="xl" padding="xl" className="h-full flex flex-col space-y-6">
      <ExecutiveHeading as="h3" className="text-muted-foreground flex items-center gap-2">
        <GitMerge size={14} /> Mapa de Atritos Institucionais
      </ExecutiveHeading>

      <div className="space-y-4 flex-1">
        {frictions.map((friction) => {
          let icon = <Zap size={14} className="text-warning font-bold" />;
          let badgeVariant: 'warning' | 'critical' | 'info' = 'warning';

          if (friction.nature === 'STRUCTURAL') {
            icon = <Waves size={14} className="text-critical font-bold" />;
            badgeVariant = 'critical';
          } else if (friction.nature === 'CONTINUITY_RELATED') {
            badgeVariant = 'info';
          }

          return (
            <div key={friction.id} className="relative pl-6 before:absolute before:left-2 before:top-4 before:bottom-[-16px] before:w-px before:bg-border last:before:hidden">
              <div className="absolute left-[-2px] top-1.5 p-1 bg-card rounded-full border border-border z-10">
                {React.isValidElement(icon) ? icon : icon ? React.createElement(icon as any, { size: 18 }) : null}
              </div>
              <div className="bg-surface-container/40 p-4 rounded-xl border border-border space-y-3">
                <div className="flex justify-between items-center">
                  <ExecutiveBadge variant={badgeVariant}>
                    {friction.nature.replace(/_/g, ' ')}
                  </ExecutiveBadge>
                  <span className="text-[9px] font-mono text-muted-foreground">{friction.id.split('-').slice(0,3).join('-')}</span>
                </div>
                <ExecutiveText variant="bodyStandard" className="font-medium text-foreground">
                  {friction.description}
                </ExecutiveText>
                <div className="flex flex-wrap gap-2 pt-1">
                  {friction.causalMetrics.map((metric, idx) => (
                    <span key={idx} className="text-[9px] font-mono text-muted-foreground bg-card px-2 py-0.5 rounded border border-border">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ExecutiveSurface>
  );
}
