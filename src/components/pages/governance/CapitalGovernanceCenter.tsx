import React, { useState, useMemo } from 'react';
import { Scale, Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp, Coins, Layers, Database, ArrowRightLeft, Briefcase, ShieldCheck, Calendar, Zap, Percent, Clock } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useAllFinancialData } from '../../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../../hooks/useInstitutionalRuntime';
import { cn, formatCurrency } from '../../../lib/utils';
import { PageHeader } from '../../Common';

interface CapitalGovernanceCenterProps {
  clients?: any[];
  selectedClient?: string;
  selectedYear?: number;
}

// ── Score Ring Component ──
function CgsScoreRing({ value, label, status }: { value: number; label: string; status: string }) {
  const r = 50, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  
  const getColors = (v: number) => {
    if (v >= 85) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-success-soft0/10' };
    if (v >= 70) return { stroke: '#3b82f6', text: 'text-blue-400', bg: 'bg-blue-500/10' };
    if (v >= 50) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-warning-soft0/10' };
    return { stroke: '#ef4444', text: 'text-rose-400', bg: 'bg-critical-soft0/10' };
  };

  const colors = getColors(value);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={colors.stroke} strokeWidth="8"
            strokeDasharray={`${c} ${c}`} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn("text-3xl font-light tracking-tight", colors.text)}>
            {Math.round(value)}
          </span>
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Score</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
        <span className={cn("mt-1 inline-block text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border", 
          value >= 85 ? 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400' :
          value >= 70 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
          value >= 50 ? 'bg-warning-soft0/10 border-amber-500/20 text-amber-400' :
          'bg-critical-soft0/10 border-rose-500/20 text-rose-400'
        )}>
          {status}
        </span>
      </div>
    </div>
  );
}

