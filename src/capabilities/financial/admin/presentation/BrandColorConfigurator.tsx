/**
 * EVCA-EBIL-002 — BrandColorConfigurator Component
 * 
 * Section 2 of Partner Brand Configuration Console.
 * Sanitized & Internationalized.
 */

import React, { useMemo } from 'react';
import { ColorTokenGenerator } from '../../../../core/brand/ColorTokenGenerator';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Palette, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export interface BrandColorConfiguratorProps {
  brandPrimaryColor: string;
  onChange: (color: string) => void;
}

const EXECUTIVE_PRESET_PALETTES = [
  { namePt: 'Illumine Navy', nameEn: 'Illumine Navy', hex: '#0E1C2C' },
  { namePt: 'Azul Oceano', nameEn: 'Ocean Blue', hex: '#0284C7' },
  { namePt: 'Verde Esmeralda', nameEn: 'Emerald Teal', hex: '#0D9488' },
  { namePt: 'Violeta Profundo', nameEn: 'Deep Violet', hex: '#7C3AED' },
  { namePt: 'Cinza Corporativo', nameEn: 'Corporate Slate', hex: '#334155' },
  { namePt: 'Vermelho Executivo', nameEn: 'Executive Crimson', hex: '#991B1B' }
];

export const BrandColorConfigurator: React.FC<BrandColorConfiguratorProps> = ({
  brandPrimaryColor,
  onChange
}) => {
  const { language } = useLanguage();
  const isEn = language.startsWith('en');

  const derivedTokens = useMemo(() => {
    const validHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(brandPrimaryColor)
      ? brandPrimaryColor
      : '#0E1C2C';
    return ColorTokenGenerator.generateTokens(validHex);
  }, [brandPrimaryColor]);

  const contrastMetrics = useMemo(() => {
    const primaryRgb = ColorTokenGenerator.hexToRgb(derivedTokens.brandPrimary);
    const onPrimaryRgb = ColorTokenGenerator.hexToRgb(derivedTokens.brandOnPrimary);
    const ratio = ColorTokenGenerator.calculateContrastRatio(primaryRgb, onPrimaryRgb);
    return {
      ratio: ratio.toFixed(2),
      isCompliant: ratio >= 4.5
    };
  }, [derivedTokens]);

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6" data-testid="brand-color-configurator">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-executive-primary/10 rounded-lg text-executive-primary">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {isEn ? 'Institutional Primary Color' : 'Cor Institucional Primária'}
            </h3>
            <p className="text-xs text-executive-secondary">
              {isEn
                ? 'Defines partner brand highlight tone under canonical EBIL rules.'
                : 'Define o tom de destaque institucional do parceiro sob regras canônicas do EBIL.'}
            </p>
          </div>
        </div>

        {/* WCAG Compliance Badge */}
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
          contrastMetrics.isCompliant
            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-700 border-amber-500/30'
        }`}>
          {contrastMetrics.isCompliant ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              {isEn ? `WCAG 2.1 AA Compliant (${contrastMetrics.ratio}:1)` : `Conforme WCAG 2.1 AA (${contrastMetrics.ratio}:1)`}
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              {isEn ? `Low Contrast (${contrastMetrics.ratio}:1)` : `Contraste Baixo (${contrastMetrics.ratio}:1)`}
            </>
          )}
        </div>
      </div>

      {/* Picker & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color Input */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-foreground">
            {isEn ? 'Institutional HEX Code' : 'Código HEX Institucional'}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={derivedTokens.brandPrimary}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded-lg border border-input cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={brandPrimaryColor}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#0066CC"
              className="flex-1 px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground font-mono uppercase"
            />
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {isEn
              ? '* The system automatically derives 6 semantic variations (hover, active, subtle, border, and on-primary) ensuring universal legibility.'
              : '* O sistema derivará automaticamente 6 variações semânticas (hover, active, subtle, border e on-primary) garantindo legibilidade universal.'}
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-foreground">
            {isEn ? 'Recommended Executive Palette' : 'Paleta Executiva Recomendada'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {EXECUTIVE_PRESET_PALETTES.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                onClick={() => onChange(preset.hex)}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  brandPrimaryColor.toUpperCase() === preset.hex.toUpperCase()
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                    : 'border-border hover:border-muted-foreground/40 bg-surface/50'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: preset.hex }}
                />
                <span className="text-xs font-medium text-foreground truncate">
                  {isEn ? preset.nameEn : preset.namePt}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Derived Tokens Live Cards */}
      <div className="flex flex-col gap-2 pt-2 border-t border-border">
        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          {isEn ? 'Tokens Derived by ColorTokenGenerator' : 'Tokens Derivados pelo ColorTokenGenerator'}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <div className="p-2.5 rounded-lg border border-border flex flex-col gap-1 text-center" style={{ backgroundColor: derivedTokens.brandPrimary, color: derivedTokens.brandOnPrimary }}>
            <span className="text-[10px] font-bold opacity-80">{isEn ? 'PRIMARY' : 'PRIMÁRIO'}</span>
            <span className="text-xs font-mono font-semibold">{derivedTokens.brandPrimary}</span>
          </div>

          <div className="p-2.5 rounded-lg border border-border flex flex-col gap-1 text-center" style={{ backgroundColor: derivedTokens.brandPrimaryHover, color: derivedTokens.brandOnPrimary }}>
            <span className="text-[10px] font-bold opacity-80">HOVER</span>
            <span className="text-xs font-mono font-semibold">{derivedTokens.brandPrimaryHover}</span>
          </div>

          <div className="p-2.5 rounded-lg border border-border flex flex-col gap-1 text-center" style={{ backgroundColor: derivedTokens.brandPrimaryActive, color: derivedTokens.brandOnPrimary }}>
            <span className="text-[10px] font-bold opacity-80">ACTIVE</span>
            <span className="text-xs font-mono font-semibold">{derivedTokens.brandPrimaryActive}</span>
          </div>

          <div className="p-2.5 rounded-lg border border-border flex flex-col gap-1 text-center bg-surface text-foreground" style={{ borderLeftColor: derivedTokens.brandPrimary, borderLeftWidth: 4 }}>
            <span className="text-[10px] font-bold text-muted-foreground">{isEn ? 'SUBTLE' : 'SUBTIL'}</span>
            <span className="text-[10px] font-mono truncate">{derivedTokens.brandPrimarySubtle}</span>
          </div>

          <div className="p-2.5 rounded-lg border flex flex-col gap-1 text-center bg-surface text-foreground" style={{ borderColor: derivedTokens.brandPrimaryBorder }}>
            <span className="text-[10px] font-bold text-muted-foreground">{isEn ? 'BORDER' : 'BORDA'}</span>
            <span className="text-[10px] font-mono truncate">{derivedTokens.brandPrimaryBorder}</span>
          </div>

          <div className="p-2.5 rounded-lg border border-border flex flex-col gap-1 text-center bg-surface text-foreground">
            <span className="text-[10px] font-bold text-muted-foreground">{isEn ? 'ON PRIMARY' : 'SOBRE PRIMÁRIO'}</span>
            <span className="text-xs font-mono font-semibold">{derivedTokens.brandOnPrimary}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
