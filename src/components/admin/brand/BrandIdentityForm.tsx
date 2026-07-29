/**
 * EVCA-EBIL-002 — BrandIdentityForm Component
 * 
 * Section 1 of Partner Brand Configuration Console.
 * Sanitized & Internationalized.
 */

import React, { useState, useEffect } from 'react';
import { TenantBrandConfig } from '../../../core/brand/BrandBoundaryContract';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Building2, Upload, Link2, Mail, AlertCircle } from 'lucide-react';

export interface BrandIdentityFormProps {
  config: TenantBrandConfig;
  onChange: (updated: Partial<TenantBrandConfig>) => void;
  onError?: (msg: string) => void;
}

const ALLOWED_MIME_TYPES = [
  'image/svg+xml',
  'image/png',
  'image/jpeg',
  'image/x-icon',
  'image/vnd.microsoft.icon'
];

export const BrandIdentityForm: React.FC<BrandIdentityFormProps> = ({
  config,
  onChange,
  onError
}) => {
  const { language } = useLanguage();
  const isEn = language.startsWith('en');

  const [logoLightPreview, setLogoLightPreview] = useState(config.logoLight || '');
  const [logoDarkPreview, setLogoDarkPreview] = useState(config.logoDark || '');

  useEffect(() => {
    setLogoLightPreview(config.logoLight || '');
    setLogoDarkPreview(config.logoDark || '');
  }, [config.logoLight, config.logoDark]);

  const handleFileUpload = (
    field: 'logoLight' | 'logoDark' | 'favicon',
    e: React.ChangeEvent<HTMLInputElement>,
    setPreviewFn: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Sanitize file type
    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.name.endsWith('.svg') && !file.name.endsWith('.png') && !file.name.endsWith('.ico')) {
      const msg = isEn
        ? 'Invalid file format. Only SVG, PNG, JPEG, or ICO files are allowed.'
        : 'Formato de arquivo inválido. Apenas arquivos SVG, PNG, JPEG ou ICO são permitidos.';
      if (onError) onError(msg);
      return;
    }

    // 2. Sanitize file size (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      const msg = isEn
        ? 'Maximum file size allowed is 2MB.'
        : 'Tamanho máximo permitido para o arquivo é 2MB.';
      if (onError) onError(msg);
      return;
    }

    // 3. Asynchronous FileReader with memory cleanup
    const reader = new FileReader();
    let isCancelled = false;

    reader.onload = (evt) => {
      if (isCancelled) return;
      const result = evt.target?.result as string;
      setPreviewFn(result);
      onChange({ [field]: result });
    };

    reader.readAsDataURL(file);

    return () => {
      isCancelled = true;
    };
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6" data-testid="brand-identity-form">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-executive-primary/10 rounded-lg text-executive-primary">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {isEn ? 'Institutional Identity' : 'Identidade Institucional'}
          </h3>
          <p className="text-xs text-executive-secondary">
            {isEn
              ? 'Configuration of organization name and official visual marks.'
              : 'Configuração do nome da organização e marcas visuais oficiais.'}
          </p>
        </div>
      </div>

      {/* Organization Name */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          {isEn ? 'Organization Name' : 'Nome da Organização'} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={config.organizationName || ''}
          onChange={(e) => onChange({ organizationName: e.target.value })}
          placeholder={isEn ? 'e.g. Acme Corporate Governance' : 'Ex: Acme Corporate Governance'}
          className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Logo Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logo Light */}
        <div className="flex flex-col gap-2 p-4 border border-border rounded-lg bg-surface/50">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>{isEn ? 'Main Logo (Light Background)' : 'Logo Principal (Fundo Claro)'}</span>
            <span className="text-[10px] text-muted-foreground">SVG / PNG (Max 2MB)</span>
          </label>

          <div className="h-16 w-full border border-dashed border-border rounded-md flex items-center justify-center p-2 bg-white relative overflow-hidden">
            {logoLightPreview ? (
              <img src={logoLightPreview} alt="Logo Light Preview" className="h-full max-h-12 w-auto object-contain" />
            ) : (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> {isEn ? 'No logo loaded' : 'Nenhuma logo carregada'}
              </span>
            )}
          </div>

          <label className="cursor-pointer text-xs font-medium text-primary hover:underline flex items-center gap-1 justify-center py-1">
            <Upload className="w-3.5 h-3.5" /> {isEn ? 'Upload file' : 'Carregar arquivo'}
            <input
              type="file"
              accept="image/svg+xml,image/png,image/jpeg"
              onChange={(e) => handleFileUpload('logoLight', e, setLogoLightPreview)}
              className="hidden"
            />
          </label>
        </div>

        {/* Logo Dark */}
        <div className="flex flex-col gap-2 p-4 border border-border rounded-lg bg-surface/50">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>{isEn ? 'Alternate Logo (Dark Background)' : 'Logo Alternativo (Fundo Escuro)'}</span>
            <span className="text-[10px] text-muted-foreground">SVG / PNG (Max 2MB)</span>
          </label>

          <div className="h-16 w-full border border-dashed border-border rounded-md flex items-center justify-center p-2 bg-slate-950 relative overflow-hidden">
            {logoDarkPreview ? (
              <img src={logoDarkPreview} alt="Logo Dark Preview" className="h-full max-h-12 w-auto object-contain" />
            ) : (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> {isEn ? 'No dark logo' : 'Nenhuma logo alternativa'}
              </span>
            )}
          </div>

          <label className="cursor-pointer text-xs font-medium text-primary hover:underline flex items-center gap-1 justify-center py-1">
            <Upload className="w-3.5 h-3.5" /> {isEn ? 'Upload file' : 'Carregar arquivo'}
            <input
              type="file"
              accept="image/svg+xml,image/png,image/jpeg"
              onChange={(e) => handleFileUpload('logoDark', e, setLogoDarkPreview)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Favicon & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Favicon */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-foreground">
            {isEn ? 'Favicon (Tab Icon)' : 'Favicon (Ícone de Aba)'}
          </label>
          <input
            type="text"
            value={config.favicon || ''}
            onChange={(e) => onChange({ favicon: e.target.value })}
            placeholder="/favicon.ico"
            className="w-full px-3 py-2 text-xs border border-input rounded-lg bg-background text-foreground"
          />
        </div>

        {/* Support URL */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5 text-muted-foreground" /> {isEn ? 'Institutional Support URL' : 'Link de Suporte Institucional'}
          </label>
          <input
            type="text"
            value={config.supportUrl || ''}
            onChange={(e) => onChange({ supportUrl: e.target.value })}
            placeholder="https://partner.com/support"
            className="w-full px-3 py-2 text-xs border border-input rounded-lg bg-background text-foreground"
          />
        </div>

        {/* Institutional Email */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {isEn ? 'Contact Email' : 'E-mail de Contato'}
          </label>
          <input
            type="email"
            value={config.institutionalEmail || ''}
            onChange={(e) => onChange({ institutionalEmail: e.target.value })}
            placeholder="governance@partner.com"
            className="w-full px-3 py-2 text-xs border border-input rounded-lg bg-background text-foreground"
          />
        </div>
      </div>
    </div>
  );
};
