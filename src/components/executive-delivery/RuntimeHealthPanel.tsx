import React from 'react';
import { Activity, ShieldAlert, CheckCircle, Database } from 'lucide-react';
import { ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
import { cn } from '../../lib/utils';

interface RuntimeHealthPanelProps {
  report: ExecutiveIntelligenceReport;
  className?: string;
}

export function RuntimeHealthPanel({ report, className }: RuntimeHealthPanelProps) {
  if (!report) return null;

  const { compliance, runtimeMetadata } = report;

  const getConfidenceStyle = (level: string) => {
    switch (level) {
      case 'HIGH_CONFIDENCE':
        return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Alta Confiança fiduciária' };
      case 'MEDIUM_CONFIDENCE':
        return { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Média Confiança' };
      case 'LOW_CONFIDENCE':
        return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', label: 'Degradação / Baixa Confiança' };
      default:
        return { text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200', label: 'Não Determinado' };
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'FULL_FINANCIAL_VIEW':
        return 'Visão Financeira Completa (BP + DRE)';
      case 'PARTIAL_FINANCIAL_VIEW':
        return 'Visão Financeira Parcial';
      case 'BALANCE_SHEET_ONLY':
        return 'Apenas Balanço Patrimonial (BP)';
      case 'DRE_ONLY':
        return 'Apenas DRE';
      case 'CASHFLOW_ONLY':
        return 'Apenas Fluxo de Caixa';
      default:
        return mode;
    }
  };

  const conf = getConfidenceStyle(compliance.confidenceLevel);

  return (
    <div className={cn("bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-6">
        <Activity className="text-slate-400" size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Integridade de Execução do Runtime</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Confidence Level */}
        <div className={cn("rounded-2xl p-4 border flex flex-col justify-between", conf.bg, conf.border)}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Grau de Confiança</span>
            {compliance.confidenceLevel === 'HIGH_CONFIDENCE' ? (
              <CheckCircle className="text-emerald-500" size={16} />
            ) : (
              <ShieldAlert className={conf.text} size={16} />
            )}
          </div>
          <div className="mt-4">
            <p className={cn("text-lg font-black tracking-tight", conf.text)}>
              {conf.label}
            </p>
            <p className="text-[10px] font-medium text-slate-500 mt-1">
              Profundidade Causal: {compliance.causalDepth}
            </p>
          </div>
        </div>

        {/* Completeness */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Completude Contábil</span>
            <Database className="text-slate-400" size={16} />
          </div>
          <div className="mt-4">
            <p className="text-lg font-black text-slate-800 tracking-tight">
              {(compliance.dataCompleteness * 100).toFixed(1)}%
            </p>
            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all" 
                style={{ width: `${compliance.dataCompleteness * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Runtime Mode */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Modo de Operação</span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block animate-pulse" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-black text-slate-800 tracking-tight leading-snug">
              {getModeLabel(compliance.runtimeMode)}
            </p>
            <p className="text-[9px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Trace ID: {((runtimeMetadata as any)?.importId || runtimeMetadata?.executionId) ? String((runtimeMetadata as any)?.importId || runtimeMetadata?.executionId).slice(0, 12) + '...' : 'EXEC-N/A'}
            </p>
          </div>
        </div>

      </div>

      {/* Warnings & Restrictions */}
      {compliance.narrativeRestrictions && compliance.narrativeRestrictions.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
          <p className="text-[9px] font-bold text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <ShieldAlert size={12} />
            Políticas de Supressão & Restrições Narrativas
          </p>
          <ul className="space-y-1 text-[11px] font-semibold text-amber-900/80 list-disc list-inside">
            {compliance.narrativeRestrictions.map((restriction, idx) => (
              <li key={idx}>{restriction}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
