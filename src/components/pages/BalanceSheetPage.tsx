import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Loader2, Upload, Trash2, AlertTriangle, CheckCircle2, X, BookOpen } from 'lucide-react';
import { DATA } from '../../data';
import { cn, formatCurrency } from '../../lib/utils';
import { PageHeader } from '../Common';
import { useAnnualFinancialData } from '../../hooks/useFinancialData';

import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { parseFinancialPdf, parseFinancialExcel, parseFinancialTxt, inferType } from '../../services/importService';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = { type: 'success' | 'error'; message: string } | null;

// ─── Component ───────────────────────────────────────────────────────────────
export function BalanceSheetPage({ clients, selectedClient, selectedYear }: any) {
  const [filterClient, setFilterClient] = useState(selectedClient);
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilterClient(selectedClient);
  }, [selectedClient]);

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  // ── Busca dados anuais (sem filtro de mês) ──────────────────────────────────
  // Tenta com o tipo exato "Balanço Patrimonial" primeiro, depois "BP" como fallback
  const { dbData: dbDataBP, docIds: docIdsBP, loading: loadingBP, refetch: refetchBP } =
    useAnnualFinancialData(filterClient, filterYear, 'Balanço Patrimonial');
  const { dbData: dbDataShort, docIds: docIdsShort, loading: loadingShort, refetch: refetchShort } =
    useAnnualFinancialData(filterClient, filterYear, 'BP');

  const loading = loadingBP || loadingShort;
  const dbData = dbDataBP.length > 0 ? dbDataBP : dbDataShort;
  const docIds = dbDataBP.length > 0 ? docIdsBP : docIdsShort;

  // ── Mock fallback ─────────────────────────────────────────────────────────
  const mockRows = DATA.bp.filter(
    (r: any) => r.id === filterClient && r.ano === filterYear
  );
  const rows = dbData.length > 0
    ? dbData.map((d: any) => ({ ...d, val: d.val ?? d.valor ?? 0 }))
    : mockRows;

  // ── Indicadores de liquidez ───────────────────────────────────────────────
  const ativo = rows.filter((r: any) => {
    if (!r) return false;
    const t = (r.tipo || r.type || '').toLowerCase();
    return t === 'ativo';
  });
  const passivo = rows.filter((r: any) => {
    if (!r) return false;
    const t = (r.tipo || r.type || '').toLowerCase();
    return t === 'passivo' || t === 'patrimônio líquido' || t === 'pl';
  });

  const findAccountValue = (name: string) => {
    const search = name.toLowerCase();
    const match = rows.find((r: any) => {
      const conta = (r.conta || '').toLowerCase();
      // Remove códigos iniciais como "1.01 -" se existirem
      const cleanConta = conta.replace(/^[0-9.]+\s*[-]\s*/, '').trim();
      return cleanConta === search || conta.includes(search);
    });
    return match?.val || 0;
  };

  const ac  = findAccountValue('ativo circulante');
  const pc  = findAccountValue('passivo circulante');
  const est = findAccountValue('estoques') || findAccountValue('estoque');
  const cx  = findAccountValue('caixa e equivalentes') || findAccountValue('caixa') || findAccountValue('bancos');
  const anc = findAccountValue('ativo não circulante');
  const pnc = findAccountValue('passivo não circulante');

  const liqCorrente = pc > 0 ? ac / pc : 0;
  const liqSeca     = pc > 0 ? (ac - est) / pc : 0;
  const liqImediata = pc > 0 ? cx / pc : 0;
  const liqGeral    = (pc + pnc) > 0 ? (ac + anc * 0.4) / (pc + pnc) : 0;

  const liquidityIndices = [
    { name: 'Liquidez Corrente',  val: liqCorrente,  desc: 'Capacidade de pagamento no curto prazo',              color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Liquidez Seca',      val: liqSeca,      desc: 'Capacidade de pagamento sem depender do estoque',     color: 'text-blue-600',    bg: 'bg-blue-50'    },
    { name: 'Liquidez Imediata',  val: liqImediata,  desc: 'Disponibilidade imediata para quitar obrigações',     color: 'text-amber-600',   bg: 'bg-amber-50'   },
    { name: 'Liquidez Geral',     val: liqGeral,     desc: 'Solvência de curto e longo prazo',                    color: 'text-purple-600',  bg: 'bg-purple-50'  },
  ];

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // A lógica de importação foi movida para o ImportFinancialModal

  // ── Excluir todos os documentos deste cliente/ano ─────────────────────────
  const handleDelete = async () => {
    if (!auth.currentUser) {
      showToast('error', 'Você precisa estar logado para excluir dados.');
      return;
    }

    setDeleting(true);
    setShowDeleteConfirm(false);
    try {
      // Busca todos os documentos BP deste cliente/ano (ambos os tipos)
      const types = ['Balanço Patrimonial', 'BP'];
      const idsToDelete: string[] = [...docIds];

      for (const t of types) {
        const q = query(
          collection(db, 'financial_entries'),
          where('clientId', '==', filterClient),
          where('type',     '==', t),
          where('year',     '==', filterYear)
        );
        const snap = await getDocs(q);
        snap.docs.forEach((d) => {
          if (!idsToDelete.includes(d.id)) idsToDelete.push(d.id);
        });
      }

      await Promise.all(idsToDelete.map((id) => deleteDoc(doc(db, 'financial_entries', id))));
      showToast('success', `${idsToDelete.length} registro(s) excluído(s) com sucesso.`);
      refetchBP();
      refetchShort();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Balanço Patrimonial" 
        subtitle="Visão estática da posição financeira, ativos, passivos e patrimônio líquido para análise de solvência e estrutura de capital."
        icon={BookOpen}
        color="bg-slate-900"
      />
      
      <div className="flex flex-wrap gap-4 -mt-6 mb-8 justify-end">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 items-center">
            <select
              onChange={(e) => setFilterClient(e.target.value)}
              value={filterClient}
              className="bg-transparent px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              {clients.map((c: any) => (
                <option key={c.id} value={c.id}>{c.fantasia}</option>
              ))}
            </select>
            <div className="w-px bg-slate-200 mx-1 h-4" />
            <select
              onChange={(e) => setFilterYear(Number(e.target.value))}
              value={filterYear}
              className="bg-transparent px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              {Array.from({ length: 21 }, (_, i) => 2010 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-3">
            {loading && <Loader2 size={14} className="animate-spin text-blue-600" />}
            <span className={cn('text-[10px] font-black uppercase tracking-[0.2em]', dbData.length > 0 ? 'text-emerald-500' : 'text-slate-400')}>
              {dbData.length > 0 ? 'Dados Reais' : 'Amostra'}
            </span>
          </div>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-8 py-4 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2"
          >
            <Upload size={16} /> IMPORTAR
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={dbData.length === 0}
            className={cn(
              'px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border flex items-center gap-2',
              dbData.length === 0 ? 'bg-slate-50 text-slate-300 border-slate-100 pointer-events-none' : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
            )}
          >
            <Trash2 size={16} /> EXCLUIR
          </button>
        </div>


      {/* ── Indicadores de Liquidez ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {liquidityIndices.map((idx, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              {idx.name}
            </h4>
            <div className="flex items-baseline gap-2">
              <span className={cn('text-2xl font-display font-bold', idx.color)}>
                {idx.val.toFixed(2)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Índice
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium mt-2 leading-tight">{idx.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Tabelas Ativo / Passivo ──────────────────────────────────────── */}
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Calendar size={28} className="text-slate-200" />
          </div>
          <p className="text-sm font-bold text-slate-400">Nenhum dado encontrado</p>
          <p className="text-xs text-slate-300 mt-1">
            Importe um arquivo XLSX/CSV para o ano {filterYear}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Ativo */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
              Ativo (Onde o recurso foi aplicado)
            </h3>
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase">Conta</th>
                    <th className="text-right py-4 px-6 text-[10px] font-bold text-slate-400 uppercase">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ativo.map((row: any, i: number) => (
                    <tr
                      key={i}
                      className={cn('hover:bg-slate-50 transition-colors', row.level === 1 ? 'bg-slate-50/10 font-bold' : '')}
                    >
                      <td className="py-4 px-6 flex items-center gap-2">
                        <span className={cn('inline-block', row.level === 1 ? 'text-primary' : 'pl-4 text-slate-600 font-medium')}>
                          {row.conta}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-slate-700">
                        {formatCurrency(row.val)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Passivo */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
              Passivo (Origem dos recursos)
            </h3>
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase">Conta</th>
                    <th className="text-right py-4 px-6 text-[10px] font-bold text-slate-400 uppercase">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {passivo.map((row: any, i: number) => (
                    <tr
                      key={i}
                      className={cn('hover:bg-slate-50 transition-colors', row.level === 1 ? 'bg-slate-50/10 font-bold' : '')}
                    >
                      <td className="py-4 px-6 flex items-center gap-2">
                        <span className={cn('inline-block', row.level === 1 ? 'text-primary' : 'pl-4 text-slate-600 font-medium')}>
                          {row.conta}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-slate-700">
                        {formatCurrency(row.val)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Comentário Executivo ─────────────────────────────────────────── */}
      <ExecutiveCommentary
        reportType="BP"
        clientId={filterClient}
        year={filterYear}
        month={1}
      />
    </div>
  );
}
