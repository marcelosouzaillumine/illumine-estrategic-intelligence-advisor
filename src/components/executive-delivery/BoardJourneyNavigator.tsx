import React from 'react';
import { ArrowLeft, ArrowRight, X, Maximize2, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BoardJourneyNavigatorProps {
  currentStepIndex: number;
  totalSteps: number;
  currentStepTitle: string;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  onToggleEvidence: () => void;
  evidenceModeActive: boolean;
  className?: string;
}

export function BoardJourneyNavigator({
  currentStepIndex,
  totalSteps,
  currentStepTitle,
  onNext,
  onPrev,
  onExit,
  onToggleEvidence,
  evidenceModeActive,
  className
}: BoardJourneyNavigatorProps) {
  return (
    <div className={cn("bg-slate-900 text-white rounded-full px-6 py-3 shadow-2xl border border-slate-800 flex items-center justify-between gap-6", className)}>
      
      {/* Title / Info */}
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600/30 text-indigo-400 p-2 rounded-full border border-indigo-500/20">
          <Maximize2 size={14} className="animate-pulse" />
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Jornada do Conselho</span>
          <span className="text-xs font-bold text-slate-100">{currentStepTitle}</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onPrev}
          disabled={currentStepIndex === 0}
          className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={16} />
        </button>

        <span className="text-xs font-black text-slate-400 tracking-wider">
          {currentStepIndex + 1} <span className="text-[10px] text-slate-600">/</span> {totalSteps}
        </span>

        <button 
          onClick={onNext}
          disabled={currentStepIndex === totalSteps - 1}
          className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Toggle Evidence Mode */}
        <button
          onClick={onToggleEvidence}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
            evidenceModeActive 
              ? "bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400"
              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
          )}
        >
          <Layers size={12} />
          <span>EVIDÊNCIAS</span>
        </button>

        {/* Exit Journey */}
        <button 
          onClick={onExit}
          className="p-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors"
          title="Sair da Apresentação"
        >
          <X size={16} />
        </button>
      </div>

    </div>
  );
}
