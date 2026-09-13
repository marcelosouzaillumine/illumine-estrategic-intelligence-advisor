/**
 * EVCA-EBIL-002 — PartnerBrandConfigurationPage Component
 * 
 * Main Administration Page: "Administração -> Identidade Institucional"
 * (EBIL Administration Console)
 * 
 * Fully Sanitized, Race-Condition Free, & Internationalized.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { TenantBrandConfig } from '../../core/brand/BrandBoundaryContract';
import { BrandIdentityResolver } from '../../core/brand/BrandIdentityResolver';
import { BrandIdentityForm } from '../../capabilities/financial/admin/presentation/BrandIdentityForm';
import { BrandColorConfigurator } from '../../capabilities/financial/admin/presentation/BrandColorConfigurator';
import { BrandIdentityPreview } from '../../capabilities/financial/admin/presentation/BrandIdentityPreview';
import { BrandPublicationWorkflow } from '../../capabilities/financial/admin/presentation/BrandPublicationWorkflow';
import { useLanguage } from '../../contexts/LanguageContext';
import { Building2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface FeedbackBanner {
  type: 'success' | 'error';
  text: string;
}

export const PartnerBrandConfigurationPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language.startsWith('en');

  const [selectedTenantId, setSelectedTenantId] = useState('tenant-acme-001');
  const [tenantConfig, setTenantConfig] = useState<TenantBrandConfig>(() => {
    return BrandIdentityResolver.resolve('tenant-acme-001') as TenantBrandConfig;
  });

  const [feedback, setFeedback] = useState<FeedbackBanner | null>(null);

  const availableTenants = BrandIdentityResolver.getAvailableTenants();

  // Auto-dismiss feedback banner after 4 seconds
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleSelectTenant = useCallback((id: string) => {
    setSelectedTenantId(id);
    const resolved = BrandIdentityResolver.resolve(id);
    if ('tenantId' in resolved) {
      setTenantConfig(resolved);
      setFeedback(null);
    }
  }, []);

  const handleConfigChange = useCallback((updated: Partial<TenantBrandConfig>) => {
    setTenantConfig(prev => ({
      ...prev,
      ...updated
    }));
  }, []);

  const handleFormError = useCallback((errorMsg: string) => {
    setFeedback({ type: 'error', text: errorMsg });
  }, []);

  const handleSaveDraft = useCallback(() => {
    BrandIdentityResolver.registerTenantBrand({
      ...tenantConfig,
      status: 'draft'
    });
    setFeedback({
      type: 'success',
      text: isEn
        ? 'Draft saved successfully in partner governance.'
        : 'Rascunho salvo com sucesso na governança do parceiro.'
    });
  }, [tenantConfig, isEn]);

  const handlePublishSuccess = useCallback((published: TenantBrandConfig) => {
    BrandIdentityResolver.registerTenantBrand(published);
    setTenantConfig(published);
    setFeedback({
      type: 'success',
      text: isEn
        ? `Institutional brand of '${published.organizationName}' successfully published to EBIL!`
        : `Identidade institucional de '${published.organizationName}' publicada com sucesso no EBIL!`
    });
  }, [isEn]);

  return (
    <div className="w-full min-h-screen bg-background text-foreground p-6 md:p-10 flex flex-col gap-8 max-w-7xl mx-auto" data-testid="partner-brand-configuration-page">
      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-md transition-all animate-in fade-in slide-in-from-top-2 ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'
            : 'bg-destructive/10 border-destructive/30 text-destructive'
        }`}>
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Executive Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-muted-foreground mb-1">
            <span>{isEn ? 'Administration' : 'Administração'}</span>
            <span>/</span>
            <span className="text-primary font-semibold">
              {isEn ? 'Institutional Identity' : 'Identidade Institucional'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-primary" /> Executive Brand Configuration Console
          </h1>
          <p className="text-sm text-executive-secondary mt-1">
            {isEn
              ? 'EBIL Administration Console — Institutional Identity configuration without canonical visual architecture alteration.'
              : 'EBIL Administration Console — Configuração da Identidade Institucional sem alteração da arquitetura visual canônica.'}
          </p>
        </div>

        {/* Multi-Tenant Simulation Selector */}
        <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-xl shadow-xs">
          <label className="text-xs font-semibold text-muted-foreground whitespace-nowrap px-1">
            {isEn ? 'Simulate Partner:' : 'Simular Parceiro:'}
          </label>
          <select
            value={selectedTenantId}
            onChange={(e) => handleSelectTenant(e.target.value)}
            className="text-xs font-medium bg-background border border-input rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
          >
            {availableTenants.filter(t => t.id !== 'platform-core').map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Forms & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form, Color Configurator, & Workflow (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <BrandIdentityForm
            config={tenantConfig}
            onChange={handleConfigChange}
            onError={handleFormError}
          />

          <BrandColorConfigurator
            brandPrimaryColor={tenantConfig.brandPrimaryColor}
            onChange={(color) => handleConfigChange({ brandPrimaryColor: color })}
          />

          <BrandPublicationWorkflow
            config={tenantConfig}
            onSaveDraft={handleSaveDraft}
            onPublishSuccess={handlePublishSuccess}
          />
        </div>

        {/* Right Column: Live Real UI Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <BrandIdentityPreview
            config={tenantConfig}
            className="sticky top-6"
          />
        </div>
      </div>
    </div>
  );
};
