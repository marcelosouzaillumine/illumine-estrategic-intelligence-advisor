import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar, Loader2, Upload, Trash2, Plus, FileText, Database,
  TrendingUp, TrendingDown, Info, BarChart3, AlertTriangle,
  ShieldAlert, Zap, Target, Activity, ShieldCheck, CheckCircle2,
  BookOpen, Percent, PieChart as PieChartIcon, ArrowUpRight,
  ArrowDownRight, Minus, BookMarked, Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, Cell, AreaChart, Area, ComposedChart, ReferenceLine
} from 'recharts';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { PageHeader, KpiValue } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { collection, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CapitalGovernanceAdapter } from '../../services/FiduciaryRuntimeAdapter';
import { LifecycleContextBuilder } from '../../services/FiduciaryRuntimeAdapter';
import { LifecycleSemanticAuthority } from '../../services/FiduciaryRuntimeAdapter';
import { LifecycleRenderAudit } from '../../services/FiduciaryRuntimeAdapter';
import { DLPAExecutiveRenderingGuard, DLPAViolation } from '../../services/FiduciaryRuntimeAdapter';
import { DLPALegacyLabelScanner } from '../../services/FiduciaryRuntimeAdapter';

type ToastType = { type: 'success' | 'error'; message: string } | null;

// ── Helpers ─────────────────────────────────────────────────────────────────

function resolveDisplayLabel(semanticSource: string, resolvedValue: string | undefined, rawValue: string, fallback: string) {
  if (semanticSource === 'ELSA' && resolvedValue) return resolvedValue;
  return rawValue ?? fallback;
}

