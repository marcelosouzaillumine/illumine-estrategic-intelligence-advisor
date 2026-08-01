import React from 'react';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExecutiveInsightCardProps {
  text: string;
  author?: string;
  date?: string;
  className?: string;
  variant?: 'section' | 'float';
}

export function ExecutiveInsightCard({ text, author, date, className, variant = 'section' }: ExecutiveInsightCardProps) {
  if (variant === 'float') {
    return (
      <div className={cn("p-4 md:p-6 bg-[#0A0A0B]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl relative", className)}>
        <Quote className="w-6 h-6 text-white/10 absolute top-4 left-4" />
        <div className="pl-6">
          <p className="text-sm font-medium text-slate-300 leading-relaxed mb-4">
            "{text}"
          </p>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Executive Insight</span>
            {(author || date) && (
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                {author && <span className="text-slate-300">{author}</span>}
                {author && date && <span>•</span>}
                {date && <span>{date}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("py-12 md:py-20 flex justify-center", className)}>
      <div className="max-w-2xl text-center relative px-6">
        <Quote className="w-8 h-8 md:w-12 md:h-12 text-white/5 absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2" />
        <h3 className="text-xl md:text-3xl font-medium text-slate-300 leading-relaxed md:leading-relaxed" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
          "{text}"
        </h3>
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-[1px] bg-white/10" />
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Executive Insight</span>
            <div className="w-8 h-[1px] bg-white/10" />
          </div>
          {(author || date) && (
             <div className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-2">
               {author && <span className="text-slate-300">{author}</span>}
               {author && date && <span>•</span>}
               {date && <span>{date}</span>}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
