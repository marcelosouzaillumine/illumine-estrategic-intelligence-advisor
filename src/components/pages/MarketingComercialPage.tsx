import React, { useMemo } from 'react';
import { 
  Globe, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  Target, 
  Percent, 
  Zap,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { PageHeader, StatusBadge } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';

interface MarketingComercialPageProps {
  type: 'marketing' | 'comercial';
  clientId: string;
}

export function MarketingComercialPage({ type, clientId }: MarketingComercialPageProps) {
  const isMarketing = type === 'marketing';

  const indicators = useMemo(() => {
    if (isMarketing) {
      return [
        { label: 'CAC (Custo Aquisição)', value: 450, isCur: true, status: 'positive', target: 500, icon: Users },
        { label: 'ROI Marketing', value: 4.2, suffix: 'x', status: 'positive', target: 3.5, icon: TrendingUp },
        { label: 'Brand Awareness', value: 68, suffix: '%', status: 'neutral', target: 75, icon: Globe },
        { label: 'Leads Qualificados', value: 128, suffix: '', status: 'positive', target: 100, icon: Zap }
      ];
    } else {
      return [
        { label: 'Taxa de Conversão', value: 24, suffix: '%', status: 'positive', target: 20, icon: ArrowUpRight },
        { label: 'Ticket Médio', value: 2850, isCur: true, status: 'positive', target: 2500, icon: Target },
        { label: 'LTV (Lifetime Value)', value: 18500, isCur: true, status: 'positive', target: 15000, icon: BarChart3 },
        { label: 'Churn Rate', value: 2.1, suffix: '%', status: 'negative', target: 1.5, icon: Percent }
      ];
    }
  }, [isMarketing]);

  const recommendations = useMemo(() => {
    if (isMarketing) {
      return [
        "Aumentar investimento em canais de fundo de funil para reduzir o CAC.",
        "Otimizar a segmentação de campanhas para o público premium.",
        "Implementar régua de relacionamento automática para MQLs."
      ];
    } else {
      return [
        "Revisar script de vendas focado em proposta de valor e propósito.",
        "Implementar política de Upsell para clientes com LTV acima da média.",
        "Treinar equipe comercial em técnicas de fechamento consultivo."
      ];
    }
  }, [isMarketing]);

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title={isMarketing ? 'Marketing Estratégico' : 'Vendas & Mercado'}
        subtitle={isMarketing ? 'Gestão de comunicação, branding e geração de leads qualificados.' : 'Monitoramento de performance comercial, pipeline e conversão.'}
        icon={isMarketing ? <Globe className="text-primary" size={24} /> : <ShoppingBag className="text-primary" size={24} />}
        color={isMarketing ? "bg-blue-900" : "bg-emerald-900"}
      />

      {/* KPI Grid - Standardized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicators.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                <kpi.icon size={24} />
              </div>
              <div className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                kpi.status === 'positive' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                kpi.status === 'negative' ? "bg-rose-50 text-rose-600 border border-rose-100" : 
                "bg-amber-50 text-amber-600 border border-amber-100"
              )}>
                {kpi.status === 'positive' ? 'No Alvo' : kpi.status === 'negative' ? 'Crítico' : 'Atenção'}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 group-hover:text-slate-500 transition-colors whitespace-nowrap">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter whitespace-nowrap">
                  {formatValue(kpi.value, kpi.isCur ? 'R$' : kpi.suffix || '')}
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-2">
                <div className="h-1 flex-1 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full", kpi.status === 'positive' ? "bg-emerald-500" : "bg-amber-500")}
                    style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 tabular-nums">Meta: {formatValue(kpi.target, kpi.isCur ? 'R$' : kpi.suffix || '')}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Chart Placeholder */}
         <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                  <BarChart3 size={20} className="text-primary" /> Tendência Trimestral
               </h3>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">Mensal</button>
                  <button className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Trimestral</button>
               </div>
            </div>
            <div className="h-[300px] bg-slate-50 rounded-[32px] flex items-center justify-center border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Gráfico de Performance em Integração</p>
            </div>
         </div>

         {/* Recommendations */}
         <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 p-8 text-secondary/5">
               <Zap size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10 space-y-8">
               <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-3">
                  <MessageSquare size={20} /> Recomendações Estratégicas
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
                  Gerar Plano de Ação
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