function getRetentionLabel(status: string) {
  const map: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
    'ALTA_RETENÇÃO':              { label: 'Alta Retenção',             color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200', icon: ArrowUpRight },
    'RETENÇÃO_MODERADA':          { label: 'Retenção Moderada',         color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200',    icon: TrendingUp },
    'DISTRIBUIÇÃO_EXCESSIVA':     { label: 'Distribuição Excessiva',    color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200',   icon: TrendingDown },
    'DESCAPITALIZAÇÃO_DELIBERADA':{ label: 'Descapitalização Deliberada', color: 'text-rose-700', bg: 'bg-rose-50',     border: 'border-rose-200',    icon: ShieldAlert },
    'NÃO_APLICÁVEL_SEM_LUCRO':   { label: 'N/A — Sem Lucro',           color: 'text-slate-500',   bg: 'bg-slate-50',    border: 'border-slate-200',   icon: Minus },
    'NÃO_APLICÁVEL':              { label: 'N/A',                       color: 'text-slate-500',   bg: 'bg-slate-50',    border: 'border-slate-200',   icon: Minus },
    'AUSÊNCIA_DE_CAPACIDADE_DISTRIBUTIVA': { label: 'Sem Capacidade Distributiva', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: Minus },
    'RETENÇÃO_COMPULSÓRIA_POR_PREJUÍZO':   { label: 'Retenção por Prejuízo', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: ShieldAlert },
    
    // New fiduciaries
    'STRATEGIC_RETENTION':        { label: 'Retenção Estratégica',      color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200', icon: ArrowUpRight },
    'FORCED_RETENTION':           { label: 'Retenção Compulsória',      color: 'text-slate-600',   bg: 'bg-slate-50',    border: 'border-slate-200',   icon: Minus },
    'EMERGENCY_CAPITAL_PRESERVATION': { label: 'Preservação Emergencial', color: 'text-amber-700', bg: 'bg-amber-50',    border: 'border-amber-200',   icon: ShieldAlert },
    'SURVIVAL_STAGE_CAPITAL_STRUCTURE': { label: 'Estrutura de Sobrevivência', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: ShieldAlert },
    'UNSUSTAINABLE_PRESERVATION': { label: 'Preservação Insustentável', color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200',   icon: TrendingDown },
    'GOVERNANCE_RETENTION':       { label: 'Retenção de Governança',    color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200',    icon: TrendingUp },
    'RETENTION_NOT_ELIGIBLE':     { label: 'Inelegível para Retenção',  color: 'text-slate-500',   bg: 'bg-slate-50',    border: 'border-slate-200',   icon: Minus },
  };
  return map[status] || map['NÃO_APLICÁVEL'];
}

function getDistributionLabel(pressure: string) {
  const map: Record<string, { label: string; color: string; bg: string; border: string }> = {
    'BAIXA':                   { label: 'Conservadora',              color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'MODERADA':                { label: 'Equilibrada',               color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
    'ALTA':                    { label: 'Agressiva',                  color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
    'CRÍTICA':                 { label: 'Predatória',                 color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200' },
    'NÃO_APLICÁVEL_SEM_LUCRO': { label: 'Sem distribuição no período', color: 'text-slate-500',  bg: 'bg-slate-50',   border: 'border-slate-200' },
    'NÃO_APLICÁVEL':           { label: 'N/A',                        color: 'text-slate-500',   bg: 'bg-slate-50',   border: 'border-slate-200' },
  };
  return map[pressure] || map['NÃO_APLICÁVEL'];
}

function getPreservationLabel(status: string) {
  const map: Record<string, { label: string; color: string; bg: string; border: string }> = {
    'PRESERVAÇÃO_SAUDÁVEL':   { label: 'Preservação Saudável',       color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'EROSÃO_MODERADA':        { label: 'Erosão Moderada',             color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
    'EROSÃO_RELEVANTE':       { label: 'Erosão Relevante',            color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
    'FRAGILIDADE_PATRIMONIAL':{ label: 'Fragilidade Patrimonial',     color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200' },
    'NEUTRO':                 { label: 'Patrimônio Preservado',       color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200' },
    'DEPENDÊNCIA_DE_CAPITALIZAÇÃO':{ label: 'Dependência de Capital', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
    'SUSTENTAÇÃO_PATRIMONIAL_EXTERNA':{ label: 'Sustentação Externa', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    'EROSÃO_PATRIMONIAL_OPERACIONAL':{ label: 'Erosão Operacional', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
    // legado
    'PRESERVADO':             { label: 'Preservado',                  color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'DRENADO':                { label: 'Erosão Relevante',             color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
    // fiduciários novos
    'PRESERVED':              { label: 'Preservado',                  color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'PRESSURED':              { label: 'Pressionado',                 color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
    'SEVERELY_ERODED':        { label: 'Erosão Severa',               color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
    'CAPITAL_COLLAPSE_RISK':  { label: 'Risco de Colapso',            color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200' },
    // CPI classifications
    'CAPITAL_EXPANSION':      { label: 'Expansão de Capital',         color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'CAPITAL_PRESERVED':      { label: 'Capital Preservado',          color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'MODERATE_EROSION':       { label: 'Erosão Moderada',             color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
    'HIGH_EROSION':           { label: 'High Capital Erosion',        color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
    'CRITICAL_EROSION':       { label: 'Erosão Crítica',              color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200' },
    'CAPITAL_COLLAPSE':       { label: 'Colapso de Capital',          color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200' },
    'Capitalização em Consolidação': { label: 'Capitalização em Consolidação', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', border: 'border-blue-200' },
    'Estrutura de Capital em Formação': { label: 'Estrutura de Capital em Formação', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-100', border: 'border-slate-200' },
    'Estrutura Patrimonial em Formação': { label: 'Estrutura Patrimonial em Formação', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-100', border: 'border-slate-200' }
  };
  return map[status] || map['NEUTRO'];
}

function getMaturityLabel(maturity: string) {
  const map: Record<string, { label: string; color: string; bg: string; border: string; score: number }> = {
    'MATURA':           { label: 'Governança Matura',           color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', score: 90 },
    'EM_DESENVOLVIMENTO':{ label: 'Em Desenvolvimento',         color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    score: 65 },
    'FRAGILIZADA':      { label: 'Governança Fragilizada',      color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   score: 38 },
    'EM_ESTRUTURAÇÃO':  { label: 'Em Estruturação',             color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200',   score: 28 },
    'FRÁGIL':           { label: 'Governança Frágil',           color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   score: 40 },
    'DESTRUTIVA':       { label: 'Governança Destrutiva',       color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200',    score: 10 },
    
    // Modern CGE statuses mapping
    'Governança Estruturada': { label: 'Governança Estruturada', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100', border: 'border-emerald-200', score: 90 },
    'Governança Estruturada com Risco de Capital': { label: 'Governança Estruturada com Risco de Capital', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100', border: 'border-emerald-200', score: 85 },
    'Governança em Consolidação': { label: 'Governança em Consolidação', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', border: 'border-blue-200', score: 70 },
    'Governança Fragilizada': { label: 'Governança Fragilizada', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100', border: 'border-amber-200', score: 50 },
    'Governança Crítica': { label: 'Governança Crítica', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-100', border: 'border-rose-200', score: 30 },
    'Governança em Estruturação': { label: 'Governança em Estruturação', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', border: 'border-blue-200', score: 50 }
  };
  return map[maturity] || { label: maturity, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-100', border: 'border-slate-200', score: 50 };
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
function DlpaKpiCard({ title, value, subtitle, statusLabel, statusBg, statusText, statusBorder, icon: Icon, accentColor, formula }: any) {
  return (
    <div className={cn(
      'group relative bg-white rounded-[20px] border p-6 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col',
      statusBorder || 'border-slate-200'
    )}>
      <div className={cn('absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-[0.04] pointer-events-none transition-transform duration-500 group-hover:scale-125', accentColor || 'bg-slate-400')} />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-snug w-3/4">{title}</h4>
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', accentColor || 'bg-slate-100')}>
          <Icon size={16} />
        </div>
      </div>
      <div className="relative z-10 mt-auto">
        <div className="mb-2">
          <KpiValue
            value={value}
            className="font-semibold tracking-tight text-slate-800"
          />
          {formula && (
            <p className="text-[9px] font-mono text-slate-400 mt-1 bg-slate-50 p-1.5 rounded border border-slate-100 whitespace-pre-wrap leading-relaxed">
              {formula}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-[9px] font-black uppercase px-2.5 py-1 rounded-full border', statusBg, statusText, statusBorder)}>
            {statusLabel}
          </span>
          <span className="text-[10px] text-slate-400 font-medium whitespace-normal break-words leading-snug min-w-0 max-w-full">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 40, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const colorMap: Record<string, string> = {
    emerald: '#10b981', blue: '#3b82f6', amber: '#f59e0b', rose: '#f43f5e', slate: '#94a3b8'
  };
  const stroke = colorMap[color] || colorMap.slate;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={stroke} strokeWidth="8"
          strokeDasharray={`${c} ${c}`} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 48 48)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        <text x="48" y="48" textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: '24px', fontWeight: 800, fill: stroke }}>
          {Math.round(value)}
        </text>
      </svg>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">{label}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function DLPAPage({ clients, selectedClient, selectedYear }: any) {
  const [filterYear, setFilterYear] = useState<number>(Number(selectedYear) || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showElsaPanel, setShowElsaPanel] = useState(false);
  const [showTechnicalLayer, setShowTechnicalLayer] = useState(false);

  useEffect(() => {
    if (selectedYear) setFilterYear(Number(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        setShowElsaPanel(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Data Fetching ──────────────────────────────────────────────────────────
  const { dbData: dbDataDLPA, docIds: docIdsDLPA, loading: loadingDLPA, refetch: refetchDLPA } =
    useAnnualFinancialData(selectedClient, filterYear, 'DLPA');

  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  // ── Extrai valores reais da DLPA ──────────────────────────────────────────
  const dlpaMetrics = useMemo(() => {
    if (dbDataDLPA.length === 0) return null;

    const normalize = (s: string) =>
      (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // First, try to get the real PL values from the Balance Sheet (BP) for this year in allHistoryData
    const bpEntries = allHistoryData.filter((d: any) =>
      Number(d.year) === filterYear &&
      ['bp', 'balanço patrimonial', 'balanco patrimonial', 'balanco'].includes(normalize(d.docType || d.type || ''))
    );

    let bpPlFim = 0;
    if (bpEntries.length > 0) {
      const plEntry = bpEntries.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return (n === 'patrimonio liquido' || n === 'pl' || n === 'total do patrimonio liquido') && e.type === 'pl';
      });
      if (plEntry) {
        bpPlFim = Number(plEntry.val || plEntry.valor || plEntry.value || 0);
      }
    }

    // Also get the BP PL for the previous year (starting equity)
    const bpEntriesPrev = allHistoryData.filter((d: any) =>
      Number(d.year) === (filterYear - 1) &&
      ['bp', 'balanço patrimonial', 'balanco patrimonial', 'balanco'].includes(normalize(d.docType || d.type || ''))
    );

    let bpPlInicio = 0;
    if (bpEntriesPrev.length > 0) {
      const plEntry = bpEntriesPrev.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return (n === 'patrimonio liquido' || n === 'pl' || n === 'total do patrimonio liquido') && e.type === 'pl';
      });
      if (plEntry) {
        bpPlInicio = Number(plEntry.val || plEntry.valor || plEntry.value || 0);
      }
    }

    const findVal = (...terms: string[]) => {
      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return terms.some(t => n.includes(normalize(t)));
      });
      return Number(entry?.val || entry?.valor || entry?.value || 0);
    };

    // Lucro Líquido extraction that also matches Prejuízo (excluding carryover/accumulated balances)
    const getNetIncomeValue = () => {
      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        if (n.includes('acumulado') || n.includes('saldo inicial') || n.includes('saldo final') || n.includes('saldo anterior') || n.includes('periodo anterior') || n.includes('inicio') || n.includes('fim')) {
          return false;
        }
        return [
          'lucro liquido', 'lucro do exercicio', 'resultado liquido',
          'prejuizo liquido', 'prejuizo do exercicio', 'prejuizo liquido do exercicio',
          'resultado do exercicio', 'resultado liquido do exercicio', 'prejuizo do periodo', 'lucro do periodo',
          'lucro/prejuizo do exercicio', 'lucro ou prejuizo do exercicio'
        ].some(term => n.includes(normalize(term))) || (n.includes('lucro') || n.includes('prejuizo') || n.includes('resultado do exercicio'));
      });
      if (!entry) return 0;
      let val = Number(entry.val ?? entry.valor ?? entry.value ?? 0);
      const n = normalize(entry.conta || entry.category || '');
      if ((n.includes('prejuizo') || n.includes('(-)')) && val > 0) {
        val = -val;
      }
      return val;
    };

    const getPlInicioValue = () => {
      if (bpPlInicio > 0) return bpPlInicio;
      
      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        const isSubAccount = n.includes('lucro') || n.includes('prejuizo') || n.includes('reserva');
        if (isSubAccount) return false;
        
        return [
          'pl inicio', 'saldo inicial', 'patrimonio inicio',
          'saldo no inicio', 'saldo anterior', 'saldo no inicio do periodo',
          'saldo de abertura'
        ].some(term => n.includes(normalize(term))) || (n.includes('saldo') && n.includes('inicio'));
      });
      return Number(entry?.val || entry?.valor || entry?.value || 0);
    };

    const getPlFimValue = () => {
      if (bpPlFim > 0) return bpPlFim;

      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        const isSubAccount = n.includes('lucro') || n.includes('prejuizo') || n.includes('reserva');
        if (isSubAccount) return false;

        return [
          'pl fim', 'saldo final', 'patrimonio fim', 'patrimonio liquido',
          'saldo no fim', 'saldo atual', 'saldo no fim do periodo',
          'saldo de encerramento'
        ].some(term => n.includes(normalize(term))) || (n.includes('saldo') && n.includes('fim'));
      });

      return Number(entry?.val || entry?.valor || entry?.value || 0);
    };

    const getCapitalSocial = () => {
      const bpEntries = allHistoryData.filter((d: any) =>
        Number(d.year) === filterYear &&
        ['bp', 'balanço patrimonial', 'balanco patrimonial', 'balanco'].includes(normalize(d.docType || d.type || ''))
      );
      const bpCapitalSocialEntry = bpEntries.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return n === 'capital social' || n === 'capital social integralizado' || n === 'capital integralizado' || n === 'capital subscrito';
      });
      if (bpCapitalSocialEntry) {
        return Math.abs(Number(bpCapitalSocialEntry.val || bpCapitalSocialEntry.valor || bpCapitalSocialEntry.value || 0));
      }

      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return n.includes('capital social') || n.includes('capital integralizado');
      });
      return Number(entry?.val || entry?.valor || entry?.value || bpPlFim || 0);
    };

    const getStartingLucrosPrejuizos = () => {
      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return (n.includes('saldo anterior') || n.includes('saldo inicial') || n.includes('inicio') || n.includes('abertura') || n.includes('anterior')) && 
               (n.includes('lucros') || n.includes('prejuizos') || n.includes('acumulados') || n.includes('lucros/prejuizos') || n.includes('lucros ou prejuizos'));
      });
      let val = Number(entry?.val ?? entry?.valor ?? entry?.value ?? 0);
      if (entry) {
        const nameNorm = normalize(entry.conta || entry.category || '');
        if ((nameNorm.includes('prejuizo') || nameNorm.includes('(-)')) && val > 0) {
          val = -val;
        }
      }
      return val;
    };

    const lucroLiquido       = getNetIncomeValue();
    const dividendos         = Math.abs(findVal('dividendo', 'distribuicao', 'jcp', 'juros sobre capital'));
    const reservaLegal       = findVal('reserva legal');
    const reservaEstatutaria = findVal('reserva estatutaria', 'outras reservas');
    const plInicio           = getPlInicioValue();
    const plFim              = getPlFimValue();
    const aumentoCapital     = findVal('aumento de capital', 'integralizacao');
    const lucrosPrejuizosInicio = getStartingLucrosPrejuizos();
    const capitalSocial = getCapitalSocial();

    return {
      lucroLiquido,
      dividendos,
      reservaLegal,
      reservaEstatutaria,
      plInicio: plInicio || plFim,
      plFim: plFim || plInicio,
      aumentoCapital,
      lucrosPrejuizosInicio,
      capitalSocial
    };
  }, [dbDataDLPA, allHistoryData, filterYear]);

  // ── Capital Governance Adapter (local, sem runtime completo) ──────────────
  const capitalGov = useMemo(() => {
    if (!dlpaMetrics || dbDataDLPA.length === 0) return null;
    const { lucroLiquido, dividendos, plInicio, plFim, aumentoCapital, capitalSocial } = dlpaMetrics;
    const retainedEarnings = plFim > 0 ? plFim - (plInicio || plFim) : lucroLiquido - dividendos;

    const currentClient = clients?.find((c: any) => c.id === selectedClient);

    let foundationYear: number | undefined = undefined;
    if (currentClient?.dataFundacao) {
      const parts = currentClient.dataFundacao.split('/');
      if (parts.length === 3) {
        const yearPart = Number(parts[2]);
        if (!isNaN(yearPart)) foundationYear = yearPart;
      } else {
        const yearPart = Number(currentClient.dataFundacao);
        if (!isNaN(yearPart)) {
          foundationYear = yearPart;
        } else {
          const dateObj = new Date(currentClient.dataFundacao);
          if (!isNaN(dateObj.getFullYear())) {
            foundationYear = dateObj.getFullYear();
          }
        }
      }
    }
    if (foundationYear === undefined && typeof currentClient?.foundationYear === 'number') {
      foundationYear = currentClient.foundationYear;
    }

    const uniqueYears = Array.from(new Set(allHistoryData.map((d: any) => Number(d.year)).filter(Boolean)));
    const historicalCycles = uniqueYears.filter(y => y <= filterYear).length;

    const normalize = (s: string) =>
      (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const dreEntries = allHistoryData.filter((d: any) =>
      Number(d.year) === filterYear &&
      ['dre', 'dre gerencial', 'resultado'].includes(normalize(d.docType || d.type || ''))
    );
    const revEntry = dreEntries.find((d: any) => {
      const name = normalize(d.conta || d.category || d.item || '');
      return name.includes('receita') || name.includes('faturamento') || name.includes('vendas');
    });
    const revenue = revEntry ? Number(revEntry.val ?? revEntry.valor ?? revEntry.value ?? 0) : 0;

    const lContext = LifecycleContextBuilder.build({
      foundationYear,
      analysisYear: filterYear,
      historicalCycles,
      capitalSocial,
      revenue,
      netIncome: lucroLiquido
    });
    const lifecycleProfile = LifecycleSemanticAuthority.getSemanticProfile(lContext);

    const financialRuntimeContext = {
      lifecycle: lContext,
      analysisYear: filterYear,
      lifecycleProfile,
      contextualConfidence: 'HIGH' as const,
      interpretationWarnings: [] as string[],
      requiredDisclosures: [] as string[],
      auditTrail: [] as string[]
    };

    try {
      return CapitalGovernanceAdapter.process(
        dbDataDLPA,
        lucroLiquido,
        retainedEarnings,
        dividendos,
        plInicio || plFim,
        plFim,
        aumentoCapital,
        financialRuntimeContext,
        allHistoryData
      );
    } catch (e: any) {
      console.error("DLPA Adapter Error:", e);
      return { error: e.message };
    }
  }, [dbDataDLPA, dlpaMetrics, allHistoryData, clients, selectedClient, filterYear]);

  // ── Dados históricos para gráfico ─────────────────────────────────────────
  const chartData = useMemo(() => {
    return [4, 3, 2, 1, 0].map(offset => {
      const y = filterYear - offset;
      const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y);

      const normalize = (s: string) =>
        (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const findYearVal = (docTypes: string[], terms: string[]) => {
        const match = yearEntries
          .filter((d: any) => docTypes.some(dt => normalize(d.docType || d.type || '') === normalize(dt)))
          .find((d: any) => terms.some(t => normalize(d.conta || d.category || '').includes(normalize(t))));
        return Number(match?.val || match?.valor || match?.value || 0);
      };

      const ll    = findYearVal(['dre', 'dre gerencial'], ['lucro liquido', 'lucro do exercicio']);
      const divid = Math.abs(findYearVal(['dlpa'], ['dividendo', 'distribuicao', 'jcp']));
      const rl    = findYearVal(['dlpa'], ['reserva legal']);

      return { year: y.toString(), LucroLíquido: ll, Dividendos: divid, ReservaLegal: rl };
    });
  }, [allHistoryData, filterYear]);

  // ── Toast ────────────────────────────────────────────────────────────────
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Delete Handler ────────────────────────────────────────────────────────
  const handleDeleteAll = async () => {
    if (!selectedClient || docIdsDLPA.length === 0) return;
    setDeleting(true);
    try {
      await Promise.all(docIdsDLPA.map(id => deleteDoc(doc(db, 'financial_entries', id))));
      showToast('success', 'Dados DLPA excluídos com sucesso.');
      refetchDLPA();
    } catch {
      showToast('error', 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const loading = loadingDLPA || loadingHistory;
  const hasData = dbDataDLPA.length > 0;
  const retention    = (capitalGov as any)?.diagnostics?.retention;
  const distribution = (capitalGov as any)?.diagnostics?.distribution;
  const preservation = (capitalGov as any)?.diagnostics?.preservation;
  const behavior     = (capitalGov as any)?.diagnostics?.behavior;
  const fiduciaryOutput = (capitalGov as any)?.diagnostics?.fiduciaryOutput;
  const narrative    = (capitalGov as any)?.narrative || '';
  const lifecycleContext = (capitalGov as any)?.semantic?.semanticContext || {};
  const isValidLifecycleContext = lifecycleContext?.semanticSource && lifecycleContext?.lifecycleStage;

  const semanticSource = isValidLifecycleContext ? lifecycleContext.semanticSource : ((capitalGov as any)?.semanticSource || 'LEGACY');
  const lifecycleStage = isValidLifecycleContext ? lifecycleContext.lifecycleStage : ((capitalGov as any)?.diagnostics?.fiduciaryOutput?.lifecycleStage || (capitalGov as any)?.lifecycleStage || 'ESTABLISHED_ANALYSIS');

  const executiveLayer = (capitalGov as any)?.executiveLayer;

  const capitalSocialValue = dlpaMetrics?.capitalSocial ?? 0;

  const cpi = useMemo(() => {
    if (!dlpaMetrics || capitalSocialValue === 0) return 1;
    return (dlpaMetrics.plFim ?? 0) / capitalSocialValue;
  }, [dlpaMetrics, capitalSocialValue]);

  const cpiStatus = useMemo(() => {
    const raw = preservation?.preservationStatus || 'NEUTRO';
    const resolved = (capitalGov as any)?.semantic?.resolvedCapitalStatus || (capitalGov as any)?.resolvedCapitalStatus;
    return resolveDisplayLabel(semanticSource, resolved, raw, 'NEUTRO');
  }, [capitalGov, preservation, semanticSource]);

  const retentionStyle    = getRetentionLabel(retention?.retentionStatus || 'NÃO_APLICÁVEL');
  const distributionStyle = getDistributionLabel(distribution?.distributionPressure || 'NÃO_APLICÁVEL');
  const preservationStyle = getPreservationLabel(cpiStatus || 'NEUTRO');

  const alignedMaturity = useMemo(() => {
    const raw = behavior?.governanceMaturity || 'Governança Crítica';
    const resolved = (capitalGov as any)?.semantic?.resolvedGovernanceStatus || (capitalGov as any)?.resolvedGovernanceStatus;
    return resolveDisplayLabel(semanticSource, resolved, raw, 'Governança Crítica');
  }, [capitalGov, behavior, semanticSource]);

  const [renderingViolations, setRenderingViolations] = useState<DLPAViolation[]>([]);
  const featureFlags = useMemo(() => ({
    showSemanticAudit: true
  }), []);

  // Execute UI Rendering Audit
  useEffect(() => {
    if (capitalGov && process.env.NODE_ENV !== 'production') {
      LifecycleRenderAudit.validate({
        governanceStatus: behavior?.governanceMaturity,
        resolvedGovernanceStatus: (capitalGov as any)?.resolvedGovernanceStatus,
        capitalStatus: preservation?.preservationStatus,
        resolvedCapitalStatus: (capitalGov as any)?.resolvedCapitalStatus,
        semanticSource: (capitalGov as any)?.semanticSource,
        resolvedSemanticSource: (capitalGov as any)?.semanticSource
      });
    }
  }, [capitalGov, behavior, preservation]);

  const maturityStyle     = getMaturityLabel(alignedMaturity);

  // Hook DLPAExecutiveRenderingGuard into DLPAPage.tsx via useEffect
  useEffect(() => {
    if (capitalGov) {
      const renderedTerms = [
        maturityStyle.label,
        preservationStyle.label,
        narrative,
        cpiStatus
      ];
      
      if (semanticSource === 'ELSA') {
        try {
          DLPALegacyLabelScanner.scanRenderedLabels(semanticSource, renderedTerms);
        } catch (e) {
          console.error(e);
        }
      }

      const viols = DLPAExecutiveRenderingGuard.validateExecutiveDisplay(semanticSource, lifecycleStage, renderedTerms);
      setRenderingViolations(viols);
    }
  }, [semanticSource, lifecycleStage, maturityStyle.label, preservationStyle.label, narrative, capitalGov, cpiStatus]);

  const lucrosPrejuizosFinal = useMemo(() => {
    if (!dlpaMetrics) return 0;
    if (retention?.lucrosPrejuizos != null && retention.lucrosPrejuizos !== 0) {
      return retention.lucrosPrejuizos;
    }
    return (dlpaMetrics.lucrosPrejuizosInicio || 0) + (dlpaMetrics.lucroLiquido || 0);
  }, [dlpaMetrics, retention]);

  const parsedTaxaRetencao = retention ? retention.retentionRatio * 100 : 0;
  const parsedTaxaDistribuicao = distribution ? distribution.distributionRatio * 100 : 0;
  const retentionValue = retention ? retention.retainedEarnings : 0;

  // ── Action Bar ─────────────────────────────────────────────────────────────
  const actionButtons = (
    <div className="flex items-center gap-3">
      <div className="flex bg-card p-1 rounded-md border border-border items-center mr-2 shadow-sm">
        <Calendar size={12} className="ml-2 text-secondary" />
        <select
          onChange={e => setFilterYear(Number(e.target.value))}
          value={filterYear}
          className="bg-transparent px-3 py-1 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground appearance-none pr-1"
        >
          {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setShowManualModal(true)}
        className="px-4 py-2 bg-success/10 hover:bg-success text-success hover:text-white border border-success/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Plus size={14} /> Lançar
      </button>

      <button
        onClick={() => setShowImportModal(true)}
        className="px-4 py-2 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Upload size={14} /> Importar
      </button>

      {hasData && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
        >
          <Trash2 size={14} /> Excluir
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      {/* Toast */}
      {toast && typeof document !== 'undefined' && createPortal(
        <div className={cn(
          'fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-bold text-white animate-executive-fade',
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
        )}>
          {toast.message}
        </div>,
        document.body
      )}

      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl" style={{ width: '100%', maxWidth: '24rem' }}>
            <ShieldAlert size={32} className="text-rose-500 mb-4" />
            <h3 className="text-lg font-black text-slate-900 mb-2">Confirmar Exclusão</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Todos os registros DLPA de <strong>{filterYear}</strong> serão excluídos permanentemente.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
              <button onClick={handleDeleteAll} disabled={deleting} className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 disabled:opacity-60">
                {deleting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Excluir'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <PageHeader
        title="DLPA — Demonstração de Lucros e Prejuízos Acumulados"
        subtitle="Análise estrutural de distribuição de lucros, preservação patrimonial e maturidade de governança de capital."
        icon={BookOpen}
        color="executive"
      />

      {lifecycleStage === 'INITIAL_CAPITALIZATION' && (
        <div className="flex justify-start -mt-6 -mb-6">
          <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-sm">
            Fase Inicial de Capitalização
          </span>
        </div>
      )}

      {/* Temporário: Auditoria de Propagação ELSA (Atalho: Ctrl+Shift+E) */}
      {showElsaPanel && (featureFlags.showSemanticAudit || process.env.NODE_ENV !== 'production') && (capitalGov as any)?.lifecycleAudit && (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl mb-6 flex flex-col gap-2">
          <h4 className="text-xs font-black uppercase text-white mb-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" /> Auditoria de Propagação ELSA (Painel Técnico)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] uppercase font-mono text-slate-300">
            <div>
              <span className="block text-slate-500 mb-1">Semantic Source:</span>
              <strong className={(capitalGov as any).lifecycleAudit.semanticSource === 'ELSA' ? 'text-emerald-400' : 'text-amber-400'}>
                {(capitalGov as any).lifecycleAudit.semanticSource}
              </strong>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">Raw Governance Status:</span>
              <strong className="text-amber-400">
                {behavior?.governanceMaturity || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">Resolved Governance:</span>
              <strong className="text-emerald-400">
                {(capitalGov as any)?.resolvedGovernanceStatus || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">Raw Capital Status:</span>
              <strong className="text-amber-400">
                {preservation?.preservationStatus || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">Resolved Capital:</span>
              <strong className="text-emerald-400">
                {(capitalGov as any)?.resolvedCapitalStatus || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">Fallback Activated:</span>
              <strong className={(capitalGov as any).lifecycleAudit.fallbackActivated ? 'text-rose-400' : 'text-emerald-400'}>
                {(capitalGov as any).lifecycleAudit.fallbackActivated ? 'YES' : 'NO'}
              </strong>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">Fallback Reason:</span>
              <strong className="text-rose-400">
                {(capitalGov as any).lifecycleAudit.fallbackReason || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">UI Rendering Match:</span>
              <strong className={alignedMaturity === (capitalGov as any)?.resolvedGovernanceStatus ? 'text-emerald-400' : 'text-rose-400'}>
                {alignedMaturity === (capitalGov as any)?.resolvedGovernanceStatus ? 'VALID' : 'LEGACY_FIELD_RENDERED'}
              </strong>
            </div>
          </div>
          {renderingViolations.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-700">
              <span className="block text-rose-400 font-bold text-[9px] mb-1">Controlled Rendering Violations:</span>
              {renderingViolations.map((v, i) => (
                <div key={i} className="text-[9px] text-rose-300 font-mono">
                  [{v.code}] {v.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          {loading && <Loader2 size={14} className="animate-spin text-secondary" />}
          <div className="bg-card border border-border rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
            <Database size={14} className={hasData ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', hasData ? 'text-success' : 'text-muted-foreground/40')}>
              {hasData
                ? `${dbDataDLPA.length} registro${dbDataDLPA.length !== 1 ? 's' : ''} · DLPA ${filterYear}`
                : `Amostra · DLPA ${filterYear}`}
            </span>
          </div>
        </div>
        {actionButtons}
      </div>

      {!loading && !hasData && (
        <div className="bg-white border border-dashed border-slate-300 rounded-[40px] p-16 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
            <BookOpen size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-black text-slate-700 mb-2">Nenhum dado DLPA encontrado</h3>
          <p className="text-sm text-slate-400 leading-relaxed mx-auto" style={{ maxWidth: '36rem' }}>
            Importe ou lance manualmente os dados da Demonstração de Lucros e Prejuízos Acumulados para {filterYear}.
          </p>
          <div className="flex gap-3 mt-6 justify-center">
            <button onClick={() => setShowManualModal(true)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus size={16} /> Lançar DLPA
            </button>
            <button onClick={() => setShowImportModal(true)} className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
              <Upload size={16} /> Importar
            </button>
          </div>
        </div>
      )}

      {hasData && (
        <div className="space-y-6 mb-12">
          {(capitalGov as any)?.error && (
            <div className="bg-rose-50 border border-rose-200 rounded-[32px] p-8 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Falha na Renderização Executiva</h3>
              <p className="text-sm text-slate-500 max-w-lg mb-4">
                Houve um erro ao processar a governança de capital.
              </p>
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs font-mono text-rose-600 w-full max-w-2xl text-left overflow-auto">
                {(capitalGov as any).error}
              </div>
            </div>
          )}
          
          {/* --- 2. EXECUTIVE LAYER UI --- */}
          {executiveLayer && (
            <div className="space-y-6">
              
              {/* Capital Preservation Score (CPS) Header Block */}
              {executiveLayer.capitalPreservationScore && (
                <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck size={24} className="text-[#FF8552]" />
                      <h3 className="text-xl font-black tracking-wide text-[#0E1C2C]">Capital Preservation Score (CPS)</h3>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Métrica Principal de Governança Fiduciária</p>
                    {executiveLayer.capitalPreservationScore.components ? (
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Ponderação:</span>
                        <div className="inline-flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm text-[11px] font-semibold text-slate-600">
                          Remanescente <span className="text-slate-400 ml-1">({executiveLayer.capitalPreservationScore.components.remanescenteScore?.toFixed(0) || '0'} pts × 45%)</span>
                        </div>
                        <span className="text-slate-300 font-black">+</span>
                        <div className="inline-flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm text-[11px] font-semibold text-slate-600">
                          Dependência <span className="text-slate-400 ml-1">({executiveLayer.capitalPreservationScore.components.dependencyScore?.toFixed(0) || '0'} pts × 30%)</span>
                        </div>
                        <span className="text-slate-300 font-black">+</span>
                        <div className="inline-flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm text-[11px] font-semibold text-slate-600">
                          Distribuição <span className="text-slate-400 ml-1">({executiveLayer.capitalPreservationScore.components.distributionScore?.toFixed(0) || '0'} pts × 10%)</span>
                        </div>
                        <span className="text-slate-300 font-black">+</span>
                        <div className="inline-flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm text-[11px] font-semibold text-slate-600">
                          Horizonte <span className="text-slate-400 ml-1">({executiveLayer.capitalPreservationScore.components.horizonScore?.toFixed(0) || '0'} pts × 15%)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-4 py-2 mt-1 bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-xs font-semibold text-slate-600 tracking-wide">
                        {executiveLayer.capitalPreservationScore.rationale}
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 flex flex-col items-center justify-center shrink-0 bg-slate-50 border border-slate-100 rounded-3xl p-6 min-w-[200px]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Preservação Geral</span>
                    <div className="text-5xl font-black text-[#0E1C2C] tracking-tight mb-2">
                      {executiveLayer.capitalPreservationScore.value}<span className="text-lg text-slate-400">/100</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-200 bg-white text-slate-700">
                      {executiveLayer.capitalPreservationScore.classification}
                    </span>
                  </div>
                </div>
              )}

              {/* 1. Tese de Governança & 8. Síntese Executiva */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="col-span-1 xl:col-span-4 bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <Target size={20} className="text-[#FF8552]" />
                    <h3 className="text-xl font-black text-[#0E1C2C]">Tese de Governança</h3>
                  </div>
                  <p className="text-xs font-black text-[#0E1C2C] bg-slate-100 px-3 py-1.5 rounded-full self-start mb-4 uppercase tracking-widest">
                    {executiveLayer.governanceInterpretation?.classification}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {executiveLayer.governanceInterpretation?.narrative}
                  </p>
                  {executiveLayer.governanceInterpretation?.riskToShareholders && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-wider text-rose-500 mb-1">Risco ao Capital dos Sócios</p>
                      <p className="text-xs font-bold text-slate-600 leading-relaxed">
                        {executiveLayer.governanceInterpretation.riskToShareholders}
                      </p>
                    </div>
                  )}
                </div>

                <div className="col-span-1 xl:col-span-8 bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity size={20} className="text-emerald-500" />
                    <h3 className="text-xl font-black text-[#0E1C2C]">Síntese Executiva Advisory</h3>
                  </div>
                  <div className="space-y-4">
                    {executiveLayer.boardAdvisory?.narrative?.split('\n\n').map((paragraph: string, idx: number) => {
                      if (!paragraph.trim()) return null;
                      const colonIndex = paragraph.indexOf(':');
                      if (colonIndex > 0 && colonIndex < 40) {
                        const title = paragraph.substring(0, colonIndex + 1);
                        const rest = paragraph.substring(colonIndex + 1);
                        return (
                          <p key={idx} className="text-sm text-slate-600 leading-relaxed font-medium">
                            <span className="font-bold text-[#0E1C2C]">{title}</span>
                            {rest}
                          </p>
                        );
                      }
                      return (
                        <p key={idx} className="text-sm text-slate-600 leading-relaxed font-medium">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Framework de Governança de Capital */}
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 size={20} className="text-blue-500" />
                  <h3 className="text-xl font-black text-slate-900">Framework de Decisão do Conselho</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {executiveLayer.boardDecisionSupport?.value?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">{item.question}</p>
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3, 4, 5, 6. Inteligência de Preservação de Capital */}
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp size={20} className="text-[#0E1C2C]" />
                  <h3 className="text-xl font-black text-slate-900">Inteligência de Preservação de Capital</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
                  {/* Card 1: Capital Remanescente */}
                  {(() => {
                    const val = executiveLayer.capitalPreservationStatus?.value ?? 0;
                    const classification = executiveLayer.capitalPreservationStatus?.classification || 'Capital Erodido';
                    const badgeColor = val >= 0.90 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' 
                      : val >= 0.75
                        ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                        : val >= 0.50 
                          ? 'bg-amber-50 text-amber-700 border-amber-200/80' 
                          : val >= 0.25
                            ? 'bg-rose-50/50 text-rose-600 border-rose-200/50'
                            : 'bg-rose-50 text-rose-700 border-rose-200/80';
                    
                    return (
                      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 hover:shadow-md transition-all duration-300 min-h-[220px]">
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-col items-start gap-3 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Capital Remanescente</span>
                            <span className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border text-left max-w-full", badgeColor)}>
                              {classification}
                            </span>
                          </div>
                          <div className="text-3xl font-black text-slate-800 tracking-tight">
                            {(val * 100).toFixed(1).replace('.', ',')}%
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-2">
                            {executiveLayer.capitalPreservationStatus?.narrative}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4 pt-3 border-t border-slate-200/40">
                          {executiveLayer.capitalPreservationStatus?.rationale}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Card 2: Capital Consumido */}
                  {(() => {
                    const val = executiveLayer.capitalErosionRisk?.value ?? 0;
                    const consumedAmount = executiveLayer.capitalErosionRisk?.capitalConsumedAmount ?? 0;
                    const classification = executiveLayer.capitalErosionRisk?.classification || 'Baixo';
                    const badgeColor = val >= 0.50 
                      ? 'bg-rose-50 text-rose-700 border-rose-200/80' 
                      : val >= 0.25 
                        ? 'bg-amber-50 text-amber-700 border-amber-200/80' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
                    
                    return (
                      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 hover:shadow-md transition-all duration-300 min-h-[220px]">
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-col items-start gap-3 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Capital Consumido</span>
                            <span className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border text-left max-w-full", badgeColor)}>
                              Risco: {classification}
                            </span>
                          </div>
                          <div className="text-3xl font-black text-slate-800 tracking-tight">
                            {formatCurrency(consumedAmount)}
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-2">
                            {executiveLayer.capitalErosionRisk?.narrative}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4 pt-3 border-t border-slate-200/40">
                          {executiveLayer.capitalErosionRisk?.rationale}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Card 3: Recomposição Requerida */}
                  {(() => {
                    const val = executiveLayer.capitalRecoveryRequirement?.value ?? 0;
                    const requiredAmount = executiveLayer.capitalRecoveryRequirement?.capitalRecoveryRequired ?? 0;
                    const classification = executiveLayer.capitalRecoveryRequirement?.classification || 'Patrimônio Íntegro';
                    const badgeColor = val > 0 
                      ? 'bg-rose-50 text-rose-700 border-rose-200/80' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
                    
                    return (
                      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 hover:shadow-md transition-all duration-300 min-h-[220px]">
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-col items-start gap-3 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Recomposição Requerida</span>
                            <span className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border text-left max-w-full", badgeColor)}>
                              {classification}
                            </span>
                          </div>
                          <div className="text-3xl font-black text-slate-800 tracking-tight">
                            {formatCurrency(requiredAmount)}
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-2">
                            {executiveLayer.capitalRecoveryRequirement?.narrative}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4 pt-3 border-t border-slate-200/40">
                          {executiveLayer.capitalRecoveryRequirement?.rationale}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Card 4: Horizonte de Recuperação Patrimonial */}
                  {(() => {
                    const formatted = executiveLayer.patrimonialRecoveryHorizon?.formatted || 'Não Estimável';
                    const value = executiveLayer.patrimonialRecoveryHorizon?.value;
                    const classification = executiveLayer.capitalRecoverability?.classification || 'Não Estimável';
                    const badgeColor = classification === 'Alta'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                      : classification === 'Moderada'
                        ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                        : classification === 'Baixa'
                          ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                          : 'bg-rose-50 text-rose-700 border-rose-200/80';
                    
                    return (
                      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 hover:shadow-md transition-all duration-300 min-h-[220px]">
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-col items-start gap-3 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">
                              Horizonte de Recuperação
                            </span>
                            <span className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border text-left max-w-full", badgeColor)}>
                              {classification}
                            </span>
                          </div>
                          <div className="text-3xl font-black text-[#0E1C2C] tracking-tight mb-2">
                            {formatted}
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                            {executiveLayer.capitalRecoverability?.narrative}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4 pt-3 border-t border-slate-200/40 shrink-0">
                          {executiveLayer.patrimonialRecoveryHorizon?.rationale}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* 7. Proteção ao Capital dos Sócios */}
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <h3 className="text-xl font-black text-slate-900">Proteção ao Capital dos Sócios</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {/* Card 1: Dependência dos Sócios */}
                  {(() => {
                    const val = executiveLayer.shareholderDependencyNarrative?.value ?? 1;
                    const classification = executiveLayer.shareholderDependencyNarrative?.classification || 'Baixa';
                    const badgeColor = classification === 'Crítica' || classification === 'Alta'
                      ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                      : classification === 'Moderada'
                        ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
                    
                    const formattedValue = val === Infinity ? 'Insolvência' : `${val.toFixed(2).replace('.', ',')}x`;

                    return (
                      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 hover:shadow-md transition-all duration-300 min-h-[220px]">
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-col items-start gap-3 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Dependência de Aportes</span>
                            <span className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border text-left max-w-full", badgeColor)}>
                              Grau: {classification}
                            </span>
                          </div>
                          <div className="text-3xl font-black text-slate-800 tracking-tight">
                            {formattedValue}
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-2">
                            {executiveLayer.shareholderDependencyNarrative?.narrative}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4 pt-3 border-t border-slate-200/40">
                          {executiveLayer.shareholderDependencyNarrative?.rationale}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Card 2: Proteção do Capital dos Sócios */}
                  <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 hover:shadow-md transition-all duration-300 min-h-[220px]">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-3">Salvaguarda Patrimonial</span>
                      <h4 className="text-base font-black text-slate-800 mb-2">Narrativa de Risco</h4>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        {executiveLayer.governanceInterpretation?.shareholderCapitalProtection}
                      </p>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-4 pt-3 border-t border-slate-200/40">
                      Comunicação de Diretoria Executiva
                    </p>
                  </div>

                  {/* Card 3: Tese de Recuperação Patrimonial */}
                  <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 hover:shadow-md transition-all duration-300 min-h-[220px]">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-3">Diretriz de Recomposição</span>
                      <h4 className="text-base font-black text-[#FF8552] mb-2">Recovery Thesis</h4>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        {executiveLayer.governanceInterpretation?.recoveryThesis}
                      </p>
                    </div>
                    <p className="text-[9px] text-[#0E1C2C] font-bold uppercase tracking-wider mt-4 pt-3 border-t border-slate-200/40">
                      Tese de Governança Fiduciária
                    </p>
                  </div>
                </div>
              </div>

              {/* Aviso de Retenção Compulsória */}
              {executiveLayer.retention?.classification === 'Retenção Compulsória' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-[24px] p-6 flex items-start gap-4 shadow-sm mt-6 animate-executive-fade">
                  <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-700 mb-1">Aviso de Governança Patrimonial: Retenção Compulsória</p>
                    <p className="text-xs font-bold leading-relaxed">
                      Todo lucro futuro deverá ser destinado prioritariamente à absorção dos prejuízos acumulados antes da retomada de distribuições aos sócios.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button 
              onClick={() => setShowTechnicalLayer(!showTechnicalLayer)}
              className="px-6 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-colors"
            >
              {showTechnicalLayer ? 'Ocultar Camada Técnica (Contábil)' : 'Exibir Camada Técnica (Contábil)'}
            </button>
          </div>

          {/* --- 9. CAMADA TÉCNICA (Oculta por padrão) --- */}
          {showTechnicalLayer && (
            <>
              {/* --- 3. GRÁFICOS & MAPA DE GOVERNANÇA (Originalmente 1. Lucro vs Distribuição e 2. Radar) --- */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 mb-2">Lucro vs Distribuição Histórica</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-3xl mb-8">
                    Evolução dos últimos 5 anos de destinação de resultados.
                  </p>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={8} />
                        <YAxis hide />
                        <Tooltip
                          cursor={{ fill: '#f8fafc' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                                  <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">{payload[0]?.payload?.year}</p>
                                  {payload.map((p: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between gap-6 mb-1">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                        <span className="text-[10px] font-bold text-slate-600 uppercase">{p.name}</span>
                                      </div>
                                      <span className="text-xs font-black text-slate-900">{formatCurrency(p.value)}</span>
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="LucroLíquido" name="Lucro Líquido" fill="#3b82f6" radius={[5, 5, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="Dividendos"   name="Dividendos"    fill="#f43f5e" radius={[5, 5, 0, 0]} maxBarSize={40} />
                        <Line type="monotone" dataKey="ReservaLegal" name="Reserva Legal" stroke="#8b5cf6" strokeWidth={3}
                          dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar de Governança Integrado */}
                <div className="bg-slate-900 text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

                  <h3 className="text-xl font-black text-white mb-2 relative z-10">Radar de Governança</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 relative z-10">Dimensões Institucionais de Retenção de Capital.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 relative z-10">
                    {[
                      { label: 'Sustentabilidade Patrimonial', value: cpiStatus !== 'NEUTRO' ? cpiStatus : '—', badge: preservationStyle.label, badgeColor: preservationStyle.color, icon: ShieldCheck },
                      { label: 'Dependência de Capitalização', value: fiduciaryOutput?.capitalSupportRatio === 'NOT_AVAILABLE' ? 'N/A' : fiduciaryOutput?.capitalSupportRatio != null ? `${(fiduciaryOutput.capitalSupportRatio * 100).toFixed(1)}%` : '—', badge: retentionStyle.label, badgeColor: retentionStyle.color, icon: BookMarked },
                      { label: 'Capacidade Distributiva', value: distribution?.distributionRatio != null && distribution.distributionRatio > 0 ? `${(distribution.distributionRatio * 100).toFixed(1)}%` : 'Inexistente', badge: distributionStyle.label, badgeColor: distributionStyle.color, icon: PieChartIcon },
                      { label: 'Integridade Patrimonial', value: preservation ? `${(preservation.equityPreservationRatio * 100).toFixed(1)}%` : '—', badge: preservationStyle.label, badgeColor: preservationStyle.color, icon: ShieldCheck }
                    ].map(({ label, value, badge, badgeColor, icon: Icon }) => {
                      const darkBadgeColor = badgeColor.replace('700', '400').replace('600', '400').replace(/bg-[a-z]+-50/g, 'bg-white/5').replace(/border-[a-z]+-200/g, 'border-white/10').replace(/border-[a-z]+-100/g, 'border-white/10');
                      return (
                      <div key={label} className="p-5 bg-white/[0.03] rounded-2xl border border-white/10 flex flex-col gap-3 hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-md shadow-lg group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                              <Icon size={18} className="text-white/80" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.15em] mb-0.5">{label}</p>
                              <p className={cn('text-xs font-bold px-2 py-0.5 rounded border inline-block mt-1', darkBadgeColor)}>{badge}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xl font-black text-white tracking-tight text-right">{value}</p>
                      </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* --- 4. TABELA DETALHADA --- */}
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                      <FileText size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Detalhamento DLPA — {filterYear}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Demonstração Contábil Importada</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    {dbDataDLPA.length} lançamentos
                  </span>
                </div>
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição da Conta</th>
                        <th className="text-right py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor (R$)</th>
                        <th className="text-right py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Natureza</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {dbDataDLPA.map((row: any, i: number) => {
                        const v = Number(row.val || row.valor || row.value || 0);
                        const isNegative = v < 0;
                        const conta = row.conta || row.category || row.nome || '—';
                        const isTotal = conta.toLowerCase().includes('total') ||
                          conta.toLowerCase().includes('saldo') ||
                          conta.toLowerCase().includes('lucro liquido') ||
                          conta.toLowerCase().includes('resultado');
                        return (
                          <tr key={row.id || i} className={cn('hover:bg-slate-50 transition-colors', isTotal ? 'bg-slate-50/60' : '')}>
                            <td className="py-4 px-8">
                              <span className={cn('block', isTotal ? 'text-slate-900 font-black text-sm' : 'text-slate-600 font-medium pl-4 text-sm')}>
                                {conta}
                              </span>
                            </td>
                            <td className={cn('py-4 px-8 text-right font-mono font-bold text-sm',
                              isNegative ? 'text-rose-600' : 'text-slate-700',
                              isTotal && 'text-slate-900 font-black')}>
                              {formatCurrency(v)}
                            </td>
                            <td className="py-4 px-8 text-right">
                              <span className={cn('text-[9px] font-black uppercase px-3 py-1 rounded-full border',
                                isNegative ? 'bg-rose-50 text-rose-600 border-rose-200' : v > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                              )}>
                                {isNegative ? 'Redução' : v > 0 ? 'Adição' : 'Neutro'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {dlpaMetrics && (
                      <tfoot>
                        <tr className="bg-slate-900 text-white rounded-b-3xl overflow-hidden">
                          <td className="py-6 px-8 text-sm font-black uppercase tracking-widest rounded-bl-[32px]">
                            {lucrosPrejuizosFinal < 0 ? "Prejuízo Acumulado" : "Saldo de Lucros Acumulados"}
                          </td>
                          <td className={cn('py-6 px-8 text-right font-mono font-black text-lg',
                            lucrosPrejuizosFinal >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                            {formatCurrency(lucrosPrejuizosFinal)}
                          </td>
                          <td className="py-6 px-8 text-right rounded-br-[32px]">
                            <span className="text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20">
                              Calculado
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}


      {/* Modals */}
      {showImportModal && (
        <ImportFinancialModal
          type="DLPA"
          clientId={selectedClient}
          year={filterYear}
          clients={clients || []}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => { setShowImportModal(false); refetchDLPA(); showToast('success', 'DLPA importado com sucesso!'); }}
        />
      )}
      {showManualModal && (
        <ManualFinancialModal
          type="DLPA"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => setShowManualModal(false)}
          onSuccess={() => { setShowManualModal(false); refetchDLPA(); showToast('success', 'DLPA lançado com sucesso!'); }}
        />
      )}
    </div>
  );
}
