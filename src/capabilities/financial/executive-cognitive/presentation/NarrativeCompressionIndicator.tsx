import React from 'react';
import { useExecutiveCognitive } from '../../../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { ListCollapse } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function NarrativeCompressionIndicator() {
  const { compressionMode, setCompressionMode } = useExecutiveCognitive();

  const options: { id: typeof compressionMode; label: string }[] = [
    { id: 'board', label: 'Conselho (Board)' },
    { id: 'cfo', label: 'CFO' },
    { id: 'advisor', label: 'Assessor' },
    { id: 'operational', label: 'Operacional' }
  ];

  return (
    <div className="flex items-center gap-4 bg-surface-container/60 border border-border/80 px-4 py-2 rounded-xl text-xs font-semibold">
      <div className="flex items-center gap-2 text-muted-foreground">
        <ListCollapse size={14} />
        <span>Compressão Narrativa:</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => setCompressionMode(opt.id)}
            className={cn(
              "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all border",
              compressionMode === opt.id
                ? "bg-secondary text-secondary-foreground border-secondary"
                : "bg-background border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
