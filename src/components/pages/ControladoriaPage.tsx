
import React, { useMemo } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  Scale, 
  WalletCards,
  AlertCircle,
  CheckCircle2,
  PieChart as PieIcon,
  Zap,
  MessageSquare,
  Landmark
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatValue } from '../../lib/utils';
import { PageHeader } from '../Common';

interface ControladoriaPageProps {
  clientId: string;
}

export function ControladoriaPage({ clientId }: ControladoriaPageProps) {
  const indicators = useMemo(() => [
    { label: 'Aderência Orçamentária', value: 94.2, suffix: '%', status: 'neutral', target: 98.0, icon: Scale },
    { label: 'Margem EBITDA Realizada', value: 22.5, suffix: '%', status: 'positive', target: 20.0, icon: TrendingUp },
    { label: 'Burn Rate Mensal', value: 125000, isCur: true, status: 'positive', target: 150000, icon: WalletCards },
    { label: 'Índice de Alavancagem', value: 1.8, suffix: 'x', status: 'positive', target: 2.5, icon: Landmark }
  ], []);

  return (
    <div className="space-y-8 pb-32">
      <PageHeader 
        title="Controladoria Estratégica"
        subtitle="Governança financeira, auditoria de processos e monitoramento de aderência orçamentária para máxima eficiência operacional."
        icon={ShieldCheck}
        color="bg-emerald-900"
      />

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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 whitespace-nowrap">{kpi.label}</p>
            <p className="text-2xl font-black text-slate-800 whitespace-nowrap">
              {formatValue(kpi.value, kpi.isCur ? 'R$' : kpi.suffix || '')}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* BvA Chart Placeholder */}
         <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                  <BarChart3 size={20} className="text-primary" /> Budget vs Realizado (Anual)
               </h3>
               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-slate-400">
                     <div className="w-3 h-3 bg-slate-200 rounded-full" /> Planejado
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                     <div className="w-3 h-3 bg-primary rounded-full" /> Realizado
                  </div>
               </div>
            </div>
            <div className="h-[300px] bg-slate-50 rounded-[32px] flex items-center justify-center border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Análise Orçamentária em Integração</p>
            </div>
         </div>

         {/* Recommendations */}
         <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 p-8 text-secondary/5">
               <Zap size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10 space-y-8">
               <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-3">
                  <MessageSquare size={20} /> Insights de Controladoria
               </h3>
               <div className="space-y-6">
                  {[
                    "Investigar desvio de 15% nas despesas de marketing em relação ao budget do Q1.",
                    "Antecipar revisão orçamentária do H2 considerando as novas premissas macroeconômicas.",
                    "Auditar processos de compras acima de R$ 50k para garantir conformidade."
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
               <button className="w-full py-4 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                  Gerar Relatório de Auditoria
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
