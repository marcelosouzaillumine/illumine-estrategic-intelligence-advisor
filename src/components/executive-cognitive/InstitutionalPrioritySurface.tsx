import React from 'react';
import { useExecutiveCognitive } from '../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { NarrativeCompressionIndicator } from './NarrativeCompressionIndicator';
import { SignalSaturationWarning } from './SignalSaturationWarning';
import { CognitiveOverloadState } from './CognitiveOverloadState';

interface InstitutionalPrioritySurfaceProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function InstitutionalPrioritySurface({ children, title, subtitle, actions }: InstitutionalPrioritySurfaceProps) {
  const { cognitiveLoad } = useExecutiveCognitive();

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade text-foreground leading-relaxed">
      
      {/* Visual pacing header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1.5 max-w-[70%]">
          <h1 className="text-h1 font-display font-medium tracking-tight text-primary">{title}</h1>
          {subtitle && <p className="text-body text-muted-foreground font-medium">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {actions}
          <NarrativeCompressionIndicator />
        </div>
      </div>

      {/* Cognitive status bar alerts */}
      <div className="space-y-4">
        <CognitiveOverloadState />
        <SignalSaturationWarning />
      </div>

      {/* Main Page Layout Grid */}
      <main className="space-y-8">
        {children}
      </main>
    </div>
  );
}
