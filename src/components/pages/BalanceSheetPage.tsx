import React, { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { DATA } from '../../data';
import { cn, formatCurrency } from '../../lib/utils';
import { useFinancialData } from '../../hooks/useFinancialData';
import { ExecutiveCommentary } from '../ExecutiveCommentary';

export function BalanceSheetPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  const [filterClient, setFilterClient] = useState(selectedClient);
  const [filterMonth, setFilterMonth] = useState(selectedMonth);
  const [filterYear, setFilterYear] = useState(selectedYear);

  useEffect(() => {
    setFilterClient(selectedClient);
    setFilterYear(selectedYear);
    setFilterMonth(selectedMonth);
  }, [selectedClient, selectedYear, selectedMonth]);

  const { dbData, loading } = useFinancialData(filterClient, filterYear, filterMonth, 'BP');

  let mockRows = DATA.bp.filter(r => (r as any).id === filterClient && (r as any).mes === filterMonth && (r as any).ano === filterYear);
  const rows = dbData.length > 0 ? dbData.map(d => ({ ...d, val: d.valor })) : mockRows;

  const ativo = rows.filter(r => r.tipo === 'ativo' || r.type === 'ativo');
  const passivo = rows.filter(r => r.tipo === 'passivo' || r.type === 'passivo');

  const ac = rows.find(r => r.conta === 'Ativo Circulante')?.val || 0;
  const pc = rows.find(r => r.conta === 'Passivo Circulante')?.val || 0;
  const est = rows.find(r => r.conta === 'Estoques')?.val || 0;
  const cx = rows.find(r => r.conta === 'Caixa e Equivalentes')?.val || 0;
  const anc = rows.find(r => r.conta === 'Ativo Não Circulante')?.val || 0;
  const pnc = rows.find(r => r.conta === 'Passivo Não Circulante')?.val || 0;

  const liqCorrente = pc > 0 ? ac / pc : 0;
  const liqSeca = pc > 0 ? (ac - est) / pc : 0;
  const liqImediata = pc > 0 ? cx / pc : 0;
  const liqGeral = (pc + pnc) > 0 ? (ac + anc * 0.4) / (pc + pnc) : 0;

  const liquidityIndices = [
    { name: 'Liquidez Corrente', val: liqCorrente, desc: 'Capacidade de pagamento no curto prazo', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Liquidez Seca', val: liqSeca, desc: 'Capacidade de pagamento sem depender do estoque', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Liquidez Imediata', val: liqImediata, desc: 'Disponibilidade imediata para quitar obrigações', color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Liquidez Geral', val: liqGeral, desc: 'Solvência de curto e longo prazo', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-wrap gap-4 mb-8 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm inline-flex items-center">
        <div className="flex items-center px-4 py-2 border-r border-slate-100">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mr-4">Cliente</label>
          <select 
            onChange={(e) => setFilterClient(e.target.value)} 
            value={filterClient} 
            className="text-sm font-bold text-primary outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
          >
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.fantasia}</option>)}
          </select>
        </div>
        <div className="flex items-center px-4 py-2 border-r border-slate-200">
          <Calendar size={14} className="text-slate-400 mr-2" />
          <select 
            onChange={(e) => setFilterYear(Number(e.target.value))} 
            value={filterYear} 
            className="text-sm font-semibold outline-none bg-transparent cursor-pointer"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>
        <div className="flex items-center px-4 py-2 border-r border-slate-200">
          <select 
            onChange={(e) => setFilterMonth(Number(e.target.value))} 
            value={filterMonth} 
            className="text-sm font-semibold outline-none bg-transparent cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
              <option key={m} value={m}>{new Date(2000, m - 1, 1).toLocaleString('pt-BR', { month: 'long' })}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center px-4 py-2 min-w-[120px]">
          {loading && <Loader2 size={12} className="animate-spin text-blue-600 mr-2" />}
          <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">
            {dbData.length > 0 ? 'Dados Reais' : 'Amostra'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {liquidityIndices.map((idx, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{idx.name}</h4>
            <div className="flex items-baseline gap-2">
              <span className={cn("text-2xl font-display font-bold", idx.color)}>{idx.val.toFixed(2)}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Índice</span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium mt-2 leading-tight">{idx.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Ativo (Onde o recurso foi aplicado)</h3>
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase">Conta</th>
                  <th className="text-right py-4 px-6 text-[10px] font-bold text-slate-400 uppercase">Valor (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ativo.map((row, i) => (
                  <tr key={i} className={cn("hover:bg-slate-50 transition-colors", row.level === 1 ? "bg-slate-50/10 font-bold" : "")}>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <span className={cn("inline-block", row.level === 1 ? "text-primary" : "pl-4 text-slate-600 font-medium")}>{row.conta}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-slate-700">{formatCurrency(row.val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Passivo (Origem dos recursos)</h3>
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase">Conta</th>
                  <th className="text-right py-4 px-6 text-[10px] font-bold text-slate-400 uppercase">Valor (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {passivo.map((row, i) => (
                  <tr key={i} className={cn("hover:bg-slate-50 transition-colors", row.level === 1 ? "bg-slate-50/10 font-bold" : "")}>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <span className={cn("inline-block", row.level === 1 ? "text-primary" : "pl-4 text-slate-600 font-medium")}>{row.conta}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-slate-700">{formatCurrency(row.val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ExecutiveCommentary 
        reportType="BP"
        clientId={filterClient}
        year={filterYear}
        month={filterMonth}
      />
    </div>
  );
}
