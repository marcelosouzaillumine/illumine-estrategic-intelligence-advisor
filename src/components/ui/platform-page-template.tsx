import React from 'react';
import { cn } from '../../lib/utils';
import { PageHeader, PageHeaderProps } from './page-header';

export interface PlatformPageTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  header: PageHeaderProps;
  children: React.ReactNode;
}

/**
 * PlatformPageTemplate — Componente Canônico do Platform Render Protocol
 * Wave 18.3 (PWGE v1.0 / ADR-077)
 *
 * Enquadra páginas do Platform Workspace (Registration Experience: Clientes, Parceiros, Usuários, Controladoria)
 * garantindo o isolamento absoluto em relação ao Executive Workspace.
 */
export function PlatformPageTemplate({
  header,
  children,
  className,
  ...props
}: PlatformPageTemplateProps) {
  return (
    <div className={cn("max-w-[1440px] mx-auto space-y-8 pb-24 animate-executive-fade", className)} {...props}>
      <PageHeader {...header} />
      
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
}
