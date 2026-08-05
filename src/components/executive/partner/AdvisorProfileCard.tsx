import React from 'react';
import { UserCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { AdvisorProfileContract } from '@illumine/executive-contracts';
import { useTranslation } from "react-i18next";
import { useExecutiveFormatter } from '../../../core/localization';

export interface AdvisorProfileCardProps {
  readonly profile: AdvisorProfileContract;
}

export const AdvisorProfileCard: React.FC<AdvisorProfileCardProps> = ({ profile }) => {
  // @ts-ignore
  const { t } = useTranslation('partners');
  const formatter = useExecutiveFormatter();

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
          {t('profile.fiduciaryScore', { score: profile.fiduciaryScore })}
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
        <div>{t('profile.successRate')} <strong className="text-success">{profile.successRatePercent}%</strong></div>
        <div>{t('profile.nps')} <strong className="text-foreground">{profile.npsScore}</strong></div>
        <div>{t('profile.level')} <strong className="text-foreground">{profile.certificationLevel}</strong></div>
        <div>{t('profile.generatedRoi')} <strong className="text-primary">{formatter.currency(profile.generatedROIValue)}</strong></div>
      </div>
    </ExecutiveSurface>
  );
};
