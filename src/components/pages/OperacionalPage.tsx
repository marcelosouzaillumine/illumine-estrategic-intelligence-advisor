
import React, { useMemo } from 'react';
import { 
  Database, 
  Activity, 
  Truck, 
  Box, 
  Settings, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Zap,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, cn } from '../../lib/utils';

interface OperacionalPageProps {
  type: 'logistica' | 'producao';
  clientId: string;
}

export function OperacionalPage({ type, clientId }: OperacionalPageProps) {
  const isLogistica = type === 'logistica';

  const indicators = useMemo(() => {
    if (isLogistica) {
      return [
        { label: 'OTIF (Entrega no Prazo)', value: 92, suffix: '%', status: 'positive', target: 95, icon: Truck },
        { label: 'Giro de Estoque', value: 4.8, suffix: 'x', status: 'neutral', target: 6.0, icon: Box },
        { label: 'Custo Frete / Receita', value: 8.5, suffix: '%', status: 'negative', target: 6.0, icon: TrendingUp },
        { label: 'Tempo Médio Entrega', value: 3.2, suffix: ' dias', status: 'positive', target: 4.0, icon: Clock }
      ];
    } else {
      return [
        { label: 'OEE (Eficiência Equip.)', value: 78, suffix: '%', status: 'positive', target: 85, icon: Settings },
        { label: 'Nível de Refugo', value: 2.4, suffix: '%', status: 'negative', target: 1.5, icon: AlertCircle },
        { label: 'Lead Time Produção', value: 12, suffix: ' dias', status: 'neutral', target: 10, icon: Clock },
        { label: 'Produtividade Hora', value: 145, suffix: ' und/h', status: 'positive', target: 140, icon: Activity }
      ];
    }
  }, [isLogistica]);

  const recommendations = useMemo(() => {
    if (isLogistica) {
      return [
        "Negociar tabelas de frete com transportadoras alternativas para rotas críticas.",
        "Implementar sistema de roteirização inteligente para otimizar entregas locais.",
        "Reduzir estoque de segurança de itens C para melhorar o giro total."
      ];
    } else {
      return [
        "Implementar manutenção preventiva programada para reduzir paradas não planejadas.",
        "Treinar operadores em técnicas de Lean Manufacturing para redução de desperdício.",
        "Revisar fluxo de processos na linha 3 para eliminar gargalos identificados."
      ];
    }
  }, [isLogistica]);

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className={cn(
            "w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl",
            isLogistica ? "bg-amber-600 shadow-amber-600/20" : "bg-purple-600 shadow-purple-600/20"
          )}>
            {isLogistica ? <Truck size={32} /> : <Settings size={32} />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {isLogistica ? 'Eficiência em Logística' : 'Performance de Produção'}
            </h2>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">
              {isLogistica ? 'Gestão de Entregas e Cadeia de Suprimentos' : 'Otimização de Processos e Produtividade'}
            </p>
          </div>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Eficiência Operacional</span>
           <span className="text-amber-500 font-black uppercase text-xs">Otimização Necessária</span>
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
              {kpi.value}{kpi.suffix || ''}
            </p>
            <div className="mt-4 flex items-center gap-2">
               <div className="h-1 flex-1 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full", kpi.status === 'positive' ? "bg-emerald-500" : kpi.status === 'negative' ? "bg-rose-500" : "bg-amber-500")}
                    style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                  />
               </div>
               <span className="text-[10px] font-bold text-slate-400">Meta: {kpi.target}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Chart Placeholder */}
         <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                  <BarChart3 size={20} className="text-primary" /> Histórico de Eficiência
               </h3>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">Diário</button>
                  <button className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Semanal</button>
               </div>
            </div>
            <div className="h-[300px] bg-slate-50 rounded-[32px] flex items-center justify-center border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Monitoramento em Tempo Real</p>
            </div>
         </div>

         {/* Recommendations */}
         <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 p-8 text-secondary/5">
               <Zap size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10 space-y-8">
               <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-3">
                  <MessageSquare size={20} /> Insights do Eixo Operacional
               </h3>
               <div className="space-y-6">
                  {recommendations.map((rec, i) => (
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
                  Otimizar Processos
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
