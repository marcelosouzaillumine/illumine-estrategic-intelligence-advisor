import React from 'react';
import { cn } from '@/lib/utils';
import { semanticTokens } from '../tokens/semantic/institutionalSemanticTokens';
import { physicalTokens } from '../tokens/physical/institutionalTokens';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'accent';
  children: React.ReactNode;
}

export function Surface({ variant = 'primary', className, children, ...props }: SurfaceProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return semanticTokens.surface.primary;
      case 'secondary': return semanticTokens.surface.secondary;
      case 'tertiary': return semanticTokens.surface.tertiary;
      case 'accent': return 'rgba(245, 158, 11, 0.1)'; // Amber 500 at 10%
      default: return semanticTokens.surface.primary;
    }
  };

  return (
    <div 
      className={cn("rounded-2xl border", className)}
      style={{
        backgroundColor: getBackgroundColor(),
        borderColor: variant === 'accent' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardProps extends SurfaceProps {
  hoverable?: boolean;
}

export function Card({ hoverable = false, className, children, ...props }: CardProps) {
  return (
    <Surface 
      className={cn(
        "p-8 md:p-12 transition-all duration-300", 
        hoverable ? "hover:border-white/20 hover:-translate-y-1 shadow-lg" : "",
        className
      )}
      {...props}
    >
      {children}
    </Surface>
  );
}

export function Divider({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr 
      className={cn("border-t border-white/5 my-12", className)} 
      {...props}
    />
  );
}
