
import React, { useMemo } from 'react';
import { 
  FileText, 
  Users, 
  TrendingDown, 
  BarChart3, 
  Layout, 
  ShieldCheck,
  Clock,
  DollarSign,
  PieChart as PieIcon,
  Zap,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, cn } from '../../lib/utils';

interface AdministrativaPageProps {
  clientId: string;
}

export function AdministrativaPage({ clientId }: AdministrativaPageProps) {
  const indicators = useMemo(() => [
    { label: 'Overhead Administrativo', value: 12.5, suffix: '%', status: 'neutral', target: 10.0, icon: Layout },
    { label: 'Custo G&A por Colaborador', value: 1250, isCur: true, status: 'positive', target: 1500, icon: Users },
    { label: 'Eficiência de Processos', value: 85, suffix: '%', status: 'positive', target: 80, icon: ShieldCheck },
    { label: 'Budget vs Realizado (Adm)', value: 98, suffix: '%', status: 'positive', target: 100, icon: PieIcon }
  ], []);

  const departmentBreakdown = [
    { name: 'Financeiro', value: 45000, color: '#3b82f6' },
    { name: 'RH', value: 28000, color: '#10b981' },
    { name: 'Jurídico', value: 15000, color: '#f59e0b' },
    { name: 'Facilities', value: 32000, color: '#ef4444' }
  ];

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center text-white shadow-xl shadow-slate-800/20">
            <FileText size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gestão Administrativa</h2>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Eficiência de Back-office e Despesas Gerais</p>
          </div>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nível de Eficiência</span>
           <span className="text-blue-500 font-black uppercase text-xs">Otimizado</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicators.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <kpi.icon size={24} />
               </div>
               <div className={cn(
                 "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
                 kpi.status === 'positive' ? "bg-emerald-50 text-emerald-600" : 
                 kpi.status === 'negative' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
               )}>
                 {kpi.status === 'positive' ? 'No Alvo' : kpi.status === 'negative' ? 'Crítico' : 'Atenção'}
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-slate-800">
              {kpi.isCur ? formatCurrency(kpi.value) : `${kpi.value}${kpi.suffix || ''}`}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Department Breakdown */}
         <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
               <PieIcon size={20} className="text-primary" /> Distribuição de Gastos Administrativos
            </h3>
            <div className="space-y-6">
               {departmentBreakdown.map((dept, i) => {
                 const total = departmentBreakdown.reduce((acc, d) => acc + d.value, 0);
                 const percent = (dept.value / total) * 100;
                 return (
                   <div key={i} className="group">
                      <div className="flex justify-between items-center text-xs font-bold mb-2">
                         <span className="text-slate-600">{dept.name}</span>
                         <div className="flex gap-4">
                            <span className="text-slate-400 font-medium">{percent.toFixed(1)}%</span>
                            <span className="text-primary font-black">{formatCurrency(dept.value)}</span>
                         </div>
                      </div>
                      <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${percent}%` }}
                           className="h-full rounded-full"
                           style={{ backgroundColor: dept.color }}
                         />
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>

         {/* Admin Insights */}
         <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 p-8 text-secondary/5">
               <Zap size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10 space-y-8">
               <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-3">
                  <MessageSquare size={20} /> Otimização Administrativa
               </h3>
               <div className="space-y-6">
                  {[
                    "Digitalizar processos de aprovação de despesas para reduzir lead time em 40%.",
                    "Consolidar fornecedores de facilities para ganho de escala e redução de 15% nos custos.",
                    "Revisar política de viagens e reembolsos para maior controle orçamentário."
                  ].map((rec, i) => (
                    <div key={i} className="flex gap-4 group cursor-default">
                       <div className="w-8 h-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-black text-xs shrink-0 group-hover:bg-secondary group-hover:text-primary transition-all">
                          {i + 1}
                       </div>
                       <p className="text-xs font-medium text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                          {rec}
                       </p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
