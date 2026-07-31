import React from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstitutionalShowcaseProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  maxHeight?: string; // Limit height so it doesn't take the full screen
}

export function InstitutionalShowcase({ 
  children, 
  title = "Live Platform Preview",
  className,
  maxHeight = "max-h-[70vh]"
}: InstitutionalShowcaseProps) {
  return (
    <div className={cn("relative w-full rounded-2xl md:rounded-3xl border border-white/10 bg-[#0A0A0B] shadow-2xl overflow-hidden", className)}>
      
      {/* Top Bar */}
      <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/5">
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-slate-700/50" />
          <div className="w-3 h-3 rounded-full bg-slate-700/50" />
          <div className="w-3 h-3 rounded-full bg-slate-700/50" />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              {title}
            </span>
          </div>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className={cn("overflow-hidden relative bg-[#060606] p-4 md:p-8", maxHeight)}>
        {/* Subtle Gradient Overlay at the bottom to indicate more content if scrollable */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#060606] to-transparent pointer-events-none z-20" />
        
        {/* The actual component */}
        <div className="h-full overflow-hidden pointer-events-none opacity-90 hover:opacity-100 transition-opacity duration-700 origin-top">
          {children}
        </div>
      </div>
      
    </div>
  );
}
