



import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Sparkles, Activity, Target, ShieldCheck, LayoutDashboard, ArrowRight, Loader2, Calendar, ChevronRight, Zap, BarChart as BarChartIcon, PieChart as PieChartIcon, ArrowRightLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { cn, formatCurrency } from '../../lib/utils';
import { DATA } from '../../data';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { useMethodologicalAnalysis } from '../../hooks/useMethodologicalAnalysis';
import { PageHeader, Semaphore, StatusBadge } from '../Common';
import { useAnaliseFinanceiraPageAdapter } from '../../adapters/ui/useAnaliseFinanceiraPageAdapter';
import { getComputedBPSummary, getComputedDreMetrics } from '../../core/orchestration/financial-math-adapter';
import { executiveRuntime, ExecutiveIntelligenceReport } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useAnaliseFinanceiraViewModel } from '../../viewmodels/useAnaliseFinanceiraViewModel';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';

export function AnaliseFinanceiraPage({ clients, selectedClient, selectedYear }: any) {
  // Adapter: useAnaliseFinanceiraAdapter
  // ViewModel: useAnaliseFinanceiraViewModel
  const { state, computed, actions } = useAnaliseFinanceiraViewModel({ clientId: selectedClient });
  const portal = createPortal;
  const [year, setYear] = useState(selectedYear || new Date().getFullYear());
  const { cashFlowData, loadingCashFlow } = useAnaliseFinanceiraPageAdapter(selectedClient);

  // Sync year from parent
  useEffect(() => {
    if (selectedYear) setYear(selectedYear);
  }, [selectedYear]);

  const curYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 11 }, (_, i) => curYear - 5 + i);

  // Annual data — fetches all entries for the selected year (no month filter)
  const { dbData: dbDre, loading: loadingDre } = useAnnualFinancialData(selectedClient, year, 'DRE');
  const { dbData: dbBp, loading: loadingBp } = useAnnualFinancialData(selectedClient, year, 'BP');
  const { dbData: dbDlpa, loading: loadingDlpa } = useAnnualFinancialData(selectedClient, year, 'DLPA');
  const { dbData: dbDfc, loading: loadingDfc } = useAnnualFinancialData(selectedClient, year, 'DFC');
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);



  const currentDre = dbDre.length > 0 ? dbDre : [];
  const currentBp = dbBp.length > 0 ? dbBp : [];
  const currentDlpa = dbDlpa.length > 0 ? dbDlpa : [];

  // month = 0 is the annual sentinel (never conflicts with real months 1-12)
  const { analysis, loading: loadingAnalysis, error: errorAnalysis, reprocessAnalysis, currentVersion } = useMethodologicalAnalysis(
    selectedClient, year, 0, currentDre, currentBp
  );

  const [showReprocessed, setShowReprocessed] = useState(false);
  const [executiveReport, setExecutiveReport] = useState<ExecutiveIntelligenceReport | null>(null);

  // Compute BP and DRE values for runtime
  const bpSummaryForRuntime = useMemo(() => getComputedBPSummary(dbBp), [dbBp]);

  const { ebitdaForRuntime, lucroLiquidoForRuntime } = useMemo(() => {
    const metrics = getComputedDreMetrics(dbDre);
    return { ebitdaForRuntime: metrics.ebitda, lucroLiquidoForRuntime: metrics.lucroLiquido };
  }, [dbDre]);

  useEffect(() => {
    if (loadingDre || loadingBp || loadingDlpa || loadingDfc || loadingHistory || loadingCashFlow) return;

    const clientObj = clients?.find((c: any) => c.id === selectedClient);
    const segment = clientObj?.segmento || 'Default';

    const historyByYear = allHistoryData.reduce((acc: any, item: any) => {
      const yr = item.year;
      if (!acc[yr]) acc[yr] = {};
      const contaNorm = (item.conta || '').toLowerCase();
      if (contaNorm.includes('patrimônio líquido') || contaNorm === 'pl') {
        acc[yr].pl = (acc[yr].pl || 0) + (item.val || 0);
      }
      return acc;
    }, {});

    const prevPl = historyByYear[year - 1]?.pl || 0;

    let calculatedCycles = Object.keys(historyByYear ?? {}).filter((year) => {
      const data = historyByYear[year];
      return data && data.pl !== undefined; // using pl as an indicator of valid statements in this file's historyByYear
    }).length || 1;

    const payload = {
      clientProfile: clientObj,
      rawFinancialData: {
        bpSummary: bpSummaryForRuntime,
        ebitda: ebitdaForRuntime,
        lucroLiquido: lucroLiquidoForRuntime,
        segmentoEmpresa: segment,
        prevPl,
        dreDataLength: dbDre.length,
        historicalCyclesCount: calculatedCycles,
        allHistoryData: allHistoryData,
        filterYear: year
      },
      bpData: dbBp,
      dreData: dbDre,
      dlpaData: dbDlpa,
      dfcData: dbDfc,
      cashFlowData: cashFlowData,
      historicalSeries: allHistoryData,
      historicalCyclesCount: calculatedCycles,
      isMockData: dbBp.length === 0 && dbDre.length === 0
    };

    try {
      const report = executiveRuntime.generateExecutiveReport(payload);
      setExecutiveReport(report);
    } catch (err) {
      console.error('Error generating executive report in AnaliseFinanceira:', err);
    }
  }, [bpSummaryForRuntime, ebitdaForRuntime, lucroLiquidoForRuntime, dbDre, dbBp, dbDlpa, dbDfc, cashFlowData, year, allHistoryData, clients, selectedClient, loadingDre, loadingBp, loadingDlpa, loadingDfc, loadingHistory, loadingCashFlow]);

  // Seleciona os dados a exibir (original ou reprocessado se o usuário ativou o toggle)
  const displayData = (showReprocessed && analysis?.reprocessed) 
    ? analysis.reprocessed 
    : analysis;

  const metricsObj = displayData?.metrics || {
    receita: 0, ebitda: 0, lucro: 0, ativoTotal: 0, pl: 0, ac: 0, pc: 0, pnc: 0, est: 0,
    clientes: 0, fornecedores: 0, cmv: 0, cmvSource: 'proxy' as 'real' | 'proxy',
    roe: 0, investedCapital: 0, noplat: 0, roic: 0, wacc: 0, eva: 0, dscr: 0,
    totalThirdParty: 0, ct: 0, ce: 0, impl: 0, irpc: 0, gaf: 0,
    giroAtivo: 0, giroEstoque: 0, pmr: 0, pme: 0, pmp: 0, cicloOperacional: 0, cicloFinanceiro: 0
  };

  const {
    receita, ebitda, lucro, ativoTotal, pl, ac, pc, pnc, est,
    clientes, fornecedores, cmv, cmvSource,
    roe, investedCapital, noplat, roic, wacc, eva, dscr,
    totalThirdParty, ct, ce, impl, irpc, gaf,
    giroAtivo, giroEstoque, pmr, pme, pmp, cicloOperacional, cicloFinanceiro
  } = metricsObj;

  const methodologyUsed = displayData?.methodologyVersion || 'Pendente';
  const hasMethodologyUpdate = analysis && analysis.methodologyVersion !== currentVersion && !analysis.reprocessed;

  const metrics = [
    { label: 'Criação de Valor (EVA)', value: formatCurrency(eva), sem: eva > 0 ? 'Verde' : 'Vermelho', sub: eva > 0 ? '+ Cap. Gerado' : '- Cap. Destruído' },
    { label: 'Retorno ROIC', value: `${roic.toFixed(2)}%`, sem: roic > wacc ? 'Verde' : 'Amarelo', sub: `vs WACC ${wacc.toFixed(2)}%` },
    { label: 'Solvência (DSCR)', value: `${dscr.toFixed(2)}x`, sem: dscr > 1.2 ? 'Verde' : 'Vermelho', sub: dscr > 1.2 ? 'Cobertura Segura' : 'Risco de Liquidez' },
    { label: 'ROE Anualizado', value: `${roe.toFixed(2)}%`, sem: roe > 10 ? 'Verde' : 'Amarelo', sub: 'Retorno Acionista' },
    { label: 'Alavancagem (GAF)', value: `${gaf.toFixed(2)}x`, sem: gaf > 1 ? 'Verde' : 'Amarelo', sub: gaf > 1 ? 'Favorável' : 'Risco' },
  ] as const;

   return (
     <ExecutivePageTemplate header={{
       title: "Inteligência de Capital",
       description: "Análise de eficiência financeira, criação de valor e estrutura de capital estratégica.",
     }}>

       {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE INTELIGÊNCIA DE CAPITAL) --- */}
       <ExecutiveSummarySection 
         className="mb-8"
         status={{ label: eva > 0 ? 'Criação de Valor (EVA+)' : 'Destruição de Valor (EVA-)', variant: eva > 0 ? 'success' : 'critical' }}
         question="Qual a eficiência da alocação de capital, spread ROIC vs WACC e capacidade de criação de valor?"
         opinion="O comitê fiduciário homologa a análise de capital, atestando o retorno sobre o capital investido e a solvência de longo prazo."
         driver="ROIC, WACC, margem EBITDA, cobertura de juros (DSCR) e EVA acumulado."
         implication="Garantia de que os investimentos superam o custo de capital próprio e de terceiros."
         action="Ajustar o mix de captação de recursos para reduzir o WACC médio ponderado da companhia."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

         <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-border rounded-2xl p-1 shadow-sm">
            <div className="flex items-center px-4 py-2">
              <Calendar size={14} className="text-muted-foreground mr-2.5" />
              <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {yearsArray.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-xl shadow-sm">
            <ShieldCheck size={14} className={analysis?.reprocessed ? "text-blue-500" : "text-emerald-500"} />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Análise processada com: <span className="text-muted-foreground">{methodologyUsed}</span>
            </span>
          </div>

          {/* Temporal Scope Indicator (FYSIF) */}
          <div className="flex items-center gap-2 px-4 py-2 border border-amber-200 bg-warning-soft rounded-xl shadow-sm">
            <Calendar size={14} className="text-amber-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-800">
              Escopo Estrito: Até {year}
            </span>
          </div>

          {analysis?.reprocessed && (
            <button 
              onClick={() => setShowReprocessed(!showReprocessed)}
              className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border", showReprocessed ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-border text-muted-foreground hover:bg-slate-50")}
            >
              {showReprocessed ? "Ver Original" : "Ver Reprocessada"}
            </button>
          )}

          {hasMethodologyUpdate && (
             <button 
               onClick={reprocessAnalysis}
               className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-xl shadow-sm transition-all"
             >
               <Activity size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">Reprocessar ({currentVersion})</span>
             </button>
          )}

          {(loadingDre || loadingBp || loadingAnalysis) && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl shadow-sm animate-pulse">
              <Loader2 size={14} className="animate-spin text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sincronizando...</span>
            </div>
         )}
         </div>
         <StatusBadge status={analysis ? 'Verde' : 'Amarelo'} label={analysis ? 'Online' : 'Pendente'} />
       
      </div>

       <div className="mt-12 mb-8 border-t border-border pt-8" />
       <ExecutiveAccordion
         title="Inteligência de Capital"
         subtitle="Eficiência financeira, criação de valor e estrutura de capital estratégica."
         variant="analytics"
         defaultExpanded
       >

       {/* CFO Executive Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="shrink-0">
             <div className="w-20 h-20 rounded-[32px] bg-secondary/10 flex items-center justify-center text-secondary relative">
                <Sparkles size={40} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-soft0 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                </div>
             </div>
          </div>
          <div>
            <ExecutiveHeading as="h3" className="text-secondary mb-3">Insight de Capital</ExecutiveHeading>
      <p className="executive-note font-semibold text-executive-secondary italic leading-relaxed">
              {executiveReport ? (
                `"${executiveReport.orchestratedNarrative?.leadParagraph || executiveReport.financialThesis?.thesis}"`
              ) : (
                "Aguardando dados financeiros consolidados para análise de spread ROIC/WACC e geração de valor econômico (EVA). A análise estratégica será habilitada após a primeira importação de balanço e DRE."
              )}
            </p>
          </div>
        </div>
        
        <div className="bg-primary p-8 rounded-[32px] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all"></div>
          <div>
            <ExecutiveHeading as="h3" className="text-muted-foreground mb-4">Custo de Capital (WACC)</ExecutiveHeading>
            <ExecutiveText as="div" variant="bodyStandard" className="font-display mb-2">{wacc.toFixed(2)}%</ExecutiveText>
            <div className="flex items-center gap-2 text-emerald-400">
               <ShieldCheck size={16} />
               <span className="text-xs font-bold">Estrutura Estável</span>
            </div>
          </div>
          <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Simular Novos Contratos
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        {metrics.map(m => (
          <div key={m.label} className="bg-white p-8 rounded-[32px] border border-border shadow-sm transition-all hover:shadow-elegant group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <ExecutiveText as="div" variant="caption" className="text-muted-foreground">{m.label}</ExecutiveText>
                <Semaphore status={m.sem as 'Verde' | 'Amarelo' | 'Vermelho'} />
              </div>
       <p className="text-2xl font-display font-medium tracking-tight text-primary group-hover:text-executive-secondary transition-colors">
                {m.value}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground italic">
                  {m.sub}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Eficiência de Capital */}
        <div className="space-y-4">
          <ExecutiveHeading as="h2" className="text-muted-foreground font-sans">Eficiência de Capital</ExecutiveHeading>
          <div className="bg-white p-8 rounded-3xl border border-border shadow-sm interactive-card">
            <ExecutiveHeading as="h3" className="text-muted-foreground mb-8 flex items-center gap-2">
              <Activity size={14} className="text-secondary" /> Retorno sobre Ativos e Capital
            </ExecutiveHeading>
            <div className="space-y-8">
              {[
                { label: 'ROI Operacional (EBITDA/Ativo)', val: ((ebitda / ativoTotal) * 100), color: 'bg-blue-600' },
                { label: 'Invested Capital Ratio (Cap/Ativo)', val: (investedCapital / ativoTotal * 100), color: 'bg-emerald-600' },
                { label: 'Asset Turnover (Receita/Ativo)', val: (receita / ativoTotal) * 20, display: `${(receita / ativoTotal).toFixed(2)}x`, color: 'bg-amber-600' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-bold text-muted-foreground">{item.label}</span>
          <span className="text-base font-medium text-executive-secondary">{item.display || `${item.val.toFixed(2)}%`}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(item.val, 100)}%` }}
                      className={cn("h-full transition-all duration-1000", item.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estrutura de Capital */}
        <div className="space-y-4">
          <ExecutiveHeading as="h2" className="text-muted-foreground font-sans">Estrutura de Capital</ExecutiveHeading>
          <div className="bg-white p-8 rounded-3xl border border-border shadow-sm interactive-card">
            <ExecutiveHeading as="h3" className="text-muted-foreground mb-8 flex items-center gap-2">
              <PieChartIcon size={14} className="text-secondary" /> Composição de Passivos
            </ExecutiveHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                {[
                  { label: 'Cap. Terceiros / PL (IMPL)', val: impl },
                  { label: 'Curto Prazo (CT %)', val: ct },
                  { label: 'Longo Prazo (CE %)', val: ce },
                  { label: 'Endividamento Geral (IRPC)', val: irpc }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between py-3 border-b border-border last:border-0">
                    <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-medium text-muted-foreground">{item.val.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 p-6 rounded-[32px] border border-border">
                {/* Gráfico de barras empilhadas proporcional: mantém valores de enquadramento */}
                <div className="flex flex-col items-center gap-4">
         <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary">Dívida Total</ExecutiveText>
         <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary">{formatCurrency(totalThirdParty)}</ExecutiveText>

                  {totalThirdParty > 0 ? (
                    <div className="w-full space-y-3">
                      {/* CP bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            <span className="text-[9px] font-black text-muted-foreground uppercase">CP — {ct.toFixed(1)}%</span>
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground">{formatCurrency(pc)}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${ct}%` }} />
                        </div>
                      </div>
                      {/* LP bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-300" />
                            <span className="text-[9px] font-black text-muted-foreground uppercase">LP — {ce.toFixed(1)}%</span>
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground">{formatCurrency(pnc)}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-300 rounded-full transition-all duration-700" style={{ width: `${ce}%` }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ExecutiveText as="div" variant="caption" className="text-muted-foreground text-center py-4">Sem endividamento registrado</ExecutiveText>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ciclos e Atividade */}
      <div className="space-y-6 pt-12">
        <div className="flex items-center justify-between px-4">
          <ExecutiveHeading as="h2" className="text-muted-foreground font-sans">Ciclos e Atividade Operacional</ExecutiveHeading>
          <div className="h-px flex-1 bg-slate-100 mx-8"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              name: 'Giro do Ativo',
              val: giroAtivo > 0 ? giroAtivo.toFixed(2) : '—',
              unit: 'x',
              icon: ArrowRightLeft,
              desc: 'Receita / Ativo Total'
            },
            {
              name: 'Giro do Estoque',
              val: giroEstoque > 0 ? giroEstoque.toFixed(2) : '—',
              unit: 'x',
              icon: LayoutDashboard,
              desc: cmvSource === 'real' ? 'CMV / Estoque' : 'Receita / Estoque (sem CMV)'
            },
            {
              name: 'Ciclo Operacional',
              val: cicloOperacional > 0 ? Math.round(cicloOperacional).toString() : '—',
              unit: cicloOperacional > 0 ? 'dias' : '',
              icon: Zap,
              desc: `PMR ${Math.round(pmr)}d + PME ${Math.round(pme)}d`
            },
            {
              name: 'Ciclo Financeiro',
              val: cicloFinanceiro !== 0 ? Math.round(cicloFinanceiro).toString() : '—',
              unit: cicloFinanceiro !== 0 ? 'dias' : '',
              icon: Target,
              desc: `C.Op. ${Math.round(cicloOperacional)}d − PMP ${Math.round(pmp)}d`
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[32px] border border-border shadow-sm flex flex-col items-center text-center group hover:border-secondary/20 transition-all">
              <div className="p-3 bg-slate-50 rounded-2xl text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary transition-all mb-4">
                <item.icon size={20} />
              </div>
              <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mb-1">{item.name}</ExecutiveText>
              <p className="text-2xl font-display font-medium text-primary">
                {item.val}<span className="text-xs ml-1 font-medium text-muted-foreground uppercase">{item.unit}</span>
              </p>
              <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mt-2">{item.desc}</ExecutiveText>
             </div>
           ))}
         </div>
       </div>
        <ExecutiveSummarySection 
          status={{ label: 'Análise Concluída', variant: 'success' }}
          question="Como otimizar a estrutura de capital e rentabilidade?"
          opinion="O retorno sobre o capital (ROIC) supera o custo médio ponderado de capital (WACC), gerando valor econômico."
          driver="Ciclo operacional, giro e prazos médios."
          implication="Geração consistente de fluxo de caixa livre."
          action="Manter alocação disciplinada e monitorar solvência."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
