import React from 'react';
import { cn } from '@/lib/utils';

interface InstitutionalSectionProps {
  id?: string;
  className?: string;
  variant?: 'dark' | 'darker' | 'glow';
  children: React.ReactNode;
}

export function InstitutionalSection({
  id,
  className,
  variant = 'dark',
  children
}: InstitutionalSectionProps) {
  const bgClasses = {
    dark: 'bg-[#0A0A0B]',
    darker: 'bg-[#050506]',
    glow: 'bg-[#0A0A0B] relative overflow-hidden'
  };

  return (
    <section 
      id={id} 
      className={cn(
        "py-32 md:py-40 relative border-t border-white/5",
        bgClasses[variant],
        className
      )}
    >
      {variant === 'glow' && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0A0A0B] to-[#0A0A0B] z-0 pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
