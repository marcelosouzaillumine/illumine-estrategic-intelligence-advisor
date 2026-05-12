import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';
import { SacerdotalPrinciple, getPrincipleById } from '../lib/sacerdotalIntelligence';
import { cn } from '../lib/utils';

interface SacerdotalInsightPanelProps {
  key?: React.Key;
  principleId: string;
  misalignment?: string;
  impact?: string;
  recommendation?: string;
  className?: string;
  compact?: boolean;
}

export function SacerdotalInsightPanel({ 
  principleId, 
  misalignment, 
  impact, 
  recommendation,
  className,
  compact = false
}: SacerdotalInsightPanelProps) {
  const principle = getPrincipleById(principleId);

  if (!principle) return null;

  if (compact) {
    return (
      <div className={cn("bg-amber-50 border border-amber-100 rounded-xl p-3 flex flex-col gap-2", className)}>
        <div className="flex items-center gap-2 text-amber-700">
          <BookOpen size={14} />
          <span className="text-xs font-black uppercase tracking-widest">{principle.name}</span>
          <span className="text-[10px] font-bold opacity-70 border-l border-amber-200 pl-2">({principle.reference})</span>
        </div>
        <p className="text-[10px] text-amber-900 font-medium leading-relaxed">
          {recommendation || principle.practicalRecommendations[0]}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-6 shadow-sm", className)}>
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl shrink-0">
          <BookOpen size={24} />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Princípio de {principle.axis}</h4>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-slate-800">{principle.name}</h3>
            <span className="text-[10px] bg-white px-2 py-1 rounded border border-amber-200 text-amber-700 font-bold">
              {principle.reference}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600 mt-1 italic">"{principle.description}"</p>
        </div>
      </div>

      <div className="space-y-4 bg-white/60 p-4 rounded-2xl border border-amber-50/50">
        {misalignment && (
          <div className="flex gap-3">
            <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Desalinhamento</p>
              <p className="text-xs font-bold text-slate-700">{misalignment}</p>
              {impact && <p className="text-[10px] text-slate-500 mt-1">Impacto: {impact}</p>}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recomendação Prática</p>
            <p className="text-xs font-bold text-slate-700">{recommendation || principle.practicalRecommendations[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
