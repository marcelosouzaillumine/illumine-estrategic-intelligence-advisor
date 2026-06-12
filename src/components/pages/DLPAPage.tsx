import { ExecutiveTable, ExecutiveTableHeader, ExecutiveTableBody, ExecutiveTableRow, ExecutiveTableHead, ExecutiveTableCell } from "../ui/executive-table";

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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Line, 
  ComposedChart,
  ResponsiveContainer 
} from 'recharts';

import { ExecutiveHistoricalEvolutionCard } from '../ui/executive-historical-evolution-card';
import { 
  ExecutiveComposedChart, ExecutiveBar, ExecutiveLine, ExecutiveChartGrid, ExecutiveChartXAxis, ExecutiveChartYAxis, ExecutiveChartTooltip 
} from '../ui/executive-chart';
import { ExecutiveChartSemanticPalette } from '../../core/theme/ExecutiveChartSemanticPalette';
import { HistoricalInsightEngine } from '../../services/FiduciaryRuntimeAdapter';
import type { HistoricalSeries } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveStrategicSemanticCards } from '../ui/executive-strategic-semantic-cards';
import { ExecutiveDecisionSynthesisEngine } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveNarrative } from '../ui/executive-narrative';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveTechnicalMetricCard } from '../ui/executive-technical-metric-card';
import { ExecutiveScore } from '../ui/executive-score';

import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { PageHeader, KpiValue, StatusBadge } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { DLPAActionToolbar } from './dlpa/DLPAActionToolbar';
import { DLPADataSourceStatus } from './dlpa/DLPADataSourceStatus';
import { DLPAYearFilter } from './dlpa/DLPAYearFilter';
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

export interface NormalizedDLPARow {
  id: string | number;
  description: string;
  value: number;
  isTotal: boolean;
  nature: 'positive' | 'negative' | 'neutral';
}

export function normalizeDLPARow(row: any, index: number): NormalizedDLPARow {
  const v = Number(row.val || row.valor || row.value || 0);
  const desc = String(row.conta || row.category || row.nome || '—');
  const lowerDesc = desc.toLowerCase();
  const isTotal = lowerDesc.includes('total') ||
    lowerDesc.includes('saldo') ||
    lowerDesc.includes('lucro liquido') ||
    lowerDesc.includes('resultado');
  
  return {
    id: row.id || index,
    description: desc,
    value: v,
    isTotal,
    nature: v < 0 ? 'negative' : v > 0 ? 'positive' : 'neutral'
  };
}


function resolveDisplayLabel(semanticSource: string, resolvedValue: string | undefined, rawValue: string, fallback: string) {
  if (semanticSource === 'ELSA' && resolvedValue) return resolvedValue;
  return rawValue ?? fallback;
}

