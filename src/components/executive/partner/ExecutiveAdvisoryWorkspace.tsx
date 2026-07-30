import React from 'react';
import { Briefcase } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { AdvisoryOrganizationCard } from './AdvisoryOrganizationCard';
import { AdvisorProfileCard } from './AdvisorProfileCard';
import { MultiAdvisorAssignmentCard } from './MultiAdvisorAssignmentCard';
import { HoldingStructureCard } from './HoldingStructureCard';
import { ExecutiveMeetingCenterCard } from './ExecutiveMeetingCenterCard';
import { WhiteLabelConfigCard } from './WhiteLabelConfigCard';

export const ExecutiveAdvisoryWorkspace: React.FC = () => {
  const mockOrg = {
    organizationId: 'org-1',
    name: 'Illumine Strategic Advisory Partner Network',
    branding: { primaryColor: '#0052FF' },
    memberCount: 18,
    specializationSectors: ['TECNOLOGIA', 'INDUSTRIA', 'SERVICOS'],
    certificationLevel: 'EXECUTIVE_FELLOW' as const
  };

  const mockAdvisor = {
    advisorId: 'adv-01',
    fullName: 'Dr. Roberto Silveira',
    primarySpecialty: 'FINANCIAL' as const,
    certificationLevel: 'EXECUTIVE_FELLOW' as const,
    fiduciaryScore: 99.2,
    technicalScore: 98.0,
    implementationRatePercent: 92.0,
    successRatePercent: 96.5,
    generatedROIValue: 3400000,
    npsScore: 98
  };

  const mockHolding = {
    holdingId: 'holding-1',
    holdingName: 'Grupo Delta Capital',
    childCompanyIds: ['comp-granatum', 'comp-emporio'],
    totalConsolidatedRevenue: 85000000
  };

  const mockMeeting = {
    meetingId: 'mtg-1',
    companyId: 'comp-granatum',
    title: 'Comitê de Alinhamento Fiduciário & Estratégia 2026',
    scheduledAt: new Date().toISOString(),
    participantAdvisorIds: ['adv-01', 'adv-02'],
    agendaTopics: ['Homologação do Plano de Reestruturação', 'Aprovação de CAPEX'],
    minutesSummary: 'Sessão colegiada realizada com presença dos advisors financeiro e operacional.',
    decisionsMade: ['Aprovado investimento de R$ 1.5M', 'Meta de EBITDA fixada em 18.5%']
  };

  return (
    <div className="space-y-4">
      <ExecutiveSurface className="p-4 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <ExecutiveText variant="sectionTitle" className="font-bold text-primary text-base">
              Enterprise Advisory Operating System (B2B2B)
            </ExecutiveText>
          </div>
          <ExecutiveBadge variant="success">
            Modo Partner Ativo
          </ExecutiveBadge>
        </div>
      </ExecutiveSurface>

      <AdvisoryOrganizationCard organization={mockOrg} />
      <AdvisorProfileCard profile={mockAdvisor} />
      <HoldingStructureCard holding={mockHolding} />
      <ExecutiveMeetingCenterCard meeting={mockMeeting} />
      <WhiteLabelConfigCard brandName={mockOrg.name} primaryColor={mockOrg.branding.primaryColor} />
    </div>
  );
};
