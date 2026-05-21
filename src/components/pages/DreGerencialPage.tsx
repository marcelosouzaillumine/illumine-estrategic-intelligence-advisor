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
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { PageHeader, KpiCard } from '../Common';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import { FULL_MONTH_LABELS, MONTH_LABELS } from '../../constants';
import { DashboardSkeleton } from '../ui/skeletons';

interface PeriodInfo {
  year: number;
  month?: number;
  label: string;
}

export function DreGerencialPage({ selectedClient, selectedYear: initialYear, selectedMonth: initialMonth }: any) {
  const [selectedYear, setSelectedYear] = useState(initialYear || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || new Date().getMonth() + 1);
  const [periodType, setPeriodType] = useState<'mensal' | 'anual'>('anual');
  
  const [filterFilial, setFilterFilial] = useState('Todas');
  const [filterUnidade, setFilterUnidade] = useState('Todas');
  const [filterCentroCusto, setFilterCentroCusto] = useState('Todos');
  const [viewMode, setViewMode] = useState<'historical' | 'projection'>('historical');

  const { dbData, loading } = useAllFinancialData(selectedClient);

  const periods = useMemo(() => {
    if (periodType === 'anual') {
      const historical: PeriodInfo[] = Array.from({ length: 5 }, (_, i) => {
        const y = selectedYear - 5 + i;
        return { year: y, label: y.toString() };
      });
      const projections: PeriodInfo[] = Array.from({ length: 5 }, (_, i) => {
        const y = selectedYear + 1 + i;
        return { year: y, label: y.toString() };
      });
      return { 
        historical, 
        current: { year: selectedYear, label: selectedYear.toString() } as PeriodInfo, 
        projections 
      };
    } else {
      const historical: PeriodInfo[] = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(selectedYear, selectedMonth - 1 - (12 - i), 1);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();
        return { month: m, year: y, label: `${MONTH_LABELS[m]}/${y.toString().slice(-2)}` };
      });
      const projections: PeriodInfo[] = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(selectedYear, selectedMonth - 1 + (i + 1), 1);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();
        return { month: m, year: y, label: `${MONTH_LABELS[m]}/${y.toString().slice(-2)}` };
      });
      return { 
        historical, 
        current: { month: selectedMonth, year: selectedYear, label: `${MONTH_LABELS[selectedMonth]}/${selectedYear.toString().slice(-2)}` } as PeriodInfo, 
        projections 
      };
    }
  }, [selectedYear, selectedMonth, periodType]);

  const dimensions = useMemo(() => {
    const filiais = new Set<string>(['Todas']);
    const unidades = new Set<string>(['Todas']);
    const centros = new Set<string>(['Todos']);

    dbData.forEach((d: any) => {
      if (d.filial) filiais.add(d.filial);
      if (d.unidade) unidades.add(d.unidade);
      if (d.centro_custo || d.centroCusto) centros.add(d.centro_custo || d.centroCusto);
    });

    return {
      filiais: Array.from(filiais),
      unidades: Array.from(unidades),
      centros: Array.from(centros)
    };
  }, [dbData]);

  const reportData = useMemo(() => {
    if (loading) return null;

    const structure = [
      { id: 'rb', label: 'Receita Operacional Bruta', level: 0 },
      { id: 'ded', label: '(-) Deduções e Impostos', level: 1 },
      { id: 'rl', label: 'Receita Líquida', level: 0, isTotal: true },
      { id: 'custos', label: '(-) Custos (CPV/CSP)', level: 1 },
      { id: 'lb', label: 'Lucro Bruto', level: 0, isTotal: true },
      { id: 'desp', label: '(-) Despesas Operacionais', level: 1 },
      { id: 'ebitda', label: 'EBITDA Gerencial', level: 0, isTotal: true },
      { id: 'dep', label: '(-) Depreciação e Amortização', level: 1 },
      { id: 'ebit', label: 'EBIT', level: 0, isTotal: true },
      { id: 'fin', label: '(+/-) Resultado Financeiro', level: 1 },
      { id: 'lair', label: 'LAIR', level: 0, isTotal: true },
      { id: 'ir', label: '(-) Provisão IR/CSLL', level: 1 },
      { id: 'll', label: 'Lucro Líquido', level: 0, isTotal: true },
    ];

    const valuesByPeriod: Record<string, Record<string, number>> = {};
    const allPeriods = [...periods.historical, periods.current, ...periods.projections];
    
    const getPeriodKey = (p: PeriodInfo) => periodType === 'anual' ? p.year.toString() : `${p.year}-${p.month}`;

    allPeriods.forEach(p => {
      valuesByPeriod[getPeriodKey(p)] = { rb: 0, ded: 0, rl: 0, custos: 0, lb: 0, desp: 0, ebitda: 0, dep: 0, ebit: 0, fin: 0, lair: 0, ir: 0, ll: 0 };
    });

    dbData.forEach((d: any) => {
      if (d.type !== 'DRE' && d.type !== 'DRE Gerencial') return;

      const y = d.year || d.ano;
      const m = d.month || d.mes;
      const periodKey = periodType === 'anual' ? y.toString() : `${y}-${m}`;
      
      if (!valuesByPeriod[periodKey]) return;

      if (filterFilial !== 'Todas' && d.filial !== filterFilial) return;
      if (filterUnidade !== 'Todas' && d.unidade !== filterUnidade) return;
      if (filterCentroCusto !== 'Todos' && (d.centro_custo || d.centroCusto) !== filterCentroCusto) return;

      const val = d.val || d.valor || 0;
      const cat = (d.conta || d.category || '').toLowerCase();

      if (cat.includes('receita bruta') || cat.includes('faturamento')) valuesByPeriod[periodKey].rb += val;
      if (cat.includes('deduções') || cat.includes('impostos sobre vendas')) valuesByPeriod[periodKey].ded += Math.abs(val);
      if (cat.includes('custo')) valuesByPeriod[periodKey].custos += Math.abs(val);
      if (cat.includes('despesa')) valuesByPeriod[periodKey].desp += Math.abs(val);
      if (cat.includes('depreciação') || cat.includes('amortização')) valuesByPeriod[periodKey].dep += Math.abs(val);
      if (cat.includes('financeiro')) valuesByPeriod[periodKey].fin += val;
      if (cat.includes('irpj') || cat.includes('csll') || cat.includes('imposto de renda')) valuesByPeriod[periodKey].ir += Math.abs(val);
    });

    [...periods.historical, periods.current].forEach(p => {
      const key = getPeriodKey(p);
      const v = valuesByPeriod[key];
      v.rl = v.rb - v.ded;
      v.lb = v.rl - v.custos;
      v.ebitda = v.lb - v.desp;
      v.ebit = v.ebitda - v.dep;
      v.lair = v.ebit + v.fin;
      v.ll = v.lair - v.ir;
    });

    const growthRate = periodType === 'anual' ? 0.08 : 0.006;
    periods.projections.forEach((p) => {
      const key = getPeriodKey(p);
      let prevKey = '';
      if (periodType === 'anual') {
        prevKey = (p.year - 1).toString();
      } else {
        const d = new Date(p.year, (p.month || 0) - 2, 1);
        prevKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
      }
      
      const prevV = valuesByPeriod[prevKey] || valuesByPeriod[getPeriodKey(periods.current)];
      const v = valuesByPeriod[key];
      
      const factor = 1 + growthRate;
      v.rb = prevV.rb * factor;
      v.ded = prevV.ded * factor;
      v.rl = v.rb - v.ded;
      v.custos = prevV.custos * factor;
      v.lb = v.rl - v.custos;
      v.desp = prevV.desp * (periodType === 'anual' ? 1.05 : 1.004);
      v.ebitda = v.lb - v.desp;
      v.dep = prevV.dep;
      v.ebit = v.ebitda - v.dep;
      v.fin = prevV.fin;
      v.lair = v.ebit + v.fin;
      v.ir = v.lair > 0 ? v.lair * 0.15 : 0;
      v.ll = v.lair - v.ir;
    });

    return { structure, valuesByPeriod };
  }, [dbData, loading, periods, filterFilial, filterUnidade, filterCentroCusto, periodType]);

  const currentKey = periodType === 'anual' ? periods.current.year.toString() : `${periods.current.year}-${periods.current.month}`;

  const renderAccountRow = (row: any) => {
    if (!reportData) return null;
    const currentVal = reportData.valuesByPeriod[currentKey]?.[row.id] || 0;
    const netRevenue = reportData.valuesByPeriod[currentKey]?.rl || 1;
    const av = (currentVal / netRevenue) * 100;

    let prevKey = '';
    if (periodType === 'anual') {
      prevKey = (selectedYear - 1).toString();
    } else {
      const d = new Date(selectedYear, selectedMonth - 2, 1);
      prevKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
    }
    const prevVal = reportData.valuesByPeriod[prevKey]?.[row.id] || 0;
    const ah = prevVal !== 0 ? ((currentVal / prevVal) - 1) * 100 : 0;

    const visiblePeriods = viewMode === 'historical' 
      ? [...periods.historical, periods.current]
      : [periods.current, ...periods.projections];

    return (
      <tr key={row.id} className={cn(
        "hover:bg-surface-container/30 transition-colors group",
        row.isTotal && "bg-surface-container/50 font-black text-foreground"
      )}>
        <td className="px-5 md:px-8 py-2.5 md:py-4 sticky left-0 bg-card z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
           <div className="flex items-center gap-2" style={{ paddingLeft: `${row.level * 20}px` }}>
              <span className={cn(
                "text-[11px] break-words overflow-visible",
                row.isTotal ? "uppercase tracking-wider text-foreground font-black" : "text-muted-foreground font-medium"
              )}>
                {row.label}
              </span>
           </div>
        </td>
        
        {visiblePeriods.map(p => {
          const key = periodType === 'anual' ? p.year.toString() : `${p.year}-${p.month}`;
          const isCurrent = periodType === 'anual' ? p.year === selectedYear : (p.year === selectedYear && p.month === selectedMonth);
          const val = reportData.valuesByPeriod[key]?.[row.id] || 0;
          return (
            <td key={key} className={cn(
              "px-4 md:px-6 py-2.5 md:py-4 text-right text-[11px] font-mono",
              val < 0 ? "text-rose-500" : "text-foreground",
              isCurrent && "bg-secondary/5 font-bold"
            )}>
              {formatCurrency(val)}
            </td>
          );
        })}

        <td className="px-4 md:px-6 py-2.5 md:py-4 text-right">
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full",
            av > 0 ? "bg-secondary/10 text-secondary" : "bg-surface-container text-muted-foreground border border-border"
          )}>
            {av.toFixed(1)}%
          </span>
        </td>

        <td className="px-4 md:px-6 py-2.5 md:py-4 text-right">
          <div className="flex items-center justify-end gap-1">
            {ah !== 0 && (ah > 0 ? <ArrowUpRight size={10} className="text-success" /> : <ArrowDownRight size={10} className="text-destructive" />)}
            <span className={cn(
              "text-[10px] font-bold",
              ah > 0 ? "text-success" : ah < 0 ? "text-destructive" : "text-muted-foreground"
            )}>
              {ah.toFixed(1)}%
            </span>
          </div>
        </td>
      </tr>
    );
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="DRE Gerencial Estratégica" 
        subtitle="Demonstrativo multidimensional de resultados operacionais com série histórica e análise preditiva."
        icon={Activity}
      />

      <div className="flex items-center justify-start gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
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
        <KpiCard 
          title="Receita (Período)" 
          value={formatValue(reportData?.valuesByPeriod[currentKey]?.rl || 0, '')} 
          suffix="R$"
          icon={TrendingUp} 
          status="Verde" 
          trend="Estável" 
        />
        <KpiCard 
          title="EBITDA (Período)" 
          value={formatValue(reportData?.valuesByPeriod[currentKey]?.ebitda || 0, '')} 
          suffix="R$"
          icon={CircleDollarSign} 
          status={(reportData?.valuesByPeriod[currentKey]?.ebitda || 0) >= 0 ? "Verde" : "Vermelho"} 
          trend={(reportData?.valuesByPeriod[currentKey]?.ebitda || 0) >= 0 ? "Bullish" : "Bearish"} 
        />
        <KpiCard 
          title="Margem EBITDA" 
          value={((reportData?.valuesByPeriod[currentKey]?.ebitda || 0) / (reportData?.valuesByPeriod[currentKey]?.rl || 1) * 100).toFixed(1)} 
          suffix="%"
          icon={Target} 
          status={((reportData?.valuesByPeriod[currentKey]?.ebitda || 0) / (reportData?.valuesByPeriod[currentKey]?.rl || 1) * 100) >= 20 ? "Verde" : "Amarelo"} 
          trend="Estável" 
        />
        <KpiCard 
          title="Lucro Líquido" 
          value={formatValue(reportData?.valuesByPeriod[currentKey]?.ll || 0, '')} 
          suffix="R$"
          icon={Activity} 
          status={(reportData?.valuesByPeriod[currentKey]?.ll || 0) >= 0 ? "Verde" : "Vermelho"} 
          trend="Consolidado" 
        />
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
             onClick={() => setViewMode('historical')}
             className={cn(
               "flex-1 py-2 rounded-sm text-[9px] font-medium uppercase tracking-widest transition-all",
               viewMode === 'historical' ? "bg-card text-secondary shadow-sm" : "text-muted-foreground hover:text-foreground"
             )}
           >
             Série Histórica
           </button>
           <button 
             onClick={() => setViewMode('projection')}
             className={cn(
               "flex-1 py-2 rounded-sm text-[9px] font-medium uppercase tracking-widest transition-all",
               viewMode === 'projection' ? "bg-card text-secondary shadow-sm" : "text-muted-foreground hover:text-foreground"
             )}
           >
             Projeção 
           </button>
        </div>
      </div>

      <div className="bg-card rounded-md border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-surface-container/30">
          <div>
            <h2 className="text-lg font-black text-foreground">Análise de Resultados Multi-Dimensional</h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-0.5">
              {viewMode === 'historical' ? 'Série Histórica' : 'Projeções Futuras'} · {periodType === 'anual' ? 'Visão de 5 Anos' : 'Visão de 12 Meses'}
            </p>
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

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-surface-container border-b border-border">
                <th className="px-5 md:px-8 py-2.5 md:py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest sticky left-0 bg-surface-container z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Estrutura DRE</th>
                {(viewMode === 'historical' ? [...periods.historical, periods.current] : [periods.current, ...periods.projections]).map(p => {
                  const key = periodType === 'anual' ? p.year.toString() : `${p.year}-${p.month}`;
                  const isCurrent = periodType === 'anual' ? p.year === selectedYear : (p.year === selectedYear && p.month === selectedMonth);
                  return (
                    <th key={key} className={cn(
                      "px-4 md:px-6 py-2.5 md:py-4 text-right text-[10px] font-black uppercase tracking-widest",
                      isCurrent ? "text-secondary bg-secondary/5" : "text-muted-foreground"
                    )}>
                      {p.label}
                    </th>
                  );
                })}
                <th className="px-4 md:px-6 py-2.5 md:py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">AV %</th>
                <th className="px-4 md:px-6 py-2.5 md:py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">AH %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {reportData ? (
                reportData.structure.map(row => renderAccountRow(row))
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

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
                      <h3 className="text-h3 font-display font-medium text-foreground">Meta EBITDA {selectedYear}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">Performance Desejada</p>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-xs font-bold text-muted-foreground">Progresso do Período</span>
                         <span className="text-lg font-black text-secondary">0.0%</span>
                      </div>
                      <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden border border-border">
                          <div className="h-full bg-secondary w-0 shadow-[0_0_20px_rgba(255,133,82,0.2)]" />
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-surface-container rounded-md border border-border">
                         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Margem Alvo</p>
                         <p className="text-xl font-bold text-foreground">0.0%</p>
                      </div>
                      <div className="p-4 bg-surface-container rounded-md border border-border">
                         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Gap de Resultado</p>
                         <p className="text-xl font-bold text-foreground">R$ 0</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}
