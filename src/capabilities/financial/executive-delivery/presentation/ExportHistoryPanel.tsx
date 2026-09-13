import React from 'react';
import { History, Download, ShieldCheck, Hash } from 'lucide-react';
import { ExportSnapshotMetadata } from '../../../../core/exporting/ExportTypes';
import { cn } from '../../../../lib/utils';
import { useExecutiveFormatter } from '../../../../core/localization';

interface ExportHistoryPanelProps {
  exports: ExportSnapshotMetadata[];
  onDownloadReport?: (metadata: ExportSnapshotMetadata) => void;
  className?: string;
}

export function ExportHistoryPanel({ exports, onDownloadReport, className }: ExportHistoryPanelProps) {
  const formatter = useExecutiveFormatter();
  return (
    <div className={cn("bg-white border border-border rounded-[32px] p-6 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-6">
        <History className="text-muted-foreground" size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Histórico de Board Packs Emitidos</span>
      </div>

      {exports.length === 0 ? (
        <div className="py-8 text-center text-xs font-medium text-muted-foreground italic">
          Nenhum relatório foi exportado para este tenant até o momento.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 font-black">Export ID / Data</th>
                <th className="pb-3 font-black">Lineage Hash</th>
                <th className="pb-3 font-black">Calibração</th>
                <th className="pb-3 font-black">Confiança</th>
                <th className="pb-3 font-black text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-muted-foreground">
              {exports.map((exp) => (
                <tr key={exp.exportId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <span className="font-mono text-[11px] block text-muted-foreground select-all">{exp.exportId}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold block mt-0.5">
                      {formatter.date(exp.timestamp)}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-[10px] text-muted-foreground max-w-[150px] truncate" title={exp.lineageHash}>
                    {exp.lineageHash}
                  </td>
                  <td className="py-4 uppercase text-muted-foreground">
                    {exp.calibrationProfile}
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider font-black",
                      exp.confidenceSnapshot === 'HIGH_CONFIDENCE' 
                        ? "bg-success-soft text-emerald-700 border-emerald-100"
                        : exp.confidenceSnapshot === 'MEDIUM_CONFIDENCE'
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-critical-soft text-rose-700 border-rose-100"
                    )}>
                      {exp.confidenceSnapshot.replace('_CONFIDENCE', '')}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {onDownloadReport && (
                      <button
                        onClick={() => onDownloadReport(exp)}
                        className="p-2 rounded-lg bg-accent border border-accent text-accent hover:bg-accent hover:text-accent transition-all inline-flex items-center gap-1.5"
                        title="Baixar Cópia do PDF"
                      >
                        <Download size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
