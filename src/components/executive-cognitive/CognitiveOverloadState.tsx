import React from 'react';
import { useExecutiveCognitive } from '../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { ShieldAlert } from 'lucide-react';

export function CognitiveOverloadState() {
  const { cognitiveLoad, compressionMode, setCompressionMode } = useExecutiveCognitive();

  if (cognitiveLoad !== 'SATURATED') {
    return null;
  }

  return (
    <div className="card-premium p-6 border border-amber-500/25 bg-warning-soft0/5 rounded-xl space-y-4 animate-executive-fade leading-relaxed">
      <div className="flex items-start gap-3">
        <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-foreground font-display uppercase tracking-wider">Carga Cognitiva Saturada</h4>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Múltiplos fluxos e sinais concorrentes de governança foram detectados simultaneamente. O motor de proteção cognitiva recomendou a simplificação do detalhamento visual para evitar fadiga de decisão.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-2 text-[10px] font-bold uppercase tracking-wider">
        {compressionMode !== 'board' && (
          <button
            onClick={() => setCompressionMode('board')}
            className="px-3 py-1 bg-warning-soft0/10 border border-amber-500/35 text-amber-400 rounded hover:bg-warning-soft0/20 transition-colors"
          >
            Ativar Board Mode (Máxima Compressão)
          </button>
        )}
        {compressionMode !== 'cfo' && (
          <button
            onClick={() => setCompressionMode('cfo')}
            className="px-3 py-1 bg-surface-container border border-border text-muted-foreground rounded hover:bg-surface-container/80 hover:text-foreground transition-colors"
          >
            Ativar CFO Mode (Visão de Resumos)
          </button>
        )}
      </div>
    </div>
  );
}
