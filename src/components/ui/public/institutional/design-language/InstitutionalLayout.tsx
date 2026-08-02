import React from 'react';
import { cn } from '@/lib/utils';
import { semanticTokens } from '../tokens/semantic/institutionalSemanticTokens';

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageFrame({ children, className, ...props }: LayoutProps) {
  return (
    <div 
      className={cn("min-h-screen flex flex-col bg-[#0A0A0B]", className)} 
      {...props}
    >
      {children}
    </div>
  );
}

export function Container({ children, className, ...props }: LayoutProps) {
  return (
    <div 
      className={cn("mx-auto px-6 w-full")} 
      style={{ maxWidth: semanticTokens.layout.maxWidth.container }}
      {...props}
    >
      <div className={className}>{children}</div>
    </div>
  );
}

export function Section({ children, className, ...props }: LayoutProps) {
  return (
    <section 
      className={cn("py-24 md:py-32 relative", className)} 
      {...props}
    >
      {children}
    </section>
  );
}

export function Hero({ children, className, ...props }: LayoutProps) {
  return (
    <section 
      className={cn("pt-20 pb-16 md:pt-24 md:pb-20 relative", className)} 
      {...props}
    >
      {children}
    </section>
  );
}

interface ReadingContentProps extends LayoutProps {
  rhythm?: 'compact' | 'comfortable' | 'editorial';
}

export function ReadingContent({ children, rhythm = 'editorial', className, ...props }: ReadingContentProps) {
  const rhythmClass = {
    compact: 'space-y-4',
    comfortable: 'space-y-6',
    editorial: 'space-y-8',
  }[rhythm];

  return (
    <div 
      className={cn("mx-auto", rhythmClass, className)} 
      style={{ maxWidth: semanticTokens.layout.maxWidth.reading }}
      {...props}
    >
      {children}
    </div>
  );
}
