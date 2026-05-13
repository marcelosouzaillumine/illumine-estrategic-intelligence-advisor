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
import { cn, formatCurrency } from '../../lib/utils';
import { ExecutiveCommentary } from '../ExecutiveCommentary';

import { useAllFinancialData } from '../../hooks/useFinancialData';
import { FULL_MONTH_LABELS, MONTH_LABELS } from '../../constants';

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
        "hover:bg-slate-50 transition-colors group",
        row.isTotal && "bg-slate-50/50 font-black text-slate-900"
      )}>
        <td className="px-8 py-4 sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
           <div className="flex items-center gap-2" style={{ paddingLeft: `${row.level * 20}px` }}>
              <span className={cn(
                "text-[11px] whitespace-nowrap",
                row.isTotal ? "uppercase tracking-wider" : "text-slate-600 font-medium"
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
              "px-6 py-4 text-right text-[11px] font-mono",
              val < 0 ? "text-rose-500" : "text-slate-700",
              isCurrent && "bg-blue-50/30 font-bold"
            )}>
              {formatCurrency(val)}
            </td>
          );
        })}

        <td className="px-6 py-4 text-right">
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full",
            av > 0 ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"
          )}>
            {av.toFixed(1)}%
          </span>
        </td>

        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-1">
            {ah !== 0 && (ah > 0 ? <ArrowUpRight size={10} className="text-emerald-500" /> : <ArrowDownRight size={10} className="text-rose-500" />)}
            <span className={cn(
              "text-[10px] font-bold",
              ah > 0 ? "text-emerald-600" : ah < 0 ? "text-rose-600" : "text-slate-400"
            )}>
              {ah.toFixed(1)}%
            </span>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Activity size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">DRE Gerencial Estratégica</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Demonstrativo multi-dimensional com análise preditiva e série histórica.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1">
            <div className="flex items-center px-4 py-2 border-r border-white/10">
              <Calendar size={14} className="text-slate-400 mr-2" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
              >
                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                  <option key={y} value={y} className="bg-slate-900">{y}</option>
                ))}
              </select>
            </div>
            {periodType === 'mensal' && (
              <div className="flex items-center px-4 py-2">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
                >
                  {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                    <option key={m} value={Number(m)} className="bg-slate-900">{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
              periodType === 'mensal' ? "text-secondary" : "text-slate-500"
            )}>Mensal</span>
            <button 
              onClick={() => setPeriodType(prev => prev === 'mensal' ? 'anual' : 'mensal')}
              className={cn(
                "w-12 h-6 rounded-full p-1 transition-all duration-500 relative",
                periodType === 'anual' ? "bg-secondary" : "bg-slate-700"
              )}
            >
              <motion.div 
                animate={{ x: periodType === 'anual' ? 24 : 0 }}
                className="w-4 h-4 bg-white rounded-full shadow-lg"
              />
            </button>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
              periodType === 'anual' ? "text-secondary" : "text-slate-500"
            )}>
              Anual
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCardGerencial title="Receita (Período)" value={formatCurrency(reportData?.valuesByPeriod[currentKey]?.rl || 0)} icon={TrendingUp} tone="primary" />
        <KpiCardGerencial title="EBITDA (Período)" value={formatCurrency(reportData?.valuesByPeriod[currentKey]?.ebitda || 0)} icon={CircleDollarSign} tone={(reportData?.valuesByPeriod[currentKey]?.ebitda || 0) >= 0 ? "success" : "danger"} />
        <KpiCardGerencial title="Margem EBITDA" value={`${((reportData?.valuesByPeriod[currentKey]?.ebitda || 0) / (reportData?.valuesByPeriod[currentKey]?.rl || 1) * 100).toFixed(1)}%`} icon={Target} tone="warning" />
        <KpiCardGerencial title="Lucro Líquido" value={formatCurrency(reportData?.valuesByPeriod[currentKey]?.ll || 0)} icon={Activity} tone="primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm items-end">
        <div>
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Filial</label>
          <div className="relative group">
            <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" />
            <select 
              value={filterFilial}
              onChange={(e) => setFilterFilial(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-secondary/20 transition-all appearance-none"
            >
              {dimensions.filiais.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Unidade de Negócio</label>
          <div className="relative group">
            <Boxes size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" />
            <select 
              value={filterUnidade}
              onChange={(e) => setFilterUnidade(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-secondary/20 transition-all appearance-none"
            >
              {dimensions.unidades.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Centro de Custo</label>
          <div className="relative group">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" />
            <select 
              value={filterCentroCusto}
              onChange={(e) => setFilterCentroCusto(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-secondary/20 transition-all appearance-none"
            >
              {dimensions.centros.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button 
             onClick={() => setViewMode('historical')}
             className={cn(
               "flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
               viewMode === 'historical' ? "bg-white text-secondary shadow-sm" : "text-slate-500 hover:text-slate-700"
             )}
           >
             Série Histórica
           </button>
           <button 
             onClick={() => setViewMode('projection')}
             className={cn(
               "flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
               viewMode === 'projection' ? "bg-white text-secondary shadow-sm" : "text-slate-500 hover:text-slate-700"
             )}
           >
             Projeção 
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-slate-900">Análise de Resultados Multi-Dimensional</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">
              {viewMode === 'historical' ? 'Série Histórica' : 'Projeções Futuras'} · {periodType === 'anual' ? 'Visão de 5 Anos' : 'Visão de 12 Meses'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all" title="Exportar Excel">
              <FileSpreadsheet size={16} />
            </button>
            <button className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all" title="Exportar PDF">
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Estrutura DRE</th>
                {(viewMode === 'historical' ? [...periods.historical, periods.current] : [periods.current, ...periods.projections]).map(p => {
                  const key = periodType === 'anual' ? p.year.toString() : `${p.year}-${p.month}`;
                  const isCurrent = periodType === 'anual' ? p.year === selectedYear : (p.year === selectedYear && p.month === selectedMonth);
                  return (
                    <th key={key} className={cn(
                      "px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest",
                      isCurrent ? "text-blue-600 bg-blue-50/30" : "text-slate-400"
                    )}>
                      {p.label}
                    </th>
                  );
                })}
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">AV %</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">AH %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={30} className="py-20 text-center">
                    <Activity className="animate-spin mx-auto text-secondary mb-4" size={32} />
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Consolidando dimensões...</span>
                  </td>
                </tr>
              ) : reportData ? (
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
          
          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col justify-center">
             <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-secondary">
                      <Target size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black">Meta EBITDA {selectedYear}</h3>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Performance Desejada</p>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-xs font-bold text-slate-400">Progresso do Período</span>
                         <span className="text-lg font-black text-secondary">78.5%</span>
                      </div>
                      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-secondary w-[78.5%] shadow-[0_0_20px_rgba(255,133,82,0.4)]" />
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Margem Alvo</p>
                         <p className="text-xl font-black text-white">22.0%</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Gap de Resultado</p>
                         <p className="text-xl font-black text-rose-400">R$ 142k</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}

function KpiCardGerencial({ title, value, icon: Icon, tone = 'primary' }: any) {
  const bgTones: any = {
    primary: "bg-blue-50 text-blue-600",
    success: "bg-emerald-50 text-emerald-600",
    danger: "bg-rose-50 text-rose-600",
    warning: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm group hover:shadow-md transition-all">
       <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2.5 rounded-xl transition-all group-hover:scale-110", bgTones[tone])}>
             <Icon size={18} />
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] block group-hover:text-slate-500 transition-colors">{title}</span>
             <span className="text-2xl font-black text-slate-900 tracking-tighter block mt-1">{value}</span>
          </div>
       </div>
    </div>
  );
}
