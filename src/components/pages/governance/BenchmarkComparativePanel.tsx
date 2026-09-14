import React from 'react';
import { Sparkles, Lock, AlertTriangle, TrendingUp, CheckCircle2, ShieldAlert, Scale, Info, ChevronRight, TrendingDown, Award, Activity } from 'lucide-react';
import { FiduciaryRuntimeAdapter, ESGIMScenario, BenchmarkPosition } from '../../../services/FiduciaryRuntimeAdapter';
// src/components/pages/governance/BenchmarkComparativePanel.tsx


interface BenchmarkComparativePanelProps {
  clientId: string;
  scenario: ESGIMScenario;
}

export function BenchmarkComparativePanel({ clientId, scenario }: BenchmarkComparativePanelProps) {
  // 1. Fetch comparative calculation from engine
  const comparison = FiduciaryRuntimeAdapter.benchmarkComparativeEngine.calculateComparison(clientId, 'DEMO_SCENARIO', scenario);
  const readiness = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadiness(clientId, scenario);

  const isBlocked = readiness.certificationStatus === 'NOT_CERTIFIED';
  const isConditional = readiness.certificationStatus === 'CONDITIONALLY_CERTIFIED';

  // Helper for Position styling
  const getPositionStyles = (pos: BenchmarkPosition) => {
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

  const posTheme = getPositionStyles(comparison.benchmarkPosition);

  // visual slider layout for benchmark positions
  const positionsOrdered: BenchmarkPosition[] = ['BOTTOM_25', 'BOTTOM_50', 'TOP_50', 'TOP_25', 'TOP_10'];
  const getPositionLabel = (pos: BenchmarkPosition) => {
    if (pos === 'TOP_10') return 'Top 10%';
    if (pos === 'TOP_25') return 'Top 25%';
    if (pos === 'TOP_50') return 'Top 50%';
    if (pos === 'BOTTOM_50') return 'Bottom 50%';
    return 'Bottom 25%';
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      
      {/* Background soft lighting */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full filter blur-[120px] opacity-10 transition-colors duration-1000 ${isBlocked ? 'bg-red-500' : 'bg-primary'}`} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-2xl border border-primary text-primary shadow-lg shadow-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Benchmark Comparative Governance
                                            </h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary border border-primary text-primary rounded-full">
                BCI™ v1.0
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              Posicionamento Estratégico Corporativo Contra Cohorts Homologados
            </p>
          </div>
        </div>

        {/* Data mode info */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-gray-950/40 border border-border px-3 py-1.5 rounded-xl">
          <Info className="w-3.5 h-3.5 text-primary" />
          <span className="uppercase tracking-wider">Cohort Mode: {comparison.cohortDataMode}</span>
        </div>
      </div>

      {/* BLOCKED OVERLAY / STATE (BRL Gate) */}
      {isBlocked ? (
        <div className="p-6 bg-red-950/10 border border-dashed border-red-900/30 rounded-2xl space-y-5 text-center relative overflow-hidden">
          <div className="p-4 bg-red-500/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-red-400 border border-red-500/20 shadow-lg shadow-red-500/5">
            <Lock className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
              Comparação Bloqueada Preventivamente
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              De acordo com a cláusula constitucional de auditoria comparativa, o benchmark setorial permanece suspenso até que a holding atinja a prontidão fiduciária mínima (BRL™).
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
              Ações Requeridas para Desbloquear BCI™:
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
          {/* CONDITIONAL ADVISORY CONTAINER */}
          {isConditional && (
            <div className="p-4 bg-warning-soft0/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-start gap-3 shadow-md shadow-amber-500/5">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-extrabold uppercase tracking-wider block">Aviso Consultivo de Prontidão:</span>
                <p className="font-semibold leading-relaxed">
                  Comparação condicionada à melhoria da prontidão institucional.
                </p>
                <p className="text-[10px] text-amber-500/80 leading-normal">
                  Identificadas pendências moderadas de consistência de dados ou gaps operacionais que adicionam ruído à análise.
                </p>
              </div>
            </div>
          )}

          {/* Active Comparative Cockpit */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Score dial */}
            <div className="bg-black/20 border border-border rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">BPS™ Index</span>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * comparison.bpsScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{comparison.bpsScore}</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">BPS™ Score</span>
                </div>
              </div>

              <div className="space-y-3 w-full">
                <div className={`py-1.5 px-3 rounded-xl border text-center font-black uppercase text-[10px] tracking-widest ${posTheme.text}`}>
                  {posTheme.label}
                </div>
                <div className="text-[10px] text-muted-foreground leading-snug">
                  Cohort: <strong className="text-muted-foreground">{comparison.cohortName}</strong>
                </div>
              </div>
            </div>

            {/* General summary & limitations */}
            <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
              <div className="bg-black/20 border border-border rounded-2xl p-6 space-y-4">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Análise Comparativa Executiva</span>
                <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
                  {comparison.executiveSummary}
                </p>
                <div className="text-[10px] text-muted-foreground border-t border-border pt-3 leading-relaxed">
                  <strong>Limitações do Benchmark:</strong>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    {comparison.benchmarkLimitations.map((lim, index) => (
                      <li key={index}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Benchmark slider indicator */}
              <div className="p-5 bg-black/20 border border-border rounded-2xl space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Slider de Posição do Cohort</span>
                
                <div className="relative pt-2">
                  {/* Gray slider bar */}
                  <div className="w-full h-2 bg-gray-800 rounded-full" />
                  
                  {/* Ordered slider points */}
                  <div className="flex justify-between mt-2">
                    {positionsOrdered.map((pos, idx) => {
                      const isCurrent = comparison.benchmarkPosition === pos;
                      return (
                        <div key={idx} className="flex flex-col items-center text-center">
                          <div className={`w-3 h-3 rounded-full border -mt-4.5 z-10 transition-all ${
                            isCurrent ? 'bg-primary scale-125 border-primary shadow-md shadow-primary' : 'bg-gray-800 border-border'
                          }`} />
                          <span className={`text-[9px] font-bold mt-1.5 ${isCurrent ? 'text-primary font-extrabold' : 'text-muted-foreground'}`}>
                            {getPositionLabel(pos)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Comparative Dimensions Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              Comparativo das Dimensões Fiduciárias (Holdings vs. Cohort)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {comparison.comparativeDimensions.map((cd, index) => {
                const isPositive = cd.delta >= 0;
                
                return (
                  <div key={index} className="p-4 bg-slate-950/40 border border-border rounded-2xl flex flex-col justify-between gap-3 relative overflow-hidden">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                        {cd.dimension}
                      </span>
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="text-xs text-muted-foreground">Atual: <strong className="text-white text-sm">{cd.currentScore}</strong></span>
                        <span className="text-xs text-muted-foreground">Cohort: <strong className="text-muted-foreground">{cd.benchmarkScore}</strong></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-border pt-2">
                      <span className={`text-[10px] font-black font-mono flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPositive ? `+${cd.delta}` : cd.delta}
                      </span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-gray-800 text-muted-foreground border border-border rounded uppercase">
                        {cd.position.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gap Analysis */}
          {comparison.benchmarkGaps.length > 0 && (
            <div className="p-5 bg-black/15 border border-border rounded-2xl space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Gap Analysis de Evolução Comparativa (BGI™)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparison.benchmarkGaps.map((gap, index) => (
                  <div key={index} className="p-4 bg-slate-950/40 border border-border rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <strong className="text-xs text-muted-foreground block uppercase tracking-wider">{gap.metric}</strong>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Pontuação atual: {gap.currentScore} / Meta ideal: {gap.targetScore}
                      </p>
                    </div>

                    <div className="px-4 py-2 bg-primary border border-primary rounded-xl text-center">
                      <span className="text-lg font-extrabold text-primary">+{gap.gap}</span>
                      <span className="text-[8px] font-bold block text-primary uppercase tracking-widest">Pontos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Vulnerabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Strengths */}
            <div className="p-5 bg-black/15 border border-border rounded-2xl space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Onde a Holding Supera o Benchmark ({comparison.strengths.length})
              </span>
              <div className="space-y-2">
                {comparison.strengths.map((str, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-500 font-bold mt-0.5">✔</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vulnerabilities */}
            <div className="p-5 bg-black/15 border border-border rounded-2xl space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Gargalos Setoriais Prioritários ({comparison.vulnerabilities.length})
              </span>
              <div className="space-y-2">
                {comparison.vulnerabilities.map((vul, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                    <span className="text-red-500 font-bold mt-0.5">✘</span>
                    <span>{vul}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </>
      )}

    </div>
  );
}
