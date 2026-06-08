import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  GitFork, 
  AlertOctagon, 
  CheckCircle, 
  HelpCircle, 
  Filter, 
  RefreshCw, 
  Layers, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useAllFinancialData } from '../../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../../hooks/useInstitutionalRuntime';
import { cn, formatCurrency } from '../../../lib/utils';
import { PageHeader } from '../../Common';
import { FinancialLineageIntegrityAdapter } from '../../../runtime/adapters/FinancialLineageIntegrityAdapter';

interface FinancialLineageCenterProps {
  selectedClient?: string;
  selectedYear?: number;
}

export function FinancialLineageCenter({ selectedClient, selectedYear }: FinancialLineageCenterProps) {
  const filterYear = selectedYear || new Date().getFullYear();

  // Fetch historical data
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

  const [filterType, setFilterType] = useState<'ALL' | 'VIOLATIONS' | 'WARNINGS' | 'CRITICAL'>('ALL');

  // Perform dynamic full-context lineage audit
  const flifAuditResult = useMemo(() => {
    if (!runtimeOutput) return null;
    return FinancialLineageIntegrityAdapter.audit(runtimeOutput.context);
  }, [runtimeOutput]);

  const flifInference = useMemo(() => {
    return runtimeOutput?.inferences?.['FinancialLineageIntegrityAdapter'];
  }, [runtimeOutput]);

  if (loadingHistory || runtimeLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-400">
        <Activity className="w-8 h-8 animate-pulse text-indigo-400" />
        <span className="text-sm font-medium tracking-wide uppercase">Executando Auditoria Fiduciária de Linhagem (FLIF)...</span>
      </div>
    );
  }

  const {
    auditedMetrics = [],
    edrs = 100,
    reliabilityClassification = 'Alta Confiabilidade',
    lineageBreaksCount = 0,
    fallbackViolationsCount = 0,
    renderMismatchesCount = 0,
    crossEngineInconsistenciesCount = 0,
    violations = []
  } = flifAuditResult || flifInference?.metrics || {};

  const filteredMetrics = auditedMetrics.filter((m: any) => {
    if (filterType === 'VIOLATIONS') return m.status === 'VIOLATION';
    if (filterType === 'WARNINGS') return m.status === 'WARNING';
    if (filterType === 'CRITICAL') return ['lucroLiquido', 'ebitda', 'receitaLiquida', 'fcoOperacional', 'caixaFinal'].includes(m.metricId);
    return true;
  });

  const getReliabilityBg = (v: number) => {
    if (v >= 90) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    if (v >= 70) return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
    if (v >= 50) return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
    return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
  };

  const getReliabilityColor = (v: number) => {
    if (v >= 90) return 'text-emerald-400';
    if (v >= 70) return 'text-yellow-400';
    if (v >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  // Chronological metrics value mapping for Timeline propagation
  const timelineNodes = [
    {
      id: 'BP',
      title: 'Balanço Patrimonial',
      metric: 'Caixa Final (Real)',
      val: bpSummary()?.caixaEquivalentes,
      color: 'border-blue-500 text-blue-400 bg-blue-500/5'
    },
    {
      id: 'DFC',
      title: 'Fluxo de Caixa',
      metric: 'FCO Oficial',
      val: dfcMetrics()?.fco,
      color: 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
    },
    {
      id: 'CQS',
      title: 'Cash Quality Score',
      metric: 'CQS Score',
      val: dfcMetrics()?.fiduciary?.cashQuality?.score ?? dfcMetrics()?.fiduciary?.score ?? 'N/A',
      color: 'border-primary text-primary bg-primary'
    },
    {
      id: 'EQE',
      title: 'Earnings Quality',
      metric: 'Lucro Líquido Real',
      val: dfcMetrics()?.lucroLiquido,
      color: 'border-pink-500 text-pink-400 bg-pink-500/5'
    },
    {
      id: 'ENE',
      title: 'Economic Normalization',
      metric: 'EBITDA Normalizado',
      val: eneMetrics()?.ebitda?.normalizado,
      color: 'border-yellow-500 text-yellow-400 bg-yellow-500/5'
    },
    {
      id: 'CCS',
      title: 'Credit Simulator',
      metric: 'Readiness Score',
      val: ccsMetrics()?.score,
      color: 'border-orange-500 text-orange-400 bg-orange-500/5'
    },
    {
      id: 'SDE',
      title: 'Sovereign Decision',
      metric: 'Urgency Score',
      val: sdeMetrics()?.score,
      color: 'border-teal-500 text-teal-400 bg-teal-500/5'
    },
    {
      id: 'E3',
      title: 'Executive Execution',
      metric: 'Execution Score',
      val: e3Metrics()?.score,
      color: 'border-rose-500 text-rose-400 bg-rose-500/5'
    }
  ];

  function bpSummary() {
    return runtimeOutput?.inferences?.['LegacyFinancialAdapter']?.metrics?.bpSummary || {};
  }
  function dfcMetrics() {
    return runtimeOutput?.inferences?.['LegacyDFCAdapter']?.metrics || {};
  }
  function eneMetrics() {
    return runtimeOutput?.inferences?.['EconomicNormalizationAdapter']?.metrics || {};
  }
  function ccsMetrics() {
    return runtimeOutput?.inferences?.['CreditCommitteeSimulatorAdapter']?.metrics || {};
  }
  function sdeMetrics() {
    return runtimeOutput?.inferences?.['SovereignDecisionAdapter']?.metrics || {};
  }
  function e3Metrics() {
    return runtimeOutput?.inferences?.['ExecutiveExecutionAdapter']?.metrics || {};
  }

  const formatDisplayVal = (val: any) => {
    if (typeof val === 'number') {
      return formatCurrency(val);
    }
    return val !== undefined && val !== null ? String(val) : 'N/A';
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Page Header */}
      <PageHeader 
        title="Lineagem Fiduciária (FLIF)"
        subtitle="Rastreabilidade contínua de propagação econômica, assegurando que o dado de origem (BP/DRE/DFC) permaneça íntegro em toda a análise fiduciária."
        icon={GitFork}
        transparent
        actions={
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Status da Linhagem</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Monitoramento Ativo</span>
            </div>
          </div>
        }
      />

      {/* Row 1: EDRS Gauge & Metric counters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gauge card */}
        <div className="card-premium p-8 flex flex-col justify-between relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Lineage Reliability Index</span>
                <h3 className="text-lg font-medium text-slate-100 mt-1">Executive Data Reliability Score</h3>
              </div>
              <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border", getReliabilityBg(edrs))}>
                {reliabilityClassification}
              </span>
            </div>
            
            <div className="my-8 flex items-baseline gap-2">
              <span className={cn("text-7xl font-light tracking-tight transition-colors", getReliabilityColor(edrs))}>
                {edrs}
              </span>
              <span className="text-slate-500 text-lg">/100</span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
              Calculado dinamicamente com base nas violações de linhagem, fallbacks de dados contábeis e divergências entre as engines da governança.
            </p>
          </div>

          <div className="pt-6 border-t border-border/10 flex justify-between items-center text-xs">
            <span className="text-slate-500 uppercase font-semibold">Classification:</span>
            <span className={cn("font-bold uppercase tracking-wide", getReliabilityColor(edrs))}>{reliabilityClassification}</span>
          </div>
        </div>

        {/* Counter cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="card-premium p-6 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Auditado</span>
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-4xl font-light text-slate-100">{auditedMetrics.length}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-1 tracking-wider font-bold">Métricas Financeiras Núcleo</div>
            </div>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quebras de Linhagem</span>
              <GitFork className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <div className="text-4xl font-light text-slate-100">{lineageBreaksCount}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-1 tracking-wider font-bold">Divergências Origem x Consumido</div>
            </div>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Divergências de Render</span>
              <AlertOctagon className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-4xl font-light text-slate-100">{renderMismatchesCount}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-1 tracking-wider font-bold">Divergências Engine x Dashboard</div>
            </div>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cross-Engine Inconsistencies</span>
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-4xl font-light text-slate-100">{crossEngineInconsistenciesCount}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-1 tracking-wider font-bold">Inconsistências Downstream</div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Matrix & Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/10 pb-4">
          <div>
            <h2 className="text-lg font-medium text-slate-200">Matriz de Integridade de Linhagem (FLIF Matrix)</h2>
            <p className="text-xs text-slate-500 font-light mt-1">Comparação determinística de propagação fiduciária.</p>
          </div>
          
          {/* Filters controls */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <div className="flex bg-slate-950/60 p-1 rounded-xl border border-border/10">
              {(['ALL', 'VIOLATIONS', 'WARNINGS', 'CRITICAL'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                    filterType === t 
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {t === 'ALL' ? 'Todas' : t === 'VIOLATIONS' ? 'Violações' : t === 'WARNINGS' ? 'Alertas' : 'Críticas'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/10 bg-slate-950/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Métrica</th>
                  <th className="py-4 px-6">Fonte Original</th>
                  <th className="py-4 px-6">Valor na Fonte</th>
                  <th className="py-4 px-6">Valor Consumido</th>
                  <th className="py-4 px-6">Valor Renderizado</th>
                  <th className="py-4 px-6">Status da Linhagem</th>
                  <th className="py-4 px-6 text-right">Linhagem Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/5 text-xs text-slate-300">
                {filteredMetrics.map((m: any) => {
                  const isViolation = m.status === 'VIOLATION';
                  const isWarning = m.status === 'WARNING';
                  const isNotObservable = m.status === 'NOT_OBSERVABLE';

                  return (
                    <tr key={m.metricId} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-200">{m.name}</td>
                      <td className="py-4 px-6 font-mono text-[11px] text-slate-400">{m.source}</td>
                      <td className="py-4 px-6 font-mono">{formatDisplayVal(m.sourceValue)}</td>
                      <td className="py-4 px-6 font-mono">{formatDisplayVal(m.consumedValue)}</td>
                      <td className="py-4 px-6 font-mono">
                        {isNotObservable ? (
                          <span className="text-slate-500 font-bold uppercase text-[10px]">Não Observável</span>
                        ) : (
                          formatDisplayVal(m.renderedValue)
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {isViolation ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-rose-500/10 border border-rose-500/20 text-rose-400">
                            Violação de Linhagem
                          </span>
                        ) : isWarning ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                            Aviso / Rastro
                          </span>
                        ) : isNotObservable ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-slate-800 border border-slate-700 text-slate-400">
                            Não Observável
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            Linhagem Íntegra
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-mono text-[10px] text-slate-500 text-right uppercase">{m.lineageHash}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredMetrics.length === 0 && (
            <div className="text-center py-12 text-slate-500 border-t border-border/10">
              Nenhuma métrica fiduciária atende aos critérios do filtro.
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Active Lineage Violations Feed */}
      {violations.length > 0 && (
        <div className="card-premium p-6 space-y-4 border-rose-500/20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            Detalhes dos Alertas e Violações de Linhagem Fiduciária
          </h3>
          <div className="space-y-3">
            {violations.map((v: any, idx: number) => {
              const isCritical = v.severity === 'CRITICAL';
              return (
                <div key={idx} className={cn("p-4 rounded-xl border flex gap-3 items-start", isCritical ? "bg-red-500/5 border-red-500/10 text-red-400" : "bg-yellow-500/5 border-yellow-500/10 text-yellow-400")}>
                  <AlertOctagon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide">{v.rule}</div>
                    <p className="text-xs font-light mt-1 leading-normal">{v.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Row 4: Chronological Lineage Timeline flow */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-slate-200">Rastro de Propagação Fiduciária (Lineage Timeline)</h2>
          <p className="text-xs text-slate-500 font-light mt-1">Fluxo cronológico de dados financeiros propagados entre as engines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 relative">
          {timelineNodes.map((node, idx) => (
            <div key={node.id} className="flex flex-col h-full justify-between">
              <div className={cn("p-5 border rounded-xl flex flex-col justify-between h-full hover:border-slate-700 transition-all", node.color)}>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-900 border border-border/5 rounded-lg">
                      {node.id}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold font-mono">Step {idx + 1}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 tracking-wide uppercase leading-snug">{node.title}</h4>
                  <p className="text-[10px] text-slate-400 font-light mt-2">{node.metric}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/10">
                  <div className="text-sm font-black tracking-tight truncate font-mono text-slate-100">
                    {formatDisplayVal(node.val)}
                  </div>
                </div>
              </div>
              
              {idx < timelineNodes.length - 1 && (
                <div className="hidden lg:flex items-center justify-center py-2 text-slate-600">
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
