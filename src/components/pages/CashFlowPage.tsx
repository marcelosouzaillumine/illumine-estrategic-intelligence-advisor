
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calculator, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../Common';
import { DATA } from '../../data';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
import { ExecutiveCommentary } from '../ExecutiveCommentary';

export function CashFlowPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fluxo' | 'receber' | 'pagar' | 'passivo'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClient, setFilterClient] = useState(selectedClient);
  const [filterMonth, setFilterMonth] = useState(selectedMonth);
  const [filterYear, setFilterYear] = useState(selectedYear);

  // Sync with global selection
  useEffect(() => {
    setFilterClient(selectedClient);
    setFilterYear(selectedYear);
    setFilterMonth(selectedMonth);
  }, [selectedClient, selectedYear, selectedMonth]);

  const detalhado = (DATA as any).fluxoCaixaDetalhado[filterClient] || {
    Fluxo_Diario: [],
    Contas_Receber: [],
    Contas_Pagar: [],
    Passivo_Vencido: [],
    KPIs: []
  };

  const { Fluxo_Diario, Contas_Receber, Contas_Pagar, Passivo_Vencido, KPIs } = detalhado;

  const resumo = useMemo(() => {
    if (Fluxo_Diario.length === 0) return { saldoInicial: 0, entradas: 0, saidas: 0, saldoFinal: 0, passivoVencido: 0, burnRate: 0, diasCaixa: 0 };
    
    const saldoInicial = Fluxo_Diario[0]["Saldo Inicial"];
    const entradas = Fluxo_Diario.reduce((acc: number, r: any) => acc + r.Entradas, 0);
    const saidas = Fluxo_Diario.reduce((acc: number, r: any) => acc + r["Saídas"], 0);
    const saldoFinal = Fluxo_Diario[Fluxo_Diario.length - 1]["Saldo Final"];
    const passivoVencido = Passivo_Vencido.reduce((acc: number, r: any) => acc + r.Valor, 0);
    const burnRate = KPIs.find((k: any) => k.Indicador === "Burn rate médio diário")?.["Fórmula / Valor"] || 0;
    const diasCaixa = KPIs.find((k: any) => k.Indicador === "Dias de caixa")?.["Fórmula / Valor"] || 0;
    
    return { saldoInicial, entradas, saidas, saldoFinal, passivoVencido, burnRate, diasCaixa };
  }, [Fluxo_Diario, Passivo_Vencido, KPIs]);

  const fluxoMensal = useMemo(() => {
    const map = new Map();
    Fluxo_Diario.forEach((row: any) => {
      const key = row.Data.slice(0, 7); // YYYY-MM
      if (!map.has(key)) map.set(key, { mes: key, entradas: 0, saidas: 0, saldoFinal: 0 });
      const item = map.get(key);
      item.entradas += row.Entradas;
      item.saidas += row["Saídas"];
      item.saldoFinal = row["Saldo Final"];
    });
    return Array.from(map.values());
  }, [Fluxo_Diario]);

  const filteredPagar = Contas_Pagar.filter((r: any) => 
    r.Fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (r.Observação && r.Observação.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredReceber = Contas_Receber.filter((r: any) => 
    r.Cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maxMensal = Math.max(...fluxoMensal.flatMap((m: any) => [m.entradas, m.saidas]), 1);

  if (Fluxo_Diario.length === 0) {
    return (
      <div className="space-y-12 pb-20">
        <div className="flex items-center justify-between">
          <PageHeader 
            title="Fluxo de Caixa" 
            description="Monitoramento de liquidez, projeções diárias e controle de obrigações."
          />
          <div className="flex gap-2">
            <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))} className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-secondary/20">
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
            <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))} className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-secondary/20">
              <option value={1}>Jan</option>
              <option value={2}>Fev</option>
              <option value={3}>Mar</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-200 rounded-3xl p-20 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Calculator size={48} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-display text-primary mb-2">Sem dados de fluxo detalhado</h3>
          <p className="text-slate-500 max-w-md mb-8 font-sans">Não encontramos o arquivo de projeção de caixa para o cliente {clients.find((c: any) => c.id === filterClient)?.fantasia}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-6">
          <PageHeader 
            title="Fluxo de Caixa" 
            description={`${clients.find((c: any) => c.id === filterClient)?.fantasia} · ${filterMonth}/${filterYear}`}
          />
          <div className="flex gap-2">
            <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))} className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-secondary/20">
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
            <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))} className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-secondary/20">
              <option value={1}>Jan</option>
              <option value={2}>Fev</option>
              <option value={3}>Mar</option>
            </select>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl h-fit">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'fluxo', label: 'Fluxo Diário' },
            { id: 'receber', label: 'Contas a Receber' },
            { id: 'pagar', label: 'Contas a Pagar' },
            { id: 'passivo', label: 'Passivo Vencido' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                activeTab === tab.id ? "bg-white text-secondary shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Saldo Inicial', value: formatCurrency(resumo.saldoInicial), color: 'text-rose-600' },
                { title: 'Entradas Projetadas', value: formatCurrency(resumo.entradas), color: 'text-emerald-600' },
                { title: 'Saídas Projetadas', value: formatCurrency(resumo.saidas), color: 'text-rose-600' },
                { title: 'Saldo Final Projetado', value: formatCurrency(resumo.saldoFinal), color: resumo.saldoFinal < 0 ? 'text-rose-600' : 'text-emerald-600' },
                { title: 'Passivo Vencido', value: formatCurrency(resumo.passivoVencido), color: 'text-rose-600' },
                { title: 'Burn Rate Diário', value: formatCurrency(resumo.burnRate) },
                { title: 'Dias de Caixa', value: resumo.diasCaixa.toString(), color: 'text-rose-600' },
                { title: 'Saldo Tesouraria', value: formatCurrency(resumo.saldoFinal - resumo.passivoVencido), color: 'text-rose-600' },
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.title}</p>
                  <h3 className={cn("text-xl font-black tracking-tight", kpi.color || "text-slate-900")}>{kpi.value}</h3>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900">Visão Mensal Consolidada</h3>
                <p className="text-sm text-slate-500">Comparativo de entradas e saídas por competência.</p>
              </div>
              <div className="space-y-10">
                {fluxoMensal.map((m: any) => (
                  <div key={m.mes} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{m.mes}</h4>
                      <p className="text-xs font-bold text-slate-600">Saldo: <span className={cn(m.saldoFinal < 0 ? "text-rose-600" : "text-emerald-600")}>{formatCurrency(m.saldoFinal)}</span></p>
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-4">
                         <div className="w-24 text-[10px] font-bold text-slate-400 uppercase">Entradas</div>
                         <div className="flex-1 bg-slate-50 h-3 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(m.entradas / maxMensal) * 100}%` }}
                            className="bg-emerald-500 h-full rounded-full"
                           />
                         </div>
                         <div className="w-32 text-right text-xs font-bold text-emerald-600">{formatCurrency(m.entradas)}</div>
                       </div>
                       <div className="flex items-center gap-4">
                         <div className="w-24 text-[10px] font-bold text-slate-400 uppercase">Saídas</div>
                         <div className="flex-1 bg-slate-50 h-3 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(m.saidas / maxMensal) * 100}%` }}
                            className="bg-rose-500 h-full rounded-full"
                           />
                         </div>
                         <div className="w-32 text-right text-xs font-bold text-rose-600">{formatCurrency(m.saidas)}</div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'fluxo' && (
          <motion.div 
            key="fluxo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Extrato Diário Projetado</h3>
              <p className="text-sm text-slate-500">Movimentação esperada para os próximos 120 dias.</p>
            </div>
            <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    {["Data", "Saldo Inicial", "Entradas", "Saídas", "Saldo Final"].map(h => (
                      <th key={h} className={cn("px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest", h === "Saldo Inicial" ? "text-primary bg-primary/5" : "text-slate-400")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Fluxo_Diario.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors border-l-4 border-transparent hover:border-secondary">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">{formatDate(row.Data)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700 bg-slate-50/30">{formatCurrency(row["Saldo Inicial"])}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">+{formatCurrency(row.Entradas)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-rose-600">-{formatCurrency(row["Saídas"])}</td>
                      <td className={cn("px-6 py-4 text-sm font-black", row["Saldo Final"] < 0 ? "text-rose-600" : "text-slate-900")}>
                        {formatCurrency(row["Saldo Final"])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {(activeTab === 'receber' || activeTab === 'pagar') && (
           <motion.div 
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{activeTab === 'receber' ? 'Contas a Receber' : 'Contas a Pagar'}</h3>
                <p className="text-sm text-slate-500">Gestão detalhada de {activeTab === 'receber' ? 'receitas' : 'obrigações'}.</p>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Buscar fornecedor/cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all w-64"
                />
                <Search size={14} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-secondary transition-colors" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Vencimento</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeTab === 'receber' ? 'Cliente' : 'Fornecedor'}</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    {activeTab === 'pagar' && <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Obs</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeTab === 'receber' ? filteredReceber : filteredPagar).map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">{formatDate(row.Vencimento)}</td>
                      <td className="px-6 py-4 text-xs font-black text-slate-900">{row.Cliente || row.Fornecedor}</td>
                      <td className="px-6 py-4 text-right text-xs font-black text-secondary">{formatCurrency(row.Valor)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter",
                          row.Status === 'Recebido' || row.Status === 'Pago' ? "bg-emerald-100 text-emerald-700" :
                          row.Status === 'Vencido' ? "bg-rose-100 text-rose-700" :
                          "bg-primary/10 text-primary"
                        )}>{row.Status}</span>
                      </td>
                      {activeTab === 'pagar' && <td className="px-6 py-4 text-xs text-slate-500 italic">{row.Observação}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'passivo' && (
          <motion.div 
            key="passivo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Passivo Vencido e Exigível</h3>
              <p className="text-sm text-slate-500">Débitos acumulados fora do fluxo operacional corrente.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Credor", "Tipo", "Vencimento Originário", "Valor Principal"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Passivo_Vencido.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-black text-slate-900">{row.Credor}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{row.Tipo}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">{formatDate(row.Vencimento)}</td>
                      <td className="px-6 py-4 text-sm font-black text-rose-600">{formatCurrency(row.Valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 p-6 bg-slate-50 border border-slate-200 rounded-2xl opacity-60">
        <FileSpreadsheet size={16} className="text-slate-400" />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           Análise projetada baseada na planilha "sobrasa fluxo caixa projetado Mar-Jun2026.xlsx"
        </p>
      </div>

      <ExecutiveCommentary 
        reportType="DFC"
        clientId={filterClient}
        year={filterYear}
        month={filterMonth}
      />
    </div>
  );
}
