import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  BarChart as ChartBarIcon, 
  TrendingUp, 
  TrendingDown, 
  CircleDollarSign, 
  Target,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../../lib/utils';
import { PageHeader } from '../Common';
import { ExecutiveCommentary } from '../ExecutiveCommentary';

import { useFinancialData } from '../../hooks/useFinancialData';
import { useAccountPlan } from '../../hooks/useAccountPlan';
import { FULL_MONTH_LABELS } from '../../constants';

export function DreGerencialPage({ selectedClient, selectedYear, selectedMonth }: any) {
  const [filterMonth, setFilterMonth] = useState(selectedMonth || 3);
  const [filterYear, setFilterYear] = useState(selectedYear || 2026);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const { accounts, loading: loadingPlan } = useAccountPlan(selectedClient, 'managerial');
  const { dbData, loading: loadingData } = useFinancialData(selectedClient, filterYear, filterMonth, 'DRE');

  const toggleGroup = (code: string) => {
    setExpandedGroups(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => current - i);
  }, []);

  const { dreData, summary } = useMemo(() => {
    if (loadingPlan || !accounts) return { dreData: [], summary: { receitas: 0, custos: 0, despesas: 0, resultado: 0, ebitda: 0, margem: 0 } };

    // 1. Map values from dbData to accounts
    const valuesMap: Record<string, number> = {};
    dbData.forEach(entry => {
      const cat = entry.conta || entry.category;
      if (cat) {
        valuesMap[cat] = (valuesMap[cat] || 0) + (entry.valor || 0);
      }
    });

    // 2. Build Hierarchy and Sum up
    // Sort accounts by code length (descending) to sum children into parents
    const sortedAccounts = [...accounts].sort((a, b) => b.code.length - a.code.length);
    const totals: Record<string, number> = {};

    // Initial values from entries
    accounts.forEach(acc => {
      totals[acc.code] = valuesMap[acc.name] || 0;
    });

    // Sum up children to parents
    sortedAccounts.forEach(acc => {
      const parts = acc.code.split('.');
      if (parts.length > 1) {
        const parentCode = parts.slice(0, -1).join('.');
        totals[parentCode] = (totals[parentCode] || 0) + totals[acc.code];
      }
    });

    // 3. Build the DRE Structure
    const buildTree = (parentCode: string | null = null): any[] => {
      return accounts
        .filter(acc => {
          if (parentCode === null) return !acc.code.includes('.');
          const parts = acc.code.split('.');
          const parentParts = parentCode ? parentCode.split('.') : [];
          return parts.length === parentParts.length + 1 && (parentCode === null || acc.code.startsWith(parentCode + '.'));
        })
        .map(acc => ({
          ...acc,
          total: totals[acc.code],
          children: buildTree(acc.code)
        }));
    };

    const tree = buildTree();

    // 4. Calculate Summary
    const receitas = tree.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.total, 0);
    const custos = Math.abs(tree.filter(t => t.type === 'Custo').reduce((acc, t) => acc + t.total, 0));
    const despesas = Math.abs(tree.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.total, 0));
    
    const ebitda = receitas - custos - despesas;
    const resultado = ebitda; // Simplified for now
    const margem = receitas > 0 ? ebitda / receitas : 0;

    return { 
      dreData: tree, 
      summary: { receitas, custos, despesas, ebitda, resultado, margem } 
    };
  }, [accounts, dbData, loadingPlan]);

  const renderAccountRow = (acc: any, level: number = 0) => {
    const isExpanded = expandedGroups.includes(acc.code);
    const hasChildren = acc.children && acc.children.length > 0;
    const isNegative = acc.total < 0;

    return (
      <React.Fragment key={acc.code}>
        <tr className={cn(
          "hover:bg-slate-50/50 transition-colors group",
          level === 0 && "bg-slate-50/30"
        )}>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
              {hasChildren ? (
                <button onClick={() => toggleGroup(acc.code)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <div className="w-6" />
              )}
              <span className={cn(
                "text-xs",
                level === 0 ? "font-black text-primary uppercase tracking-widest" : "font-bold text-slate-600"
              )}>
                {acc.name}
              </span>
            </div>
          </td>
          <td className="px-6 py-4 text-xs font-mono text-slate-400">{acc.code}</td>
          <td className={cn(
            "px-6 py-4 text-xs font-black text-right",
            isNegative ? "text-rose-500" : "text-slate-900"
          )}>
            {formatCurrency(acc.total)}
          </td>
          <td className="px-6 py-4 text-right">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {summary.receitas !== 0 ? `${((acc.total / summary.receitas) * 100).toFixed(1)}%` : '0.0%'}
            </span>
          </td>
        </tr>
        {isExpanded && acc.children.map((child: any) => renderAccountRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <div className="bg-slate-900 rounded-[40px] p-10 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <PageHeader 
            title="DRE Gerencial" 
            subtitle="Demonstração de resultados estruturada sob a ótica de gestão e plano de contas personalizado."
            icon={<Activity className="text-secondary" size={24} />}
            color="secondary"
          />
          <div className="flex flex-wrap items-center gap-3">
            <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(Number(e.target.value))} 
                className="bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:bg-white/10 transition-all"
            >
                {years.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
            </select>

            <select 
                value={filterMonth} 
                onChange={(e) => setFilterMonth(Number(e.target.value))} 
                className="bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:bg-white/10 transition-all"
            >
                {Object.entries(FULL_MONTH_LABELS).map(([num, name]) => (
                    <option key={num} value={num} className="bg-slate-900">{name}</option>
                ))}
            </select>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCardGerencial title="Receita Operacional" value={formatCurrency(Math.floor(summary.receitas))} icon={TrendingUp} tone="primary" />
        <KpiCardGerencial title="Custos e Despesas" value={formatCurrency(Math.floor(summary.custos + summary.despesas))} icon={TrendingDown} tone="danger" />
        <KpiCardGerencial title="EBITDA" value={formatCurrency(Math.floor(summary.ebitda))} icon={CircleDollarSign} tone={summary.ebitda >= 0 ? "success" : "danger"} />
        <KpiCardGerencial title="Margem EBITDA" value={`${(summary.margem * 100).toFixed(1)}%`} icon={Target} tone="warning" />
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-black text-slate-900">Demonstrativo de Resultados</h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">ESTRUTURA POR PLANO DE CONTAS</p>
          </div>
          <button 
            onClick={() => setExpandedGroups(expandedGroups.length > 0 ? [] : dreData.map((a: any) => a.code))}
            className="text-[10px] font-black text-secondary uppercase tracking-widest px-4 py-2 bg-secondary/5 rounded-xl hover:bg-secondary/10 transition-all"
          >
            {expandedGroups.length > 0 ? 'Recolher Tudo' : 'Expandir Tudo'}
          </button>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Estrutura de Contas</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Código</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Valor Período</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">AV %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingPlan || loadingData ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Activity className="animate-spin mx-auto text-secondary mb-4" size={32} />
                    <span className="text-slate-500 font-bold">Carregando dados estruturados...</span>
                  </td>
                </tr>
              ) : dreData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Info className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-medium italic">Nenhum dado encontrado para este período ou plano de contas não configurado.</p>
                  </td>
                </tr>
              ) : (
                dreData.map((acc: any) => renderAccountRow(acc))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ExecutiveCommentary 
        reportType="DRE_GERENCIAL"
        clientId={selectedClient}
        year={filterYear}
        month={filterMonth}
      />
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
