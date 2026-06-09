import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Scale, 
  ShieldCheck,
  Brain,
  Sliders,
  DollarSign,
  Zap,
  ArrowRight,
  TrendingUp,
  History,
  AlertCircle
} from 'lucide-react';
import { useAllFinancialData } from '../../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../../hooks/useInstitutionalRuntime';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn, formatCurrency } from '../../../lib/utils';
import { PageHeader } from '../../Common';
import { InvestigationLauncherWrapper } from '../../investigation/InvestigationLauncherWrapper';

interface SovereignDecisionCenterProps {
  clients?: any[];
  selectedClient?: string;
  selectedYear?: number;
}

export function SovereignDecisionCenter({ selectedClient, selectedYear }: SovereignDecisionCenterProps) {
  const filterYear = selectedYear || new Date().getFullYear();
  const { t } = useLanguage();

  // Fetch history data
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient || '');

  // Run runtime engines
  const { runtimeOutput, loading: runtimeLoading } = useInstitutionalRuntime({
    input: {
      clientId: selectedClient,
      rawFinancialData: {
        filterYear,
        allHistoryData
      }
    }
  });

  const [expandedDecisionId, setExpandedDecisionId] = useState<string | null>(null);
  const [selectedSimDecisionId, setSelectedSimDecisionId] = useState<string>('preserve_cash');
  const [selectedTimelineTab, setSelectedTimelineTab] = useState<'immediate' | 'short' | 'medium' | 'long'>('immediate');

  const sdeInference = useMemo(() => {
    return runtimeOutput?.inferences?.['SovereignDecisionEngine'];
  }, [runtimeOutput]);

  const metrics = sdeInference?.metrics || {};
  const {
    sdsUrgency = 50,
    sdsHealth = 50,
    executionCapacity = 70,
    decisionFatigueIndex = 30,
    domainScores = { treasury: 50, capital: 50, growth: 50, profitability: 50, governance: 50, strategic: 50 },
    capitalAllocationRanking = [],
    pathways = {
      conservative: { name: 'Conservador', probability: 80, decisions: [], description: '' },
      balanced: { name: 'Balanceado', probability: 60, decisions: [], description: '' },
      aggressive: { name: 'Agressivo', probability: 30, decisions: [], description: '' }
    },
    timelineDecisions = { immediate: [], shortTerm: [], mediumTerm: [], longTerm: [] },
    topDecisions = [],
    allDecisions = [],
    conflicts = [],
    decisionScenarioMatrix = {},
    alerts = [],
    isEarlyStage = false,
    isCriticalConstraintActive = false,
    auditability = {}
  } = metrics;

  const currentSimDecision = useMemo(() => {
    return allDecisions.find((d: any) => d.id === selectedSimDecisionId) || allDecisions[0];
  }, [allDecisions, selectedSimDecisionId]);

  if (loadingHistory || runtimeLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-sm text-slate-500 font-medium">Orquestrando Inteligência de Decisão Soberana...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Centro de Decisão Soberana (SDE)"
          subtitle="Priorização, Sequenciamento de Ações e Simulação de Consequências Fiduciárias."
          icon={Brain}
          transparent
        />
        {isEarlyStage && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-800 rounded-xl text-xs font-semibold">
            <ShieldCheck size={14} /> Amortecimento Early-Stage Ativo
          </div>
        )}
      </div>

      {/* ── ALERTS PANEL ── */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {alerts.map((alert: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-bold text-amber-950">Aviso do Conselho de Administração</h4>
                <p className="text-xs text-amber-900 mt-0.5">{alert}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HERO METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* SDS Urgency */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden text-white shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity size={120} className="text-white" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sovereign Decision Urgency</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight">{sdsUrgency}</span>
            <span className="text-slate-500 font-bold">/ 100</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                sdsUrgency >= 75 ? "bg-rose-500" : sdsUrgency >= 50 ? "bg-amber-500" : "bg-emerald-500"
              )}
              style={{ width: `${sdsUrgency}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            {sdsUrgency >= 75 ? "Nível Crítico: Ações imediatas exigidas." : sdsUrgency >= 50 ? "Nível Moderado: Atenção necessária." : "Nível Estável: Baixa urgência."}
          </p>
        </div>

        {/* SDS Health */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck size={120} className="text-slate-800" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Decision Health & Readiness</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight text-slate-800">{sdsHealth}</span>
            <span className="text-slate-400 font-bold">/ 100</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                sdsHealth >= 80 ? "bg-emerald-500" : sdsHealth >= 60 ? "bg-amber-500" : "bg-rose-500"
              )}
              style={{ width: `${sdsHealth}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            {isCriticalConstraintActive ? "SDS Capped due to Critical constraints." : "Preparação fiduciária geral calculada."}
          </p>
        </div>

        {/* ECE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Execution Capacity (ECE)</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight text-slate-800">{executionCapacity}</span>
            <span className="text-slate-400 font-bold">/ 100</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${executionCapacity}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            Aderência a conselhos e estabilidade operacional.
          </p>
        </div>

        {/* DFI */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Decision Fatigue Index</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight text-slate-800">{decisionFatigueIndex}</span>
            <span className="text-slate-400 font-bold">/ 100</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                decisionFatigueIndex > 70 ? "bg-rose-500" : "bg-slate-400"
              )} 
              style={{ width: `${decisionFatigueIndex}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            {decisionFatigueIndex > 70 ? "Alerta: Risco de sobrecarga do Board." : "Nível saudável de initiatives."}
          </p>
        </div>
      </div>

      {/* ── TWO COLUMN MAIN BODY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Decision Priority Board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Decision Priority Board</h3>
                <p className="text-xs text-slate-500 mt-0.5">Top 10 decisões prioritárias geradas de forma determinística.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {topDecisions.map((dec: any, idx: number) => {
                const isExpanded = expandedDecisionId === dec.id;
                return (
                  <div key={dec.id} className={cn("p-6 transition-all", isExpanded ? "bg-slate-50/50" : "hover:bg-slate-50/20")}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedDecisionId(isExpanded ? null : dec.id)}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {dec.label}
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight uppercase",
                              dec.classification === 'STABILIZE' ? "bg-rose-50 border border-rose-200 text-rose-800" :
                              dec.classification === 'RESTRUCTURE' ? "bg-amber-50 border border-amber-200 text-amber-800" :
                              dec.classification === 'PRESERVE' ? "bg-sky-50 border border-sky-200 text-sky-800" :
                              "bg-indigo-50 border border-indigo-200 text-indigo-800"
                            )}>
                              {dec.classification}
                            </span>
                            <div onClick={(e) => e.stopPropagation()}>
                              <InvestigationLauncherWrapper 
                                tenantId="SYSTEM_TENANT" 
                                nodeId={dec.id} 
                                originSurface="CONSTITUTIONAL" 
                              />
                            </div>
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">Domínios: {dec.originatingMetrics.join(', ') || 'Geral'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 self-end sm:self-auto">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DPI SCORE</p>
                          <p className="text-lg font-extrabold text-slate-800">{dec.dpi}<span className="text-xs text-slate-400">/100</span></p>
                        </div>
                        {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 animate-slide-down">
                        <div className="space-y-4">
                          <div>
                            <p className="font-bold text-slate-800">Diretriz & Racional</p>
                            <p className="mt-1 text-slate-600 leading-relaxed">{dec.rationale}</p>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">Trade-offs de Execução</p>
                            <div className="mt-2 space-y-2">
                              <p className="leading-relaxed"><strong className="text-emerald-700">Benefício esperado:</strong> {dec.benefits}</p>
                              <p className="leading-relaxed"><strong className="text-rose-700">Riscos e Efeitos Colaterais:</strong> {dec.risks}</p>
                              <p className="leading-relaxed"><strong className="text-slate-700">Custo de Oportunidade:</strong> {dec.opportunityCost}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/50">
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-1.5">
                              <Scale size={14} className="text-indigo-600" /> Parâmetros de Prioridade
                            </p>
                            <div className="grid grid-cols-3 gap-3 mt-2.5">
                              <div className="bg-white p-2 rounded-xl border border-slate-200/40 text-center">
                                <span className="block text-[9px] font-semibold text-slate-400 uppercase">Urgência</span>
                                <span className="font-extrabold text-slate-800">{dec.urgency}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-slate-200/40 text-center">
                                <span className="block text-[9px] font-semibold text-slate-400 uppercase">Impacto</span>
                                <span className="font-extrabold text-slate-800">{dec.impact}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-slate-200/40 text-center">
                                <span className="block text-[9px] font-semibold text-slate-400 uppercase">Sobrevivência</span>
                                <span className="font-extrabold text-slate-800">{dec.survivability}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-slate-200/40 text-center">
                                <span className="block text-[9px] font-semibold text-slate-400 uppercase">Redução Risco</span>
                                <span className="font-extrabold text-slate-800">{dec.riskReduction}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-slate-200/40 text-center">
                                <span className="block text-[9px] font-semibold text-slate-400 uppercase">Viabilidade</span>
                                <span className="font-extrabold text-slate-800">{dec.feasibility}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-slate-200/40 text-center">
                                <span className="block text-[9px] font-semibold text-slate-400 uppercase">DRS</span>
                                <span className="font-extrabold text-slate-800">{dec.dependencyReadiness}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">Conexão de Dependência</p>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{dec.dependencies}</p>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>Audit Lineage ID:</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded border select-all" title={dec.lineageHash}>{dec.lineageHash.substring(0, 16)}...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Capital Allocation & Trade-Off Matrix */}
        <div className="space-y-6">
          {/* Capital Allocation Ranking */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Direcionamento de Capital</h3>
              <p className="text-xs text-slate-500">Ordem recomendada para alocação do próximo real/dólar.</p>
            </div>
            <div className="space-y-3">
              {capitalAllocationRanking.map((alloc: any) => (
                <div key={alloc.rank} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {alloc.rank}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{alloc.destination}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{alloc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade-Off / Conflict Matrix */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Filtro de Conflitos</h3>
              <p className="text-xs text-slate-500">Contradições de diretrizes táticas com severidade dinâmica.</p>
            </div>
            <div className="space-y-4">
              {conflicts.length > 0 ? (
                conflicts.map((conf: any) => (
                  <div key={conf.id} className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">CHOQUE DE DIRETRIZES</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-bold tracking-tight uppercase",
                        conf.severity === 'CRITICAL' ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
                      )}>
                        {conf.severity} ({conf.score})
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">{conf.decA} vs {conf.decB}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{conf.explanation}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-slate-400 text-center">
                  <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
                  <p className="text-xs font-medium">Nenhum choque de diretrizes ativo no ciclo atual.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECOND ROW: DECISION CASCADE VIEWER & SCENARIO SIMULATOR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cascade Viewer */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Cascade Decision Viewer</h3>
            <p className="text-xs text-slate-500">Mapeamento dinâmico de consequências de segunda ordem da recomendação selecionada.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Selecione uma Recomendação</label>
              <select 
                value={selectedSimDecisionId} 
                onChange={(e) => setSelectedSimDecisionId(e.target.value)}
                className="mt-1 block w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {allDecisions.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {currentSimDecision && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-bold shrink-0">1</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Efeito Direto Primário</h4>
                  <p className="text-xs text-slate-600 mt-1">{currentSimDecision.directEffect}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold shrink-0">2</div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-800">Efeito Indireto Secundário</h4>
                  <p className="text-xs text-slate-600 mt-1">{currentSimDecision.indirectEffect}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold shrink-0">3</div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-800">Efeito Sistêmico Fiduciário</h4>
                  <p className="text-xs text-slate-600 mt-1">{currentSimDecision.systemicEffect}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scenario Decision Simulator */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Scenario Decision Simulator</h3>
            <p className="text-xs text-slate-500">Projeção da decisão selecionada sob diferentes estresses macroeconômicos.</p>
          </div>

          {currentSimDecision && decisionScenarioMatrix[currentSimDecision.id] && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800">Cenários de Estresse para: {currentSimDecision.label}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(decisionScenarioMatrix[currentSimDecision.id]).map(([scName, scVal]: [string, any]) => (
                  <div key={scName} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{scName}</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                      <div>
                        <strong className="block text-slate-700">Liquidez:</strong>
                        {scVal.liquidityImpact}
                      </div>
                      <div>
                        <strong className="block text-slate-700">Covenants:</strong>
                        {scVal.covenantImpact}
                      </div>
                      <div>
                        <strong className="block text-slate-700">Continuity:</strong>
                        {scVal.survivabilityImpact}
                      </div>
                      <div>
                        <strong className="block text-slate-700">Financiabilidade:</strong>
                        {scVal.financeabilityImpact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── THIRD ROW: TIMELINE & PATHWAYS ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-800">Executive Action Timeline</h3>
          <p className="text-xs text-slate-500">Sequenciamento temporal de iniciativas táticas e caminhos estratégicos recomendados.</p>
        </div>

        {/* Timeline Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-max">
          <button
            onClick={() => setSelectedTimelineTab('immediate')}
            className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", selectedTimelineTab === 'immediate' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            Imediato (0-30 dias)
          </button>
          <button
            onClick={() => setSelectedTimelineTab('short')}
            className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", selectedTimelineTab === 'short' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            Curto Prazo (30-90 dias)
          </button>
          <button
            onClick={() => setSelectedTimelineTab('medium')}
            className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", selectedTimelineTab === 'medium' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            Médio Prazo (90-180 dias)
          </button>
          <button
            onClick={() => setSelectedTimelineTab('long')}
            className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", selectedTimelineTab === 'long' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            Longo Prazo (180+ dias)
          </button>
        </div>

        {/* Action Items for Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Clock size={14} className="text-indigo-600" /> Ações Programadas</h4>
            {(() => {
              const currentList = selectedTimelineTab === 'immediate' ? timelineDecisions.immediate :
                                  selectedTimelineTab === 'short' ? timelineDecisions.shortTerm :
                                  selectedTimelineTab === 'medium' ? timelineDecisions.mediumTerm :
                                  timelineDecisions.longTerm;

              if (!currentList || currentList.length === 0) {
                return <p className="text-xs text-slate-400">Nenhuma decisão recomendada para este horizonte temporal.</p>;
              }

              return currentList.map((id: string) => {
                const dec = allDecisions.find((d: any) => d.id === id);
                if (!dec) return null;
                return (
                  <div key={dec.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <h5 className="text-xs font-bold text-slate-800">{dec.label}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">{dec.benefits}</p>
                  </div>
                );
              });
            })()}
          </div>

          {/* Pathway Viabilities */}
          <div className="space-y-4 border-l border-slate-100 pl-6">
            <h4 className="text-xs font-bold text-slate-800">Vias Estratégicas Alternativas</h4>
            <div className="space-y-3">
              {Object.entries(pathways).map(([pathId, pathVal]: [string, any]) => (
                <div key={pathId} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-800">{pathVal.name}</h5>
                    <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                      {pathVal.probability}% viabilidade
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{pathVal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
