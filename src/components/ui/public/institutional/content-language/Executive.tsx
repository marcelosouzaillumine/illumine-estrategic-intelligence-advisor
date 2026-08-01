import React from 'react';
import { cn } from '@/lib/utils';
import { semanticTokens } from '../tokens/semantic/institutionalSemanticTokens';
import { physicalTokens } from '../tokens/physical/institutionalTokens';
import { CheckCircle2, AlertTriangle, Info, ArrowRight } from 'lucide-react';

interface ExecutiveProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Finding: A core discovery or diagnostic conclusion.
 */
export function Finding({ children, className, ...props }: ExecutiveProps) {
  return (
    <div className={cn("mb-6 flex items-start gap-4", className)} {...props}>
      <div className="mt-1">
        <Info className="w-5 h-5 text-amber-500" />
      </div>
      <p 
        className="text-lg md:text-xl font-medium text-white leading-relaxed"
        style={{ fontFamily: physicalTokens.typography.fontFamily.sans }}
      >
        {children}
      </p>
    </div>
  );
}

/**
 * Evidence: Data points, metrics, or factual backing for a finding.
 */
export function Evidence({ children, className, ...props }: ExecutiveProps) {
  return (
    <div className={cn("mb-8 pl-9", className)} {...props}>
      <p 
        className="text-base text-slate-400 leading-relaxed border-l-2 border-white/10 pl-4"
        style={{ fontFamily: physicalTokens.typography.fontFamily.sans }}
      >
        {children}
      </p>
    </div>
  );
}

/**
 * Recommendation: An actionable advisory statement.
 */
export function Recommendation({ children, className, ...props }: ExecutiveProps) {
  return (
    <div className={cn("p-6 bg-slate-900/50 border border-slate-800 rounded-lg flex items-start gap-4 mb-6", className)} {...props}>
      <div className="mt-1">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-emerald-500 uppercase tracking-widest mb-2">Recommendation</h4>
        <p 
          className="text-base text-slate-300 leading-relaxed"
          style={{ fontFamily: physicalTokens.typography.fontFamily.sans }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}

/**
 * Decision: A formalized decision point or strategic resolution.
 */
export function Decision({ children, className, ...props }: ExecutiveProps) {
  return (
    <div className={cn("p-6 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-4 mb-6", className)} {...props}>
      <div className="mt-1">
        <ArrowRight className="w-5 h-5 text-amber-500" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-widest mb-2">Decision Required</h4>
        <p 
          className="text-base text-white leading-relaxed font-medium"
          style={{ fontFamily: physicalTokens.typography.fontFamily.sans }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}
