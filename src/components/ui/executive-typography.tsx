import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// 1. Executive Typography Registry
// Focado em estrutura de leitura e hierarquia de página.
// ============================================================================

export const ExecutiveTypographyRegistry = {
  pageTitle: "text-[30px] md:text-[36px] font-bold leading-tight tracking-tight text-executive-primary",
  sectionTitle: "text-[24px] md:text-[28px] font-bold leading-tight tracking-tight text-executive-primary",
  moduleTitle: "text-[20px] md:text-[22px] font-semibold leading-snug text-executive-primary",
  moduleSubtitle: "text-[14px] md:text-[15px] font-normal leading-snug text-executive-secondary",
  submoduleTitle: "text-[16px] md:text-[18px] font-semibold leading-snug text-executive-primary",
  bodyLarge: "text-[15px] md:text-[16px] font-normal leading-relaxed text-executive-primary",
  bodyStandard: "text-[14px] font-normal leading-relaxed text-executive-secondary",
  caption: "text-[12px] font-medium leading-normal text-slate-700 dark:text-slate-200",
  metricDescription: "text-[13px] md:text-[14px] font-medium leading-relaxed text-slate-700 dark:text-slate-200",
  metricMeta: "text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300",
  metricConfidence: "text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300",
  microLabel: "text-[11px] font-semibold leading-normal text-slate-700 dark:text-slate-300 uppercase tracking-wider",
  
  // Legacy aliases for backward compatibility (will be phased out progressively)
  body: "text-[14px] font-normal leading-relaxed text-executive-secondary", 
  bodyStrong: "text-[14px] font-bold leading-relaxed text-executive-primary",
  cardTitle: "text-[20px] md:text-[22px] font-semibold leading-snug text-executive-primary", 
  pageSubtitle: "text-[15px] md:text-[16px] font-normal leading-relaxed text-executive-primary", 
  sectionSubtitle: "text-[15px] md:text-[16px] font-normal leading-relaxed text-executive-primary", 
  label: "text-[11px] font-medium leading-normal text-executive-muted uppercase tracking-wider", 
  metricLabel: "text-[13px] md:text-[14px] font-medium text-executive-secondary",
  
  // Inverse Variants (For Highlight modes)
  metricLabelInverse: "text-[13px] md:text-[14px] font-medium text-executive-inverse-secondary",
  metricDescriptionInverse: "text-[13px] md:text-[14px] font-normal leading-relaxed text-executive-inverse-secondary",
  captionInverse: "text-[12px] font-normal leading-normal text-executive-inverse-secondary",
  metricConfidenceInverse: "text-[11px] font-medium uppercase tracking-wider text-executive-inverse-muted",
  metricMetaInverse: "text-[11px] font-medium uppercase tracking-wider text-executive-inverse-muted",
} as const;

export type ExecutiveTypographyRole = keyof typeof ExecutiveTypographyRegistry;

// ============================================================================
// 2. Executive Metric Registry
// Focado na clareza e autoridade de dados, indicadores e pontuações.
// ============================================================================

export const ExecutiveMetricRegistry = {
  heroMetric: "text-[38px] md:text-[44px] font-extrabold text-executive-primary tracking-tight",
  metricValue: "text-[28px] md:text-[32px] font-bold text-executive-primary",
  metricLabel: "text-[13px] md:text-[14px] font-medium text-executive-secondary",
  
  // Legacy aliases
  metricCompact: "text-[24px] font-semibold text-executive-primary",
  metricUnit: "text-[16px] font-bold text-executive-secondary",
  metricMeta: "text-[11px] font-medium uppercase tracking-wider text-executive-muted",
  metricMetaValue: "text-[11px] font-bold uppercase tracking-wider text-executive-primary",
  metricConfidence: "text-[11px] font-bold uppercase tracking-wider text-executive-primary",
  
  // Inverse Variants (For Highlight modes)
  metricMetaValueInverse: "text-[11px] font-bold uppercase tracking-wider text-executive-inverse-muted",
  metricConfidenceInverse: "text-[11px] font-bold uppercase tracking-wider text-executive-inverse-muted",
} as const;

export type ExecutiveMetricRole = keyof typeof ExecutiveMetricRegistry;

// ============================================================================
// 3. Executive Spacing Registry
// Focado em separações, respiros e blocos.
// ============================================================================

export const ExecutiveSpacingRegistry = {
  sectionGap: "gap-12",
  cardPadding: "p-6 md:p-8",
  cardPaddingCompact: "p-4",
  contentGap: "gap-6",
  blockGap: "gap-8",
  elementGap: "gap-1.5",
  microGap: "gap-0.5"
} as const;

export type ExecutiveSpacingRole = keyof typeof ExecutiveSpacingRegistry;

// ============================================================================
// Helpers
// ============================================================================

/**
 * Sanitiza as classes passadas para os componentes tipográficos.
 * Remove tentativas de sobrescrita local (hardcodes) que violam a Constituição Visual Executiva.
 * Permite cores (text-critical), layout (flex), margin, etc.
 */
export function stripExecutiveTypographyOverrides(className?: string): string {
  if (!className) return '';
  return className
    .split(/\s+/)
    .filter(cls => {
      // Bloqueia classes de tamanho (text-sm, text-[20px], etc) mas permite cores (text-primary)
      const isTextSize = /^text-(xs|sm|base|lg|xl|[2-9]xl|\[.*?\])$/.test(cls);
      // Bloqueia qualquer font-weight (font-bold, font-[600])
      const isFontWeight = /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[.*?\])$/.test(cls);
      // Bloqueia leading (line-height)
      const isLeading = /^leading-/.test(cls);
      // Bloqueia tracking (letter-spacing)
      const isTracking = /^tracking-/.test(cls);
      // Bloqueia transformações textuais explícitas
      const isTransform = ['uppercase', 'lowercase', 'capitalize', 'normal-case'].includes(cls);
      
      return !(isTextSize || isFontWeight || isLeading || isTracking || isTransform);
    })
    .join(' ');
}

/**
 * Retorna as classes Tailwind padronizadas para uma tipografia textual canônica.
 */
export function getExecutiveTypography(variant: ExecutiveTypographyRole, className?: string): string {
  return cn(ExecutiveTypographyRegistry[variant], stripExecutiveTypographyOverrides(className));
}

/**
 * Retorna as classes Tailwind padronizadas para uma métrica canônica.
 */
export function getExecutiveMetric(variant: ExecutiveMetricRole, className?: string): string {
  return cn(ExecutiveMetricRegistry[variant], stripExecutiveTypographyOverrides(className));
}

// ============================================================================
// Componentes Wrapper (Opcional, para facilitar a adoção progressiva)
// ============================================================================

export interface ExecutiveTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant: ExecutiveTypographyRole;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export const ExecutiveText = React.forwardRef<HTMLElement, ExecutiveTextProps>(
  ({ variant, className, as: Component = 'p', children, ...props }, ref) => {
    return (
      <Component ref={ref as any} className={getExecutiveTypography(variant, className)} {...props}>
        {children}
      </Component>
    );
  }
);
ExecutiveText.displayName = 'ExecutiveText';

export interface ExecutiveMetricProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: ExecutiveMetricRole;
  as?: 'span' | 'div' | 'p';
}

export const ExecutiveMetric = React.forwardRef<HTMLElement, ExecutiveMetricProps>(
  ({ variant, className, as: Component = 'span', children, ...props }, ref) => {
    return (
      <Component ref={ref as any} className={getExecutiveMetric(variant, className)} {...props}>
        {children}
      </Component>
    );
  }
);
ExecutiveMetric.displayName = 'ExecutiveMetric';
