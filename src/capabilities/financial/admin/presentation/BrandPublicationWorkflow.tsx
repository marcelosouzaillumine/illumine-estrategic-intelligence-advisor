/**
 * EVCA-EBIL-002 — BrandPublicationWorkflow Component
 * 
 * Section 4 of Partner Brand Configuration Console.
 * Race-Condition Free & Internationalized.
 * Workflow: DRAFT → VALIDATING → APPROVED → PUBLISHED
 */

import React, { useState, useEffect, useRef } from 'react';
import { TenantBrandConfig } from '../../../../core/brand/BrandBoundaryContract';
import { BrandGovernanceValidator } from '../../../../core/brand/BrandGovernanceValidator';
import { EBILRuntimeEngine } from '../../../../core/brand/EBILRuntimeEngine';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { AlertTriangle, ShieldCheck, Send, RefreshCw, FileText } from 'lucide-react';

export interface BrandPublicationWorkflowProps {
  config: TenantBrandConfig;
  onSaveDraft: () => void;
  onPublishSuccess: (updated: TenantBrandConfig) => void;
}

export const BrandPublicationWorkflow: React.FC<BrandPublicationWorkflowProps> = ({
  config,
  onSaveDraft,
  onPublishSuccess
}) => {
  const { language } = useLanguage();
  const isEn = language.startsWith('en');

  const [currentStatus, setCurrentStatus] = useState<'draft' | 'approved' | 'published'>(config.status || 'draft');
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    setCurrentStatus(config.status || 'draft');
    return () => {
      isMountedRef.current = false;
    };
  }, [config.tenantId, config.status]);

  const runValidation = () => {
    setIsValidating(true);
    setValidationErrors([]);
    setValidationWarnings([]);

    // Race-condition free async validation execution
    setTimeout(() => {
      if (!isMountedRef.current) return;

      const result = BrandGovernanceValidator.validate(config as unknown as Record<string, unknown>);
      setIsValidating(false);

      if (result.valid) {
        setCurrentStatus('approved');
        setValidationWarnings(result.warnings);
      } else {
        setValidationErrors(result.errors);
      }
    }, 400);
  };

  const handlePublish = () => {
    const result = BrandGovernanceValidator.validate(config as unknown as Record<string, unknown>);
    if (!result.valid) {
      setValidationErrors(result.errors);
      return;
    }

    // Apply to EBIL Runtime Engine live safely
    EBILRuntimeEngine.applyBrand(config.tenantId);

    const publishedConfig: TenantBrandConfig = {
      ...config,
      status: 'published'
    };

    setCurrentStatus('published');
    onPublishSuccess(publishedConfig);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6" data-testid="brand-publication-workflow">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-executive-primary/10 rounded-lg text-executive-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {isEn ? 'Validation & Publication Workflow' : 'Validação & Workflow de Publicação'}
            </h3>
            <p className="text-xs text-executive-secondary">
              {isEn
                ? 'Institutional brand approval workflow under EBIL governance rules.'
                : 'Workflow de homologação de marca institucional sob regras de governança do EBIL.'}
            </p>
          </div>
        </div>

        {/* Status Stepper Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            currentStatus === 'published'
              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
              : currentStatus === 'approved'
              ? 'bg-blue-500/10 text-blue-700 border-blue-500/30'
              : 'bg-amber-500/10 text-amber-700 border-amber-500/30'
          }`}>
            Status: {currentStatus}
          </span>
        </div>
      </div>

      {/* Stepper Visualization */}
      <div className="grid grid-cols-4 gap-2">
        <div className={`p-3 rounded-lg border flex flex-col gap-1 text-center ${currentStatus === 'draft' ? 'border-amber-500 bg-amber-500/5' : 'border-border bg-surface/40'}`}>
          <span className="text-[10px] font-bold text-muted-foreground">{isEn ? 'STEP 1' : 'ETAPA 1'}</span>
          <span className="text-xs font-semibold text-foreground">{isEn ? 'Draft' : 'Rascunho'}</span>
        </div>

        <div className={`p-3 rounded-lg border flex flex-col gap-1 text-center ${isValidating ? 'border-blue-500 bg-blue-500/10 animate-pulse' : 'border-border bg-surface/40'}`}>
          <span className="text-[10px] font-bold text-muted-foreground">{isEn ? 'STEP 2' : 'ETAPA 2'}</span>
          <span className="text-xs font-semibold text-foreground">{isEn ? 'Validation' : 'Validação'}</span>
        </div>

        <div className={`p-3 rounded-lg border flex flex-col gap-1 text-center ${currentStatus === 'approved' ? 'border-blue-500 bg-blue-500/5' : 'border-border bg-surface/40'}`}>
          <span className="text-[10px] font-bold text-muted-foreground">{isEn ? 'STEP 3' : 'ETAPA 3'}</span>
          <span className="text-xs font-semibold text-foreground">{isEn ? 'Approved' : 'Homologado'}</span>
        </div>

        <div className={`p-3 rounded-lg border flex flex-col gap-1 text-center ${currentStatus === 'published' ? 'border-emerald-500 bg-emerald-500/10' : 'border-border bg-surface/40'}`}>
          <span className="text-[10px] font-bold text-muted-foreground">{isEn ? 'STEP 4' : 'ETAPA 4'}</span>
          <span className="text-xs font-semibold text-foreground">{isEn ? 'Published' : 'Publicado'}</span>
        </div>
      </div>

      {/* Validation Messages */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-destructive font-semibold text-xs">
            <AlertTriangle className="w-4 h-4" /> {isEn ? 'Publication Block (Governance Violations):' : 'Bloqueio de Publicação (Erros de Governança):'}
          </div>
          <ul className="text-xs text-destructive space-y-1 list-disc list-inside">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {validationWarnings.length > 0 && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4" /> {isEn ? 'Accessibility Warnings (Recommendations):' : 'Avisos de Acessibilidade (Recomendações):'}
          </div>
          <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
            {validationWarnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <button
          type="button"
          onClick={onSaveDraft}
          className="px-4 py-2 text-xs font-semibold text-foreground border border-border rounded-lg hover:bg-surface transition-all flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" /> {isEn ? 'Save Draft' : 'Salvar Rascunho'}
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={runValidation}
            disabled={isValidating}
            className="px-4 py-2 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} /> {isEn ? 'Validate Governance' : 'Validar Governança'}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isValidating || validationErrors.length > 0}
            className="px-5 py-2 text-xs font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> {isEn ? 'Publish Identity' : 'Publicar Identidade'}
          </button>
        </div>
      </div>
    </div>
  );
};
