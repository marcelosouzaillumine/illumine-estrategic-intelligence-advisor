import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  UserCheck, 
  Clock, 
  AlertCircle, 
  Download,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Loader2,
  Plus,
  Upload,
  Trash2
} from 'lucide-react';
import { cn, formatCurrency } from '../../../../lib/utils';
import { useDataTable } from '../../../../hooks/useDataTable';
import { SortableHeader } from './SortableHeader';
import { PageHeader } from '../../../../components/Common';
import { usePayrollDashboardAdapter, PayrollEmployee } from '../../../../adapters/ui/usePayrollDashboardAdapter';
import { useExecutiveFormatter } from "../../../../core/localization";

const CHART_COLORS = ['var(--color-primary)', 'var(--color-state-excellent)', 'var(--color-state-warning)', 'var(--color-state-critical)', 'var(--color-accent)', 'var(--color-primary)'];

type Employee = PayrollEmployee;

export default function PayrollDashboard({ clientId }: { clientId: string }) {
    const formatter = useExecutiveFormatter();
  const { employees, loading, clientInfo } = usePayrollDashboardAdapter(clientId);
  const [turnoverMensal, setTurnoverMensal] = useState<number>(0);
  const [selectedSimEmployeeId, setSelectedSimEmployeeId] = useState<string>('todos');

  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sort,
    toggleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData: filteredEmployees,
    paginatedData: paginatedEmployees
  } = useDataTable(employees, {
    searchFields: ['nome', 'funcao', 'area'],
    initialSort: { key: 'custoMensal', direction: 'desc' as const },
    itemsPerPage: 10
  });

  const unique = (values: any[]) => Array.from(new Set(values.filter(Boolean))).sort();

  const filterOptions = useMemo(() => {
      const formatter = useExecutiveFormatter();
    return {
      areas: ["Todas", ...unique(employees.map((item) => item.area))],
      statuses: ["Todos", ...unique(employees.map((item) => item.status))],
      contractTypes: ["Todos", ...unique(employees.map((item) => item.tipoContrato))]
    };
  }, [employees]);

  const summary = useMemo(() => {
      const formatter = useExecutiveFormatter();
    const total = filteredEmployees.length;
    const monthlyCost = filteredEmployees.reduce((acc, item) => acc + item.custoMensal, 0);
    const annualCost = filteredEmployees.reduce((acc, item) => acc + item.custoAnual, 0);
    const salaryBase = filteredEmployees.reduce((acc, item) => acc + item.salarioBase, 0);
    const charges = filteredEmployees.reduce((acc, item) => acc + item.encargos, 0);
    const provisions = filteredEmployees.reduce((acc, item) => acc + item.decimoTerceiroFerias, 0);
    const severance = filteredEmployees.reduce((acc, item) => acc + item.custoRescisaoEstimado, 0);
    const provisaoIndenizatoria = severance * (turnoverMensal / 100);

    return {
      total,
      active: filteredEmployees.filter(e => e.status === 'Ativo').length,
      monthlyCost,
      annualCost,
      salaryBase,
      charges,
      provisions,
      severance,
      provisaoIndenizatoria,
      averageCost: total > 0 ? monthlyCost / total : 0
    };
  }, [filteredEmployees, turnoverMensal]);

  const groupSum = (rows: any[], key: string, valueKey: string) => {
      const formatter = useExecutiveFormatter();
    return rows.reduce((acc, row) => {
        const formatter = useExecutiveFormatter();
      const group = row[key] || "Não informado";
      acc[group] = (acc[group] || 0) + row[valueKey];
      return acc;
    }, {} as Record<string, number>);
  };

  const getTopGroups = (grouped: Record<string, number>, limit = 5) => {
      const formatter = useExecutiveFormatter();
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };

  const areaCost = getTopGroups(groupSum(filteredEmployees, "area", "custoMensal"));
  const roleCost = getTopGroups(groupSum(filteredEmployees, "funcao", "custoMensal"));

  const downloadCsv = () => {
      const formatter = useExecutiveFormatter();
    const headers = ["Nome", "Função", "Área", "Contrato", "Status", "Custo Mensal", "Custo Anual"];
    const rows = filteredEmployees.map(e => [
      e.nome, e.funcao, e.area, e.tipoContrato, e.status, e.custoMensal, e.custoAnual
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(";") + "\n"
      + rows.map(r => r.join(";")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `folha_pessoal_${clientInfo?.fantasia || 'cliente'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <Loader2 className="animate-spin text-secondary" size={48} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Users size={16} className="text-secondary" />
          </div>
        </div>
        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest animate-pulse">Carregando quadro de pessoal...</p>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="bg-slate-50 border border-border p-20 rounded-[40px] text-center space-y-6">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-muted-foreground mx-auto shadow-sm">
          <Users size={40} />
        </div>
        <h2 className="text-xl font-display text-primary">Selecione um Cliente</h2>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto uppercase font-bold tracking-widest">Escolha uma empresa no menu superior para visualizar os custos com pessoal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <PageHeader 
        title="Análise de Custos de Pessoal"
        subtitle="Análise gerencial detalhada de folha de pagamento, encargos e provisões."
        icon={Users}
        actions={
          <div className="flex gap-3">
            <button className="h-[46px] px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/10">
              <Upload size={16} /> Importar
            </button>
            <button className="h-[46px] px-6 bg-secondary text-white hover:bg-secondary/90 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-secondary/20">
              <Plus size={16} /> Inserir
            </button>
            <button className="h-[46px] px-6 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-red-500/20">
              <Trash2 size={16} /> Excluir
            </button>
          </div>
        }
      />

      {/* Toolbar */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">Buscar Colaborador</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Nome, função ou área..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="min-w-[140px]">
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">Área</label>
          <select 
            value={filters.area || 'Todas'} 
            onChange={e => setFilters(prev => ({ ...prev, area: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-display"
          >
            {filterOptions.areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="min-w-[140px]">
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">Vínculo</label>
          <select 
            value={filters.tipoContrato || 'Todos'} 
            onChange={e => setFilters(prev => ({ ...prev, tipoContrato: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-display"
          >
            {filterOptions.contractTypes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="min-w-[140px]">
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">Turnover Médio (%)</label>
          <input 
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={turnoverMensal}
            onChange={e => setTurnoverMensal(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-display"
          />
        </div>

        <button 
          onClick={downloadCsv}
          className="h-[46px] px-6 bg-slate-50 text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-border"
        >
          <Download size={16} /> Exportar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Custo Mensal', val: summary.monthlyCost, helper: 'Recorrência mensal bruta', icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Custo Anual', val: summary.annualCost, helper: 'Projeção 12 meses', icon: TrendingUp, color: 'text-muted-foreground', bg: 'bg-slate-50' },
          { label: 'Colaboradores', val: summary.total, suffix: ' pessoas', helper: `${summary.active} ativos no grupo`, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-success-soft' },
          { label: 'Custo Médio', val: summary.averageCost, helper: 'Gasto médio por pessoa', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-border shadow-sm group hover:border-secondary/30 transition-all">
            <div className={cn("w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-colors", kpi.bg, kpi.color)}>
              <kpi.icon size={18} />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-display text-primary tracking-tight">
              {typeof kpi.val === 'number' && !kpi.suffix ? formatCurrency(kpi.val) : `${kpi.val}${kpi.suffix || ''}`}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium mt-1">{kpi.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Base Salarial', val: summary.salaryBase, icon: Briefcase },
          { label: 'Encargos (INSS/FGTS)', val: summary.charges, icon: AlertCircle },
          { label: 'Provisões (13º/Férias)', val: summary.provisions, icon: Clock },
          { label: 'Prov. Indenizatória', val: summary.provisaoIndenizatoria, icon: AlertCircle },
          { label: 'Risco Rescisório', val: summary.severance, icon: AlertCircle, variant: 'red' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-slate-50/50 p-5 rounded-2xl border border-border flex items-center gap-4 group">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", kpi.variant === 'red' ? 'bg-red-50 text-red-500' : 'bg-white text-muted-foreground border border-border group-hover:text-secondary group-hover:border-secondary/30')}>
              <kpi.icon size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(kpi.val)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Severance Detailed Breakdown */}
      <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Simulação de Rescisão</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Estimativa baseada em demissão sem justa causa</p>
            </div>
          </div>
          
          <div className="min-w-[240px]">
            <select 
              value={selectedSimEmployeeId} 
              onChange={e => setSelectedSimEmployeeId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-display"
            >
              <option value="todos">Todos os Colaboradores</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.nome} - {e.funcao}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(() => {
                      const formatter = useExecutiveFormatter();
            const simEmployees = selectedSimEmployeeId === 'todos' ? employees : employees.filter(e => e.id === selectedSimEmployeeId);
            const aviso = simEmployees.reduce((acc, e) => acc + ((e as any).valorAviso || 0), 0);
            const multa = simEmployees.reduce((acc, e) => acc + ((e as any).valorMultaFgts || 0), 0);
            const prop = simEmployees.reduce((acc, e) => acc + ((e as any).decimoTerceiroProp || 0) + ((e as any).feriasProp || 0) + ((e as any).umTercoFerias || 0), 0);
            const total = simEmployees.reduce((acc, e) => acc + e.custoRescisaoEstimado, 0);

            return [
              { label: 'Aviso Prévio Indenizado', val: aviso, icon: Clock },
              { label: 'Multa FGTS (Est.)', val: multa, icon: DollarSign },
              { label: '13º e Férias Prop.', val: prop, icon: TrendingUp },
              { label: 'TOTAL RISCO ESTIMADO', val: total, icon: AlertCircle, highlight: true }
            ].map((item, idx) => (
              <div key={idx} className={cn("p-4 rounded-2xl border transition-all", item.highlight ? "bg-slate-900 border-border text-white" : "bg-slate-50 border-border")}>
                <p className={cn("text-[8px] font-black uppercase tracking-widest mb-1", item.highlight ? "text-muted-foreground" : "text-muted-foreground")}>{item.label}</p>
                <p className={cn("text-xl font-display", item.highlight ? "text-white" : "text-primary")}>{formatCurrency(item.val)}</p>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Análise Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart: Area Cost */}
        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8 text-center md:text-left">
            <div>
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Filter size={14} className="text-secondary" /> Custo Mensal por Área
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">Impacto financeiro por centro de custo</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaCost} layout="vertical" margin={{ left: 40, right: 40, top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-surface)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 9, fontWeight: 700, fill: 'var(--color-state-neutral)' }}
                  width={100}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--color-background)' }}
                  content={({ active, payload }) => {
                      const formatter = useExecutiveFormatter();
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-primary p-3 rounded-xl shadow-xl border border-white/10 backdrop-blur-md">
                          <p className="text-[10px] font-black text-secondary uppercase mb-1">{payload[0].payload.name}</p>
                          <p className="text-sm font-display text-white">{formatCurrency(payload[0].value as number)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 6, 6, 0]} 
                  barSize={16}
                >
                  {areaCost.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Role Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8 text-center md:text-left">
            <div>
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Briefcase size={14} className="text-blue-500" /> Distribuição por Função (Top 5)
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">Impacto financeiro por cargo</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleCost}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  label={false}
                >
                  {roleCost.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                                      const formatter = useExecutiveFormatter();
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-primary p-3 rounded-xl shadow-xl border border-white/10 backdrop-blur-md">
                          <p className="text-[10px] font-black text-secondary uppercase mb-1 text-center">{payload[0].payload.name}</p>
                          <p className="text-sm font-display text-white text-center">{formatCurrency(payload[0].value as number)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tight">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <Filter size={14} className="text-secondary" /> Custo Mensal por Área
          </h3>
          <div className="space-y-4">
            {areaCost.map((item, idx) => {
                const formatter = useExecutiveFormatter();
              const max = Math.max(...areaCost.map(i => i.value));
              const percent = (item.value / max) * 100;
              return (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-muted-foreground font-display">{item.name}</span>
                    <span className="text-primary">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className="h-full bg-secondary rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <Briefcase size={14} className="text-blue-500" /> Distribuição por Função
          </h3>
          <div className="space-y-4">
            {roleCost.map((item, idx) => {
                const formatter = useExecutiveFormatter();
              const max = Math.max(...roleCost.map(i => i.value));
              const percent = (item.value / max) * 100;
              return (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-muted-foreground font-display">{item.name}</span>
                    <span className="text-primary">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className="h-full bg-primary rounded-full group-hover:bg-secondary transition-colors"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table Detail */}
      <div className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden border-b-4 border-b-slate-200">
        <div className="p-8 border-b border-border flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-display text-primary">Detalhamento Analítico</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Lista completa de colaboradores e custos individuais</p>
          </div>
          <span className="px-4 py-1.5 bg-white border border-border shadow-sm rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
            {filteredEmployees.length} Registros encontrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/50">
                <SortableHeader label="Nome / Admissão" sortKey="nome" currentSort={sort} onSort={toggleSort} />
                <SortableHeader label="Função" sortKey="funcao" currentSort={sort} onSort={toggleSort} />
                <SortableHeader label="Área" sortKey="area" currentSort={sort} onSort={toggleSort} />
                <SortableHeader label="Vínculo" sortKey="tipoContrato" currentSort={sort} onSort={toggleSort} />
                <SortableHeader label="Status" sortKey="status" currentSort={sort} onSort={toggleSort} />
                <SortableHeader label="Custo Mensal" sortKey="custoMensal" currentSort={sort} onSort={toggleSort} align="right" />
                <SortableHeader label="Provisão Rescisão" sortKey="custoRescisaoEstimado" currentSort={sort} onSort={toggleSort} align="right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedEmployees.length > 0 ? paginatedEmployees.map((emp, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 md:px-8 py-3 md:py-5">
                    <p className="text-sm font-black text-primary uppercase tracking-tight">{emp.nome}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Admissão: {formatter.date(emp.admissao)}</p>
                  </td>
                  <td className="px-5 md:px-8 py-3 md:py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-muted-foreground">{emp.funcao}</span>
                    </div>
                  </td>
                  <td className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{emp.area}</td>
                  <td className="px-5 md:px-8 py-3 md:py-5">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest", 
                      emp.tipoContrato === 'CLT' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-warning-soft text-amber-600 border border-amber-100'
                    )}>
                      {emp.tipoContrato}
                    </span>
                  </td>
                  <td className="px-5 md:px-8 py-3 md:py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <div className={cn("w-2 h-2 rounded-full", emp.status === 'Ativo' ? 'bg-success-soft0 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-300')} />
                      {emp.status}
                    </div>
                  </td>
                  <td className="px-5 md:px-8 py-3 md:py-5 text-right">
                    <p className="text-sm font-display text-primary">{formatCurrency(emp.custoMensal)}</p>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">Anual: {formatCurrency(emp.custoAnual)}</p>
                  </td>
                  <td className="px-5 md:px-8 py-3 md:py-5 text-right">
                    <p className="text-sm font-bold text-red-500">{formatCurrency(emp.custoRescisaoEstimado)}</p>
                    <div className="hidden group-hover:block absolute right-8 bg-white border border-border p-3 rounded-xl shadow-xl z-10 text-left min-w-[180px]">
                      <p className="text-[8px] font-black text-muted-foreground uppercase mb-2 border-b border-border pb-1">Composição Estimada</p>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-[9px] font-bold text-muted-foreground">Aviso Prévio:</span>
                          <span className="text-[9px] font-bold text-muted-foreground">{formatCurrency((emp as any).valorAviso || 0)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[9px] font-bold text-muted-foreground">Multa FGTS:</span>
                          <span className="text-[9px] font-bold text-muted-foreground">{formatCurrency((emp as any).valorMultaFgts || 0)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[9px] font-bold text-muted-foreground">Prop. 13º/Férias:</span>
                          <span className="text-[9px] font-bold text-muted-foreground">{formatCurrency(((emp as any).decimoTerceiroProp || 0) + ((emp as any).feriasProp || 0) + ((emp as any).umTercoFerias || 0))}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Users size={48} />
                      <p className="text-sm font-black uppercase tracking-widest">Nenhum colaborador encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50 border-t border-border flex items-center justify-between">
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-4">
            Página <span className="text-primary">{currentPage}</span> de <span className="text-primary">{totalPages || 1}</span>
          </div>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-2.5 rounded-xl bg-white border border-border text-muted-foreground hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-2.5 rounded-xl bg-white border border-border text-muted-foreground hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
