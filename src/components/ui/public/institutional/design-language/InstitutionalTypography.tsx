import React from 'react';
import { cn } from '@/lib/utils';
import { semanticTokens } from '../tokens/semantic/institutionalSemanticTokens';
import { physicalTokens } from '../tokens/physical/institutionalTokens';

// Tipografia Base
interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

const getStylesFromToken = (token: any, align: string = 'left') => {
  return {
    fontSize: token.scale.fontSize,
    lineHeight: token.scale.lineHeight,
    letterSpacing: token.scale.tracking,
    fontWeight: token.weight,
    color: token.color,
    textTransform: token.textTransform || 'none',
    fontStyle: token.fontStyle || 'normal',
    textAlign: align as any,
    fontFamily: physicalTokens.typography.fontFamily.sans,
  };
};

export function HeroTitle({ children, align, className, ...props }: TypographyProps) {
  return (
    <h1 
      style={getStylesFromToken(semanticTokens.typography.hero.title, align)} 
      className={cn("mb-6", className)} 
      {...props}
    >
      {children}
    </h1>
  );
}

export function HeroLead({ children, align, className, ...props }: TypographyProps) {
  return (
    <p 
      style={getStylesFromToken(semanticTokens.typography.hero.lead, align)} 
      className={cn("mb-12 max-w-[720px] mx-auto", className)} 
      {...props}
    >
      {children}
    </p>
  );
}

export function SectionLabel({ children, align, className, ...props }: TypographyProps) {
  return (
    <span 
      style={getStylesFromToken(semanticTokens.typography.section.label, align)} 
      className={cn("block mb-4", className)} 
      {...props}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children, align, className, ...props }: TypographyProps) {
  return (
    <h2 
      style={getStylesFromToken(semanticTokens.typography.section.title, align)} 
      className={cn("mb-8", className)} 
      {...props}
    >
      {children}
    </h2>
  );
}

export function SectionLead({ children, align, className, ...props }: TypographyProps) {
  return (
    <p 
      style={getStylesFromToken(semanticTokens.typography.section.lead, align)} 
      className={cn("mb-12 max-w-[800px]", align === 'center' ? 'mx-auto' : '', className)} 
      {...props}
    >
      {children}
    </p>
  );
}
