import React from 'react';
import { Activity, ShieldAlert, DollarSign, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { ContinuitySection, TreasurySection, FiduciaryTimelineSection } from '../../../services/FiduciaryRuntimeAdapter';
import { useLanguage } from '../../../contexts/LanguageContext';
// src/components/pages/governance/ContinuityRiskPanel.tsx


interface ContinuityRiskPanelProps {
  continuityReport?: ContinuitySection;
  treasuryReport?: TreasurySection;
  fiduciaryTimeline?: FiduciaryTimelineSection;
}

export function ContinuityRiskPanel({ continuityReport, treasuryReport, fiduciaryTimeline }: ContinuityRiskPanelProps) {
  const { t } = useLanguage();

  const antfragilityScore = continuityReport?.antifragilityScore ?? 0;
  
  // Custom visual color for Antifragility
  const scoreColor = antfragilityScore >= 80 
    ? 'text-emerald-400 border-emerald-500/25 bg-success-soft0/5' 
    : antfragilityScore >= 50 
    ? 'text-amber-400 border-amber-500/25 bg-warning-soft0/5' 
    : 'text-rose-400 border-rose-500/25 bg-critical-soft0/5';

  return (
    <div className="p-6 rounded-[32px] border border-border dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/40 backdrop-blur-md space-y-6 shadow-xs">
      <div className="flex items-center gap-3 border-b border-border dark:border-white/5 pb-3">
        <Activity className="w-5 h-5 text-primary dark:text-primary" />
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-300">
          Riscos de Continuidade e Stress de Tesouraria
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Resilience and Continuity */}
        <div className="p-5 bg-slate-100/80 dark:bg-zinc-950/60 border border-border dark:border-zinc-900 rounded-2xl space-y-4 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500 block mb-1">
                Índice de Resiliência
              </span>
              <h4 className="text-sm font-bold text-muted-foreground dark:text-zinc-200">
                {continuityReport?.resilienceStatus || 'N/A'}
              </h4>
            </div>
            <div className={`px-3 py-1 rounded-lg border font-mono font-bold text-xs ${scoreColor}`}>
              Score: {antfragilityScore}
            </div>
          </div>

          {continuityReport?.survivalOverlays && continuityReport.survivalOverlays.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500 block">
                Overlays de Sobrevivência
              </span>
              <div className="flex flex-wrap gap-1.5">
                {continuityReport.survivalOverlays.map((overlay, idx) => (
                  <span key={idx} className="text-[9px] font-semibold px-2 py-0.5 bg-slate-200/50 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-muted-foreground dark:text-zinc-300 rounded shadow-xs">
                    {overlay}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Card: Treasury Stress */}
        <div className="p-5 bg-slate-100/80 dark:bg-zinc-950/60 border border-border dark:border-zinc-900 rounded-2xl space-y-4 shadow-xs">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500 block mb-1">
              Status de Tesouraria e Liquidez
            </span>
            <h4 className="text-sm font-bold text-muted-foreground dark:text-zinc-200">
              {treasuryReport?.treasuryStressStatus || 'N/A'}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2.5 bg-slate-200/30 dark:bg-zinc-900/40 rounded-xl border border-border dark:border-zinc-900">
              <span className="text-muted-foreground dark:text-zinc-500 block">Compressão de Caixa</span>
              <span className="font-bold text-muted-foreground dark:text-zinc-300 uppercase mt-0.5 block">{treasuryReport?.liquidityCompressionLevel || 'N/A'}</span>
            </div>
            <div className="p-2.5 bg-slate-200/30 dark:bg-zinc-900/40 rounded-xl border border-border dark:border-zinc-900">
              <span className="text-muted-foreground dark:text-zinc-500 block">Fragilidade Funding</span>
              <span className="font-bold text-muted-foreground dark:text-zinc-300 uppercase mt-0.5 block">{treasuryReport?.fundingFragility || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fiduciary Timeline Metrics Section */}
      {fiduciaryTimeline && (
        <div className="pt-4 border-t border-border dark:border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">
              Métricas Longitudinais Fiduciárias
            </span>
            <span className="text-[8px] font-mono font-bold px-2 py-0.5 bg-slate-100 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-muted-foreground dark:text-zinc-400 rounded">
              Status: {fiduciaryTimeline.timelineIntegrityStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-100/80 dark:bg-zinc-950/60 border border-border dark:border-zinc-900 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[9px] text-muted-foreground dark:text-zinc-500 block">Recorrência de Dependência</span>
              <span className="text-lg font-black text-muted-foreground dark:text-zinc-200">
                {fiduciaryTimeline.dependencyRecurrence}x
              </span>
              <span className="text-[8px] text-muted-foreground dark:text-zinc-500 block uppercase tracking-wider">Ciclos Dependentes</span>
            </div>

            <div className="p-4 bg-slate-100/80 dark:bg-zinc-950/60 border border-border dark:border-zinc-900 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[9px] text-muted-foreground dark:text-zinc-500 block">Liquidez Artificial</span>
              <span className="text-lg font-black text-muted-foreground dark:text-zinc-200">
                {fiduciaryTimeline.artificialLiquidityFrequency}%
              </span>
              <span className="text-[8px] text-muted-foreground dark:text-zinc-500 block uppercase tracking-wider">Frequência Relativa</span>
            </div>

            <div className="p-4 bg-slate-100/80 dark:bg-zinc-950/60 border border-border dark:border-zinc-900 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[9px] text-muted-foreground dark:text-zinc-500 block">Consistência EBITDA-Caixa</span>
              <span className="text-lg font-black text-zinc-250 flex items-center gap-1.5">
                {fiduciaryTimeline.ebitdaToCashConsistency ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Consistente</span>
                ) : (
                  <span className="text-rose-605 dark:text-rose-400">Inconsistente</span>
                )}
              </span>
              <span className="text-[8px] text-muted-foreground dark:text-zinc-500 block uppercase tracking-wider">Verificação de Fluxo</span>
            </div>

            <div className="p-4 bg-slate-100/80 dark:bg-zinc-950/60 border border-border dark:border-zinc-900 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[9px] text-muted-foreground dark:text-zinc-500 block">Ciclos Cobertos</span>
              <span className="text-lg font-black text-muted-foreground dark:text-zinc-200">
                {fiduciaryTimeline.periodsCovered}
              </span>
              <span className="text-[8px] text-muted-foreground dark:text-zinc-500 block uppercase tracking-wider">Meses Analisados</span>
            </div>
          </div>

          {/* Runway / Burn developments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-100/80 dark:bg-zinc-950/60 border border-border dark:border-zinc-900 rounded-2xl space-y-2 shadow-xs">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500 block">
                Evolução do Runway (Meses)
              </span>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground dark:text-zinc-500" />
                <div className="flex gap-2">
                  {fiduciaryTimeline.runwayEvolution.map((runway, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-xs font-bold text-muted-foreground dark:text-zinc-300">{runway}m</span>
                      <span className="text-[8px] text-muted-foreground dark:text-zinc-550 mt-0.5">T-{fiduciaryTimeline.runwayEvolution.length - 1 - idx}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-100/80 dark:bg-zinc-950/60 border border-border dark:border-zinc-900 rounded-2xl space-y-2 shadow-xs">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500 block">
                Evolução do Burn Rate Médio
              </span>
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-muted-foreground dark:text-zinc-500" />
                <div className="flex gap-2">
                  {fiduciaryTimeline.burnEvolution.map((burn, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-xs font-bold text-muted-foreground dark:text-zinc-300">
                        {burn < 0 ? '-' : ''}${Math.abs(Math.round(burn / 1000))}k
                      </span>
                      <span className="text-[8px] text-muted-foreground dark:text-zinc-550 mt-0.5">T-{fiduciaryTimeline.burnEvolution.length - 1 - idx}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fiduciary warnings longitudinal */}
          {fiduciaryTimeline.fiduciaryWarnings && fiduciaryTimeline.fiduciaryWarnings.length > 0 && (
            <div className="p-4 rounded-xl bg-critical-soft/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-950/40 space-y-2 shadow-xs">
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-800 dark:text-rose-400 block">
                Alertas Fiduciários Longitudinais
              </span>
              <div className="space-y-1.5">
                {fiduciaryTimeline.fiduciaryWarnings.map((warning, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] font-medium text-muted-foreground dark:text-rose-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-650 dark:text-rose-450" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
