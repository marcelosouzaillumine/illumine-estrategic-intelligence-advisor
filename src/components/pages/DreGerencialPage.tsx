
import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  BarChart as ChartBarIcon, 
  TrendingUp, 
  TrendingDown, 
  CircleDollarSign, 
  Target 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatCurrency } from '../../lib/utils';
import { ExecutiveCommentary } from '../ExecutiveCommentary';

export function DreGerencialPage({ selectedClient, selectedYear, selectedMonth }: any) {
  const [filterClient] = useState(selectedClient);
  const [filterYear] = useState(selectedYear || 2026);
  const [filterMonth] = useState(selectedMonth || 3);

  const defaultData = [
    { grupo: "Receitas", conta: "Receita Hospitalar", unidade: "Hospital", mes: "Mar/2026", valor: 120000 },
    { grupo: "Receitas", conta: "Honorários Médicos", unidade: "Centro Cirúrgico", mes: "Mar/2026", valor: 45000 },
    { grupo: "Custos", conta: "Materiais e Medicamentos", unidade: "Hospital", mes: "Mar/2026", valor: -38000 },
    { grupo: "Despesas", conta: "Folha de Pagamento", unidade: "Administrativo", mes: "Mar/2026", valor: -52000 },
    { grupo: "Despesas", conta: "Despesas Administrativas", unidade: "Administrativo", mes: "Mar/2026", valor: -18000 }
  ];

  const [unidade, setUnidade] = useState("Todas");
  const [mes, setMes] = useState("Todos");

  const unidades = ["Todas", ...new Set(defaultData.map((item) => item.unidade))];
  const meses = ["Todos", ...new Set(defaultData.map((item) => item.mes))];

  const dadosFiltrados = useMemo(() => {
    return defaultData.filter((item) => {
      const filtroUnidade = unidade === "Todas" || item.unidade === unidade;
      const filtroMes = mes === "Todos" || item.mes === mes;
      return filtroUnidade && filtroMes;
    });
  }, [unidade, mes]);

  const resumo = useMemo(() => {
    const receitas = dadosFiltrados
      .filter((item) => item.valor > 0)
      .reduce((acc, item) => acc + item.valor, 0);

    const custosDespesas = dadosFiltrados
      .filter((item) => item.valor < 0)
      .reduce((acc, item) => acc + item.valor, 0);

    const resultado = receitas + custosDespesas;
    const margem = receitas > 0 ? resultado / receitas : 0;

    return { receitas, custosDespesas, resultado, margem };
  }, [dadosFiltrados]);

  const grupos = useMemo(() => {
    return dadosFiltrados.reduce((acc: any, item) => {
      if (!acc[item.grupo]) acc[item.grupo] = 0;
      acc[item.grupo] += item.valor;
      return acc;
    }, {});
  }, [dadosFiltrados]);

  return (
    <div className="space-y-8">
      <div className="bg-[#0e1c2c] p-10 rounded-[40px] text-white overflow-hidden relative shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-md">
                <Activity size={20} className="text-blue-400" />
             </div>
             <span className="text-[12px] font-black text-blue-400 uppercase tracking-[0.3em]">Gerencial Financeiro</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-4">DRE Gerencial Hospitalar</h1>
          <p className="text-white/60 text-sm max-w-2xl font-medium leading-relaxed">
            Visão gerencial consolidada de receitas, custos, despesas e resultado operacional. Filtre por unidade ou período para análises específicas.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
           <ChartBarIcon size={400} className="text-white translate-x-1/4 -translate-y-1/4" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade:</span>
          <select 
            value={unidade} 
            onChange={(e) => setUnidade(e.target.value)} 
            className="text-xs font-bold bg-transparent outline-none cursor-pointer"
          >
            {unidades.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mês:</span>
          <select 
            value={mes} 
            onChange={(e) => setMes(e.target.value)} 
            className="text-xs font-bold bg-transparent outline-none cursor-pointer"
          >
            {meses.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCardGerencial title="Receitas" value={formatCurrency(resumo.receitas)} icon={TrendingUp} tone="primary" />
        <KpiCardGerencial title="Custos e Despesas" value={formatCurrency(Math.abs(resumo.custosDespesas))} icon={TrendingDown} tone="danger" />
        <KpiCardGerencial title="Resultado" value={formatCurrency(resumo.resultado)} icon={CircleDollarSign} tone={resumo.resultado >= 0 ? "success" : "danger"} />
        <KpiCardGerencial title="Margem Operacional" value={`${(resumo.margem * 100).toFixed(2)}%`} icon={Target} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-2">Resumo por Grupo</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-8">COMPOSIÇÃO DO RESULTADO</p>

          <div className="space-y-4">
            {Object.entries(grupos).map(([grupo, valor]: [string, any]) => (
              <div key={grupo} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-sm font-bold text-slate-600">{grupo}</span>
                <span className={cn(
                  "text-sm font-black",
                  valor < 0 ? "text-rose-500" : "text-emerald-500"
                )}>
                  {formatCurrency(valor)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <h2 className="text-lg font-black text-slate-900 mb-2">DRE Detalhada</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-8">LANÇAMENTOS DO PERÍODO</p>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 sticky left-0 z-10 bg-slate-50">Grupo</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Conta</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Unidade</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Mês</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dadosFiltrados.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-xs font-bold text-slate-600 sticky left-0 z-10 bg-white group-hover:bg-slate-50/50">
                       <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-black uppercase",
                          item.grupo === 'Receitas' ? "bg-emerald-100 text-emerald-600" : item.grupo === 'Custos' ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                       )}>
                          {item.grupo}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">{item.conta}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">{item.unidade}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-bold">{item.mes}</td>
                    <td className={cn(
                      "px-6 py-4 text-xs font-black text-right",
                      item.valor < 0 ? "text-rose-500" : "text-slate-900"
                    )}>
                      {formatCurrency(item.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ExecutiveCommentary 
        reportType="DRE_GERENCIAL"
        clientId={filterClient}
        year={filterYear}
        month={filterMonth}
      />
    </div>
  );
}

function KpiCardGerencial({ title, value, icon: Icon, tone = 'primary' }: any) {
  const tones: any = {
    primary: "from-blue-500 to-indigo-600 text-white",
    success: "from-emerald-500 to-teal-600 text-white",
    danger: "from-rose-500 to-pink-600 text-white",
    warning: "from-amber-500 to-orange-600 text-white",
  };

  const bgTones: any = {
    primary: "bg-blue-50 text-blue-600",
    success: "bg-emerald-50 text-emerald-600",
    danger: "bg-rose-50 text-rose-600",
    warning: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-all">
       <div className="flex items-start justify-between mb-6">
          <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", bgTones[tone])}>
             <Icon size={20} />
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{title}</span>
             <span className="text-2xl font-black text-slate-900 tracking-tighter block mt-1">{value}</span>
          </div>
       </div>
       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '70%' }}
            className={cn("h-full rounded-full bg-gradient-to-r", tones[tone])}
          />
       </div>
    </div>
  );
}
