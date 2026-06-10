// src/components/pages/governance/CausalityExplorerPanel.tsx

import React from 'react';
import { Compass, AlertTriangle, ShieldCheck, Lock, Activity, ArrowRight, FileText, Network, CheckCircle2, AlertCircle } from 'lucide-react';
import { InstitutionalCausalityOutput, CausalChain } from '../../../services/FiduciaryRuntimeAdapter';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn, formatCurrency } from '../../../lib/utils';
import { EXECUTIVE_SEVERITY_THEME } from './ExecutiveSeverityTheme';

interface CausalityExplorerPanelProps {
  causality?: InstitutionalCausalityOutput | null;
}

export function CausalityExplorerPanel({ causality }: CausalityExplorerPanelProps) {
  const { t } = useLanguage();

  if (!causality) {
    return (
      <div className="p-6 rounded-[32px] border border-border dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/40 backdrop-blur-md text-center py-10">
        <Network className="w-8 h-8 text-muted-foreground mx-auto mb-3 animate-pulse" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {t('runtime.ice.panel.no_causes') || 'Nenhuma cadeia de causa e efeito fiduciária foi disparada.'}
        </p>
      </div>
    );
  }

  const {
    primaryCause,
    secondaryCauses = [],
    causalChains = [],
    confidenceLevel = 'LOW',
    supportingEvidence = [],
    executiveNarrative = '',
    lineageHash = ''
  } = causality;

  const isRestricted = confidenceLevel === 'CAUSALITY_RESTRICTED';

  // Map severity of each chain to styles
  const getSeverityBadgeClass = (severity: CausalChain['severity']) => {
    switch (severity) {
      case 'RESTRICTIVE':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      case 'CRITICAL':
        return 'bg-critical-soft0/10 text-rose-700 dark:text-rose-400 border-rose-500/20 animate-pulse';
      case 'WARNING':
        return 'bg-warning-soft0/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'INFO':
      default:
        return 'bg-slate-100 dark:bg-zinc-900 text-muted-foreground dark:text-zinc-400 border-border dark:border-zinc-800';
    }
  };

  // Safe translation helper
  const translateFactor = (factor: string) => {
    const key = `runtime.ice.factor.${factor}`;
    const translated = t(key);
    return translated === key ? factor.replace(/_/g, ' ') : translated;
  };

  const translateCategory = (cat: string) => {
    const key = `runtime.ice.category.${cat}`;
    const translated = t(key);
    return translated === key ? cat : translated;
  };

  const translateConfidence = (conf: string) => {
    const key = `runtime.ice.confidence.${conf}`;
    const translated = t(key);
    return translated === key ? conf : translated;
  };

  return (
    <div className="w-full p-6 md:p-8 rounded-[32px] border border-border dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/40 backdrop-blur-md space-y-8 shadow-xs">
      
      {/* Header and Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border dark:border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary border border-primary rounded-xl text-primary dark:text-primary">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-muted-foreground dark:text-zinc-200 uppercase tracking-widest">
              {t('runtime.ice.panel.title') || 'Painel de Mapeamento de Causalidade Executiva (ICE)'}
            </h3>
            <p className="text-[9px] font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest mt-0.5">
              Fiduciary Cause & Effect Explorer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">
            {t('runtime.ice.panel.confidence_label') || 'Confiança Causal'}:
          </span>
          <span className={cn(
            "text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border shadow-xs",
            confidenceLevel === 'HIGH' ? 'bg-success-soft0/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' :
            confidenceLevel === 'MEDIUM' ? 'bg-primary text-primary dark:text-primary border-primary' :
            confidenceLevel === 'LOW' ? 'bg-warning-soft0/10 text-amber-700 dark:text-amber-400 border-amber-500/20' :
            'bg-red-500/10 text-red-750 dark:text-red-400 border-red-500/25 animate-pulse'
          )}>
            {translateConfidence(confidenceLevel)}
          </span>
        </div>
      </div>

      {/* Main Diagnosis Summary */}
      <div className={cn(
        "p-6 rounded-2xl border",
        isRestricted 
          ? "bg-red-500/5 border-red-500/20 text-red-950 dark:text-red-300"
          : "bg-slate-100/50 dark:bg-zinc-900/30 border-border dark:border-zinc-800"
      )}>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {isRestricted ? (
              <Lock className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5 animate-pulse" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-primary dark:text-primary shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 flex-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">
                {t('runtime.ice.panel.narrative_label') || 'Diagnóstico Narrativo de Causalidade'}
              </span>
              <p className="text-xs font-semibold text-muted-foreground dark:text-zinc-300 leading-relaxed">
                {executiveNarrative}
              </p>
            </div>
          </div>

          {!isRestricted && primaryCause && (
            <div className="pt-4 border-t border-border dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">
                  {t('runtime.ice.panel.primary_cause') || 'Causa Raiz Principal'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
                  <span className="text-xs font-bold text-muted-foreground dark:text-zinc-200">
                    {translateFactor(primaryCause)}
                  </span>
                </div>
              </div>

              {secondaryCauses.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">
                    {t('runtime.ice.panel.secondary_causes') || 'Causas Secundárias'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {secondaryCauses.map((sc, i) => (
                      <span key={i} className="text-[9px] font-bold text-muted-foreground dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 border border-border dark:border-zinc-800 px-2 py-0.5 rounded">
                        {translateFactor(sc)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Causal Chains Visual List */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">
          {t('runtime.ice.panel.causal_chains_label') || 'Cadeias de Causa e Efeito Detectadas'}
        </h4>

        {causalChains.length === 0 ? (
          <div className="p-4 rounded-xl border border-border dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/20 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {t('runtime.ice.panel.no_causes') || 'Nenhuma cadeia de causa e efeito fiduciária foi disparada.'}
          </div>
        ) : (
          <div className="space-y-4">
            {causalChains.map((chain, index) => (
              <div key={index} className="p-5 bg-slate-100/30 dark:bg-zinc-900/10 border border-border dark:border-zinc-900/60 rounded-2xl space-y-4 hover:border-border dark:hover:border-zinc-800 transition-all shadow-xs">
                
                {/* Chain Tags */}
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-primary text-primary dark:text-primary border border-primary rounded">
                      {translateCategory(chain.category)}
                    </span>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 border rounded",
                      getSeverityBadgeClass(chain.severity)
                    )}>
                      {chain.severity}
                    </span>
                  </div>

                  <span className="text-[8px] font-mono text-muted-foreground dark:text-zinc-650">
                    LINEAGE ID: {chain.lineageHash}
                  </span>
                </div>

                {/* Chain visual flow */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 py-2">
                  
                  {/* Cause */}
                  <div className="flex-1 p-3 bg-slate-50/90 dark:bg-zinc-950/50 border border-border dark:border-zinc-900 rounded-xl flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[8px] font-black text-muted-foreground dark:text-zinc-550 uppercase tracking-widest block leading-none mb-1">
                        Causa Raiz
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground dark:text-zinc-200 block truncate">
                        {translateFactor(chain.cause)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-muted-foreground dark:text-zinc-600 shrink-0">
                    <ArrowRight className="w-4 h-4 transform rotate-90 md:rotate-0" />
                  </div>

                  {/* Driver */}
                  <div className="flex-1 p-3 bg-slate-50/90 dark:bg-zinc-950/50 border border-border dark:border-zinc-900 rounded-xl flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-warning-soft0/10 border border-amber-500/20 text-amber-650 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[8px] font-black text-muted-foreground dark:text-zinc-550 uppercase tracking-widest block leading-none mb-1">
                        Condutor / Driver
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground dark:text-zinc-200 block truncate">
                        {translateFactor(chain.driver)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-muted-foreground dark:text-zinc-600 shrink-0">
                    <ArrowRight className="w-4 h-4 transform rotate-90 md:rotate-0" />
                  </div>

                  {/* Effect */}
                  <div className="flex-1 p-3 bg-slate-50/90 dark:bg-zinc-950/50 border border-border dark:border-zinc-900 rounded-xl flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-primary border border-primary text-primary dark:text-primary flex items-center justify-center shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[8px] font-black text-muted-foreground dark:text-zinc-550 uppercase tracking-widest block leading-none mb-1">
                        Sintoma / Efeito
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground dark:text-zinc-200 block truncate">
                        {translateFactor(chain.effect)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Chain narrative */}
                <div className="p-3 bg-slate-50/50 dark:bg-zinc-950/30 border border-border dark:border-zinc-900/60 rounded-xl text-[11px] font-semibold text-muted-foreground dark:text-zinc-400 leading-relaxed">
                  {chain.narrative}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supporting Evidence Grid */}
      {!isRestricted && supportingEvidence.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">
            {t('runtime.ice.panel.evidence_label') || 'Evidências de Suporte'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {supportingEvidence.map((ev, i) => {
              const formattedValue = typeof ev.metricValue === 'number' 
                ? formatCurrency(ev.metricValue)
                : String(ev.metricValue);

              return (
                <div key={i} className="p-3.5 bg-slate-100/50 dark:bg-zinc-900/30 border border-border dark:border-zinc-900 rounded-xl space-y-1 text-center shadow-xs">
                  <span className="text-[8px] font-black text-muted-foreground dark:text-zinc-550 uppercase tracking-wider block">
                    {ev.metricName}
                  </span>
                  <span className="text-[11px] font-black text-muted-foreground dark:text-zinc-300 block">
                    {formattedValue}
                  </span>
                  <span className="text-[7px] font-mono text-muted-foreground dark:text-zinc-600 block">
                    Period: {ev.sourcePeriod}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Causal Lineage Hash */}
      <div className="p-3 bg-slate-100/90 dark:bg-zinc-950/80 border border-border dark:border-zinc-900 rounded-xl flex items-center justify-between text-[8px] font-mono text-muted-foreground dark:text-zinc-500 shadow-inner">
        <span className="uppercase font-bold tracking-wider">Linhagem Fiduciária Causal (ICE)</span>
        <span className="font-semibold select-all break-all">{lineageHash}</span>
      </div>

    </div>
  );
}
