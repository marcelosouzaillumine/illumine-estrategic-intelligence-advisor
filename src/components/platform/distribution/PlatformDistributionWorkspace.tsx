import React from 'react';
import { Share2, ShieldCheck, ShoppingBag, DollarSign, Award, MapPin, Sparkles } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { PartnerMatchingCard } from './PartnerMatchingCard';
import { MarketplaceCatalogCard } from './MarketplaceCatalogCard';
import { RevenueSplitLedgerCard } from './RevenueSplitLedgerCard';
import { AdvisorCertificationCard } from './AdvisorCertificationCard';
import { TerritoryMapCard } from './TerritoryMapCard';
import { AIAdvisorRecommendationCard } from './AIAdvisorRecommendationCard';

export const PlatformDistributionWorkspace: React.FC = () => {
  const mockDistribution = {
    distributionId: 'dist-01',
    partnerId: 'partner-alpha',
    targetCompanyId: 'comp-granatum',
    matchedSpecialty: 'FINANCIAL',
    matchedGeographicRegion: 'BRASIL_SUL',
    matchedIndustryVertical: 'TECNOLOGIA',
    matchingScore: 98.4,
    status: 'ACTIVE' as const
  };

  const mockItem = {
    itemId: 'item-playbook-01',
    title: 'Playbook Executivo de Turnaround & Reestruturação Financeira',
    category: 'EXECUTIVE_PLAYBOOK' as const,
    publisherPartnerId: 'partner-illumine',
    priceValue: 4500,
    currency: 'BRL',
    ratingScore: 4.95,
    salesCount: 88
  };

  const mockRevenueSplit = {
    transactionId: 'tx-8812',
    grossAmount: 12000,
    platformRoyaltyAmount: 1800,
    partnerCommissionAmount: 6000,
    advisorShareAmount: 3000,
    holdingOverrideAmount: 1200,
    transactionTimestamp: new Date().toISOString(),
    ledgerHash: 'hash-tx-8812-sha256'
  };

  const mockCert = {
    advisorId: 'adv-01',
    currentBadgeLevel: 'EXECUTIVE_FELLOW' as const,
    examScorePercent: 98,
    completedCasesCount: 24,
    nextRecertificationDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isCertified: true
  };

  const mockTerritory = {
    territoryId: 'terr-sp-sp-tech',
    countryCode: 'BRA',
    stateOrProvince: 'SP',
    city: 'São Paulo',
    industrySector: 'Tecnologia & SaaS',
    exclusivePartnerOrgId: 'org-illumine-partner',
    activeQuotaCapacity: 50
  };

  const mockRecommendation = {
    recommendationId: 'rec-ai-101',
    companyId: 'comp-granatum',
    recommendedAdvisorId: 'adv-01',
    matchConfidencePercent: 97.8,
    reasoningJustification: 'Recomendação preditiva baseada em alinhamento de benchmark do setor de Tecnologia e score fiduciário de 99.2.',
    benchmarkCorrelationScore: 0.94
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. PLATFORM EXPERIENCE PROTOCOL: HEADER */}
      <ExecutiveSurface className="p-6 bg-card border border-border rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="w-5 h-5 text-primary" />
              <ExecutiveHeading as="h2" className="text-xl font-bold text-primary">
                Platform Distribution Network (PDN v1.0)
              </ExecutiveHeading>
            </div>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground text-xs">
              Orquestração de distribuição completa: Partner Matching, Marketplace, Revenue Split Ledger, Certificação, Territórios e IA Advisor Recommendation.
            </ExecutiveText>
          </div>
          <ExecutiveBadge variant="success">
            Modo Distribuição Ativo
          </ExecutiveBadge>
        </div>
      </ExecutiveSurface>

      {/* 2. PLATFORM EXPERIENCE PROTOCOL: GOVERNANCE */}
      <ExecutiveSurface className="p-4 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
          <ShieldCheck className="w-4 h-4 text-success" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Governança da Camada de Distribuição & Regras Fiduciárias
          </ExecutiveText>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2 bg-surface-container/30 rounded border border-border/30">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span>Certificação Mandatória de Advisors</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-surface-container/30 rounded border border-border/30">
            <DollarSign className="w-3.5 h-3.5 text-success" />
            <span>Split de Receita Auditável por Ledger</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-surface-container/30 rounded border border-border/30">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>Exclusividade Territorial por Região/Setor</span>
          </div>
        </div>
      </ExecutiveSurface>

      {/* 3. PLATFORM EXPERIENCE PROTOCOL: METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdvisorCertificationCard cert={mockCert} />
        <TerritoryMapCard territory={mockTerritory} />
      </div>

      {/* 4. PLATFORM EXPERIENCE PROTOCOL: WORKSPACE */}
      <div className="space-y-4">
        <AIAdvisorRecommendationCard recommendation={mockRecommendation} />
        <PartnerMatchingCard distribution={mockDistribution} />
        <MarketplaceCatalogCard item={mockItem} />
      </div>

      {/* 5. PLATFORM EXPERIENCE PROTOCOL: EDITOR & REVENUE SHARING LEDGER */}
      <RevenueSplitLedgerCard revenueSplit={mockRevenueSplit} />

      {/* 6. PLATFORM EXPERIENCE PROTOCOL: AUDIT TRAIL */}
      <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-success" />
            <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
              Audit Trail de Distribuição (Hash: {mockRevenueSplit.ledgerHash})
            </ExecutiveText>
          </div>
          <span className="text-xs text-muted-foreground">Log: <strong className="text-success font-mono">DISTRIBUTION_SPLIT_SUCCESS</strong></span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
