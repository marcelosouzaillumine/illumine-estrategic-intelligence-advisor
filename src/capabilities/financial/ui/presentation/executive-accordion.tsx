import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { cn } from '@/lib/utils';

export type ExecutiveAccordionVariant = 'default' | 'technical' | 'risk' | 'analytics';

export interface ExecutiveAccordionProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  variant?: ExecutiveAccordionVariant;
  defaultExpanded?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Padrão Oficial (Illumine Governance™) para Painéis Expansíveis Executivos
 * Centraliza a arquitetura visual, métricas e grid de accordions transversais.
 */
export function ExecutiveAccordion({
  icon,
  title,
  subtitle,
  variant = 'default',
  defaultExpanded = false,
  className,
  children,
}: ExecutiveAccordionProps) {
  
  // Base variant logic can be expanded here if needed
  // For now, variants enforce a semantic contract without necessarily changing the base layout
  const variantStyles: Record<ExecutiveAccordionVariant, string> = {
    default: "bg-card border-border",
    technical: "bg-card border-border",
    risk: "bg-card border-border",
    analytics: "bg-card border-border",
  };

  return (
    <details 
      className={cn(
        "group border rounded-[32px] open:shadow-2xl open:shadow-slate-200/40 transition-all duration-500 mb-12 overflow-hidden",
        variantStyles[variant],
        className
      )}
      open={defaultExpanded}
    >
      <summary 
        className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-surface-container/30 transition-colors select-none"
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className="text-executive-secondary group-open:text-executive-primary transition-colors flex items-center justify-center [&>svg]:w-[22px] [&>svg]:h-[22px]">
              {React.isValidElement(icon) ? icon : (typeof icon === 'function' || typeof icon === 'object' ? React.createElement(icon as any, { size: 22 }) : null)}
            </div>
          )}
          <div className="flex flex-col">
            <ExecutiveHeading as="h3" variant="moduleTitle" className="group-open:text-primary transition-colors">
              {title}
            </ExecutiveHeading>
            {subtitle && (
              <ExecutiveText as="p" variant="moduleSubtitle" className="mt-1.5">
                {subtitle}
              </ExecutiveText>
            )}
          </div>
        </div>
        <div className="text-executive-secondary group-open:rotate-180 group-open:text-executive-primary transition-all duration-300 ml-4 flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container/50 flex-shrink-0">
          <ChevronDown size={24} strokeWidth={2.5} />
        </div>
      </summary>
      
      <div className="p-8 border-t border-border bg-surface-container/30">
        {children}
      </div>
    </details>
  );
}
