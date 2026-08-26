

import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  TrendingUp, 
  CircleDollarSign, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Boxes,
  MapPin,
  Download,
  FileSpreadsheet,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatCurrency, formatValue } from '../../../lib/utils';
import { ExecutiveCommentary } from '../../ExecutiveCommentary';
import { PageHeader, StatusBadge } from '../../Common';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { ExecutivePageTemplate } from '../../ui/executive-page-template';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveAccordion } from '../../ui/executive-accordion';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { createPortal } from 'react-dom';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveSummarySection } from '../../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../ui/executive-decision-trace';
import { 
  ExecutiveTable, 
  ExecutiveTableHeader, 
  ExecutiveTableBody, 
  ExecutiveTableRow, 
  ExecutiveTableHead, 
  ExecutiveTableCell 
} from '../../ui/executive-table';
import { useDreGerencialPageViewModel } from '../../../viewmodels/useDreGerencialPageViewModel';
import { useDreGerencial } from '../../../adapters/ui/DreGerencialAdapter';
import { DRE_STRUCTURE } from '../../../viewmodels/DreGerencialViewModel';
import { FULL_MONTH_LABELS, MONTH_LABELS } from '../../../constants';
import { DashboardSkeleton } from '../../ui/skeletons';

export function DreGerencialPage({ selectedClient, selectedYear: initialYear, selectedMonth: initialMonth }: any) {
  // ViewModel & Adapter
  const { state, computed, actions } = useDreGerencialPageViewModel({ selectedClient });
  const portal = createPortal;
  const [selectedYear, setSelectedYear] = useState(initialYear || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || new Date().getMonth() + 1);
  const [periodType, setPeriodType] = useState<'mensal' | 'anual'>('anual');
  
  const [filterFilial, setFilterFilial] = useState('Todas');
  const [filterUnidade, setFilterUnidade] = useState('Todas');
  const [filterCentroCusto, setFilterCentroCusto] = useState('Todos');
  const [viewMode, setViewMode] = useState<'historical' | 'projection'>('historical');

  const { 
    loading, 
    periods, 
    valuesByPeriod, 
    dimensions, 
    getVerticalAnalysis, 
    getHorizontalAnalysis 
  } = useDreGerencial({
    selectedClient,
    selectedYear,
    selectedMonth,
    periodType,
    filterFilial,
    filterUnidade,
    filterCentroCusto
  });

  const currentKey = periodType === 'anual' ? periods.current.year.toString() : `${periods.current.year}-${periods.current.month}`;

  const renderAccountRow = (row: any) => {
    if (loading) return null;
    const currentVal = valuesByPeriod[currentKey]?.[row.id] || 0;
    const netRevenue = valuesByPeriod[currentKey]?.rl || 1;
    const grossRevenue = valuesByPeriod[currentKey]?.rb || 1;
    
    let baseRevenue = netRevenue;
    if (row.id === 'rb' || row.id === 'ded') {
      baseRevenue = grossRevenue;
    }
    const av = getVerticalAnalysis(baseRevenue, currentVal);

    let prevKey = '';
    if (periodType === 'anual') {
      prevKey = (selectedYear - 1).toString();
    } else {
      const d = new Date(selectedYear, selectedMonth - 2, 1);
      prevKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
    }
    const prevVal = valuesByPeriod[prevKey]?.[row.id] || 0;
    const ah = getHorizontalAnalysis(prevVal, currentVal);

    const visiblePeriods = [...periods.historical, periods.current];

    return (
      <ExecutiveTableRow key={row.id} className={cn(
        "transition-colors group",
        row.isTotal && "bg-surface-container/50 font-bold text-foreground"
      )}>
        <ExecutiveTableCell className="sticky left-0 bg-card z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
           <div className="flex items-center gap-2" style={{ paddingLeft: `${row.level * 20}px` }}>
              <ExecutiveText
                variant={row.isTotal ? "bodyStandard" : "microLabel"}
                className={cn(
                  "break-words overflow-visible",
                  row.isTotal ? "uppercase tracking-wider text-foreground font-black" : "text-muted-foreground font-medium"
                )}
              >
                {row.label}
              </ExecutiveText>
           </div>
        </ExecutiveTableCell>
        
        {visiblePeriods.map(p => {
          const key = periodType === 'anual' ? p.year.toString() : `${p.year}-${p.month}`;
          const isCurrent = periodType === 'anual' ? p.year === selectedYear : (p.year === selectedYear && p.month === selectedMonth);
          let val = valuesByPeriod[key]?.[row.id] || 0;
          
          if (['ded', 'custos', 'desp', 'dep', 'ir'].includes(row.id)) {
            val = -Math.abs(val);
          }
          
          return (
            <ExecutiveTableCell key={key} className={cn(
              "text-right font-mono text-xs",
              val < 0 ? "text-critical" : "text-foreground",
              isCurrent && "bg-secondary/5 font-bold"
            )}>
              {formatCurrency(val)}
            </ExecutiveTableCell>
          );
        })}

        <ExecutiveTableCell className="text-right">
          <ExecutiveBadge variant={av > 0 ? "info" : "neutral"}>
            {av.toFixed(2)}%
          </ExecutiveBadge>
        </ExecutiveTableCell>

        <ExecutiveTableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            {ah !== 0 && (ah > 0 ? <ArrowUpRight size={10} className="text-success" /> : <ArrowDownRight size={10} className="text-critical" />)}
            <ExecutiveText
              variant="microLabel"
              className={cn(
                "font-bold",
                ah > 0 ? "text-success" : ah < 0 ? "text-critical" : "text-muted-foreground"
              )}
            >
              {ah.toFixed(2)}%
            </ExecutiveText>
          </div>
        </ExecutiveTableCell>
      </ExecutiveTableRow>
    );
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <ExecutivePageTemplate header={{
      title: "DRE Gerencial Estratégica",
      description: "Demonstrativo multidimensional de resultados operacionais com série histórica e análise preditiva.",
    }}>

       {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE DRE GERENCIAL) --- */}
       <ExecutiveSummarySection 
         className="mb-8"
         status={{ label: (valuesByPeriod[currentKey]?.ebitda || 0) >= 0 ? 'Resultado Positivo' : 'EBITDA Negativo', variant: (valuesByPeriod[currentKey]?.ebitda || 0) >= 0 ? 'success' : 'critical' }}
         question="Qual o resultado operacional gerencial, margem de contribuição e eficiência da estrutura de custos?"
         opinion="O comitê fiduciário homologa a DRE Gerencial, validando a margem de contribuição e a disciplina no controle das despesas fixas."
         driver="Receita líquida, custos variáveis, margem de contribuição, despesas operacionais e EBITDA gerencial."
         implication="Garantia de rentabilidade operacional suficiente para cobrir investimentos e serviço da dívida."
         executiveQuestion="Acompanhar a análise vertical e horizontal para identificar desvios em contas operacionais críticas."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Painel Gerencial Conectado" />
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Demonstração do Resultado do Exercício"
        subtitle="Analise receitas, margens, EBITDA e lucros de forma vertical e horizontal."
        variant="analytics"
        defaultExpanded
      >

      <div className="space-y-10 pb-20 animate-executive-fade">
        <div className="flex items-center justify-start gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm mb-10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 bg-card border border-border rounded-md px-4 py-1.5 shadow-sm h-[40px]">
            <span className={cn(
              "text-[10px] font-medium uppercase tracking-[0.2em] transition-colors",
              periodType === 'mensal' ? "text-secondary font-semibold" : "text-muted-foreground"
            )}>Mensal</span>
            <button 
              onClick={() => setPeriodType(prev => prev === 'mensal' ? 'anual' : 'mensal')}
              className={cn(
                "w-10 h-5 rounded-full p-0.5 transition-all duration-300 relative",
                periodType === 'anual' ? "bg-secondary" : "bg-muted-foreground/30"
              )}
            >
              <motion.div 
                layout
                className="w-4 h-4 bg-white rounded-full shadow-sm"
                style={{
                  float: periodType === 'anual' ? 'right' : 'left'
                }}
              />
            </button>
            <span className={cn(
              "text-[10px] font-medium uppercase tracking-[0.2em] transition-colors",
              periodType === 'anual' ? "text-secondary font-semibold" : "text-muted-foreground"
            )}>
              Anual
            </span>
          </div>

          <div className="flex bg-card border border-border p-1 rounded-md shadow-sm items-center h-[40px]">
            <Calendar size={12} className="ml-2 text-muted-foreground" />
            <select
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              value={selectedYear}
              className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground"
            >
              {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                <option key={y} value={y} className="bg-card text-foreground">{y}</option>
              ))}
            </select>
          </div>

          {periodType === 'mensal' && (
            <div className="flex bg-card border border-border p-1 rounded-md shadow-sm items-center h-[40px] animate-in fade-in zoom-in duration-300">
              <select
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                value={selectedMonth}
                className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground"
              >
                {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                  <option key={m} value={Number(m)} className="bg-card text-foreground">{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ExecutiveMetricCard density="analytical" label="Receita (Período)" value={`R$ ${formatValue(valuesByPeriod[currentKey]?.rl || 0, '')}`} icon={TrendingUp} tone="success" description="Estável" />
        <ExecutiveMetricCard density="analytical" label="EBITDA (Período)" value={`R$ ${formatValue(valuesByPeriod[currentKey]?.ebitda || 0, '')}`} icon={CircleDollarSign} tone={(valuesByPeriod[currentKey]?.ebitda || 0) >= 0 ? "success" : "critical"} description={(valuesByPeriod[currentKey]?.ebitda || 0) >= 0 ? "Bullish" : "Bearish"} />
        <ExecutiveMetricCard density="analytical" label="Margem EBITDA" value={`${((valuesByPeriod[currentKey]?.ebitda || 0) / (valuesByPeriod[currentKey]?.rl || 1) * 100).toFixed(2)}%`} icon={Target} tone={((valuesByPeriod[currentKey]?.ebitda || 0) / (valuesByPeriod[currentKey]?.rl || 1) * 100) >= 20 ? "success" : "warning"} description="Estável" />
        <ExecutiveMetricCard density="analytical" label="Lucro Líquido" value={`R$ ${formatValue(valuesByPeriod[currentKey]?.ll || 0, '')}`} icon={Activity} tone={(valuesByPeriod[currentKey]?.ll || 0) >= 0 ? "success" : "critical"} description="Consolidado" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-card p-6 rounded-md border border-border shadow-sm items-end">
        <div>
          <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block mb-2 px-1">Filial</label>
          <div className="relative group">
            <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-secondary transition-colors" />
            <select 
              value={filterFilial}
              onChange={(e) => setFilterFilial(e.target.value)}
              className="w-full bg-surface-container border border-border rounded-md pl-10 pr-4 py-2.5 text-[11px] font-bold text-foreground outline-none focus:ring-2 focus:ring-secondary/20 transition-all appearance-none"
            >
              {dimensions.filiais.map(f => <option key={f} value={f} className="bg-card">{f}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block mb-2 px-1">Unidade de Negócio</label>
          <div className="relative group">
            <Boxes size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-secondary transition-colors" />
            <select 
              value={filterUnidade}
              onChange={(e) => setFilterUnidade(e.target.value)}
              className="w-full bg-surface-container border border-border rounded-md pl-10 pr-4 py-2.5 text-[11px] font-bold text-foreground outline-none focus:ring-2 focus:ring-secondary/20 transition-all appearance-none"
            >
              {dimensions.unidades.map(u => <option key={u} value={u} className="bg-card">{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block mb-2 px-1">Centro de Custo</label>
          <div className="relative group">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-secondary transition-colors" />
            <select 
              value={filterCentroCusto}
              onChange={(e) => setFilterCentroCusto(e.target.value)}
              className="w-full bg-surface-container border border-border rounded-md pl-10 pr-4 py-2.5 text-[11px] font-bold text-foreground outline-none focus:ring-2 focus:ring-secondary/20 transition-all appearance-none"
            >
              {dimensions.centros.map(c => <option key={c} value={c} className="bg-card">{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex bg-surface-container p-1 rounded-md border border-border">
           <button 
             className={cn(
               "flex-1 py-2 rounded-sm text-[9px] font-medium uppercase tracking-widest transition-all",
               "bg-card text-secondary shadow-sm"
             )}
           >
             Série Histórica
           </button>
           <button 
             disabled
             className={cn(
               "flex-1 py-2 rounded-sm text-[9px] font-medium uppercase tracking-widest transition-all text-muted-foreground opacity-50"
             )}
             title="Projeções delegadas ao Runtime Orchestrator."
           >
             Projeção (Runtime)
           </button>
        </div>
      </div>

      <ExecutiveSurface variant="default" padding="none" className="overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-surface-container/30">
          <div>
            <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground">Análise de Resultados Multi-Dimensional</ExecutiveHeading>
            <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase tracking-[0.2em] mt-0.5">
              Série Histórica · {periodType === 'anual' ? 'Visão de 5 Anos' : 'Visão de 12 Meses'}
            </ExecutiveText>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 bg-surface-container hover:bg-surface-container/80 text-foreground border border-border rounded-md transition-all" title="Exportar Excel">
              <FileSpreadsheet size={16} />
            </button>
            <button className="p-2.5 bg-surface-container hover:bg-surface-container/80 text-foreground border border-border rounded-md transition-all" title="Exportar PDF">
              <Download size={16} />
            </button>
          </div>
        </div>

        <ExecutiveTable className="min-w-[1200px]">
          <ExecutiveTableHeader>
            <ExecutiveTableRow>
              <ExecutiveTableHead className="sticky left-0 bg-surface-container z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Estrutura DRE</ExecutiveTableHead>
              {[...periods.historical, periods.current].map(p => {
                const key = periodType === 'anual' ? p.year.toString() : `${p.year}-${p.month}`;
                const isCurrent = periodType === 'anual' ? p.year === selectedYear : (p.year === selectedYear && p.month === selectedMonth);
                return (
                  <ExecutiveTableHead key={key} className={cn(
                    "text-right tracking-widest",
                    isCurrent ? "text-secondary bg-secondary/5" : "text-muted-foreground"
                  )}>
                    {p.label}
                  </ExecutiveTableHead>
                );
              })}
              <ExecutiveTableHead className="text-right tracking-widest">AV %</ExecutiveTableHead>
              <ExecutiveTableHead className="text-right tracking-widest">AH %</ExecutiveTableHead>
            </ExecutiveTableRow>
          </ExecutiveTableHeader>
          <ExecutiveTableBody>
            {!loading && DRE_STRUCTURE.map(row => renderAccountRow(row))}
          </ExecutiveTableBody>
        </ExecutiveTable>
      </ExecutiveSurface>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <ExecutiveCommentary 
            reportType="DRE_GERENCIAL"
            clientId={selectedClient}
            year={selectedYear}
            month={selectedMonth}
          />
          
          <div className="bg-card rounded-md border border-border p-8 relative overflow-hidden flex flex-col justify-center shadow-sm">
             <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary border border-border">
                      <Target size={22} strokeWidth={1.5} />
                   </div>
                   <div>
                      <ExecutiveHeading as="h3" variant="submoduleTitle" className="text-foreground">Meta EBITDA {selectedYear}</ExecutiveHeading>
                      <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mt-0.5">Performance Desejada</ExecutiveText>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-xs font-bold text-muted-foreground">Progresso do Período</span>
                         <span className="text-lg font-black text-secondary">0.0%</span>
                      </div>
                      <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden border border-border">
                          <div className="h-full bg-secondary w-0 shadow-sm" />
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-surface-container rounded-md border border-border">
             <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary mb-1">Margem Alvo</ExecutiveText>
                         <ExecutiveText as="div" variant="bodyStandard" className="text-foreground">0.0%</ExecutiveText>
                      </div>
                      <div className="p-4 bg-surface-container rounded-md border border-border">
             <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary mb-1">Gap de Resultado</ExecutiveText>
                         <ExecutiveText as="div" variant="bodyStandard" className="text-foreground">R$ 0</ExecutiveText>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      </div>
      </div>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
