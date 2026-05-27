import React from 'react';
import { Calendar, GitCommit, Link, Play } from 'lucide-react';
import { ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
import { cn } from '../../lib/utils';

interface DeliveryTimelinePanelProps {
  report: ExecutiveIntelligenceReport;
  className?: string;
}

export function DeliveryTimelinePanel({ report, className }: DeliveryTimelinePanelProps) {
  if (!report) return null;

  const trajectories = report.temporalCausality?.trajectories || [];

  return (
    <div className={cn("bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="text-slate-400" size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evolução Temporal & Trajetórias Contábeis</span>
      </div>

      {trajectories.length === 0 ? (
        <div className="py-8 text-center text-xs font-medium text-slate-400 italic">
          Nenhuma trajetória temporal encontrada nos registros históricos do runtime.
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
          {trajectories.map((traj, idx) => (
            <div key={traj.snapshotId || idx} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Período: {traj.period}
                  </span>
                  <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md border border-slate-200/50">
                    Snap ID: {traj.snapshotId}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                  <div className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Score Financeiro</span>
                    <span className="text-sm font-black text-slate-800">{traj.financialScore}</span>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Score Operacional</span>
                    <span className="text-sm font-black text-slate-800">{traj.operationalScore}</span>
                  </div>
                </div>

                <div className="mt-3 bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Caminho de Propagação</span>
                  <p className="text-[11px] font-mono font-bold text-slate-600">
                    {traj.propagationPath && traj.propagationPath.length > 0
                      ? traj.propagationPath.join(' → ')
                      : 'Sem propagação estrutural registrada'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
