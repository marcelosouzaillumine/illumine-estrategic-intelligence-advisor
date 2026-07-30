import React from 'react';
import { UserCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { AdvisorProfileContract } from '@illumine/executive-contracts';

export interface AdvisorProfileCardProps {
  readonly profile: AdvisorProfileContract;
}

export const AdvisorProfileCard: React.FC<AdvisorProfileCardProps> = ({ profile }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            {profile.fullName} ({profile.primarySpecialty})
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Score Fiduciário: {profile.fiduciaryScore}
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
        <div>Taxa de Sucesso: <strong className="text-success">{profile.successRatePercent}%</strong></div>
        <div>NPS: <strong className="text-foreground">{profile.npsScore}</strong></div>
        <div>Nível: <strong className="text-foreground">{profile.certificationLevel}</strong></div>
        <div>ROI Gerado: <strong className="text-primary">R$ {profile.generatedROIValue.toLocaleString('pt-BR')}</strong></div>
      </div>
    </ExecutiveSurface>
  );
};
