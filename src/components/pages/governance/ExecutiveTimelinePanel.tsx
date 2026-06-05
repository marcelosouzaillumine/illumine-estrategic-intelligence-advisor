// src/components/pages/governance/ExecutiveTimelinePanel.tsx

import React from 'react';
import { History, TrendingUp, AlertTriangle, HelpCircle, CheckCircle2, ChevronRight, Hash } from 'lucide-react';
import { ExecutiveTimelineOutput } from '../../../services/FiduciaryRuntimeAdapter';
import { EXECUTIVE_SEVERITY_THEME } from './ExecutiveSeverityTheme';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ExecutiveTimelinePanelProps {
  timeline?: ExecutiveTimelineOutput;
}

export function ExecutiveTimelinePanel({ timeline }: ExecutiveTimelinePanelProps) {
  const { t } = useLanguage();

  if (!timeline) {
    return (
      <div className="p-6 rounded-[32px] border border-slate-200 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/40 backdrop-blur-md text-center py-10 text-slate-500 dark:text-zinc-500 shadow-xs">
        <History className="w-8 h-8 mx-auto text-slate-400 dark:text-zinc-700 mb-2" />
        <p className="text-xs font-bold uppercase tracking-wider">Histórico Longitudinal Indisponível</p>
        <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-1">Nenhum dado temporal de linha do tempo fiduciária foi gerado.</p>
      </div>
    );
  }

  const {
    trajectoryClassification,
    accelerationState,
    confidenceLevel,
    inflectionPoints,
    timelineEvents,
    executiveNarrative,
    lineageHash
  } = timeline;

  // Map trajectory to visual severity theme
  const getTrajectoryTheme = (traj: string) => {
    switch (traj) {
      case 'IMPROVING':
      case 'RECOVERING':
        return EXECUTIVE_SEVERITY_THEME.HEALTHY;
      case 'STABLE':
      case 'PLATEAUED':
        return EXECUTIVE_SEVERITY_THEME.ATTENTION;
      case 'DETERIORATING':
        return EXECUTIVE_SEVERITY_THEME.WARNING;
      case 'STRUCTURALLY_DETERIORATING':
      case 'CONSTITUTIONALLY_RESTRICTED':
        return EXECUTIVE_SEVERITY_THEME.CRITICAL;
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return EXECUTIVE_SEVERITY_THEME.HEALTHY; // Neutral styling
    }
  };

  const getConfidenceTheme = (conf: string) => {
    switch (conf) {
      case 'HIGH_CONFIDENCE':
        return EXECUTIVE_SEVERITY_THEME.HEALTHY;
      case 'MEDIUM_CONFIDENCE':
        return EXECUTIVE_SEVERITY_THEME.ATTENTION;
      case 'LOW_CONFIDENCE':
        return EXECUTIVE_SEVERITY_THEME.WARNING;
      case 'FAIL_CLOSED':
      default:
        return EXECUTIVE_SEVERITY_THEME.FAIL_CLOSED;
    }
  };

  const trajTheme = getTrajectoryTheme(trajectoryClassification);
  const confTheme = getConfidenceTheme(confidenceLevel);

  return (
    <div className="p-6 rounded-[32px] border border-slate-200 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/40 backdrop-blur-md space-y-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-805 dark:text-zinc-300">
            {t('runtime.ete.panel.title', 'Linha do Tempo e Evolução Fiduciária Longitudinal (ETE)')}
          </h3>
        </div>
        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${confTheme.badge}`}>
          {t('runtime.ete.label.confidence', 'Confiança')}: {t(`runtime.ete.confidence.${confidenceLevel}`, confidenceLevel.replace(/_/g, ' '))}
        </span>
      </div>

      {/* Trajectory & Acceleration Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${trajTheme.border} ${trajTheme.bg} space-y-1 shadow-xs`}>
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 block">
            {t('runtime.ete.panel.trajectory_classification', 'Classificação de Trajetória')}
          </span>
          <span className={`text-sm font-black uppercase tracking-wider ${trajTheme.text}`}>
            {t(`runtime.ete.trajectory.${trajectoryClassification}`, trajectoryClassification.replace(/_/g, ' '))}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100/65 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-900 space-y-1 shadow-xs">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 block">
            {t('runtime.ete.panel.acceleration_state', 'Estado de Aceleração')}
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider">
            {t(`runtime.ete.acceleration.${accelerationState}`, accelerationState.replace(/_/g, ' '))}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100/65 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-900 flex flex-col justify-center space-y-1 min-w-0 shadow-xs">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 block">
            {t('runtime.ete.panel.lineage_hash', 'Hash de Linhagem Temporal')}
          </span>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-400 font-mono text-[9px] min-w-0">
            <Hash className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
            <span className="truncate select-all font-bold">{lineageHash}</span>
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-900 space-y-1 shadow-xs">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 block">
          {t('runtime.ete.panel.executive_trajectory_diagnosis', 'Diagnóstico de Trajetória Executiva')}
        </span>
        <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">{executiveNarrative}</p>
      </div>

      {/* Events and Inflection Points columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Longitudinal Events */}
        <div className="space-y-3">
          <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
            {t('runtime.ete.panel.important_longitudinal_events', 'Eventos Longitudinais Relevantes')}
          </span>

          {timelineEvents.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-900 text-center text-[10px] text-slate-500 dark:text-zinc-500 font-semibold uppercase tracking-wider shadow-xs">
              {t('runtime.ete.panel.no_events_registered', 'Nenhum evento registrado nesta linha temporal.')}
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {timelineEvents.map((evt, idx) => {
                const badgeColor = evt.severity === 'RESTRICTIVE' || evt.severity === 'CRITICAL'
                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                  : evt.severity === 'WARNING'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800';

                return (
                  <div key={idx} className="p-3 bg-slate-100/80 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-900 rounded-xl space-y-1.5 transition-colors hover:border-slate-300 dark:hover:border-zinc-800 shadow-xs">
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className="font-bold text-slate-500 dark:text-zinc-400">{evt.cycleReference}</span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeColor}`}>
                        {t(`runtime.ete.event.${evt.eventType}`, evt.eventType.replace(/_/g, ' '))}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-snug">
                      {evt.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inflection Points */}
        <div className="space-y-3">
          <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
            {t('runtime.ete.panel.inflection_points_critical_variations', 'Pontos de Inflexão e Variações Críticas')}
          </span>

          {inflectionPoints.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-900 text-center text-[10px] text-slate-500 dark:text-zinc-500 font-semibold uppercase tracking-wider shadow-xs">
              {t('runtime.ete.panel.no_inflection_points', 'Nenhum ponto de inflexão disparado nos ciclos analisados.')}
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {inflectionPoints.map((ip, idx) => {
                const impactColor = ip.fiduciaryImpact === 'POSITIVE'
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/5 border-emerald-250 dark:border-emerald-500/10'
                  : ip.fiduciaryImpact === 'NEGATIVE'
                  ? 'text-rose-650 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/5 border-rose-250 dark:border-rose-500/10'
                  : 'text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850';

                return (
                  <div key={idx} className="p-3 bg-slate-100/80 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-900 rounded-xl flex items-center justify-between gap-4 transition-colors hover:border-slate-300 dark:hover:border-zinc-800 shadow-xs">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-zinc-500">{ip.cycleReference}</span>
                        <span className="text-[10px] font-bold text-slate-800 dark:text-zinc-300 truncate uppercase tracking-wide">
                          {ip.metricName.replace(/([A-Z])/g, ' $1')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-655 dark:text-zinc-400">
                        <span className="text-slate-500 dark:text-zinc-500">{ip.previousValue}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-600" />
                        <span className="font-bold text-slate-700 dark:text-zinc-300">{ip.newValue}</span>
                      </div>
                    </div>

                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded border font-mono ${impactColor}`}>
                      {t(`actions.${ip.fiduciaryImpact.toLowerCase()}`, ip.fiduciaryImpact)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