function getRetentionLabel(status: string) {
  const map: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
    'ALTA_RETENÇÃO':              { label: 'Alta Retenção',             color: 'text-emerald-700', bg: 'bg-success-soft',  border: 'border-emerald-200', icon: ArrowUpRight },
    'RETENÇÃO_MODERADA':          { label: 'Retenção Moderada',         color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200',    icon: TrendingUp },
    'DISTRIBUIÇÃO_EXCESSIVA':     { label: 'Distribuição Excessiva',    color: 'text-amber-700',   bg: 'bg-warning-soft',    border: 'border-amber-200',   icon: TrendingDown },
    'DESCAPITALIZAÇÃO_DELIBERADA':{ label: 'Descapitalização Deliberada', color: 'text-rose-700', bg: 'bg-critical-soft',     border: 'border-rose-200',    icon: ShieldAlert },
    'NÃO_APLICÁVEL_SEM_LUCRO':   { label: 'N/A — Sem Lucro',           color: 'text-muted-foreground',   bg: 'bg-surface-container/30',    border: 'border-border',   icon: Minus },
    'NÃO_APLICÁVEL':              { label: 'N/A',                       color: 'text-muted-foreground',   bg: 'bg-surface-container/30',    border: 'border-border',   icon: Minus },
    'AUSÊNCIA_DE_CAPACIDADE_DISTRIBUTIVA': { label: 'Sem Capacidade Distributiva', color: 'text-muted-foreground', bg: 'bg-surface-container/30', border: 'border-border', icon: Minus },
    'RETENÇÃO_COMPULSÓRIA_POR_PREJUÍZO':   { label: 'Retenção por Prejuízo', color: 'text-rose-700', bg: 'bg-critical-soft', border: 'border-rose-200', icon: ShieldAlert },
    
    // New fiduciaries
    'STRATEGIC_RETENTION':        { label: 'Retenção Estratégica',      color: 'text-emerald-700', bg: 'bg-success-soft',  border: 'border-emerald-200', icon: ArrowUpRight },
    'FORCED_RETENTION':           { label: 'Retenção Compulsória',      color: 'text-muted-foreground',   bg: 'bg-surface-container/30',    border: 'border-border',   icon: Minus },
    'EMERGENCY_CAPITAL_PRESERVATION': { label: 'Preservação Emergencial', color: 'text-amber-700', bg: 'bg-warning-soft',    border: 'border-amber-200',   icon: ShieldAlert },
    'SURVIVAL_STAGE_CAPITAL_STRUCTURE': { label: 'Estrutura de Sobrevivência', color: 'text-rose-700', bg: 'bg-critical-soft', border: 'border-rose-200', icon: ShieldAlert },
    'UNSUSTAINABLE_PRESERVATION': { label: 'Preservação Insustentável', color: 'text-amber-700',   bg: 'bg-warning-soft',    border: 'border-amber-200',   icon: TrendingDown },
    'GOVERNANCE_RETENTION':       { label: 'Retenção de Governança',    color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200',    icon: TrendingUp },
    'RETENTION_NOT_ELIGIBLE':     { label: 'Inelegível para Retenção',  color: 'text-muted-foreground',   bg: 'bg-surface-container/30',    border: 'border-border',   icon: Minus },
  };
  return map[status] || map['NÃO_APLICÁVEL'];
}

function getDistributionLabel(pressure: string) {
  const map: Record<string, { label: string; color: string; bg: string; border: string }> = {
    'BAIXA':                   { label: 'Conservadora',              color: 'text-emerald-700', bg: 'bg-success-soft', border: 'border-emerald-200' },
    'MODERADA':                { label: 'Equilibrada',               color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
    'ALTA':                    { label: 'Agressiva',                  color: 'text-amber-700',   bg: 'bg-warning-soft',   border: 'border-amber-200' },
    'CRÍTICA':                 { label: 'Predatória',                 color: 'text-rose-700',    bg: 'bg-critical-soft',    border: 'border-rose-200' },
    'NÃO_APLICÁVEL_SEM_LUCRO': { label: 'Sem distribuição no período', color: 'text-muted-foreground',  bg: 'bg-surface-container/30',   border: 'border-border' },
    'NÃO_APLICÁVEL':           { label: 'N/A',                        color: 'text-muted-foreground',   bg: 'bg-surface-container/30',   border: 'border-border' },
  };
  return map[pressure] || map['NÃO_APLICÁVEL'];
}

function getPreservationLabel(status: string) {
  const map: Record<string, { label: string; color: string; bg: string; border: string }> = {
    'PRESERVAÇÃO_SAUDÁVEL':   { label: 'Preservação Saudável',       color: 'text-emerald-700', bg: 'bg-success-soft', border: 'border-emerald-200' },
    'EROSÃO_MODERADA':        { label: 'Erosão Moderada',             color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
    'EROSÃO_RELEVANTE':       { label: 'Erosão Relevante',            color: 'text-amber-700',   bg: 'bg-warning-soft',   border: 'border-amber-200' },
    'FRAGILIDADE_PATRIMONIAL':{ label: 'Fragilidade Patrimonial',     color: 'text-rose-700',    bg: 'bg-critical-soft',    border: 'border-rose-200' },
    'NEUTRO':                 { label: 'Patrimônio Preservado',       color: 'text-muted-foreground',   bg: 'bg-surface-container/30',   border: 'border-border' },
    'DEPENDÊNCIA_DE_CAPITALIZAÇÃO':{ label: 'Dependência de Capital', color: 'text-rose-700', bg: 'bg-critical-soft', border: 'border-rose-200' },
    'SUSTENTAÇÃO_PATRIMONIAL_EXTERNA':{ label: 'Sustentação Externa', color: 'text-amber-700', bg: 'bg-warning-soft', border: 'border-amber-200' },
    'EROSÃO_PATRIMONIAL_OPERACIONAL':{ label: 'Erosão Operacional', color: 'text-rose-700', bg: 'bg-critical-soft', border: 'border-rose-200' },
    // legado
    'PRESERVADO':             { label: 'Preservado',                  color: 'text-emerald-700', bg: 'bg-success-soft', border: 'border-emerald-200' },
    'DRENADO':                { label: 'Erosão Relevante',             color: 'text-amber-700',   bg: 'bg-warning-soft',   border: 'border-amber-200' },
    // fiduciários novos
    'PRESERVED':              { label: 'Preservado',                  color: 'text-emerald-700', bg: 'bg-success-soft', border: 'border-emerald-200' },
    'PRESSURED':              { label: 'Pressionado',                 color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
    'SEVERELY_ERODED':        { label: 'Erosão Severa',               color: 'text-amber-700',   bg: 'bg-warning-soft',   border: 'border-amber-200' },
    'CAPITAL_COLLAPSE_RISK':  { label: 'Risco de Colapso',            color: 'text-rose-700',    bg: 'bg-critical-soft',    border: 'border-rose-200' },
    // CPI classifications
    'CAPITAL_EXPANSION':      { label: 'Expansão de Capital',         color: 'text-emerald-700', bg: 'bg-success-soft', border: 'border-emerald-200' },
    'CAPITAL_PRESERVED':      { label: 'Capital Preservado',          color: 'text-emerald-700', bg: 'bg-success-soft', border: 'border-emerald-200' },
    'MODERATE_EROSION':       { label: 'Erosão Moderada',             color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
    'HIGH_EROSION':           { label: 'High Capital Erosion',        color: 'text-amber-700',   bg: 'bg-warning-soft',   border: 'border-amber-200' },
    'CRITICAL_EROSION':       { label: 'Erosão Crítica',              color: 'text-rose-700',    bg: 'bg-critical-soft',    border: 'border-rose-200' },
    'CAPITAL_COLLAPSE':       { label: 'Colapso de Capital',          color: 'text-rose-700',    bg: 'bg-critical-soft',    border: 'border-rose-200' },
    'Capitalização em Consolidação': { label: 'Capitalização em Consolidação', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', border: 'border-blue-200' },
    'Estrutura de Capital em Formação': { label: 'Estrutura de Capital em Formação', color: 'text-muted-foreground', bg: 'bg-surface-container/30 border-border', border: 'border-border' },
    'Estrutura Patrimonial em Formação': { label: 'Estrutura Patrimonial em Formação', color: 'text-muted-foreground', bg: 'bg-surface-container/30 border-border', border: 'border-border' }
  };
  return map[status] || map['NEUTRO'];
}

function getMaturityLabel(maturity: string) {
  const map: Record<string, { label: string; color: string; bg: string; border: string; score: number }> = {
    'MATURA':           { label: 'Governança Matura',           color: 'text-emerald-700', bg: 'bg-success-soft', border: 'border-emerald-200', score: 90 },
    'EM_DESENVOLVIMENTO':{ label: 'Em Desenvolvimento',         color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    score: 65 },
    'FRAGILIZADA':      { label: 'Governança Fragilizada',      color: 'text-amber-700',   bg: 'bg-warning-soft',   border: 'border-amber-200',   score: 38 },
    'EM_ESTRUTURAÇÃO':  { label: 'Em Estruturação',             color: 'text-muted-foreground',   bg: 'bg-surface-container/30',   border: 'border-border',   score: 28 },
    'FRÁGIL':           { label: 'Governança Frágil',           color: 'text-amber-700',   bg: 'bg-warning-soft',   border: 'border-amber-200',   score: 40 },
    'DESTRUTIVA':       { label: 'Governança Destrutiva',       color: 'text-rose-700',    bg: 'bg-critical-soft',    border: 'border-rose-200',    score: 10 },
    
    // Modern CGE statuses mapping
    'Governança Estruturada': { label: 'Governança Estruturada', color: 'text-emerald-700', bg: 'bg-success-soft border-emerald-100', border: 'border-emerald-200', score: 90 },
    'Governança Estruturada com Risco de Capital': { label: 'Governança Estruturada com Risco de Capital', color: 'text-emerald-700', bg: 'bg-success-soft border-emerald-100', border: 'border-emerald-200', score: 85 },
    'Governança em Consolidação': { label: 'Governança em Consolidação', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', border: 'border-blue-200', score: 70 },
    'Governança Fragilizada': { label: 'Governança Fragilizada', color: 'text-amber-700', bg: 'bg-warning-soft border-amber-100', border: 'border-amber-200', score: 50 },
    'Governança Crítica': { label: 'Governança Crítica', color: 'text-rose-700', bg: 'bg-critical-soft border-rose-100', border: 'border-rose-200', score: 30 },
    'Governança em Estruturação': { label: 'Governança em Estruturação', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', border: 'border-blue-200', score: 50 }
  };
  return map[maturity] || { label: maturity, color: 'text-muted-foreground', bg: 'bg-surface-container/30 border-border', border: 'border-border', score: 50 };
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

    const uniqueYears = Array.from(new Set((allHistoryData as any[]).map((d: any) => Number(d.year)).filter(Boolean))) as number[];
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
  const hasData = dbDataDLPA.length > 0 && !!dlpaMetrics && (dlpaMetrics.lucroLiquido !== 0 || dlpaMetrics.dividendos !== 0 || dlpaMetrics.plFim !== 0);
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

  const dlpaPayload = useMemo(() => {
    if (!executiveLayer) return null;
    return ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload({
      analysisYear: selectedYear,
      generatedAt: new Date().toISOString(),
      moduleContext: 'DLPA',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: 'HEALTHY',
      mathematicalClassification: '',
      globalScore: 75,
      primaryIndicators: {},
      technicalDrivers: {
        lucroLiquido: dlpaMetrics?.lucroLiquido || 0,
        dividendosPagos: dlpaMetrics?.dividendos || 0,
        payoutRatio: (dlpaMetrics?.lucroLiquido || 0) > 0 ? (dlpaMetrics?.dividendos || 0) / (dlpaMetrics?.lucroLiquido || 1) : 0,
        lucroPrejuizoPeriodo: dlpaMetrics?.lucroLiquido || 0,
        lucrosPrejuizosAcumulados: (dlpaMetrics?.lucrosPrejuizosInicio || 0) + (dlpaMetrics?.lucroLiquido || 0),
        capitalSocial: dlpaMetrics?.capitalSocial || 0,
        patrimonioLiquido: dlpaMetrics?.plFim || 0,
        capacidadeDistribuicao: (dlpaMetrics?.lucroLiquido || 0) - (dlpaMetrics?.dividendos || 0)
      },
      contextualAlerts: []
    });
  }, [executiveLayer, dlpaMetrics, selectedYear]);


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
          <div className="bg-card rounded-2xl p-8 shadow-2xl" style={{ width: '100%', maxWidth: '24rem' }}>
            <ShieldAlert size={32} className="text-rose-500 mb-4" />
            <h3 className="text-lg font-black text-primary mb-2">Confirmar Exclusão</h3>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              Todos os registros DLPA de <strong>{filterYear}</strong> serão excluídos permanentemente.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-surface-container/30">Cancelar</button>
              <button onClick={handleDeleteAll} disabled={deleting} className="flex-1 px-4 py-2 bg-critical-soft0 text-white rounded-xl text-sm font-bold hover:bg-rose-600 disabled:opacity-60">
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
        <div className="bg-foreground border border-border p-4 rounded-xl mb-6 flex flex-col gap-2">
          <h4 className="text-xs font-black uppercase text-white mb-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" /> Auditoria de Propagação ELSA (Painel Técnico)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] uppercase font-mono text-muted-foreground">
            <div>
              <span className="block text-muted-foreground mb-1">Semantic Source:</span>
              <strong className={(capitalGov as any).lifecycleAudit.semanticSource === 'ELSA' ? 'text-emerald-400' : 'text-amber-400'}>
                {(capitalGov as any).lifecycleAudit.semanticSource}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Raw Governance Status:</span>
              <strong className="text-amber-400">
                {behavior?.governanceMaturity || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Resolved Governance:</span>
              <strong className="text-emerald-400">
                {(capitalGov as any)?.resolvedGovernanceStatus || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Raw Capital Status:</span>
              <strong className="text-amber-400">
                {preservation?.preservationStatus || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Resolved Capital:</span>
              <strong className="text-emerald-400">
                {(capitalGov as any)?.resolvedCapitalStatus || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Fallback Activated:</span>
              <strong className={(capitalGov as any).lifecycleAudit.fallbackActivated ? 'text-rose-400' : 'text-emerald-400'}>
                {(capitalGov as any).lifecycleAudit.fallbackActivated ? 'YES' : 'NO'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Fallback Reason:</span>
              <strong className="text-rose-400">
                {(capitalGov as any).lifecycleAudit.fallbackReason || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">UI Rendering Match:</span>
              <strong className={alignedMaturity === (capitalGov as any)?.resolvedGovernanceStatus ? 'text-emerald-400' : 'text-rose-400'}>
                {alignedMaturity === (capitalGov as any)?.resolvedGovernanceStatus ? 'VALID' : 'LEGACY_FIELD_RENDERED'}
              </strong>
            </div>
          </div>
          {renderingViolations.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            {hasData && (
              <StatusBadge status="Ativo" />
            )}
            <DLPADataSourceStatus hasRealData={hasData} loading={loadingDLPA} />
          </div>
          <DLPAYearFilter filterYear={filterYear} onChangeYear={setFilterYear} />
        </div>

        {hasData && (
          <DLPAActionToolbar 
            onLaunchData={() => setShowManualModal(true)} 
            onImport={() => setShowImportModal(true)} 
            onDelete={() => setShowDeleteConfirm(true)} 
          />
        )}
      </div>

      {!loading && !hasData && (
        <div className="flex flex-col gap-6 w-full mb-12">
          <ExecutiveEmptyState
            icon={<BookOpen />}
            title="Nenhum dado disponível para este exercício"
            description={`Importe ou registre manualmente a Demonstração de Lucros e Prejuízos Acumulados para iniciar a análise institucional.`}
            actionLabel="Lançar Dados"
            onAction={() => setShowManualModal(true)}
            secondaryActionLabel="Importar Arquivo"
            onSecondaryAction={() => setShowImportModal(true)}
          />
        </div>
      )}

      {hasData && (
        <div className="space-y-6 mb-12">
          {(capitalGov as any)?.error && (
            <ExecutiveSurface variant="critical" padding="xl" radius="xl" className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert size={28} />
              </div>
              <h3 className="text-lg font-black text-primary mb-2">Falha na Renderização Executiva</h3>
              <p className="text-sm text-secondary max-w-lg mb-4">
                Houve um erro ao processar a governança de capital.
              </p>
              <div className="bg-card border border-border rounded-xl p-4 text-xs font-mono text-rose-600 w-full max-w-2xl text-left overflow-auto">
                {(capitalGov as any).error}
              </div>
            </ExecutiveSurface>
          )}
          
          {/* --- 2. EXECUTIVE LAYER UI --- */}
          {executiveLayer && (
            <div className="space-y-6">
              
              {/* Capital Preservation Score (CPS) Header Block */}
              {executiveLayer.capitalPreservationScore && (
                <ExecutiveSurface padding="xl" radius="xl" className="mb-6 border-border">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Title & Weights */}
                    <div className="lg:col-span-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-1">
                        <ShieldCheck size={24} className="text-primary" />
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">Capital Preservation Score (CPS)</h3>
                      </div>
                      <p className="text-foreground/70 text-sm font-medium mb-6">Avalia a capacidade da organização de preservar e fortalecer o capital investido pelos sócios.</p>
                    </div>

                    {/* Right: Score Panel */}
                    <div className="lg:col-span-4 w-full h-full flex flex-col justify-center">
                      {(() => {
                        const cpsValue = executiveLayer.capitalPreservationScore.value || 0;
                        let tone: 'success' | 'info' | 'warning' | 'critical' | 'neutral' = 'success';
                        if (cpsValue < 40) tone = 'critical';
                        else if (cpsValue < 70) tone = 'warning';
                        else if (cpsValue < 90) tone = 'info';
                        
                        return (
                          <ExecutiveMetricCard
                            label="Score Geral"
                            value={<span className="text-4xl font-black">{cpsValue.toFixed(0)}<span className="text-xl text-muted-foreground font-semibold">/100</span></span>}
                            statusBadge={<span>{executiveLayer.capitalPreservationScore.classification || "Capital Erodido"}</span>}
                            tone={tone}
                            description={
                              <span className="text-sm font-medium text-foreground/90">
                                Preservação Geral
                              </span>
                            }
                            className="h-full justify-center"
                          />
                        );
                      })()}
                    </div>
                  </div>
                </ExecutiveSurface>
              )}

              {dlpaPayload && (
                <div className="mb-12">
                  <ExecutiveStrategicSemanticCards payload={dlpaPayload} selectedYear={selectedYear} />
                </div>
              )}

              {/* 3. Inteligência de Preservação de Capital */}
              <ExecutiveSurface padding="xl" radius="xl" className="border-border">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp size={20} className="text-foreground" />
                  <h3 className="text-xl font-black text-primary">Inteligência e Proteção ao Capital dos Sócios</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  {/* Card 1: Capital Remanescente */}
                  {(() => {
                    const val = executiveLayer.capitalPreservationStatus?.value ?? 0;
                    const classification = executiveLayer.capitalPreservationStatus?.classification || 'Capital Erodido';
                    const tone = val >= 0.90 ? 'success' : val >= 0.75 ? 'info' : val >= 0.50 ? 'warning' : 'critical';
                    return (
                      <ExecutiveMetricCard
                        label="Capital Remanescente"
                        value={`${(val * 100).toFixed(1).replace('.', ',')}%`}
                        statusBadge={<span>{classification}</span>}
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalPreservationStatus?.narrative}</span>}
                      />
                    );
                  })()}

                  {/* Card 2: Capital Consumido */}
                  {(() => {
                    const val = executiveLayer.capitalErosionRisk?.value ?? 0;
                    const consumedAmount = executiveLayer.capitalErosionRisk?.capitalConsumedAmount ?? 0;
                    const classification = executiveLayer.capitalErosionRisk?.classification || 'Baixo';
                    const tone = val >= 0.50 ? 'critical' : val >= 0.25 ? 'warning' : 'success';
                    return (
                      <ExecutiveMetricCard
                        label="Capital Consumido"
                        value={formatCurrency(consumedAmount)}
                        statusBadge={<span>Risco: {classification}</span>}
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalErosionRisk?.narrative}</span>}
                      />
                    );
                  })()}

                  {/* Card 3: Recomposição Requerida */}
                  {(() => {
                    const val = executiveLayer.capitalRecoveryRequirement?.value ?? 0;
                    const requiredAmount = executiveLayer.capitalRecoveryRequirement?.capitalRecoveryRequired ?? 0;
                    const classification = executiveLayer.capitalRecoveryRequirement?.classification || 'Patrimônio Íntegro';
                    const tone = val > 0 ? 'critical' : 'success';
                    return (
                      <ExecutiveMetricCard
                        label="Recomposição Requerida"
                        value={formatCurrency(requiredAmount)}
                        statusBadge={<span>{classification}</span>}
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalRecoveryRequirement?.narrative}</span>}
                      />
                    );
                  })()}

                  {/* Card 4: Horizonte de Recuperação Patrimonial */}
                  {(() => {
                    const formatted = executiveLayer.patrimonialRecoveryHorizon?.formatted || 'Não Estimável';
                    const classification = executiveLayer.capitalRecoverability?.classification || 'Não Estimável';
                    const tone = classification === 'Alta' ? 'success' : classification === 'Moderada' ? 'info' : classification === 'Baixa' ? 'warning' : 'critical';
                    return (
                      <ExecutiveMetricCard
                        label="Horizonte de Recuperação"
                        value={formatted}
                        statusBadge={<span>{classification}</span>}
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalRecoverability?.narrative}</span>}
                      />
                    );
                  })()}

                  {/* Card 5: Dependência dos Sócios (Moved from Proteção ao Capital) */}
                  {(() => {
                    const val = executiveLayer.shareholderDependencyNarrative?.value ?? 1;
                    const classification = executiveLayer.shareholderDependencyNarrative?.classification || 'Baixa';
                    const tone = classification === 'Crítica' || classification === 'Alta' ? 'critical' : classification === 'Moderada' ? 'warning' : 'success';
                    const formattedValue = val === Infinity ? 'Insolvência' : `${val.toFixed(2).replace('.', ',')}x`;
                    return (
                      <ExecutiveMetricCard
                        label="Dependência de Aportes"
                        value={formattedValue}
                        statusBadge={<span>Grau: {classification}</span>}
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.shareholderDependencyNarrative?.narrative}</span>}
                      />
                    );
                  })()}
                </div>

                {/* --- Narrativas Consolidadas --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border">
                  <div className="flex flex-col gap-4">
                    {/* Rationale Aggregation from Inteligência */}
                    <ExecutiveNarrative title="Fundamentação de Preservação" variant="summary">
                      {executiveLayer.capitalPreservationStatus?.rationale && <p className="text-sm text-foreground/80 mb-2">{executiveLayer.capitalPreservationStatus?.rationale}</p>}
                      {executiveLayer.capitalErosionRisk?.rationale && <p className="text-sm text-foreground/80 mb-2">{executiveLayer.capitalErosionRisk?.rationale}</p>}
                      {executiveLayer.capitalRecoveryRequirement?.rationale && <p className="text-sm text-foreground/80">{executiveLayer.capitalRecoveryRequirement?.rationale}</p>}
                    </ExecutiveNarrative>

                    {executiveLayer.shareholderDependencyNarrative?.rationale && (
                      <ExecutiveNarrative title="Salvaguarda Patrimonial" variant="insight">
                        {executiveLayer.governanceInterpretation?.shareholderCapitalProtection && <p className="text-sm text-foreground/80 mb-2">{executiveLayer.governanceInterpretation?.shareholderCapitalProtection}</p>}
                        <p className="text-sm text-foreground/80">{executiveLayer.shareholderDependencyNarrative?.rationale}</p>
                      </ExecutiveNarrative>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    {executiveLayer.governanceInterpretation?.recoveryThesis && (
                      <ExecutiveNarrative title="Tese de Recuperação Patrimonial" variant="insight">
                        <p className="text-sm text-foreground/80 mb-2">{executiveLayer.governanceInterpretation?.recoveryThesis}</p>
                        {executiveLayer.patrimonialRecoveryHorizon?.rationale && <p className="text-sm text-foreground/80">{executiveLayer.patrimonialRecoveryHorizon?.rationale}</p>}
                      </ExecutiveNarrative>
                    )}

                    {executiveLayer.retention?.classification === 'Retenção Compulsória' && (
                      <div className="animate-executive-fade p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 rounded-2xl flex items-start gap-4 shadow-sm mt-2">
                        <ShieldAlert className="text-amber-500 shrink-0" size={24} />
                        <div>
                          <h4 className="text-amber-700 dark:text-amber-500 font-bold mb-1">Aviso de Governança Patrimonial: Retenção Compulsória</h4>
                          <p className="text-sm text-amber-600/90 dark:text-amber-500/90 leading-relaxed">
                            Todo lucro futuro deverá ser destinado prioritariamente à absorção dos prejuízos acumulados antes da retomada de distribuições aos sócios.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ExecutiveSurface>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button 
              onClick={() => setShowTechnicalLayer(!showTechnicalLayer)}
              className="px-6 py-2 rounded-full border border-border text-xs font-bold text-muted-foreground uppercase tracking-widest hover:bg-surface-container/30 transition-colors"
            >
              {showTechnicalLayer ? 'Ocultar Camada Técnica (Contábil)' : 'Exibir Camada Técnica (Contábil)'}
            </button>
          </div>

          {/* --- 9. CAMADA TÉCNICA (Oculta por padrão) --- */}
          {showTechnicalLayer && (
            <>
              {/* --- 3. GRÁFICOS & MAPA DE GOVERNANÇA (Originalmente 1. Lucro vs Distribuição e 2. Radar) --- */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                
                <ExecutiveHistoricalEvolutionCard 
                  title="Lucro vs Distribuição Histórica"
                  description="Evolução dos últimos 5 anos de destinação de resultados."
                  insight={HistoricalInsightEngine.generateExecutiveNarrative(
                    { module: 'DLPA', globalFiduciaryStatus: 'NEUTRAL' },
                    { profit: { metricName: 'Lucro', data: chartData.map((d: any) => ({ year: d.year, value: d.LucroLíquido })) } }
                  )}
                  legendItems={[
                    { label: 'Lucro Líquido', colorKey: 'profit' },
                    { label: 'Dividendos', colorKey: 'liability' },
                    { label: 'Reserva Legal', colorKey: 'primary' }
                  ]}
                >
                  <div style={{ height: 300 }} className="w-full mt-4 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <ExecutiveComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <ExecutiveChartGrid vertical={false} />
                        <ExecutiveChartXAxis dataKey="year" dy={8} />
                        <ExecutiveChartTooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          labelStyle={{ color: 'var(--color-muted-foreground)', fontWeight: 'bold' }}
                        />
                        <ExecutiveBar dataKey="LucroLíquido" name="Lucro Líquido" fill={ExecutiveChartSemanticPalette.profit} radius={[5, 5, 0, 0]} maxBarSize={40} />
                        <ExecutiveBar dataKey="Dividendos"   name="Dividendos"    fill={ExecutiveChartSemanticPalette.liability} radius={[5, 5, 0, 0]} maxBarSize={40} />
                        <ExecutiveLine type="monotone" dataKey="ReservaLegal" name="Reserva Legal" stroke={ExecutiveChartSemanticPalette.primary} strokeWidth={3}
                          dot={{ r: 4, fill: ExecutiveChartSemanticPalette.primary, strokeWidth: 2, stroke: '#fff' }} />
                      </ExecutiveComposedChart>
                    </ResponsiveContainer>
                  </div>
                </ExecutiveHistoricalEvolutionCard>

                {/* Radar de Governança Integrado */}
                <ExecutiveSurface padding="xl" radius="xl" className="bg-foreground text-white shadow-2xl relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

                  <h3 className="text-xl font-black text-white mb-2 relative z-10">Radar de Governança</h3>
                  <p className="text-sm text-white/70 font-medium leading-relaxed mb-8 relative z-10">Dimensões Institucionais de Retenção de Capital.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 relative z-10">
                    {[
                      { label: 'Sustentabilidade Patrimonial', value: cpiStatus !== 'NEUTRO' ? cpiStatus : '—', badge: preservationStyle.label, badgeColor: preservationStyle.color },
                      { label: 'Dependência de Capitalização', value: fiduciaryOutput?.capitalSupportRatio === 'NOT_AVAILABLE' ? 'N/A' : fiduciaryOutput?.capitalSupportRatio != null ? `${(fiduciaryOutput.capitalSupportRatio * 100).toFixed(1)}%` : '—', badge: retentionStyle.label, badgeColor: retentionStyle.color },
                      { label: 'Capacidade Distributiva', value: distribution?.distributionRatio != null && distribution.distributionRatio > 0 ? `${(distribution.distributionRatio * 100).toFixed(1)}%` : 'Inexistente', badge: distributionStyle.label, badgeColor: distributionStyle.color },
                      { label: 'Integridade Patrimonial', value: preservation ? `${(preservation.equityPreservationRatio * 100).toFixed(1)}%` : '—', badge: preservationStyle.label, badgeColor: preservationStyle.color }
                    ].map(({ label, value, badge, badgeColor }) => {
                      const tone = badgeColor.includes('emerald') || badgeColor.includes('success') ? 'success' :
                                   badgeColor.includes('amber') || badgeColor.includes('warning') ? 'warning' :
                                   badgeColor.includes('rose') || badgeColor.includes('critical') ? 'critical' :
                                   badgeColor.includes('blue') || badgeColor.includes('info') ? 'info' : 'neutral';
                      
                      return (
                        <div key={label} className="[&_*]:!text-white [&_.bg-surface-container\\/50]:!bg-white/10 [&_.border-border]:!border-white/10">
                          <ExecutiveTechnicalMetricCard
                            label={label}
                            value={value}
                            statusLabel={badge}
                            statusTone={tone as any}
                            className="bg-card/5 border-white/10 backdrop-blur-md hover:bg-card/10 transition-colors"
                          />
                        </div>
                      );
                    })}
                  </div>
                </ExecutiveSurface>

              </div>

              {/* --- 4. TABELA DETALHADA --- */}
              <ExecutiveSurface padding="none" radius="xl" className="overflow-hidden border-border">
                <div className="p-6 md:px-8 border-b border-border flex items-center justify-between bg-surface-container/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-border">
                      <FileText size={18} className="text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground uppercase tracking-widest">Detalhamento DLPA — {filterYear}</h4>
                      <p className="text-muted-foreground text-xs mt-1">Demonstração Contábil Importada</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-surface-container text-foreground border border-border">
                    {dbDataDLPA.length} lançamentos
                  </span>
                </div>
                <div className="p-2">
                  <ExecutiveTable className="w-full text-sm">
                    <ExecutiveTableHeader>
                      <ExecutiveTableRow className="border-b border-border">
                        <ExecutiveTableHead className="text-left py-5 px-8 text-xs font-bold text-muted-foreground uppercase tracking-widest">Descrição da Conta</ExecutiveTableHead>
                        <ExecutiveTableHead className="text-right py-5 px-8 text-xs font-bold text-muted-foreground uppercase tracking-widest">Valor (R$)</ExecutiveTableHead>
                        <ExecutiveTableHead className="text-right py-5 px-8 text-xs font-bold text-muted-foreground uppercase tracking-widest">Natureza</ExecutiveTableHead>
                      </ExecutiveTableRow>
                    </ExecutiveTableHeader>
                    <ExecutiveTableBody>
                      {dbDataDLPA.map((rawRow: any, i: number) => {
                        const row = normalizeDLPARow(rawRow, i);
                        return (
                          <ExecutiveTableRow 
                            key={row.id} 
                            className={cn('transition-colors', row.isTotal ? 'bg-surface-container/30/60' : '')}
                          >
                            <ExecutiveTableCell className="py-4 px-8">
                              <span className={cn('block', row.isTotal ? 'text-muted-foreground font-black text-sm' : 'text-muted-foreground font-medium pl-4 text-sm')}>
                                {row.description}
                              </span>
                            </ExecutiveTableCell>
                            <ExecutiveTableCell className={cn('py-4 px-8 text-right font-mono font-bold text-sm',
                              row.nature === 'negative' ? 'text-rose-600' : 'text-muted-foreground',
                              row.isTotal && 'text-muted-foreground font-black')}>
                              {formatCurrency(row.value)}
                            </ExecutiveTableCell>
                            <ExecutiveTableCell className="py-4 px-8 text-right">
                              <span className={cn('text-[10px] font-bold uppercase px-3 py-1 rounded-full border inline-block w-[72px] text-center',
                                row.nature === 'negative' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                                row.nature === 'positive' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                                'bg-surface-container/30 text-muted-foreground border-border'
                              )}>
                                {row.nature === 'negative' ? 'Redução' : row.nature === 'positive' ? 'Adição' : 'Neutro'}
                              </span>
                            </ExecutiveTableCell>
                          </ExecutiveTableRow>
                        );
                      })}
                      {dlpaMetrics && (
                        <ExecutiveTableRow className="bg-surface-high/30 hover:bg-surface-high/50 transition-colors">
                          <ExecutiveTableCell className="py-6 px-8 text-sm font-bold uppercase tracking-widest">
                            {lucrosPrejuizosFinal < 0 ? "Prejuízo Acumulado" : "Saldo de Lucros Acumulados"}
                          </ExecutiveTableCell>
                          <ExecutiveTableCell className={cn('py-6 px-8 text-right font-mono font-bold text-lg',
                            lucrosPrejuizosFinal >= 0 ? 'text-emerald-500' : 'text-rose-500')}>
                            {formatCurrency(lucrosPrejuizosFinal)}
                          </ExecutiveTableCell>
                          <ExecutiveTableCell className="py-6 px-8 text-right">
                            <span className="text-[10px] font-bold uppercase px-3 py-1.5 rounded-full bg-surface-container text-muted-foreground border border-border">
                              Calculado
                            </span>
                          </ExecutiveTableCell>
                        </ExecutiveTableRow>
                      )}
                    </ExecutiveTableBody>
                  </ExecutiveTable>
                </div>
              </ExecutiveSurface>
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
