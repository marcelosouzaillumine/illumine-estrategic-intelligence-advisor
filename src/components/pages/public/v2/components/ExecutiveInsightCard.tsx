import React from 'react';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExecutiveInsightCardProps {
  text: string;
  author?: string;
  date?: string;
  className?: string;
}

export function ExecutiveInsightCard({ text, author, date, className }: ExecutiveInsightCardProps) {
  return (
    <div className={cn("py-12 md:py-20 flex justify-center", className)}>
      <div className="max-w-2xl text-center relative px-6">
        <Quote className="w-8 h-8 md:w-12 md:h-12 text-white/5 absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2" />
        <h3 className="text-xl md:text-3xl font-medium text-slate-300 leading-relaxed md:leading-relaxed" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
          "{text}"
        </h3>
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-[1px] bg-primary/30" />
            <span className="text-xs uppercase font-bold tracking-widest text-primary">Executive Insight</span>
            <div className="w-8 h-[1px] bg-primary/30" />
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
