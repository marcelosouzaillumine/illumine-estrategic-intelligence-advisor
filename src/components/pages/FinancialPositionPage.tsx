
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon,
  Landmark,
  ChevronUp,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { 
  query, 
  collection, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PageHeader } from '../Common';
import { DATA } from '../../data';
import { cn, formatCurrency } from '../../lib/utils';
import { 
  AreaChart, 
  Area, 
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

function KpiCardModeling({ label, value, tone = 'default', helper }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className={cn(
        "text-2xl font-black tracking-tight",
        tone === 'danger' ? "text-rose-600" : tone === 'success' ? "text-emerald-600" : "text-slate-900"
      )}>{value}</h3>
      {helper && <p className="text-[10px] text-slate-400 mt-2 italic">{helper}</p>}
    </div>
  );
}

export function FinancialPositionPage({ clients, selectedClient }: { clients: any[], selectedClient: string }) {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedClient) {
      setPositions((DATA as any).posicaoFinanceira || []);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'financial_positions'),
      where('clientId', '==', selectedClient)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (dbDocs.length > 0) {
        setPositions(dbDocs);
      } else {
        setPositions((DATA as any).posicaoFinanceira.filter((p: any) => p.clientId === selectedClient));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching positions:", error);
      setPositions((DATA as any).posicaoFinanceira.filter((p: any) => p.clientId === selectedClient));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedClient]);

  const kpis = useMemo(() => {
    const totalCurrent = positions.reduce((a, b) => a + (b.saldoAtual || 0), 0);
    const totalInitial = positions.reduce((a, b) => a + (b.saldoInicial || 0), 0);
    const variation = totalInitial !== 0 ? ((totalCurrent - totalInitial) / totalInitial) * 100 : 0;
    
    return { totalCurrent, totalInitial, variation };
  }, [positions]);

  const aggHistory = useMemo(() => {
    if (positions.length === 0) return [];
    
    // Get all unique months from all positions history
    const allMonths = Array.from(new Set(positions.flatMap(p => p.historico?.map((h: any) => h.mes) || []))) as string[];
    
    // Order of months (portuguese)
    const monthOrder = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const sortedMonths = allMonths.sort((a: string, b: string) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

    return sortedMonths.map(m => {
      const total = positions.reduce((acc, p) => {
        const hist = p.historico?.find((h: any) => h.mes === m);
        return acc + (hist?.saldo || 0);
      }, 0);
      return { mes: m, saldo: total };
    });
  }, [positions]);

  const clientName = clients.find(c => c.id === selectedClient)?.fantasia || 'Cliente';

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <PageHeader 
          title="Posição Financeira" 
          description={`Detalhamento de saldos bancários, disponibilidades e evolução do patrimônio líquido líquido do cliente ${clientName}.`}
        />
        <div className="flex gap-3 mb-10">
          <div className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl border border-slate-100 flex items-center gap-2">
            <Clock size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Última Atualização: {positions[0]?.dataAtualizacao || '--'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCardModeling 
          label="Saldo Total Atual" 
          value={formatCurrency(kpis.totalCurrent)} 
          tone="default" 
        />
        <KpiCardModeling 
          label="Saldos no Início do Mês" 
          value={formatCurrency(kpis.totalInitial)} 
          tone="default" 
          helper="Soma dos saldos em 01/05/2026"
        />
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Evolução no Mês</p>
          <div className="flex items-end justify-between mt-2">
            <h4 className={cn(
              "text-2xl font-black",
              kpis.variation >= 0 ? "text-emerald-600" : "text-rose-600"
            )}>
              {kpis.variation >= 0 ? '+' : ''}{kpis.variation.toFixed(2)}%
            </h4>
            {kpis.variation >= 0 ? <TrendingUp size={24} className="text-emerald-500" /> : <TrendingDown size={24} className="text-rose-500" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
              <h3 className="text-sm font-bold text-slate-800">Evolução do Saldo Consolidado</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Histórico dos últimos 5 meses</p>
             </div>
             <div className="p-2 bg-primary/5 rounded-xl">
               <TrendingUp size={18} className="text-primary" />
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aggHistory}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0e1c2c" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0e1c2c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={v => `R$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Area type="monotone" dataKey="saldo" stroke="#0e1c2c" strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
              <h3 className="text-sm font-bold text-slate-800">Composição por Banco</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Distribuição de Disponibilidades</p>
             </div>
             <div className="p-2 bg-slate-50 rounded-xl">
               <PieChartIcon size={18} className="text-secondary" />
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={positions.map(p => ({ name: p.banco, value: p.saldoAtual }))}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {positions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0e1c2c', '#004aad', '#ff8552', '#00bf63'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   formatter={(v: number) => formatCurrency(v)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Instituição / Banco</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tipo de Conta</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Saldo Inicial (01/05)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Saldo Atual</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Variação</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Atualização</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center">
                    <Loader2 size={32} className="animate-spin text-secondary mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Carregando posições...</p>
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic">Nenhuma conta encontrada.</td>
                </tr>
              ) : (
                positions.map(p => {
                  const varAbs = p.saldoAtual - p.saldoInicial;
                  const varPerc = p.saldoInicial !== 0 ? (varAbs / p.saldoInicial) * 100 : 0;
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200/50">
                            <Landmark size={18} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{p.banco}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {p.id.padStart(3, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-tighter rounded-full border border-slate-200/50">
                          {p.tipoConta}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-bold text-slate-500">{formatCurrency(p.saldoInicial)}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-primary">{formatCurrency(p.saldoAtual)}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase",
                          varAbs >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                          {varAbs >= 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {Math.abs(varPerc).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-bold text-slate-700">{p.dataAtualizacao}</span>
                          <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Sincronizado</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
