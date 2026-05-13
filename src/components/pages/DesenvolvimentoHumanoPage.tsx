
import React, { useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Zap, 
  BarChart3, 
  ShieldCheck,
  Target,
  MessageSquare,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, cn } from '../../lib/utils';
import PayrollDashboard from '../PayrollDashboard';

interface DesenvolvimentoHumanoPageProps {
  clientId: string;
}

export function DesenvolvimentoHumanoPage({ clientId }: DesenvolvimentoHumanoPageProps) {
  const cultureIndicators = useMemo(() => [
    { label: 'Índice de Clima', value: 8.4, suffix: '/10', status: 'positive', target: 8.0, icon: Heart },
    { label: 'Turnover Mensal', value: 1.2, suffix: '%', status: 'positive', target: 2.0, icon: TrendingUp },
    { label: 'Investimento Treinamento', value: 45000, isCur: true, status: 'neutral', target: 60000, icon: Award },
    { label: 'eNPS', value: 72, suffix: '', status: 'positive', target: 60, icon: Users }
  ], []);

  return (
    <div className="space-y-12 pb-32">
      {/* Strategic Culture Section */}
      <div className="space-y-8">
      {/* Strategic Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Users size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">Desenvolvimento Humano</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Gestão de Pessoas, Cultura e Capital Humano</p>
        </div>

        <div className="relative z-10 text-right bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Saúde Organizacional</span>
           <span className="text-emerald-400 font-black uppercase text-sm flex items-center justify-end gap-2">
             <ShieldCheck size={16} />
             Excelente
           </span>
        </div>
      </div>

        {/* Culture KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cultureIndicators.map((kpi, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                    {(() => {
                      const Icon = kpi.icon;
                      return <Icon size={24} />;
                    })()}
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
      </div>

      {/* Recommendations & Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
               <Target size={20} className="text-primary" /> Foco em Retenção e Propósito
            </h3>
            <div className="h-[200px] bg-slate-50 rounded-[32px] flex items-center justify-center border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Mapa de Talentos e Sucessão (Em Desenvolvimento)</p>
            </div>
         </div>

         <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 p-8 text-secondary/5">
               <Zap size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10 space-y-8">
               <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-3">
                  <MessageSquare size={20} /> Insights de Gente & Gestão
               </h3>
               <div className="space-y-6">
                  {[
                    "Implementar programa de feedback 360º para nível de liderança.",
                    "Aumentar o budget de treinamento técnico para a área de Operações.",
                    "Revisar o pacote de benefícios para aumentar a competitividade no eNPS."
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

      {/* Detailed Payroll Analysis (Existing Feature) */}
      <div className="pt-8 border-t border-slate-100">
        <div className="mb-8">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Análise Gerencial de Folha</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Detalhamento financeiro do quadro de pessoal</p>
        </div>
        <PayrollDashboard clientId={clientId} />
      </div>
    </div>
  );
}
