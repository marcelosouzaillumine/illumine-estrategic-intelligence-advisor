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
  AlertCircle,
  FileText,
  User,
  CheckCircle,
  XCircle,
  RefreshCw,
  FolderLock
} from 'lucide-react';
import { useAllFinancialData } from '../../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../../hooks/useInstitutionalRuntime';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn, formatCurrency } from '../../../lib/utils';
import { PageHeader } from '../../Common';

interface ExecutiveExecutionCenterProps {
  clients?: any[];
  selectedClient?: string;
  selectedYear?: number;
}

export function ExecutiveExecutionCenter({ selectedClient, selectedYear }: ExecutiveExecutionCenterProps) {
  const filterYear = selectedYear || new Date().getFullYear();
  const { t } = useLanguage();

  // Fetch history data
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient || '');

  // Run runtime engines including SDE and E3
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

  const e3Inference = useMemo(() => {
    return runtimeOutput?.inferences?.['ExecutiveExecutionEngine'];
  }, [runtimeOutput]);

  const metrics = e3Inference?.metrics || {};
  const {
    eesScore = 100,
    eesClassification = 'Strong Institutional Execution',
    compliance = 100,
    velocity = 100,
    dvrs = 100,
    dvrClassification = 'FULL_VALUE_REALIZATION',
    accountabilityScore = 100,
    alignmentScore = 100,
    learningScore = 100,
    dphs = 100,
    iddsScore = 0,
    iddsLevel = 'LOW',
    capacityForecast = 'HIGH',
    ceilingsApplied = [],
    strategicGaps = [],
    frictionCounts = {},
    escalations = [],
    decisions = [],
    isEarlyStage = false,
    isSmallOrg = false
  } = metrics;

  const toggleExpandDecision = (id: string) => {
    setExpandedDecisionId(prev => prev === id ? null : id);
  };

  if (loadingHistory || runtimeLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground font-medium">Orquestrando Indicadores do Executive Execution Engine (E3)...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Centro de Execução Executiva (E3)"
          subtitle="Medição de eficácia executiva, conformidade de evidências, endividamento de decisões e accountability."
          icon={ShieldCheck}
          transparent
        />
        <div className="flex items-center gap-2">
          {isEarlyStage && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-800 rounded-xl text-xs font-semibold">
              <ShieldCheck size={14} /> Amortecimento Early-Stage Ativo
            </div>
          )}
          {isSmallOrg && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
              <Info size={14} /> Penalidades de PME Atenuadas (50%)
            </div>
          )}
        </div>
      </div>

      {/* ── ESCALATION & GAP ALERTS ── */}
      {(escalations.length > 0 || strategicGaps.length > 0 || ceilingsApplied.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overdue Escalation Alerts */}
          {escalations.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 text-rose-950 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <AlertCircle size={18} />
                <span>Protocolo de Escalonamento Ativo ({escalations.length})</span>
              </div>
              <div className="space-y-2 mt-2">
                {escalations.map((esc: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/60 border border-rose-100 rounded-xl">
                    <span className="font-semibold text-rose-900">{esc.title}</span>
                    <span className="px-2 py-0.5 bg-rose-600 text-white rounded-lg font-bold text-[10px]">
                      {esc.level} ({esc.overdueDays}d atrasado)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Execution Gaps */}
          {strategicGaps.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-950 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <AlertTriangle size={18} />
                <span>Lacunas de Execução Estratégica (Strategic Gaps)</span>
              </div>
              <p className="text-xs text-amber-900">
                Recomendações prioritárias do SDE que não foram aprovadas ou executadas pela governança:
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {strategicGaps.map((gap: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 bg-amber-100/80 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold">
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HERO METRICS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* EES Executive Execution Score */}
        <div className="bg-slate-900 border border-border rounded-3xl p-6 relative overflow-hidden text-white shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity size={120} className="text-white" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Executive Execution Score (EES)</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight">{eesScore}</span>
            <span className="text-muted-foreground font-bold">/ 100</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                eesScore >= 85 ? "bg-emerald-500" : eesScore >= 70 ? "bg-blue-500" : eesScore >= 50 ? "bg-amber-500" : "bg-rose-500"
              )}
              style={{ width: `${eesScore}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 font-semibold">
            {eesClassification}
          </p>
          {ceilingsApplied.length > 0 && (
            <div className="mt-2 text-[10px] text-rose-400 font-semibold flex flex-wrap gap-1">
              <span>Teto aplicado:</span>
              {ceilingsApplied.map((c: string) => (
                <span key={c} className="underline">{c}</span>
              ))}
            </div>
          )}
        </div>

        {/* DPHS Portfolio Health */}
        <div className="bg-slate-900 border border-border rounded-3xl p-6 relative overflow-hidden text-white shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap size={120} className="text-white" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Portfolio Health (DPHS)</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight">{dphs}</span>
            <span className="text-muted-foreground font-bold">/ 100</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                dphs >= 75 ? "bg-emerald-500" : dphs >= 50 ? "bg-amber-500" : "bg-rose-500"
              )}
              style={{ width: `${dphs}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 font-medium">
            {dphs >= 75 ? "Portfólio Operacional Balanceado" : "Desequilíbrio de Portfólio Ativo"}
          </p>
        </div>

        {/* IDDS Decision Debt */}
        <div className="bg-slate-900 border border-border rounded-3xl p-6 relative overflow-hidden text-white shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Clock size={120} className="text-white" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Decision Debt (IDDS)</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight">{iddsScore}</span>
            <span className="text-muted-foreground font-bold">/ 100</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                iddsLevel === 'CRITICAL' ? "bg-rose-500" : iddsLevel === 'HIGH' ? "bg-amber-500" : "bg-emerald-500"
              )}
              style={{ width: `${iddsScore}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 font-bold uppercase">
            Nível: {iddsLevel}
          </p>
        </div>

        {/* Execution Capacity Forecast */}
        <div className="bg-slate-900 border border-border rounded-3xl p-6 relative overflow-hidden text-white shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Brain size={120} className="text-white" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Capacity Forecast</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight">{capacityForecast}</span>
          </div>
          <div className="mt-7 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                capacityForecast === 'HIGH' ? "bg-emerald-500" : capacityForecast === 'MODERATE' ? "bg-blue-500" : "bg-rose-500"
              )}
              style={{ width: capacityForecast === 'HIGH' ? '100%' : capacityForecast === 'MODERATE' ? '65%' : '30%' }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 font-medium">
            {capacityForecast === 'HIGH' ? "Pronto para novos planos" : "Restrição de novos projetos ativa"}
          </p>
        </div>
      </div>

      {/* ── SUB-SCORES BREAKDOWN ── */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Conformidade', score: compliance, icon: CheckCircle2, desc: 'Decisões Completas / Aprovadas' },
          { label: 'Velocidade', score: velocity, icon: Clock, desc: 'Decisões no Prazo' },
          { label: 'Realização (DVRS)', score: dvrs, icon: DollarSign, desc: 'Eficácia de Benefícios' },
          { label: 'Accountability', score: accountabilityScore, icon: User, desc: 'Responsabilização & Owners' },
          { label: 'Alinhamento', score: alignmentScore, icon: Scale, desc: 'Consistência com SDE' },
          { label: 'Aprendizado', score: learningScore, icon: History, desc: 'Prevenção de Recorrências' }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white border border-border rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <Icon size={16} />
                <span className="text-xs font-semibold text-muted-foreground">Pilar {index+1}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{item.score}%</p>
                <p className="text-xs font-bold text-muted-foreground truncate">{item.label}</p>
                <p className="text-[9px] text-muted-foreground truncate mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── KANBAN BOARD & FRICTION ANALYSIS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kanban pipeline summary */}
        <div className="lg:col-span-2 bg-white border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
            <Sliders size={16} />
            <span>Fiduciary Kanban Pipeline</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
            {['PROPOSED', 'APPROVED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED'].map(col => {
              const matches = decisions.filter((d: any) => d.status === col);
              return (
                <div key={col} className="bg-slate-50/50 border border-border p-3 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center border-b border-border pb-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{col.replace('_', ' ')}</span>
                    <span className="px-1.5 py-0.5 bg-slate-200 text-muted-foreground rounded-md font-bold text-[9px]">{matches.length}</span>
                  </div>
                  <div className="space-y-1.5 max-h-[250px] overflow-y-auto">
                    {matches.map((dec: any) => (
                      <div key={dec.decisionId} className="bg-white border border-border p-2 rounded-xl text-[10px] shadow-xs space-y-1">
                        <p className="font-bold text-muted-foreground truncate">{dec.title}</p>
                        <p className="text-[9px] text-muted-foreground truncate">{dec.owner || 'Sem owner'}</p>
                      </div>
                    ))}
                    {matches.length === 0 && (
                      <p className="text-[9px] text-muted-foreground text-center py-4 italic">Nenhum</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Friction Category Counts */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
            <AlertCircle size={16} />
            <span>Friction Root Causes</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Gargalos operacionais detectados que causam atrasos ou bloqueios:</p>
          <div className="space-y-2.5 mt-4">
            {Object.keys(frictionCounts).length > 0 ? (
              Object.entries(frictionCounts).map(([friction, count]: [string, any]) => (
                <div key={friction} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 border border-border rounded-xl">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wide text-[9px]">{friction.replace('_', ' ')}</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-muted-foreground rounded-lg font-extrabold text-[10px]">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic py-8 text-center">Nenhum atrito registrado no ciclo atual.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── REGISTER TABLE ── */}
      <div className="bg-white border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
          <FileText size={16} />
          <span>Executive Evidence & Accountability Register</span>
        </h3>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead>
              <tr className="text-left font-bold text-muted-foreground uppercase tracking-wider bg-slate-50/50">
                <th className="p-3">Decisão</th>
                <th className="p-3">Responsável</th>
                <th className="p-3">Status</th>
                <th className="p-3">Evidências</th>
                <th className="p-3">Data Alvo</th>
                <th className="p-3">Eficácia (DVRS)</th>
                <th className="p-3">Fricção</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-muted-foreground">
              {decisions.map((dec: any) => {
                const isExpanded = expandedDecisionId === dec.decisionId;
                const evTypes = dec.evidence?.map((e: any) => e.type).join(', ') || 'Nenhuma';
                const effectivenessVal = dec.expectedValue && dec.expectedValue > 0 
                  ? Math.round((dec.realizedValue ?? 0) / dec.expectedValue * 100) + '%' 
                  : 'N/A';
                
                return (
                  <React.Fragment key={dec.decisionId}>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-muted-foreground">{dec.title}</td>
                      <td className="p-3 text-muted-foreground">{dec.owner || <span className="text-rose-500 font-bold">MISSING OWNER</span>}</td>
                      <td className="p-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md font-bold text-[9px] uppercase",
                          dec.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-800" :
                          dec.status === 'PARTIALLY_COMPLETED' ? "bg-blue-100 text-blue-800" :
                          dec.status === 'BLOCKED' ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-muted-foreground"
                        )}>
                          {dec.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground italic max-w-[150px] truncate">{evTypes}</td>
                      <td className="p-3 text-muted-foreground font-mono">{dec.targetDate}</td>
                      <td className="p-3 font-semibold text-muted-foreground">{effectivenessVal}</td>
                      <td className="p-3 text-muted-foreground">{dec.rootFriction || 'Nenhuma'}</td>
                      <td className="p-3">
                        <button 
                          onClick={() => toggleExpandDecision(dec.decisionId)}
                          className="flex items-center gap-1 text-primary hover:underline font-bold text-xs"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Detalhes
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/30">
                        <td colSpan={8} className="p-4 border-t border-border text-xs">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                            <div className="space-y-2">
                              <p className="font-bold text-muted-foreground">Descrição do Escopo:</p>
                              <p className="text-muted-foreground leading-relaxed">{dec.description}</p>
                              <p className="font-bold text-muted-foreground mt-3">Metas esperadas:</p>
                              <p className="text-muted-foreground italic">"{dec.expectedOutcome || 'Não especificado'}"</p>
                              {dec.actualOutcome && (
                                <>
                                  <p className="font-bold text-muted-foreground mt-2">Resultado Realizado:</p>
                                  <p className="text-muted-foreground italic">"{dec.actualOutcome}"</p>
                                </>
                              )}
                            </div>
                            <div className="space-y-3 bg-white p-4 rounded-2xl border border-border">
                              <p className="font-bold text-muted-foreground border-b border-border pb-1.5">Evidências Anexadas ({dec.evidence?.length || 0})</p>
                              {dec.evidence?.length > 0 ? (
                                dec.evidence.map((ev: any, idx: number) => (
                                  <div key={idx} className="p-2 bg-slate-50 rounded-xl space-y-1">
                                    <p className="font-bold text-[10px] text-muted-foreground uppercase">{ev.type}</p>
                                    <p className="text-muted-foreground text-[11px]">{ev.description}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-muted-foreground italic text-[11px]">Nenhuma evidência fiduciária fornecida.</p>
                              )}

                              {dec.abandonmentJustification && (
                                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl space-y-1.5 mt-2">
                                  <p className="font-bold text-amber-900">Justificativa de Cancelamento/Superação:</p>
                                  <p className="text-amber-800 text-[11px]">"{dec.abandonmentJustification.reason}"</p>
                                  <p className="text-[10px] text-amber-700">Autoridade de aprovação: <b>{dec.abandonmentJustification.approvingAuthority}</b></p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
