import React from 'react';

interface MasterDetailLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const MasterDetailLayout: React.FC<MasterDetailLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-h1 font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-executive-secondary mt-1">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
};
