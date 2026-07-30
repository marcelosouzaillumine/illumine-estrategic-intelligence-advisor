import React from 'react';
import { Building2, Award } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { AdvisoryOrganizationContract } from '@illumine/executive-contracts';

export interface AdvisoryOrganizationCardProps {
  readonly organization: AdvisoryOrganizationContract;
}

export const AdvisoryOrganizationCard: React.FC<AdvisoryOrganizationCardProps> = ({ organization }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            {organization.name}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          {organization.certificationLevel}
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Advisors Associados: <strong className="text-foreground">{organization.memberCount} Especialistas</strong></span>
        <span>Setores: <strong className="text-foreground">{organization.specializationSectors.join(', ')}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
