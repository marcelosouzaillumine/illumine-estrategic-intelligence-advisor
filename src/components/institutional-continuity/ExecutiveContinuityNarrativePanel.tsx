import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';

interface ExecutiveContinuityNarrativePanelProps {
  survivalNarrative: string;
  recoveryNarrative: string;
  regressionNarrative: string;
  resilienceNarrative: string;
  confidenceLevel: string;
  failClosedTriggered: boolean;
}

export function ExecutiveContinuityNarrativePanel({
  survivalNarrative,
  recoveryNarrative,
  regressionNarrative,
  resilienceNarrative,
  confidenceLevel,
  failClosedTriggered
}: ExecutiveContinuityNarrativePanelProps) {

  const isLowConfidence = confidenceLevel === 'LOW';

  const narrativeBlocks = [
    { label: 'Survival Assessment', text: survivalNarrative, tag: 'ISHE' },
    { label: 'Recovery Status', text: recoveryNarrative, tag: 'IRRE' },
    { label: 'Regression Analysis', text: regressionNarrative, tag: 'RRG' },
    { label: 'Resilience & Antifragility', text: resilienceNarrative, tag: 'IRAE' }
  ].filter(block => block.text && block.text.trim().length > 0);

  const isWarningNarrative = (text: string): boolean => {
    const warningPatterns = ['ALERTA', 'CRÍTICO', 'CRITICAL', 'bloqueado', 'BLOCKED', 'regressão', 'fragilidade', 'suspens'];
    return warningPatterns.some(pattern => text.toLowerCase().includes(pattern.toLowerCase()));
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg w-full font-mono flex flex-col">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
        <FileText size={14} />
        Executive Continuity Narrative
      </h3>

      {failClosedTriggered && (
        <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Garantia Fiduciária Ativa</p>
            <p className="text-red-300/80 text-xs mt-1">As narrativas estão restritas devido a dados fiduciários inconsistentes ou incompletos.</p>
          </div>
        </div>
      )}

      <div className={`space-y-4 flex-1 ${isLowConfidence ? 'opacity-60' : ''}`}>
        {narrativeBlocks.map((block, idx) => {
          const hasWarning = isWarningNarrative(block.text);
          
          return (
            <div 
              key={idx} 
              className={`p-4 rounded border ${
                hasWarning 
                  ? 'border-orange-900/60 bg-orange-950/20' 
                  : 'border-zinc-800 bg-zinc-900/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                  hasWarning 
                    ? 'text-orange-400 border-orange-800 bg-orange-950/50' 
                    : 'text-zinc-500 border-zinc-700 bg-zinc-900/50'
                }`}>
                  {block.tag}
                </span>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${
                  hasWarning ? 'text-orange-300' : 'text-zinc-400'
                }`}>
                  {block.label}
                </span>
              </div>
              
              {/* Render-only: preserve line breaks, highlight warnings already tagged by runtime */}
              <div className="text-xs leading-relaxed text-zinc-300/90" style={{ fontFamily: "'IBM Plex Mono', 'Fira Code', monospace" }}>
                {block.text.split('\n').map((line, lineIdx) => {
                  const isAlertLine = line.includes('[ALERTA') || line.includes('⚠');
                  return (
                    <p key={lineIdx} className={`mb-1 ${isAlertLine ? 'text-red-400 font-bold' : ''}`}>
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}

        {narrativeBlocks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-zinc-600 text-xs">Nenhuma narrativa fiduciária disponível neste ciclo.</p>
          </div>
        )}
      </div>

      {isLowConfidence && (
        <div className="mt-3 p-2 bg-zinc-900 border border-zinc-800 rounded">
          <p className="text-[10px] text-zinc-500 text-center">
            ⚠ Confiança narrativa estrutural baixa. Avaliações operam em escopo prudencial.
          </p>
        </div>
      )}
    </div>
  );
}
