import React from 'react';
import { cn } from '@/lib/utils';
import { getExecutiveTypography } from '../../../../components/ui/executive-typography';

export type ExecutiveBadgeVariant = "neutral" | "success" | "warning" | "attention" | "critical" | "info";

export interface ExecutiveBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ExecutiveBadgeVariant;
  as?: "span" | "div";
}

const variantStyles: Record<ExecutiveBadgeVariant, string> = {
  neutral: "bg-muted text-foreground border-border",
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning border-warning/20",
  attention: "bg-warning-soft text-warning border-warning/20",
  critical: "bg-critical-soft text-critical border-critical/20",
  info: "bg-muted text-foreground border-border", // @temporary: fallback to neutral until info-soft token is officially added
};

function sanitizeClassName(className?: string) {
  if (!className) return className;
  
  const forbiddenPatterns = [
    /^(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white|transparent)/,
    /^p[xy]?-/,
    /^rounded-/,
    /^h-/,
    /^min-h-/,
    /^font-/,
    /^leading-/,
    /^tracking-/,
  ];

  return className.split(' ').filter(cls => {
    if (cls === 'uppercase' || forbiddenPatterns.some(pattern => pattern.test(cls))) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ExecutiveBadge] Override sanitizado: '${cls}' foi bloqueado para proteger a integridade geométrica e cromática.`);
      }
      return false;
    }
    return true;
  }).join(' ');
}

function normalizeBadgeText(content: React.ReactNode): React.ReactNode {
  if (typeof content === 'string') {
    const normalized = content.trim().toUpperCase();
    if (normalized === 'AVALIAÇÃO NEUTRA') return 'NEUTRO';
    if (normalized === 'TESOURARIA POSITIVA') return 'POSITIVA';
    if (normalized === 'TESOURARIA NEGATIVA') return 'NEGATIVA';
  }
  return content;
}

/**
 * Componente canônico para tags e selos genéricos da Illumine Governance™.
 * Ele controla o peso tipográfico, background, borda e espaçamento de forma rígida
 * utilizando o token 'microLabel' por padrão.
 */
export const ExecutiveBadge = React.forwardRef<HTMLElement, ExecutiveBadgeProps>(
  ({ variant = "neutral", className, as: Component = "span", children, ...props }, ref) => {
    const displayChildren = normalizeBadgeText(children);

    return (
      <Component 
        ref={ref as any} 
        className={cn(
          getExecutiveTypography('microLabel'),
          "inline-flex items-center justify-center px-3 h-[22px] rounded-full border whitespace-nowrap min-w-[60px]",
          variantStyles[variant],
          sanitizeClassName(className)
        )} 
        {...props}
      >
        {displayChildren}
      </Component>
    );
  }
);

ExecutiveBadge.displayName = 'ExecutiveBadge';
