import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Loader2, Upload, Trash2, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { DATA } from '../../data';
import { cn, formatCurrency } from '../../lib/utils';
import { useAnnualFinancialData } from '../../hooks/useFinancialData';
import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { parseFinancialPdf, parseFinancialExcel, parseFinancialTxt } from '../../services/importService';
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
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
  const ativo = rows.filter((r: any) => r.tipo === 'ativo' || r.type === 'ativo');
  const passivo = rows.filter((r: any) => r.tipo === 'passivo' || r.type === 'passivo');

  const ac  = rows.find((r: any) => r.conta === 'Ativo Circulante')?.val || 0;
  const pc  = rows.find((r: any) => r.conta === 'Passivo Circulante')?.val || 0;
  const est = rows.find((r: any) => r.conta === 'Estoques')?.val || 0;
  const cx  = rows.find((r: any) => r.conta === 'Caixa e Equivalentes')?.val || 0;
  const anc = rows.find((r: any) => r.conta === 'Ativo Não Circulante')?.val || 0;
  const pnc = rows.find((r: any) => r.conta === 'Passivo Não Circulante')?.val || 0;

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

  // ── Importar ──────────────────────────────────────────────────────────────
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !filterClient) return;
    if (!auth.currentUser) {
      showToast('error', 'Você precisa estar logado para importar dados.');
      return;
    }

    setImporting(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const dataEntries: { category: string; value: number }[] = [];

      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        const parsed = await parseFinancialExcel(file);
        parsed.forEach((e) => dataEntries.push({ category: e.category, value: e.value }));
      } else if (ext === 'pdf') {
        const parsed = await parseFinancialPdf(file);
        parsed.forEach((e) => dataEntries.push({ category: e.category, value: e.value }));
      } else if (ext === 'txt') {
        const parsed = await parseFinancialTxt(file);
        parsed.forEach((e) => dataEntries.push({ category: e.category, value: e.value }));
      } else {
        throw new Error('Formato não suportado. Use XLSX, XLS, CSV, PDF ou TXT.');
      }

      if (dataEntries.length === 0) throw new Error('Nenhum dado válido encontrado no arquivo.');

      await addDoc(collection(db, 'financial_entries'), {
        clientId:   filterClient,
        clientName: clients.find((c: any) => c.id === filterClient)?.fantasia || 'N/A',
        type:       'Balanço Patrimonial',
        periodType: 'anual',
        month:      null,
        year:       filterYear,
        mes:        null,
        ano:        filterYear,
        data:       dataEntries,
        fileName:   file.name,
        createdAt:  serverTimestamp(),
        createdBy:  auth.currentUser.uid,
      });

      showToast('success', `Arquivo "${file.name}" importado com sucesso!`);
      refetchBP();
      refetchShort();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao processar arquivo.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
    <div className="space-y-8 pb-20">

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={cn(
            'fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-bold animate-in slide-in-from-top-2 duration-300',
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          )}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Modal de confirmação de exclusão ─────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                <Trash2 size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Excluir Balanço Patrimonial</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Todos os dados do BP de {filterYear} serão removidos permanentemente.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-2xl text-sm font-black text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Barra de filtros ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-8 items-center">
        {/* Filtros */}
        <div className="flex flex-wrap gap-0 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm items-center">
          {/* Cliente */}
          <div className="flex items-center px-4 py-2 border-r border-slate-100">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mr-4">
              Cliente
            </label>
            <select
              onChange={(e) => setFilterClient(e.target.value)}
              value={filterClient}
              className="text-sm font-bold text-primary outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
            >
              {clients.map((c: any) => (
                <option key={c.id} value={c.id}>{c.fantasia}</option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div className="flex items-center px-4 py-2 border-r border-slate-200">
            <Calendar size={14} className="text-slate-400 mr-2" />
            <select
              onChange={(e) => setFilterYear(Number(e.target.value))}
              value={filterYear}
              className="text-sm font-semibold outline-none bg-transparent cursor-pointer"
            >
              {Array.from({ length: 21 }, (_, i) => 2010 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center px-4 py-2 min-w-[130px]">
            {loading && <Loader2 size={12} className="animate-spin text-blue-600 mr-2" />}
            <span
              className={cn(
                'text-[9px] font-black uppercase tracking-tighter',
                dbData.length > 0 ? 'text-emerald-500' : 'text-slate-400'
              )}
            >
              {loading ? 'Carregando...' : dbData.length > 0 ? 'Dados Reais' : 'Amostra'}
            </span>
          </div>
        </div>

        {/* Botão Importar */}
        <label
          className={cn(
            'flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all shadow-sm border',
            importing
              ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none'
              : 'bg-secondary text-white border-secondary hover:bg-secondary/90 shadow-secondary/20'
          )}
        >
          {importing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {importing ? 'Importando...' : 'Importar'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.pdf,.txt"
            className="hidden"
            onChange={handleImport}
            disabled={importing}
          />
        </label>

        {/* Botão Excluir */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleting || dbData.length === 0}
          className={cn(
            'flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border',
            deleting || dbData.length === 0
              ? 'bg-slate-50 text-slate-300 border-slate-100 pointer-events-none'
              : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
          )}
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          {deleting ? 'Excluindo...' : 'Excluir'}
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