export function CapitalGovernanceCenter({ selectedClient, selectedYear }: CapitalGovernanceCenterProps) {
  const filterYear = selectedYear || new Date().getFullYear();

  // Fetch historical client data
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient || '');

  // Run the full institutional context pipeline
  const { runtimeOutput, loading: runtimeLoading } = useInstitutionalRuntime({
    input: {
      clientId: selectedClient,
      rawFinancialData: {
        filterYear,
        allHistoryData
      }
    }
  });

  const cgeInference = useMemo(() => {
    return runtimeOutput?.inferences?.['CapitalGovernanceAdapter'];
  }, [runtimeOutput]);

  const cgeMetrics = cgeInference?.metrics || {};

  const translateCpiStatus = (status: string) => {
    if (status === 'Capital Expansion') return 'Expansão de Capital';
    if (status === 'Capital Strengthening') return 'Fortalecimento de Capital';
    if (status === 'Capital Preserved' || status === 'Preserved Capital') return 'Capital Preservado';
    if (status === 'Moderate Erosion' || status === 'Capital Erosion') return 'Erosão Moderada';
    if (status === 'High Erosion' || status === 'Severe Erosion') return 'Erosão Patrimonial Elevada';
    if (status === 'Critical Erosion') return 'Erosão Crítica';
    if (status === 'Capital Collapse') return 'Colapso de Capital';
    return status;
  };

  const {
    cgs = 50,
    cgsStatus = 'Moderate Governance',
    cpi = 1.0,
    cpiStatus = 'Capital Preserved',
    cdi = 0.0,
    cdiStatus = 'Independent',
    ddi = 'NOT_APPLICABLE',
    ddiStatus = 'NOT_APPLICABLE',
    eri = 'NOT_APPLICABLE',
    eriStatus = 'NOT_APPLICABLE',
    erir = 0.3,
    erirStatus = 'Moderate',
    cmi = 50,
    trajectory = 'STABILIZING',
    capitalSocial = 0,
    patrimonioLiquido = 0,
    plInicio = 0,
    netIncome,
    dividendos = 0,
    capitalInjections = 0,
    capitalizacoesAcumuladas = 0
  } = cgeMetrics;

  // Rendered values in UI (directly from state/variables)
  const renderedNetIncome = netIncome;
  const renderedCapitalSocial = capitalSocial;
  const renderedPreservation = cgeMetrics.capitalPreservation;
  const renderedIntegrity = cgeMetrics.capitalIntegrity;
  const renderedResilience = cgeMetrics.capitalResilience;

  // Runtime values (directly from CGE metrics payload)
  const runtimeNetIncome = cgeMetrics.netIncome;
  const runtimeCapitalSocial = cgeMetrics.capitalSocial;
  const runtimePreservation = cgeMetrics.capitalPreservation;
  const runtimeIntegrity = cgeMetrics.capitalIntegrity;
  const runtimeResilience = cgeMetrics.capitalResilience;

  const hasMismatches = 
    (renderedNetIncome !== runtimeNetIncome) ||
    (renderedCapitalSocial !== runtimeCapitalSocial) ||
    (renderedPreservation !== runtimePreservation) ||
    (renderedIntegrity !== runtimeIntegrity) ||
    (renderedResilience !== runtimeResilience);

  const radarData = useMemo(() => {
    return [
      { subject: 'Integridade Patrimonial', value: Math.max(0, Math.min(100, Math.round(cgeMetrics.capitalIntegrity ?? 50))) },
      { subject: 'Resiliência (ERI-R)', value: Math.max(0, Math.min(100, Math.round(cgeMetrics.capitalResilience ?? 50))) },
      { subject: 'Dependência (CDI)', value: Math.max(0, Math.min(100, Math.round((1 - cdi) * 100))) },
      { subject: 'Disciplina (DDI)', value: ddi === 'NOT_APPLICABLE' ? 70 : Math.max(0, Math.min(100, Math.round((1 - (ddi as number)) * 100))) },
      { subject: 'Retenção (ERI)', value: eri === 'NOT_APPLICABLE' ? 50 : Math.max(0, Math.min(100, Math.round((eri as number) * 100))) }
    ];
  }, [cgeMetrics, cdi, ddi, eri]);

  // Extract years and dependency metrics for the heatmap
  const historicalDependencyList = useMemo(() => {
    const years = [filterYear - 4, filterYear - 3, filterYear - 2, filterYear - 1, filterYear].filter(y => y > 2000);
    return years.map(y => {
      const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y);
      
      let yearCapitalSocial = 0;
      let yearPlFim = 0;
      let yearCapInj = 0;

      const normalize = (s: string) =>
        (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      yearEntries.forEach((d: any) => {
        const normConta = normalize(d.conta || d.category || '');
        const val = Math.abs(d.val || d.valor || d.value || 0);

        if (normConta.includes('capital social') || normConta.includes('capital integralizado')) {
          yearCapitalSocial = val;
        }
        if (normConta.includes('patrimonio liquido') || normConta.includes('pl fim') || normConta.includes('saldo final')) {
          yearPlFim = Number(d.val || d.valor || d.value || 0);
        }
        if (normConta.includes('aumento de capital') || normConta.includes('integralizacao') || normConta.includes('capitalizacao')) {
          yearCapInj = val;
        }
      });

      if (yearPlFim === 0 && yearCapitalSocial > 0) yearPlFim = yearCapitalSocial;

      const yearCdi = yearPlFim > 0 ? yearCapInj / yearPlFim : 0;
      let status = 'Independent';
      if (yearCdi >= 1.0) status = 'Critical Dependency';
      else if (yearCdi >= 0.5) status = 'High Dependency';
      else if (yearCdi >= 0.2) status = 'Moderate Dependency';

      return {
        year: y,
        injections: yearCapInj,
        equity: yearPlFim,
        cdi: yearCdi,
        status
      };
    });
  }, [allHistoryData, filterYear]);

  // Trajectory timeline definition
  const trajectoryTimeline = useMemo(() => {
    const list = [
      { state: 'RECOVERING', label: 'Recuperando Base de Capital', color: 'text-emerald-400 border-emerald-500/20 bg-success-soft0/5' },
      { state: 'STABILIZING', label: 'Estrutura Estabilizada', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
      { state: 'VOLATILE', label: 'Erosão Oscilante / Volatilidade', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' },
      { state: 'DEPENDENT', label: 'Dependência de Reforço Recorrente', color: 'text-amber-500 border-amber-500/20 bg-warning-soft0/5' },
      { state: 'DETERIORATING', label: 'Deterioração Progressiva do Capital', color: 'text-rose-400 border-rose-500/20 bg-critical-soft0/5' }
    ];
    return list;
  }, []);

  if (loadingHistory || runtimeLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Activity className="w-8 h-8 animate-pulse text-primary" />
        <span className="text-sm font-medium tracking-wide uppercase">Instanciando Fiduciary Capital Governance Runtime...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Page Header */}
      <PageHeader 
        title="Centro de Governança de Capital (CGE)"
        subtitle="Auditoria fiduciária da base societária, políticas de dividendos, retenção de lucros e sustentabilidade patrimonial."
        icon={Scale}
        transparent
        actions={
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">Status da Camada CGE</div>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Ativo</span>
            </div>
          </div>
        }
      />

      {/* Row 1: CGS Gauge & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CGS Gauge Card */}
        <div className="card-premium p-8 flex flex-col justify-between relative overflow-hidden group hover:border-border transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success-soft0/5 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Capital Governance Engine</span>
                <h3 className="text-lg font-medium text-muted-foreground mt-1">Capital Governance Score</h3>
              </div>
            </div>
            
            <div className="my-8 flex justify-center">
              <CgsScoreRing 
                value={cgs} 
                label={cgsStatus} 
                status={cgs >= 70 ? 'Aprovado' : 'Atenção'} 
              />
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-light text-center">
              {cgeInference?.narrative?.diagnostic || 'Parecer de governança estruturado upstream.'}
            </p>
          </div>

          <div className="pt-6 border-t border-border/10">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground uppercase font-semibold">Trajetória Atual:</span>
              <span className="text-muted-foreground font-bold uppercase tracking-wide">{trajectory}</span>
            </div>
          </div>
        </div>

        {/* Capital Structure Radar Chart */}
        <div className="card-premium p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Radar de Governança de Capital</h3>
            <p className="text-[11px] text-muted-foreground font-light">Evolução e conformidade em 6 eixos fiduciários estruturais.</p>
          </div>
          
          <div className="h-[280px] w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'medium' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 8 }} />
                <Radar
                  name="Maturidade Patrimonial"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Capital Preservation Panel */}
      <div className="space-y-6">
        <div className="border-b border-border/10 pb-4">
          <h2 className="text-lg font-medium text-muted-foreground">Painel de Preservação Patrimonial</h2>
          <p className="text-xs text-muted-foreground font-light mt-1">Soberania do Capital Social e integridade do Patrimônio Líquido frente a prejuízos ou capitalizações.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="card-premium p-6">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Lucro Líquido do Exercício</span>
            <p className="text-xl font-bold text-muted-foreground mt-2">
              {netIncome !== null && netIncome !== undefined ? formatCurrency(netIncome) : 'Não identificado na DRE'}
            </p>
            <span className="text-[9px] text-muted-foreground mt-1 block">Base para distribuição</span>
          </div>

          <div className="card-premium p-6">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Capital Social Integralizado</span>
            <p className="text-xl font-bold text-muted-foreground mt-2">{formatCurrency(capitalSocial)}</p>
            <span className="text-[9px] text-muted-foreground mt-1 block">Base de captação societária</span>
          </div>

          <div className="card-premium p-6">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Patrimônio Líquido Final</span>
            <p className="text-xl font-bold text-emerald-400 mt-2">{formatCurrency(patrimonioLiquido)}</p>
            <span className={cn("text-[9px] mt-1 block font-bold",
              cpiStatus.includes('Erosion') || cpiStatus.includes('Collapse') ? 'text-rose-400' : 'text-emerald-400'
            )}>
              {translateCpiStatus(cpiStatus)}
            </span>
          </div>

          <div className="card-premium p-6">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Preservação Patrimonial</span>
            <p className="text-xl font-bold text-primary mt-2">
              {cgeMetrics.capitalPreservation !== undefined ? `${Number(cgeMetrics.capitalPreservation).toFixed(2)}%` : `${(cpi * 100).toFixed(2)}%`}
            </p>
            <span className="text-[9px] text-muted-foreground mt-1 block">PL Fim / Capital Social</span>
          </div>

          <div className="card-premium p-6">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Erosão Patrimonial</span>
            <p className="text-xl font-bold text-rose-400 mt-2">
              {cgeMetrics.capitalErosion !== undefined ? `${Number(cgeMetrics.capitalErosion).toFixed(2)}%` : `${((1 - cpi) * 100).toFixed(2)}%`}
            </p>
            <span className="text-[9px] text-muted-foreground mt-1 block">1 - Preservação</span>
          </div>
        </div>
      </div>

      {/* Row 3: Capital Dependency Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Heatmap Section */}
        <div className="card-premium p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Histórico de Dependência de Aporte dos Sócios</h3>
            <p className="text-[11px] text-muted-foreground font-light mb-4">Análise longitudinal da necessidade de reinjeção de capital próprio para sustentação operacional.</p>
          </div>

          <div className="space-y-3">
            {historicalDependencyList.map(item => (
              <div key={item.year} className="flex justify-between items-center p-3 bg-slate-950/20 border border-border/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground">{item.year}</span>
                  <div className="text-[10px] text-muted-foreground">
                    Aportes: <span className="text-muted-foreground font-bold">{formatCurrency(item.injections)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-muted-foreground">CDI: {(item.cdi * 100).toFixed(1)}%</span>
                  <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider border",
                    item.status === 'Independent' ? 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400' :
                    item.status === 'Moderate Dependency' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                    'bg-critical-soft0/10 border-rose-500/20 text-rose-400'
                  )}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-muted-foreground font-light mt-4 pt-4 border-t border-border/10 space-y-2">
            <p>Fidelidade societária elevada reduz o risco de colapso, contudo, a dependência recorrente de capitalização indica ineficiência na geração de caixa operacional.</p>
            {cgeMetrics.capitalizationDependency && (
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-border/5 text-[9px] font-mono text-muted-foreground">
                <span className="font-bold text-muted-foreground">Auditoria do Índice de Capitalização:</span><br />
                Fórmula: {cgeMetrics.capitalizationDependency.formula} ({formatCurrency(cgeMetrics.capitalizationDependency.numerator)} ÷ {formatCurrency(cgeMetrics.capitalizationDependency.denominator)}) = <span className="text-primary font-bold">{cgeMetrics.capitalizationDependency.value}%</span> ({cgeMetrics.capitalizationDependency.classification})
              </div>
            )}
          </div>
        </div>

        {/* Retention & Distribution Board */}
        <div className="card-premium p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Política de Retenção & Dividendos</h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Taxa de Retenção (ERI)</span>
                  <span className="text-[9px] font-bold text-primary border border-primary px-2 py-0.5 rounded bg-primary">
                    {eriStatus}
                  </span>
                </div>
                <p className="text-lg font-bold text-muted-foreground mt-1">
                  {eri === 'NOT_APPLICABLE' ? 'Não Aplicável' : `${((eri as number) * 100).toFixed(1)}%`}
                </p>
              </div>

              <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Taxa de Distribuição (DDI)</span>
                  <span className="text-[9px] font-bold text-primary border border-primary px-2 py-0.5 rounded bg-primary">
                    {ddiStatus}
                  </span>
                </div>
                <p className="text-lg font-bold text-muted-foreground mt-1">
                  {ddi === 'NOT_APPLICABLE' ? 'Não Aplicável' : `${((ddi as number) * 100).toFixed(1)}%`}
                </p>
              </div>

              <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Dividendos / Lucro Líquido</span>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  R$ {formatCurrency(dividendos)} / R$ {netIncome !== null && netIncome !== undefined ? formatCurrency(netIncome) : 'Não identificado na DRE'}
                </p>
              </div>
            </div>
          </div>

          <div className="text-[9px] font-mono text-muted-foreground uppercase pt-4 border-t border-border/10 mt-4">
            CGE Fiduciary Rules • v1.0
          </div>
        </div>

      </div>

      {/* Auditoria de Linhagem da Governança de Capital */}
      <div className="card-premium p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Auditoria de Linhagem da Governança de Capital
          </h3>
          {hasMismatches && (
            <span className="px-2.5 py-0.5 rounded bg-critical-soft0/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-wider animate-pulse">
              UI_RENDER_MISMATCH
            </span>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground border-collapse">
            <thead>
              <tr className="border-b border-border/10 text-[10px] text-muted-foreground uppercase font-black">
                <th className="py-3 px-4">Métrica</th>
                <th className="py-3 px-4">Fonte</th>
                <th className="py-3 px-4">Consumido (Runtime)</th>
                <th className="py-3 px-4">Renderizado (UI)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/5">
                <td className="py-3 px-4 font-semibold text-muted-foreground">Lucro Líquido</td>
                <td className="py-3 px-4">DRE</td>
                <td className="py-3 px-4">{runtimeNetIncome !== null && runtimeNetIncome !== undefined ? formatCurrency(runtimeNetIncome) : 'N/A'}</td>
                <td className="py-3 px-4">{renderedNetIncome !== null && renderedNetIncome !== undefined ? formatCurrency(renderedNetIncome) : 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-black uppercase border",
                    renderedNetIncome === runtimeNetIncome ? "bg-success-soft0/10 border-emerald-500/20 text-emerald-400" : "bg-critical-soft0/10 border-rose-500/20 text-rose-400"
                  )}>
                    {renderedNetIncome === runtimeNetIncome ? 'Consistente' : 'Inconsistente'}
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border/5">
                <td className="py-3 px-4 font-semibold text-muted-foreground">Capital Social</td>
                <td className="py-3 px-4">BP</td>
                <td className="py-3 px-4">{runtimeCapitalSocial !== null && runtimeCapitalSocial !== undefined ? formatCurrency(runtimeCapitalSocial) : 'N/A'}</td>
                <td className="py-3 px-4">{renderedCapitalSocial !== null && renderedCapitalSocial !== undefined ? formatCurrency(renderedCapitalSocial) : 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-black uppercase border",
                    renderedCapitalSocial === runtimeCapitalSocial ? "bg-success-soft0/10 border-emerald-500/20 text-emerald-400" : "bg-critical-soft0/10 border-rose-500/20 text-rose-400"
                  )}>
                    {renderedCapitalSocial === runtimeCapitalSocial ? 'Consistente' : 'Inconsistente'}
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border/5">
                <td className="py-3 px-4 font-semibold text-muted-foreground">Preservação Patrimonial</td>
                <td className="py-3 px-4">CGE</td>
                <td className="py-3 px-4">{runtimePreservation !== null && runtimePreservation !== undefined ? `${runtimePreservation.toFixed(2)}%` : 'N/A'}</td>
                <td className="py-3 px-4">{renderedPreservation !== null && renderedPreservation !== undefined ? `${renderedPreservation.toFixed(2)}%` : 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-black uppercase border",
                    renderedPreservation === runtimePreservation ? "bg-success-soft0/10 border-emerald-500/20 text-emerald-400" : "bg-critical-soft0/10 border-rose-500/20 text-rose-400"
                  )}>
                    {renderedPreservation === runtimePreservation ? 'Consistente' : 'Inconsistente'}
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border/5">
                <td className="py-3 px-4 font-semibold text-muted-foreground">Integridade Patrimonial</td>
                <td className="py-3 px-4">CGE</td>
                <td className="py-3 px-4">{runtimeIntegrity !== null && runtimeIntegrity !== undefined ? `${runtimeIntegrity.toFixed(0)}` : 'N/A'}</td>
                <td className="py-3 px-4">{renderedIntegrity !== null && renderedIntegrity !== undefined ? `${renderedIntegrity.toFixed(0)}` : 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-black uppercase border",
                    renderedIntegrity === runtimeIntegrity ? "bg-success-soft0/10 border-emerald-500/20 text-emerald-400" : "bg-critical-soft0/10 border-rose-500/20 text-rose-400"
                  )}>
                    {renderedIntegrity === runtimeIntegrity ? 'Consistente' : 'Inconsistente'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-muted-foreground">Resiliência de Capital</td>
                <td className="py-3 px-4">CGE</td>
                <td className="py-3 px-4">{runtimeResilience !== null && runtimeResilience !== undefined ? `${runtimeResilience.toFixed(0)}` : 'N/A'}</td>
                <td className="py-3 px-4">{renderedResilience !== null && renderedResilience !== undefined ? `${renderedResilience.toFixed(0)}` : 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-black uppercase border",
                    renderedResilience === runtimeResilience ? "bg-success-soft0/10 border-emerald-500/20 text-emerald-400" : "bg-critical-soft0/10 border-rose-500/20 text-rose-400"
                  )}>
                    {renderedResilience === runtimeResilience ? 'Consistente' : 'Inconsistente'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 5: Capital Trajectory Timeline */}
      <div className="card-premium p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Linha de Trajetória Patrimonial
        </h3>

        <div className="relative pl-6 border-l border-border space-y-8 my-4">
          {trajectoryTimeline.map(item => {
            const isActive = trajectory.toUpperCase() === item.state;
            return (
              <div key={item.state} className="relative">
                {/* Timeline Dot */}
                <div className={cn("absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all",
                  isActive ? "bg-primary border-primary ring-4 ring-indigo-500/20" : "bg-slate-900 border-border"
                )}>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-muted-foreground" />}
                </div>
                
                {/* Content */}
                <div className={cn("p-4 border rounded-2xl transition-all duration-300",
                  isActive ? item.color : "border-border/5 text-muted-foreground bg-slate-900/10"
                )}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest">{item.state}</span>
                    {isActive && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-primary text-primary border border-primary">Estado Atual</span>}
                  </div>
                  <p className="text-sm font-medium mt-1">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
