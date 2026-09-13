/**
 * EVCA-EBIL-002 — BrandIdentityPreview Component
 * 
 * Section 3 of Partner Brand Configuration Console.
 * Real Canonical Component Instance Sandbox.
 * Internationalized & Sanitized.
 */

import React from 'react';
import { TenantBrandConfig } from '../../../../core/brand/BrandBoundaryContract';
import { BrandLogo } from '../../../../components/brand/BrandLogo';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Eye, ShieldCheck, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';

export interface BrandIdentityPreviewProps {
  config: TenantBrandConfig;
  className?: string;
}

export const BrandIdentityPreview: React.FC<BrandIdentityPreviewProps> = ({ config, className = '' }) => {
  const { language } = useLanguage();
  const isEn = language.startsWith('en');

  return (
    <div className={`bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6 ${className}`} data-testid="brand-identity-preview">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-executive-primary/10 rounded-lg text-executive-primary">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {isEn ? 'Real-Time Executive Preview' : 'Preview Executivo em Tempo Real'}
            </h3>
            <p className="text-xs text-executive-secondary">
              {isEn
                ? 'Real instance of platform canonical components with brand identity applied.'
                : 'Instância real dos componentes canônicos da plataforma com a identidade aplicada.'}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded bg-surface border border-border text-muted-foreground">
          Canonical UI Sandbox
        </span>
      </div>

      {/* Live Canonical UI Mock Surface */}
      <div className="border border-border rounded-xl overflow-hidden bg-background shadow-md">
        {/* Canonical Executive Header Mock */}
        <header className="h-14 px-6 bg-card border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo variant="header" showNameFallback={true} />
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span className="text-xs font-semibold text-executive-secondary hidden sm:inline-block">
              Governance Platform
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground truncate max-w-[140px]">
              {config.organizationName || (isEn ? 'Organization' : 'Organização')}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
              {(config.organizationName || 'GOV').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Canonical Dashboard Body Preview */}
        <div className="p-6 flex flex-col gap-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                {isEn ? 'Consolidated Governance Dashboard' : 'Painel Consolidado de Governabilidade'}
              </span>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                {isEn ? 'Strategic Executive Summary' : 'Resumo Executivo Estratégico'}
              </h2>
            </div>

            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs"
            >
              {isEn ? 'Export Report' : 'Exportar Relatório'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1 */}
            <ExecutiveSurface padding="md" radius="md" className="bg-card border border-border flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>{isEn ? 'Governance Index (IGF)' : 'Índice de Governança (IGF)'}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">94.8%</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +2.4%
                </span>
              </div>
              <span className="text-[11px] text-executive-secondary">
                {isEn ? 'Active statutory compliance.' : 'Conformidade estatutária ativa.'}
              </span>
            </ExecutiveSurface>

            {/* Card 2 */}
            <ExecutiveSurface padding="md" radius="md" className="bg-card border border-border flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>{isEn ? 'Controlled EBITDA Margin' : 'Margem EBITDA Controlada'}</span>
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">R$ 14.2M</span>
                <span className="text-xs font-semibold text-muted-foreground">{isEn ? 'target 2026' : 'meta 2026'}</span>
              </div>
              <span className="text-[11px] text-executive-secondary">
                {isEn ? 'Continuous strategic alignment.' : 'Alinhamento estratégico contínuo.'}
              </span>
            </ExecutiveSurface>

            {/* Card 3 - Institutional Highlight Accent */}
            <ExecutiveSurface padding="md" radius="md" className="bg-surface/80 border border-border flex flex-col gap-3 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>{isEn ? 'Institutional Partner' : 'Parceiro Institucional'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-base font-bold text-foreground truncate">
                {config.organizationName || (isEn ? 'Partner Name' : 'Nome do Parceiro')}
              </span>
              <span className="text-[11px] text-executive-secondary truncate">
                {config.institutionalEmail || (isEn ? 'EBIL Active Certification' : 'Certificação Ativa EBIL')}
              </span>
            </ExecutiveSurface>
          </div>
        </div>
      </div>
    </div>
  );
};
