import React from 'react';
import { useExecutiveCognitive } from '../../../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { Compass, BookOpen, Layers } from 'lucide-react';

export function ExecutiveFocusPanel() {
  const { focusHierarchy, compressedOutput, compressionMode } = useExecutiveCognitive();

  if (!focusHierarchy) {
    return (
      <div className="card-premium p-8 text-center italic text-muted-foreground animate-executive-fade">
        Aguardando resolução de relatórios executivos fiduciários...
      </div>
    );
  }

  return (
    <div className="card-premium p-8 bg-card/45 backdrop-blur-md border border-border/60 space-y-8 animate-executive-fade leading-relaxed">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
            <Compass size={18} />
          </div>
          <div>
            <h3 className="text-h3 font-display font-medium tracking-tight text-foreground">Narrativa Executiva Comprimida</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Focus Mode: {compressionMode} active</p>
          </div>
        </div>
        {compressedOutput && (
          <div className="text-right">
            <span className="px-2.5 py-0.5 bg-secondary/15 text-secondary text-[9px] font-black uppercase tracking-wider rounded border border-secondary/25">
              {compressedOutput.compressionMode}
            </span>
          </div>
        )}
      </div>

      {/* Levels 1-5 Structured Hierarchy Pacing */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-1.5 p-4 rounded-xl bg-secondary/5 border border-secondary/10">
          <span className="text-[9px] font-black uppercase tracking-widest text-secondary block">Level 1 — Immediate Executive Concern</span>
          <p className="text-xs text-foreground font-semibold leading-relaxed">{focusHierarchy.level1}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Level 2 — Structural Cause</span>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{focusHierarchy.level2}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Level 3 — Operational Consequence</span>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{focusHierarchy.level3}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Level 4 — Strategic Impact</span>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{focusHierarchy.level4}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Level 5 — Recommended Action</span>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{focusHierarchy.level5}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
