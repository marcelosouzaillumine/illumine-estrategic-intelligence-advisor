import React from 'react';
import { cn } from '@/lib/utils';
import { PageHeader, PageHeaderProps } from './page-header';

export interface ExecutivePageTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  header: PageHeaderProps;
  children: React.ReactNode;
}

export function ExecutivePageTemplate({
  header,
  children,
  className,
  ...props
}: ExecutivePageTemplateProps) {
  return (
    <div className={cn("max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade", className)} {...props}>
      <PageHeader {...header} />
      
      <div className="space-y-12">
        {children}
      </div>
    </div>
  );
}
