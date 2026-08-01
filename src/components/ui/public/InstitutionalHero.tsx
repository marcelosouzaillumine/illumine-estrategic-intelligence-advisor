import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';

interface InstitutionalHeroProps {
  tagline?: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  showScrollIndicator?: boolean;
}

export function InstitutionalHero({
  tagline,
  title,
  subtitle,
  description,
  children,
  showScrollIndicator = false
}: InstitutionalHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#050506]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {tagline && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-sm">
            <span className="text-sm font-medium text-slate-300 tracking-widest uppercase">{tagline}</span>
          </div>
        )}
        
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
          {title}
        </h1>
        
        <p className="text-3xl md:text-5xl font-medium text-slate-300 mb-16">
          {subtitle}
        </p>
        
        {description && (
          <div className="max-w-3xl mx-auto space-y-6 text-xl md:text-2xl text-slate-500 font-medium">
            {description}
          </div>
        )}

        {children}

        {showScrollIndicator && (
          <div className="animate-bounce mt-20 flex justify-center">
            <ArrowDown className="text-amber-500 w-8 h-8 opacity-50" />
          </div>
        )}
      </div>
    </section>
  );
}
