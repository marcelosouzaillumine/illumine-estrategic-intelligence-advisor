import React from 'react';
import { cn } from '@/lib/utils';
import { semanticTokens } from '../tokens/semantic/institutionalSemanticTokens';
import { physicalTokens } from '../tokens/physical/institutionalTokens';
import { SectionLead, SectionTitle } from '../design-language/InstitutionalTypography';
import { ReadingContent } from '../design-language/InstitutionalLayout';

interface StrategicProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * ManifestoText: Used for the core manifesto of the platform.
 * Features an editorial rhythm (wider spacing) and a slightly larger body font if needed.
 */
export function ManifestoText({ children, className, ...props }: StrategicProps) {
  return (
    <ReadingContent rhythm="editorial" className={cn("text-lg", className)} {...props}>
      {children}
    </ReadingContent>
  );
}

/**
 * Narrative: Used for storytelling sequences. 
 * Comfortable rhythm.
 */
export function Narrative({ children, className, ...props }: StrategicProps) {
  return (
    <ReadingContent rhythm="comfortable" className={className} {...props}>
      {children}
    </ReadingContent>
  );
}

/**
 * Insight: A highlighted strategic insight, typically standing out from the body text.
 */
export function Insight({ children, className, ...props }: StrategicProps) {
  return (
    <div 
      className={cn(
        "p-8 md:p-12 border-l-4 border-amber-500 bg-white/[0.02]", 
        className
      )}
      {...props}
    >
      <p 
        className="text-xl md:text-2xl font-medium text-white leading-relaxed"
        style={{ fontFamily: physicalTokens.typography.fontFamily.sans }}
      >
        {children}
      </p>
    </div>
  );
}

export interface ExecutiveQuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  children: React.ReactNode;
}

/**
 * ExecutiveQuote: A quote from leadership, advisory board, or market references.
 */
export function ExecutiveQuote({ children, className, ...props }: ExecutiveQuoteProps) {
  return (
    <blockquote 
      className={cn("text-2xl md:text-4xl font-medium text-white italic leading-tight max-w-[48ch]", className)}
      style={{ fontFamily: physicalTokens.typography.fontFamily.sans }}
      {...props}
    >
      "{children}"
    </blockquote>
  );
}
