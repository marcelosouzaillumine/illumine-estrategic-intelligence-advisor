import React from 'react';
import { RuntimeConfidence } from '../../runtime/types';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ConsolidatedConfidenceBadge({ confidence }: { confidence: RuntimeConfidence }) {
  const isHigh = confidence === 'HIGH';
  const isMedium = confidence === 'MEDIUM';
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest w-fit",
      isHigh ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
      isMedium ? "bg-amber-50 text-amber-600 border-amber-200" :
      "bg-rose-50 text-rose-600 border-rose-200"
    )}>
      {isHigh && <ShieldCheck size={14} />}
      {isMedium && <AlertTriangle size={14} />}
      {!isHigh && !isMedium && <ShieldAlert size={14} />}
      Confiança Narrativa: {confidence}
    </div>
  );
}
