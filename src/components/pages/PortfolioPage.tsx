
import React, { useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Zap,
  Activity,
  Search,
  Filter,
  ShieldAlert,
  Coins,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatCurrency } from '../../lib/utils';
import { calculateIllumineScore, HealthScoreDimensions } from '../../lib/financialIntelligence';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ClientPortfolioData {
  id: string;
  name: string;
  industry: string;
  score: number;
  lastMonthScore: number;
  criticalAlerts: number;
  status: 'active' | 'onboarding' | 'critical';
  revenue: number;
  ebitdaMargin: number;
}

export function PortfolioPage({ clients, onSelectClient }: any) {
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      if (!clients || clients.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Fetch financial data for all clients concurrently
        const promises = clients.map((c: any) => 
          getDocs(query(collection(db, 'financial_entries'), where('clientId', '==', c.id)))
        );
        
        const snaps = await Promise.all(promises);
        const allEntries: any[] = [];
        
        snaps.forEach(snap => {
          snap.docs.forEach(doc => {
            const docData = doc.data() as any;
            
            // Filter to only DRE and BP to save memory
            if (docData.type !== 'DRE' && docData.type !== 'BP') return;
            
            if (Array.isArray(docData.data)) {
              docData.data.forEach((entry: any) => {
                allEntries.push({
                  ...entry,
                  clientId: docData.clientId,
                  type: docData.type,
                  conta: entry.category,
                  valor: entry.value,
                  val: entry.value
                });
              });
            } else {
              allEntries.push({
                ...docData,
                conta: docData.category,
                valor: docData.value,
                val: docData.value
              });
            }
          });
        });
        setFinancialData(allEntries);
      } catch (e) {
        console.error("Error fetching portfolio data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [clients]);

  const portfolioData: ClientPortfolioData[] = useMemo(() => {
    if (!clients) return [];
    return clients.map((c: any) => {
      const clientData = financialData.filter(d => d.clientId === c.id);
      const clientDre = clientData.filter(d => d.type === 'DRE');
      const clientBp = clientData.filter(d => d.type === 'BP');
      
      let hasData = clientDre.length > 0;
      let score = 0;
      let revenue = 0;
      let ebitda = 0;
      let margin = 0;
      
      if (hasData) {
        // Aggregate values for simplicity or use the latest month/year if we had it
        revenue = clientDre.filter(d => d.conta === 'Receita Líquida').reduce((sum, d) => sum + d.valor, 0);
        ebitda = clientDre.filter(d => d.conta === 'EBITDA').reduce((sum, d) => sum + d.valor, 0);
        margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
        
        const ac = clientBp.filter(b => b.conta === 'Ativo Circulante').reduce((sum, b) => sum + (b.val || b.valor), 0) || 0;
        const pc = clientBp.filter(b => b.conta === 'Passivo Circulante').reduce((sum, b) => sum + (b.val || b.valor), 0) || 1;
        const liq = ac / pc;
        
        const calculated = 40 + (margin * 2) + (liq * 5); // Rough health indicator
        score = isNaN(calculated) ? 65 : Math.max(30, Math.min(98, Math.round(calculated)));
      }
      
      return {
        id: c.id,
        name: c.fantasia || c.name,
        industry: c.segmento || 'Serviços',
        score,
        lastMonthScore: score, // Simulate stable trend if no historical data calculation
        criticalAlerts: hasData ? (score < 50 ? 3 : score < 70 ? 1 : 0) : 0,
        status: hasData ? (score < 50 ? 'critical' : 'active') : 'onboarding',
        revenue,
        ebitdaMargin: margin
      };
    });
  }, [clients, financialData]);

  const stats = useMemo(() => {
    const totalClients = portfolioData.length;
    return {
      avgScore: totalClients > 0 ? Math.round(portfolioData.reduce((acc, c) => acc + c.score, 0) / totalClients) : 0,
      totalRevenue: portfolioData.reduce((acc, c) => acc + c.revenue, 0),
      activeAlerts: portfolioData.reduce((acc, c) => acc + c.criticalAlerts, 0),
      totalClients
    };
  }, [portfolioData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Calculando Portfólio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Visão de Portfólio</h1>
          <p className="text-slate-500 text-sm font-medium">Gestão consolidada da saúde financeira de todos os clientes sob assessoria.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 flex items-center gap-2">
             <TrendingUp size={14} className="text-secondary" /> Exportar QBR
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Health Score Médio', value: stats.avgScore, icon: Target, color: 'blue' },
          { label: 'Faturamento Sob Gestão', value: `R$ ${(stats.totalRevenue / 1000000).toFixed(1)}M`, icon: Zap, color: 'emerald' },
          { label: 'Alertas Críticos', value: stats.activeAlerts, icon: AlertCircle, color: 'rose' },
          { label: 'Clientes Ativos', value: stats.totalClients, icon: Users, color: 'slate' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className={cn(
              "absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500",
              stat.color === 'blue' ? "text-blue-600" : stat.color === 'emerald' ? "text-emerald-600" : stat.color === 'rose' ? "text-rose-600" : "text-slate-600"
            )}>
              <stat.icon size={100} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              {stat.label.includes('Score') && <span className="text-[10px] font-bold text-emerald-600">+2% vs m-1</span>}
            </div>
          </div>
        ))}
      </div>
      
      {/* Strategic Watch - Portfolio Level Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldAlert size={80} /></div>
          <div className="relative z-10">
            <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">Market Risk Exposure</h3>
            <h4 className="text-xl font-display font-extrabold mb-4">Reforma Tributária: Impacto no Portfólio</h4>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Empresas em Risco</p>
                <p className="text-2xl font-black text-rose-500">{(stats.totalClients * 0.7).toFixed(0)}</p>
                <p className="text-[8px] text-slate-500 leading-tight">Serviços com baixo crédito fiscal.</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Aumento Médio IVA</p>
                <p className="text-2xl font-black text-white">+8.2%</p>
                <p className="text-[8px] text-slate-500 leading-tight">Projeção de carga líquida incremental.</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Urgência Cadastro</p>
                <p className="text-2xl font-black text-amber-500">Alta</p>
                <p className="text-[8px] text-slate-500 leading-tight">Necessidade de saneamento de NCM.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Capital Alpha Opportunities</h3>
          <h4 className="text-xl font-display font-extrabold text-slate-900 mb-4">Potencial de Otimização Financeira</h4>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Coins size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Savings em Juros (Est.)</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(stats.totalRevenue * 0.02)}/ano</p>
                <p className="text-[10px] text-slate-500 font-medium">Troca de CDI+8% por Taxas do Plano.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Globe size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Eficiência de Caixa</p>
                <p className="text-xl font-black text-slate-900">+14%</p>
                <p className="text-[10px] text-slate-500 font-medium">Melhora média no Liquidez Corrente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Buscar por cliente ou segmento..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 transition-all font-bold text-sm"
          />
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
        </div>
        <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 flex items-center gap-2 hover:bg-slate-50">
          <Filter size={16} /> Filtros Avançados
        </button>
      </div>

      {/* Portfolio Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente / Setor</th>
              <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Score</th>
              <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Alertas</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Fat. Mensal</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Margem EBITDA</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {portfolioData.sort((a, b) => a.score - b.score).map((client) => (
              <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => onSelectClient(client.id)}>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg",
                      client.score > 80 ? "bg-emerald-500 shadow-emerald-500/20" : 
                      client.score > 60 ? "bg-blue-500 shadow-blue-500/20" : "bg-rose-500 shadow-rose-500/20"
                    )}>
                      {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{client.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{client.industry}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-lg font-black",
                        client.score > 80 ? "text-emerald-600" : client.score > 60 ? "text-blue-600" : "text-rose-600"
                      )}>{client.score}</span>
                      {client.score > client.lastMonthScore ? 
                        <ArrowUpRight size={14} className="text-emerald-500" /> : 
                        <ArrowDownRight size={14} className="text-rose-500" />
                      }
                    </div>
                    <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div className={cn(
                        "h-full rounded-full",
                        client.score > 80 ? "bg-emerald-500" : client.score > 60 ? "bg-blue-500" : "bg-rose-500"
                      )} style={{ width: `${client.score}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  {client.criticalAlerts > 0 ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase">
                      <AlertCircle size={12} /> {client.criticalAlerts} Críticos
                    </div>
                  ) : (
                    <CheckCircle2 size={18} className="text-emerald-500 mx-auto" />
                  )}
                </td>
                <td className="px-8 py-6 text-right font-bold text-sm text-slate-700">
                  {formatCurrency(client.revenue)}
                </td>
                <td className="px-8 py-6 text-right">
                  <span className={cn(
                    "font-black text-sm",
                    client.ebitdaMargin > 20 ? "text-emerald-600" : "text-slate-900"
                  )}>{client.ebitdaMargin.toFixed(1)}%</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectClient(client.id, 'advisory_insights'); }}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm border border-blue-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-tight"
                      title="Ver Advisory (IA)"
                    >
                      <Zap size={14} /> Advisory
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectClient(client.id, 'dashboard'); }}
                      className="p-2 hover:bg-slate-900 hover:text-white border-2 border-slate-100 hover:border-slate-900 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-tight"
                      title="Ver Dashboard"
                    >
                      Dashboard <ChevronRight size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
