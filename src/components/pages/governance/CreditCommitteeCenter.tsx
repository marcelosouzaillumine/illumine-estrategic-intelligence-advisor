import React from 'react';
import { History, Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp, Clock, Scale, ShieldCheck, Brain, Landmark, ShieldAlert, Percent, Sliders, DollarSign, Zap, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useCreditCommitteeViewModel } from '../../../viewmodels/governance/useCreditCommitteeViewModel';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn, formatCurrency } from '../../../lib/utils';
import { PageHeader } from '../../Common';

interface CreditCommitteeCenterProps {
  clients?: any[];
  selectedClient?: string;
  selectedYear?: number;
}

export function CreditCommitteeCenter({ selectedClient, selectedYear }: CreditCommitteeCenterProps) {
  const { state, computed, actions } = useCreditCommitteeViewModel({ selectedClient, selectedYear });
  const { expandedSection, selectedScenarioIndex, showDeltaView, loading } = state;
  const {
    recoveryMomentum,
    suggestedCreditRating,
    ccsScore,
    creditReadinessLevel,
    creditDecisionSimulation,
    institutionalCreditConfidence,
    refinancingRiskLevel,
    radarData,
    bankingReadinessScore,
    bankingReadinessLevel,
    stressScenarios,
    activeScenario,
    baseScenario,
    chartData,
    fundingGapTimeline,
    hasAnyWaiver,
    fractures,
    narrative,
    auditability,
    isEarlyStage
  } = computed;
  const { toggleSection, setSelectedScenarioIndex, setShowDeltaView } = actions;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Activity className="w-8 h-8 animate-pulse text-primary" />
        <span className="text-sm font-medium tracking-wide uppercase">Instanciando Simulador de Comitê de Crédito...</span>
      </div>
    );
  }

  const getScoreColor = (val: number): string => {
    if (val >= 85) return 'text-emerald-400';
    if (val >= 70) return 'text-yellow-400';
    if (val >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (val: number): string => {
    if (val >= 85) return 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400';
    if (val >= 70) return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
    if (val >= 50) return 'bg-warning-soft0/10 border-amber-500/20 text-amber-500';
    return 'bg-critical-soft0/10 border-rose-500/20 text-rose-500';
  };

  const getDecisionBadge = (decision: string) => {
    const maps: Record<string, string> = {
      APPROVED: 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400',
      APPROVED_WITH_RESTRICTIONS: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
      CONDITIONAL_APPROVAL: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      HIGH_MONITORING_REQUIRED: 'bg-warning-soft0/10 border-amber-500/20 text-amber-500',
      RESTRICTED_CREDIT: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      DECLINED: 'bg-critical-soft0/10 border-rose-500/20 text-rose-500'
    };
    return maps[decision] || 'bg-slate-800 border-border text-muted-foreground';
  };

  const getDecisionText = (decision: string): string => {
    const maps: Record<string, string> = {
      APPROVED: 'APROVADO',
      APPROVED_WITH_RESTRICTIONS: 'APROVADO COM RESTRIÇÕES',
      CONDITIONAL_APPROVAL: 'APROVAÇÃO CONDICIONAL',
      HIGH_MONITORING_REQUIRED: 'MONITORAMENTO ELEVADO REQUERIDO',
      RESTRICTED_CREDIT: 'CRÉDITO RESTRITO',
      DECLINED: 'REJEITADO'
    };
    return maps[decision] || decision;
  };

  const getConfidenceBadge = (confidence: string) => {
    const maps: Record<string, string> = {
      HIGH_CONFIDENCE: 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400',
      MODERATE_CONFIDENCE: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      LOW_CONFIDENCE: 'bg-critical-soft0/10 border-rose-500/20 text-rose-500'
    };
    return maps[confidence] || 'bg-slate-800 border-border text-muted-foreground';
  };

  const getConfidenceText = (confidence: string): string => {
    const maps: Record<string, string> = {
      HIGH_CONFIDENCE: 'CONFIANÇA ELEVADA',
      MODERATE_CONFIDENCE: 'CONFIANÇA MODERADA',
      LOW_CONFIDENCE: 'CONFIANÇA RESTRITA (Mapeada via histórico ou volatilidade)'
    };
    return maps[confidence] || confidence;
  };

  const getRecoveryBadge = (recovery: string) => {
    const maps: Record<string, string> = {
      ACCELERATING_RECOVERY: 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400',
      STABILIZING_RECOVERY: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
      VOLATILE_RECOVERY: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      STALLED_RECOVERY: 'bg-warning-soft0/10 border-amber-500/20 text-amber-500',
      DETERIORATING: 'bg-critical-soft0/10 border-rose-500/20 text-rose-500'
    };
    return maps[recovery] || 'bg-slate-800 border-border text-muted-foreground';
  };

  const getRecoveryText = (recovery: string): string => {
    const maps: Record<string, string> = {
      ACCELERATING_RECOVERY: 'RECUPERAÇÃO ACELERADA',
      STABILIZING_RECOVERY: 'ESTABILIZAÇÃO DE TESOURARIA',
      VOLATILE_RECOVERY: 'RECUPERAÇÃO VOLÁTIL',
      STALLED_RECOVERY: 'RECUPERAÇÃO ESTAGNADA',
      DETERIORATING: 'DETERIORAÇÃO CÍCLICA'
    };
    return maps[recovery] || recovery;
  };



  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Page Header */}
      <PageHeader 
        title="Simulador de Comitê de Crédito"
        subtitle="Underwriting institucional fiduciário com projeções de estresse e propagação de risco."
        icon={Landmark}
        transparent
        actions={
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">Vetor de Recuperação</div>
            <div className="flex items-center gap-2">
              <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border", getRecoveryBadge(recoveryMomentum))}>
                {getRecoveryText(recoveryMomentum)}
              </span>
            </div>
          </div>
        }
      />

      {/* Row 1: CCS Score Gauge & Radar Axis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CCS score gauge and level card */}
        <div className="card-premium p-8 flex flex-col justify-between relative overflow-hidden group hover:border-border transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full blur-3xl pointer-events-none group-hover:bg-accent transition-all"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Rating de Crédito</span>
                <h3 className="text-lg font-medium text-muted-foreground mt-1">Score Comitê de Crédito</h3>
              </div>
              <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border", getScoreBg(ccsScore))}>
                {suggestedCreditRating}
              </span>
            </div>
            
            <div className="my-8 flex items-baseline gap-2">
              <span className={cn("text-7xl font-light tracking-tight transition-colors", getScoreColor(ccsScore))}>
                {ccsScore}
              </span>
              <span className="text-muted-foreground text-sm font-medium">/100</span>
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categoria de Atratividade:</div>
                <div className="text-sm font-semibold text-muted-foreground">{creditReadinessLevel}</div>
              </div>
              
              <div className="space-y-1 pt-2 border-t border-border">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Decisão Recomendada do Comitê:</div>
                <div className="flex items-center mt-1">
                  <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border", getDecisionBadge(creditDecisionSimulation))}>
                    {getDecisionText(creditDecisionSimulation)}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-border">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Grau de Confiança de Projeção:</div>
                <div className="flex items-center mt-1">
                  <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border", getConfidenceBadge(institutionalCreditConfidence))}>
                    {getConfidenceText(institutionalCreditConfidence)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border mt-6 flex justify-between items-center text-xs text-muted-foreground font-mono">
            <span>Risco de Rolagem:</span>
            <span className="font-bold text-muted-foreground uppercase">{refinancingRiskLevel}</span>
          </div>
        </div>

        {/* Radar Chart Card */}
        <div className="lg:col-span-2 card-premium p-8 flex flex-col justify-between hover:border-border transition-all duration-300">
          <div>
            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Análise de Eixos</span>
            <h3 className="text-lg font-medium text-muted-foreground mt-1">Atração a Crédito Multidimensional</h3>
          </div>
          <div className="h-[280px] w-full flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="currentColor" />
                <PolarAngleAxis dataKey="subject" stroke="currentColor" tick={{ fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="currentColor" tick={{ fontSize: 8 }} />
                <Radar name="Atratividade" dataKey="value" stroke="currentColor" fill="currentColor" fillOpacity={0.15} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-executive-primary)', borderRadius: '12px' }} 
                  labelStyle={{ color: 'var(--color-executive-primary)', fontSize: '11px', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--color-executive-primary)', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Underwriting Separation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-premium p-6 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Prontidão Bancária Estrutural (Banking Readiness)</h4>
              <p className="text-xs text-muted-foreground">Mapeamento fundamental de base da resiliência do balanço patrimonial.</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2 py-2">
            <span className={cn("text-5xl font-light", getScoreColor(bankingReadinessScore))}>{bankingReadinessScore}</span>
            <span className="text-muted-foreground text-sm font-medium">/100</span>
            <span className="text-xs text-muted-foreground font-semibold px-2 py-0.5 rounded-lg bg-slate-900 border border-border ml-4">
              {bankingReadinessLevel}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mapeia a conformidade passiva da estrutura. Uma empresa com score de prontidão moderado pode ser refinanciada caso possua colaterais defensáveis.
          </p>
        </div>

        <div className="card-premium p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Landmark className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Decisão Simulada do Comitê de Crédito</h4>
              <p className="text-xs text-muted-foreground">Simulação probabilística do resultado sob premissas severas de capital.</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2 py-2">
            <span className={cn("text-5xl font-light", getScoreColor(ccsScore))}>{ccsScore}</span>
            <span className="text-muted-foreground text-sm font-medium">/100</span>
            <span className={cn("px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase border ml-4", getDecisionBadge(creditDecisionSimulation))}>
              {getDecisionText(creditDecisionSimulation)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Incorpora gatilhos dinâmicos baseados no estresse do fluxo futuro de caixa e nas regras de propagação de quebra.
          </p>
        </div>
      </div>

      {/* FTE Projection & Delta Sensitivity Panel */}
      <div className="card-premium p-8 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">Forward Treasury Engine (FTE) — Projeções 12 Meses</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Simulação de liquidez futura e desvios (Deltas) relativos ao Base Scenario.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setShowDeltaView(!showDeltaView)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all uppercase",
                showDeltaView 
                  ? "bg-teal-500/10 border-teal-500/30 text-teal-400" 
                  : "bg-slate-950 border-border text-muted-foreground hover:text-muted-foreground"
              )}
            >
              {showDeltaView ? 'Ocultar Comparação Delta' : 'Exibir Visão Delta'}
            </button>

            <select
              value={selectedScenarioIndex}
              onChange={(e) => setSelectedScenarioIndex(Number(e.target.value))}
              className="bg-slate-950 border border-border text-muted-foreground text-xs rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 uppercase font-semibold"
            >
              {stressScenarios.map((sc: any, idx: number) => (
                <option key={idx} value={idx}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeScenario && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div>
                <span className="text-[10px] font-black tracking-widest text-primary uppercase">Cenário sob Análise</span>
                <h4 className="text-base font-bold text-muted-foreground mt-1">{activeScenario.name}</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Premissas estressadas: {activeScenario.assumptions}
                </p>
              </div>

              {activeScenario.cascadeLogs?.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-border bg-critical-soft0/5 p-3 rounded-lg border border-rose-500/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Propagação Causal (Contagion Path):</span>
                  </div>
                  <ul className="space-y-1">
                    {activeScenario.cascadeLogs.map((log: string, idx: number) => (
                      <li key={idx} className="text-[10px] font-mono text-rose-300 leading-tight">
                        • {log}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Quebras Finais Estimadas (12m):</span>
                <div className="space-y-1.5">
                  {activeScenario.breaches.map((br: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-rose-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{br}</span>
                    </div>
                  ))}
                  {activeScenario.breaches.length === 0 && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Estrutura sob conformidade no horizonte 12m</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recharts Chart Area */}
            <div className="lg:col-span-2 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" />
                  <XAxis dataKey="month" stroke="currentColor" tick={{ fontSize: 10 }} />
                  <YAxis stroke="currentColor" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-executive-primary)', borderRadius: '12px' }} 
                    labelStyle={{ color: 'var(--color-executive-primary)', fontSize: '11px', fontWeight: 600 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="Caixa Base" stroke="currentColor" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="Caixa Estressado" stroke="currentColor" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Delta Sensitivity Comparison Table */}
        {showDeltaView && activeScenario && baseScenario && (
          <div className="pt-6 border-t border-border space-y-3">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Spread de Sensibilidade (Deltas Base vs Estressado):</span>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-muted-foreground font-mono">
                <thead className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-2">Ciclo</th>
                    <th>Caixa Base</th>
                    <th>Caixa Estressado</th>
                    <th>Delta Caixa</th>
                    <th>Liquidez Base</th>
                    <th>Liquidez Estressada</th>
                    <th>Delta Liquidez</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {[0, 2, 5, 11].map(monthIdx => {
                    const basePt = baseScenario.trajectory[monthIdx];
                    const activePt = activeScenario.trajectory[monthIdx];
                    if (!basePt || !activePt) return null;
                    const cashDelta = activePt.cash - basePt.cash;
                    const liqDelta = Number((activePt.liquidityStDebt - basePt.liquidityStDebt).toFixed(2));
                    return (
                      <tr key={monthIdx} className="hover:bg-slate-950/20">
                        <td className="py-2.5 font-bold text-muted-foreground">Mês {basePt.month}</td>
                        <td>{formatCurrency(basePt.cash)}</td>
                        <td>{formatCurrency(activePt.cash)}</td>
                        <td className={cn("font-bold", cashDelta < 0 ? "text-rose-400" : "text-emerald-400")}>
                          {cashDelta > 0 ? '+' : ''}{formatCurrency(cashDelta)}
                        </td>
                        <td>{basePt.liquidityStDebt}x</td>
                        <td>{activePt.liquidityStDebt}x</td>
                        <td className={cn("font-bold", liqDelta < 0 ? "text-rose-400" : "text-emerald-400")}>
                          {liqDelta > 0 ? '+' : ''}{liqDelta}x
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Funding Gap Simulator & Timeline */}
      <div className="card-premium p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Percent className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-medium text-muted-foreground">Simulador de Funding Gap & Janelas de Rolagem</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Déficit acumulado projetado para restabelecer os patamares mínimos de liquidez.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Janela 30 Dias (t=1)', value: fundingGapTimeline['30d'] },
            { label: 'Janela 90 Dias (t=3)', value: fundingGapTimeline['90d'] },
            { label: 'Janela 180 Dias (t=6)', value: fundingGapTimeline['180d'] },
            { label: 'Janela 360 Dias (t=12)', value: fundingGapTimeline['360d'] }
          ].map((gap, idx) => (
            <div key={idx} className="bg-slate-950/30 p-4 border border-border rounded-xl space-y-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">{gap.label}</span>
              <div className="text-xl font-bold font-mono text-muted-foreground">
                {gap.value > 0 ? formatCurrency(gap.value) : 'Sem Funding Gap'}
              </div>
              <div className="text-[10px] text-muted-foreground leading-tight">
                {gap.value > 0 
                  ? 'Exposição fiduciária ativa. Necessário aporte/alongamento de capital.' 
                  : 'Nível de caixa acima da cobertura regulatória.'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Fracture Detection Engine */}
      <div className="card-premium p-8 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">Detector de Fraturas Estruturais Silenciosas</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Varredura de descompassos de caixa e crescimento destrutivo YoY.</p>
            </div>
          </div>
          {hasAnyWaiver && (
            <span className="px-2.5 py-1 rounded bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
              Filtro de Falsos Positivos Ativo
            </span>
          )}
        </div>

        <div className="space-y-4">
          {fractures.map((fr: any, idx: number) => (
            <div 
              key={idx} 
              className={cn(
                "p-4 rounded-xl border flex flex-col md:flex-row justify-between gap-4 items-start md:items-center transition-all duration-300",
                fr.active 
                  ? fr.waived 
                    ? "bg-teal-500/5 border-teal-500/10 text-teal-300"
                    : "bg-critical-soft0/5 border-rose-500/10 text-rose-300"
                  : "bg-slate-950/20 border-border text-muted-foreground opacity-60"
              )}
            >
              <div className="space-y-1 max-w-[700px]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono tracking-wide">{fr.name}</span>
                  {fr.active && (
                    <span className={cn("px-2 py-0.5 rounded text-[8px] font-bold font-mono", fr.waived ? "bg-teal-500/10 text-teal-400" : "bg-critical-soft0/10 text-rose-400")}>
                      {fr.waived ? 'WAIVED' : 'ATIVADA'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{fr.rationale}</p>
              </div>

              <div className="text-right text-xs font-semibold font-mono">
                {fr.active 
                  ? fr.waived 
                    ? 'Atenuado (Waiver ativo)' 
                    : '-15 Pontos de Penalidade' 
                  : 'Nenhum desvio detectado'}
              </div>
            </div>
          ))}
          {fractures.length === 0 && (
            <div className="text-center italic text-muted-foreground text-xs py-8">
              Mapeamento YoY indisponível (mínimo de 2 ciclos históricos requerido).
            </div>
          )}
        </div>
      </div>

      {/* Rastreabilidade Fiduciária e Auditoria */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rastreabilidade Fiduciária e Auditoria</h4>
        
        {/* Accordion 1: Trace */}
        <div className="border border-border rounded-xl overflow-hidden">
          <button 
            onClick={() => toggleSection('trace')}
            className="w-full flex justify-between items-center p-5 bg-slate-950/20 text-left text-sm font-semibold text-muted-foreground hover:bg-slate-950/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Diagnóstico e Salvaguardas Narrativas (Narrative Trace)
            </span>
            {expandedSection === 'trace' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedSection === 'trace' && (
            <div className="p-6 bg-slate-950/40 border-t border-border space-y-4 text-xs leading-relaxed text-muted-foreground">
              <div className="space-y-2">
                <span className="font-bold text-muted-foreground">Diagnóstico Higienizado:</span>
                <p className="p-3 bg-slate-950 rounded-xl border border-border text-muted-foreground font-mono italic">
                  {narrative?.diagnostic}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <span className="font-bold text-muted-foreground block">Vetor Causal:</span>
                  <span className="text-muted-foreground">{narrative?.cause}</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-muted-foreground block">Consequência Fiduciária:</span>
                  <span className="text-muted-foreground">{narrative?.consequence}</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-muted-foreground block">Sensibilidade Cíclica:</span>
                  <span className="text-muted-foreground">{narrative?.sensitivity}</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-muted-foreground block">Mitigador Recomendado:</span>
                  <span className="text-muted-foreground">{narrative?.priority}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Formula */}
        <div className="border border-border rounded-xl overflow-hidden">
          <button 
            onClick={() => toggleSection('formula')}
            className="w-full flex justify-between items-center p-5 bg-slate-950/20 text-left text-sm font-semibold text-muted-foreground hover:bg-slate-950/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-insight" />
              Modelo e Metodologia de Ponderação (CCS Model)
            </span>
            {expandedSection === 'formula' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedSection === 'formula' && (
            <div className="p-6 bg-slate-950/40 border-t border-border space-y-4 text-xs leading-relaxed text-muted-foreground">
              <p>
                O score consolidado CCS pondera as dimensões estratégicas reguladoras sob o limite de cascata `MAX_DEPTH = 5` para evitar feedback-loops infinitos de estresse.
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-border font-mono text-muted-foreground">
                {auditability.reconstructionLogic || 'CCS = (Treasury * 0.25) + (Earnings * 0.20) + (Capital * 0.20) + (Governance * 0.15) + (Longitudinal * 0.10) + (Covenant * 0.10)'}
              </div>
              <p>
                Racional de Conectividade: {auditability.fiduciaryRationale}
              </p>
              <p>
                Atenuador Early-Stage: {isEarlyStage ? 'ATIVADO (< 3 ciclos históricos)' : 'DESATIVADO (Maturidade temporal suficiente)'}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
