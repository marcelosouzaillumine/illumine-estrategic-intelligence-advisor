import React from 'react';
import { Sparkles, Lock, AlertTriangle, TrendingUp, CheckCircle2, ShieldAlert, Scale, Info, ChevronRight, Award, Activity, Zap, ShieldCheck, Layers } from 'lucide-react';
import { FiduciaryRuntimeAdapter, ESGIMScenario, BenchmarkPosition, BenchmarkTargetTier } from '../../../services/FiduciaryRuntimeAdapter';
// src/components/pages/governance/BenchmarkAdvisoryPanel.tsx


interface BenchmarkAdvisoryPanelProps {
  clientId: string;
  scenario: ESGIMScenario;
}

export function BenchmarkAdvisoryPanel({ clientId, scenario }: BenchmarkAdvisoryPanelProps) {
  // 1. Fetch data from the adapter
  const advisory = FiduciaryRuntimeAdapter.benchmarkAdvisoryEngine.evaluateAdvisory(clientId, 'DEMO_SCENARIO', scenario);
  const readiness = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadiness(clientId, scenario);

  const isBlocked = readiness.certificationStatus === 'NOT_CERTIFIED';
  const isConditional = readiness.certificationStatus === 'CONDITIONALLY_CERTIFIED';

  // Helper for Position styling
  const getPositionStyles = (pos: string) => {
    switch (pos) {
      case 'TOP_10':
        return { text: 'text-primary bg-primary border-primary', label: 'Top 10% (Líder)' };
      case 'TOP_25':
        return { text: 'text-emerald-400 bg-success-soft0/10 border-emerald-500/25', label: 'Top 25% (Excelente)' };
      case 'TOP_50':
        return { text: 'text-primary bg-primary border-primary', label: 'Top 50% (Maduro)' };
      case 'BOTTOM_50':
        return { text: 'text-amber-400 bg-warning-soft0/10 border-amber-500/25', label: 'Bottom 50% (Em Desenvolvimento)' };
      case 'BOTTOM_25':
      default:
        return { text: 'text-red-400 bg-red-500/10 border-red-500/25', label: 'Bottom 25% (Crítico)' };
    }
  };

  const getInitiativeTypeStyles = (type: string) => {
    switch (type) {
      case 'QUICK_WIN':
        return { bg: 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400', label: 'Quick Win' };
      case 'FOUNDATIONAL':
        return { bg: 'bg-primary border-primary text-primary', label: 'Foundational' };
      case 'TRANSFORMATIONAL':
      default:
        return { bg: 'bg-primary border-primary text-primary', label: 'Transformational' };
    }
  };

  const currentTheme = getPositionStyles(advisory.currentPosition);
  const targetTheme = getPositionStyles(advisory.targetPosition);

  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      
      {/* Background soft lighting */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full filter blur-[120px] opacity-10 transition-colors duration-1000 ${isBlocked ? 'bg-red-500' : 'bg-primary'}`} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-2xl border border-primary text-primary shadow-lg shadow-indigo-500/5">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Benchmark Advisory Intelligence
              </h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary border border-primary text-primary rounded-full">
                BAI™ v1.0
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              Roadmap de Evolução Comparativa, Simulação de Impacto e Iniciativas do Board
            </p>
          </div>
        </div>

        {/* Data mode info */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-gray-950/40 border border-border px-3 py-1.5 rounded-xl">
          <Info className="w-3.5 h-3.5 text-primary" />
          <span className="uppercase tracking-wider">Advisory Mode: CERTIFIED GATEWAY</span>
        </div>
      </div>

      {/* BRL BLOCK GATE OVERLAY */}
      {isBlocked ? (
        <div className="p-6 bg-red-950/10 border border-dashed border-red-900/30 rounded-2xl space-y-5 text-center relative overflow-hidden">
          <div className="p-4 bg-red-500/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-red-400 border border-red-500/20 shadow-lg shadow-red-500/5">
            <Lock className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
              Recomendações Suspensas (BRL™ Gate)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O cockpit de recomendações e simulações do BAI™ está indisponível para esta holding devido à falta de certificação de prontidão de dados comparativos (BRL™).
            </p>
          </div>

          <div className="max-w-xl mx-auto p-4 bg-black/40 rounded-xl text-left border border-border space-y-3">
            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block border-b border-border pb-1.5">
              Motivo do Bloqueio:
            </span>
            <p className="text-xs text-muted-foreground font-mono">
              {readiness.benchmarkBlockedReason}
            </p>
            
            <span className="text-[10px] font-black text-primary uppercase tracking-widest block border-b border-border pt-2 pb-1.5">
              Ações Críticas Necessárias antes do Benchmarking:
            </span>
            <div className="space-y-1.5">
              {readiness.requiredBeforeBenchmark?.map((req, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* CONDITIONAL ADVISORY BANNERS */}
          {isConditional && (
            <div className="p-4 bg-warning-soft0/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-start gap-3 shadow-md shadow-amber-500/5">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-extrabold uppercase tracking-wider block">Comparação Condicionada à Prontidão:</span>
                <p className="font-semibold leading-relaxed">
                  Prontidão fiduciária contendo gaps moderados. As simulações de impacto e avanços possuem menor confiabilidade.
                </p>
                <p className="text-[10px] text-amber-500/80 leading-normal">
                  Consulte os alertas de confiança (ACS™) adicionais para orientar as deliberações do Board.
                </p>
              </div>
            </div>
          )}

          {/* Core Analytics Cockpit */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Dial 1: APS Score */}
            <div className="bg-black/20 border border-border rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">APS™ INDEX</span>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={326}
                    strokeDashoffset={326 - (326 * advisory.apsScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{advisory.apsScore}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">APS™ Score</span>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">
                  Potencial de Avanço de Benchmarking
                </span>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Mede a capacidade e velocidade para implementar e certificar mudanças fiduciárias.
                </p>
              </div>
            </div>

            {/* Transition & Simulator Block */}
            <div className="bg-black/20 border border-border rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Simulador de Avanço de Quadrante</span>
              
              <div className="flex items-center justify-between p-4 bg-gray-950/40 border border-border rounded-xl">
                <div className="text-center space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-black block">Atual</span>
                  <div className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${currentTheme.text}`}>
                    {currentTheme.label}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-primary shrink-0" />

                <div className="text-center space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-black block">Target BAI™</span>
                  <div className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${targetTheme.text}`}>
                    {targetTheme.label}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-primary border border-primary rounded-xl">
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                  {advisory.expectedAdvancementImpact}
                </p>
              </div>
            </div>

            {/* Dial 2: ACS Confidence & Drivers */}
            <div className="bg-black/20 border border-border rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Confiança da Recomendação (ACS™)</span>
                <span className={`text-sm font-extrabold ${advisory.advisoryConfidenceScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {advisory.advisoryConfidenceScore}%
                </span>
              </div>

              {/* Drivers & Warnings */}
              <div className="space-y-3.5">
                {/* Drivers list */}
                <div className="space-y-1.5">
                  {advisory.confidenceDrivers.map((drv, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-450 shrink-0" />
                      <span>{drv}</span>
                    </div>
                  ))}
                </div>

                {/* Warnings list */}
                {advisory.confidenceWarnings.length > 0 && (
                  <div className="border-t border-border pt-2 space-y-1.5">
                    {advisory.confidenceWarnings.map((warn, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[10px] text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Gaps Analysis Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Benchmark Advancement Gaps
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {advisory.advancementGaps.map((gap, index) => (
                <div key={index} className="p-4 bg-slate-950/40 border border-border rounded-2xl flex flex-col justify-between gap-3 relative overflow-hidden">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                      {gap.metric}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Score Atual:</span>
                        <strong className="text-white">{gap.currentValue}</strong>
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Meta Target:</span>
                        <strong className="text-muted-foreground">{gap.nextTierTarget}</strong>
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Meta Liderança:</span>
                        <strong className="text-muted-foreground">{gap.leaderTarget}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-2 flex justify-between items-center">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">Melhoria Faltante</span>
                    <span className={`text-xs font-extrabold font-mono ${gap.improvementRequired > 0 ? 'text-primary' : 'text-emerald-400'}`}>
                      {gap.improvementRequired > 0 ? `+${gap.improvementRequired}` : 'OK'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Advisory Initiatives */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Top 5 Iniciativas Recomendadas para o Board
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {advisory.initiatives.map((init, index) => {
                const initTypeTheme = getInitiativeTypeStyles(init.initiativeType);
                return (
                  <div key={index} className="p-4 bg-slate-950/40 border border-border hover:border-border transition-all rounded-2xl flex flex-col justify-between gap-4 relative overflow-hidden">
                    {/* Badge showing initiative type */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${initTypeTheme.bg}`}>
                          {initTypeTheme.label}
                        </span>
                        <span className="text-[8px] font-bold text-muted-foreground font-mono">{init.id}</span>
                      </div>

                      <h4 className="text-xs font-extrabold text-white leading-normal line-clamp-2">
                        {init.title}
                      </h4>
                    </div>

                    <div className="space-y-2 text-[10px] text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Dificuldade:</span>
                        <strong className="text-muted-foreground font-semibold">{init.difficulty}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Horizonte:</span>
                        <strong className="text-muted-foreground font-semibold">{init.horizon.replace('_', ' ')}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Impacto Simulado:</span>
                        <strong className="text-primary font-bold font-mono">+{init.simulatedBpsImpact} BPS</strong>
                      </div>
                    </div>

                    <div className="p-2.5 bg-black/40 border border-border rounded-lg text-[10px] leading-relaxed text-muted-foreground italic">
                      {init.rationale}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advisory disclaimers/Limitations */}
          <div className="p-4 bg-black/30 border border-border rounded-2xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">
                Limitações e Exclusão de Responsabilidade do Board pack
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {advisory.advisoryLimitations.map((lim, idx) => (
                  <li key={idx} className="text-[10px] text-muted-foreground leading-normal">
                    {lim}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
