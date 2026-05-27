import React from 'react';
import { Layers, Shield, Hash, Server, Calendar, Cpu } from 'lucide-react';
import { BoardEvidenceData } from '../../core/executive-delivery/GuidedBoardJourneyRuntime';
import { cn } from '../../lib/utils';

interface ExecutiveEvidenceViewerProps {
  evidence: BoardEvidenceData;
  className?: string;
}

export function ExecutiveEvidenceViewer({ evidence, className }: ExecutiveEvidenceViewerProps) {
  if (!evidence) return null;

  return (
    <div className={cn("bg-amber-950/95 border border-amber-800 text-amber-100 rounded-3xl p-6 shadow-2xl backdrop-blur-md max-w-lg w-full", className)}>
      <div className="flex items-center justify-between pb-4 border-b border-amber-800/60 mb-6">
        <div className="flex items-center gap-2">
          <Layers className="text-amber-400" size={20} />
          <h3 className="text-sm font-black uppercase tracking-widest text-amber-400">
            BOARD_EVIDENCE_MODE
          </h3>
        </div>
        <span className="text-[9px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
          Auditoria Ativa
        </span>
      </div>

      <p className="text-[11px] font-semibold text-amber-200/70 mb-6 leading-relaxed">
        Evidências e metadados de lineage extraídos fiduciariamente da execução oficial do runtime. Nenhuma interpretação local de regras foi realizada sobre estes dados.
      </p>

      <div className="space-y-4">
        {/* Dataset Hash */}
        <div className="flex items-start gap-3 p-3 bg-amber-950/40 rounded-xl border border-amber-900/40">
          <Hash className="text-amber-400 mt-0.5" size={14} />
          <div>
            <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-wider block">Lineage Dataset Hash</span>
            <span className="text-xs font-mono font-bold select-all break-all text-amber-200">
              {evidence.datasetHash}
            </span>
          </div>
        </div>

        {/* Execution Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-amber-950/40 rounded-xl border border-amber-900/40">
            <Cpu className="text-amber-400 mt-0.5" size={14} />
            <div>
              <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-wider block">Calibration Profile</span>
              <span className="text-xs font-bold text-amber-200">
                {evidence.calibrationProfile}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-950/40 rounded-xl border border-amber-900/40">
            <Shield className="text-amber-400 mt-0.5" size={14} />
            <div>
              <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-wider block">Confiança</span>
              <span className="text-xs font-bold text-amber-200">
                {evidence.confidenceLevel}
              </span>
            </div>
          </div>
        </div>

        {/* System Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-amber-950/40 rounded-xl border border-amber-900/40">
            <Server className="text-amber-400 mt-0.5" size={14} />
            <div>
              <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-wider block">Execution ID</span>
              <span className="text-xs font-mono font-bold select-all break-all text-amber-200">
                {evidence.executionId.slice(0, 14)}...
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-950/40 rounded-xl border border-amber-900/40">
            <Calendar className="text-amber-400 mt-0.5" size={14} />
            <div>
              <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-wider block">Data da Execução</span>
              <span className="text-xs font-bold text-amber-200">
                {new Date(evidence.timestamp).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Flags */}
        {evidence.auditFlags && evidence.auditFlags.length > 0 && (
          <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-900/40">
            <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-wider block mb-2">Audit Flags Detectadas</span>
            <div className="flex flex-wrap gap-1.5">
              {evidence.auditFlags.map((flag, idx) => (
                <span key={idx} className="text-[9px] bg-amber-900/60 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
