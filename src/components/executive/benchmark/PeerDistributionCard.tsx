import React from 'react';
import { Users, ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';

export interface PeerDistributionCardProps {
  readonly segmentName: string;
  readonly sampleCount: number;
}

export const PeerDistributionCard: React.FC<PeerDistributionCardProps> = ({ segmentName, sampleCount }) => {
  return (
    <ExecutiveSurface className="p-3 mb-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Grupo Comparável Anonimizado
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="neutral" className="flex items-center gap-1 text-[10px]">
          <ShieldCheck className="w-3 h-3 text-success" />
          <span>Isolamento Total</span>
        </ExecutiveBadge>
      </div>
      <p className="text-muted-foreground text-xs mt-1">
        Segmento: <strong className="text-foreground">{segmentName}</strong> ({sampleCount.toLocaleString('pt-BR')} empresas contribuindo anonimamente).
      </p>
    </ExecutiveSurface>
  );
};
