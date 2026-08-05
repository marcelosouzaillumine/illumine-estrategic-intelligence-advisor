import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ConciergeOptionCardProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function ConciergeOptionCard({ label, onClick, icon }: ConciergeOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-[#121214] hover:bg-[#1A1A1D] border border-white/5 hover:border-amber-500/30 transition-all group shadow-sm"
    >
      <div className="flex items-center gap-3">
        {icon && <div className="text-slate-500 group-hover:text-amber-500 transition-colors">{icon}</div>}
        <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
    </button>
  );
}
