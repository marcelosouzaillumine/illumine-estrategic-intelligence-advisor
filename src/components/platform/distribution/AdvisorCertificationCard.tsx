import React from 'react';
import { Award } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { CertificationLevelContract } from '@illumine/executive-contracts';

export interface AdvisorCertificationCardProps {
  readonly cert: CertificationLevelContract;
}

export const AdvisorCertificationCard: React.FC<AdvisorCertificationCardProps> = ({ cert }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Certificação & Exames Fiduciários ({cert.currentBadgeLevel})
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Nota no Exame: {cert.examScorePercent}%
        </ExecutiveBadge>
      </div>
    </ExecutiveSurface>
  );
};
