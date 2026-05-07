import React, { useState, useEffect, useMemo } from 'react';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { DATA } from '../../data';
import { formatValue, cn } from '../../lib/utils';

function StatusBadge({ status }: { status: string }) {
  const classMap: Record<string, string> = {
    'Verde': 'badge-verde',
    'Amarelo': 'badge-amarelo',
    'Vermelho': 'badge-vermelho',
    'Validado': 'badge-verde',
    'Ativo': 'badge-verde',
    'Implantação': 'badge-amarelo',
    'Viável': 'badge-verde',
    'Ativa': 'badge-verde',
    'Inativa': 'badge-vermelho'
  };
  return (
    <span className={cn("badge font-sans", classMap[status] || 'badge-verde')}>
      {status}
    </span>
  );
}

function useIndicators(clientId: string, year: number, month: number) {
  const [indicators, setIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientId) {
      setIndicators(DATA.indicadores.filter(i => i.ano === year && i.mes === month));
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('ano', '==', year),
      where('mes', '==', month)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (dbDocs.length > 0) {
        setIndicators(dbDocs);
      } else {
        setIndicators(DATA.indicadores.filter(i => i.id === clientId && i.ano === year && i.mes === month));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching indicators:", error);
      setIndicators(DATA.indicadores.filter(i => i.id === clientId && i.ano === year && i.mes === month));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId, year, month]);

  return { indicators, loading };
}

export function IndicatorsPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  const [filterClient, setFilterClient] = useState(selectedClient);
  const [filterMonth, setFilterMonth] = useState(selectedMonth);
  const [filterYear, setFilterYear] = useState(selectedYear);
  const [filterCat, setFilterCat] = useState('');

  useEffect(() => {
    setFilterClient(selectedClient);
    setFilterYear(selectedYear);
    setFilterMonth(selectedMonth);
  }, [selectedClient, selectedYear, selectedMonth]);

  const { indicators, loading } = useIndicators(filterClient, filterYear, filterMonth);

  const { filtered, categories } = useMemo(() => {
    let list = indicators;
    if (filterCat) list = list.filter(f => f.cat === filterCat);
    
    const cats = Array.from(new Set([...DATA.indicadores.map(i => i.cat), ...indicators.map(i => i.cat)]));
    return { filtered: list, categories: cats };
  }, [indicators, filterCat]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-2xl border border-slate-200">
        <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="text-sm border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 outline-none font-bold text-slate-600 focus:ring-2 focus:ring-secondary/10 transition-all">
          <option value="">Selecione Cliente</option>
          {clients.map((c: any) => <option key={c.id} value={c.id}>{c.fantasia}</option>)}
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))} className="text-sm border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 outline-none font-bold text-slate-600 focus:ring-2 focus:ring-secondary/10 transition-all">
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
        </select>
        <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))} className="text-sm border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 outline-none font-bold text-slate-600 focus:ring-2 focus:ring-secondary/10 transition-all">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
            <option key={m} value={m}>{m === 1 ? 'Janeiro' : m === 2 ? 'Fevereiro' : m === 3 ? 'Março' : m}</option>
          ))}
        </select>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="text-sm border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 outline-none font-bold text-slate-600 focus:ring-2 focus:ring-secondary/10 transition-all sm:ml-auto">
          <option value="">Todas as Categorias</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-elegant scrollbar-thin">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 z-10">Cliente</th>
                <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Comp.</th>
                <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Indicador</th>
                <th className="text-right py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="text-right py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-5 px-8 font-bold text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50/80 transition-colors z-10">{r.cl}</td>
                  <td className="py-5 px-8 text-slate-500 font-bold">{r.comp}</td>
                  <td className="py-5 px-8 text-slate-400 font-bold uppercase text-[10px] tracking-wider">{r.cat}</td>
                  <td className="py-5 px-8 text-slate-700 font-semibold">{r.ind}</td>
                  <td className="py-5 px-8 text-right font-black text-primary">{formatValue(r.val, r.un)}</td>
                  <td className="py-5 px-8 text-right"><StatusBadge status={r.sem} /></td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 font-medium italic">
                    Nenhum indicador encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
