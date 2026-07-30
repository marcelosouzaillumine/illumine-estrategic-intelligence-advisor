import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { BrainCircuit, BookOpen, Database, Sparkles } from 'lucide-react';

export const InstitutionalMemoryCard: React.FC = () => {
  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-border/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-sm">Institutional Memory Triad (ILI v1.0)</h3>
        </div>
        <ExecutiveBadge variant="info" className="font-mono">Permanent Wisdom Active</ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-background/50 border border-border/30">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Episodic Memory</span>
          </div>
          <p className="text-muted-foreground text-[11px]">Registro histórico completo de decisões e resultados observados.</p>
        </div>

        <div className="p-2.5 rounded-lg bg-background/50 border border-border/30">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>Semantic Memory</span>
          </div>
          <p className="text-muted-foreground text-[11px]">Grafo de conhecimento causal e sabedoria consolidada da empresa.</p>
        </div>

        <div className="p-2.5 rounded-lg bg-background/50 border border-border/30">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Procedural Memory</span>
          </div>
          <p className="text-muted-foreground text-[11px]">Parâmetros e gatilhos de calibração operacional contínua.</p>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
