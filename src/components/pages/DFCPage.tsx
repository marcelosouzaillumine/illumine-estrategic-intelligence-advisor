import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Loader2, Upload, Trash2, Plus, WalletCards, Database, TrendingUp, TrendingDown, Info, BarChart3 } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { PageHeader, KpiCard } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../hooks/useInstitutionalRuntime';
import { useLanguage } from '../../contexts/LanguageContext';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { useInstitutionalAuth } from '../../core/security/auth/InstitutionalAuthProvider';
import { FiduciaryRuntimeAdapter } from '../../services/FiduciaryRuntimeAdapter';
import type { PresentationLayer } from '../../services/FiduciaryRuntimeAdapter';
import {
  collection,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

type ToastType = { type: 'success' | 'error'; message: string } | null;

type RawPriorityLike = {
  sourceModule?: string;
  severity?: string;
  rationale?: string;
  [key: string]: any;
};


const renderPolarAngleAxisTick = (props: any) => {
  const { x, y, cx, cy, payload } = props;
  const value = payload?.value || '';
  
  let lines: string[] = [];
  if (value === 'Conversão de Caixa') {
    lines = ['Conversão', 'de Caixa'];
  } else if (value === 'Integridade de Recorrência') {
    lines = ['Integridade de', 'Recorrência'];
  } else if (value === 'Sustentabilidade da Margem') {
    lines = ['Sustentabilidade', 'da Margem'];
  } else if (value === 'Dependência dos Sócios') {
    lines = ['Dependência', 'dos Sócios'];
  } else if (value === 'Conservadorismo Contábil') {
    lines = ['Conservadorismo', 'Contábil'];
  } else if (value === 'Estabilidade Longitudinal') {
    lines = ['Estabilidade', 'Longitudinal'];
  } else {
    const words = value.split(' ');
    if (words.length > 2) {
      const mid = Math.ceil(words.length / 2);
      lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    } else if (words.length === 2 && value.length > 12) {
      lines = words;
    } else {
      lines = [value];
    }
  }

  // Calculate radial vector from center (cx, cy) to tick position (x, y)
  const dx = x - cx;
  const dyVal = y - cy;
  const r = Math.sqrt(dx * dx + dyVal * dyVal);
  
  // Shift text outwards along the radial vector by 12 pixels to prevent overlap
  const shift = 12;
  const tx = x + (dx / (r || 1)) * shift;
  const ty = y + (dyVal / (r || 1)) * shift;

  // Align text based on horizontal quadrant position
  let anchor: 'start' | 'end' | 'middle' = 'middle';
  if (dx > 10) {
    anchor = 'start';
  } else if (dx < -10) {
    anchor = 'end';
  }

  return (
    <g transform={`translate(${tx}, ${ty})`}>
      {lines.map((line, i) => {
        let lineDy = '0.35em'; // Vertical center for single line
        if (lines.length === 2) {
          lineDy = i === 0 ? '-0.25em' : '0.95em';
        } else if (lines.length === 3) {
          lineDy = i === 0 ? '-0.8em' : (i === 1 ? '0.4em' : '1.6em');
        }
        return (
          <text
            key={i}
            x={0}
            y={0}
            dy={lineDy}
            textAnchor={anchor}
            fill="#64748b"
            fontSize={8.5}
            fontWeight={700}
          >
            {line}
          </text>
        );
      })}
    </g>
  );
};

export function DFCPage({ clients, selectedClient, selectedYear }: any) {
  const { t } = useLanguage();
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'oficial' | 'fiduciario' | 'lucro'>('oficial');
  const { session } = useInstitutionalAuth();
  const userRole = session?.role || 'BOARD_MEMBER';
  const profile = useMemo(() => FiduciaryRuntimeAdapter.getProfile(FiduciaryRuntimeAdapter.mapOfficialRoleToProfileId(userRole)), [userRole]);

  const [densityLevel, setDensityLevel] = useState<PresentationLayer>(profile.defaultDensity);

  useEffect(() => {
    setDensityLevel(profile.defaultDensity);
  }, [userRole, profile]);

  const isSectionVisible = (sectionName: string) => {
    return FiduciaryRuntimeAdapter.ExecutiveInformationDensityFramework.isSectionVisible(sectionName, densityLevel);
  };

  const isBoardMode = densityLevel === 'BOARD';

  const [technicalTableOpen, setTechnicalTableOpen] = useState(false);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [selectedSimulationIndex, setSelectedSimulationIndex] = useState<number>(0);

  const numberedSections = useMemo(() => [
    'DFC_CONTEXT',
    'DFC_CQS_SUMMARY',
    'DFC_EXECUTIVE_DIAGNOSIS',
    'DFC_CAUSAL_INTELLIGENCE',
    'DFC_EARLY_WARNING',
    'DFC_REVENUE_CASH_CONVERSION',
    'DFC_SHAREHOLDER_DEPENDENCY',
    'DFC_RUNWAY',
    'DFC_SCENARIO_SIMULATION',
    'DFC_EFSI',
    'DFC_BOARD_ADVISORY',
    'DFC_RECONCILIATION_SUMMARY',
    'DFC_TECHNICAL_LAYER',
    'DFC_EQE_SUMMARY'
  ], []);

  const visibleNumberedSections = useMemo(() => {
    return numberedSections.filter(id => isSectionVisible(id));
  }, [densityLevel, isSectionVisible, numberedSections]);

  const totalVisibleSections = visibleNumberedSections.length;

  const getSectionHeader = (sectionId: string, labelKey: string) => {
    const rawHeader = FiduciaryRuntimeAdapter.ExecutivePresentationLabelRegistry.getLabel(labelKey);
    return FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(rawHeader, densityLevel);
  };

  const getEQETitle = () => {
    const labelKey = isSectionVisible('DFC_EQE_LINEAGE') ? 'DFC_EQE_SUMMARY_TECHNICAL' : 'DFC_EQE_SUMMARY_EXECUTIVE';
    return getSectionHeader('DFC_EQE_SUMMARY', labelKey);
  };

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  // ── Busca dados anuais ──────────────────────────────────────────────────────
  const { dbData: dbDataDFC, docIds: docIdsDFC, loading: loadingDFC, refetch: refetchDFC } =
    useAnnualFinancialData(selectedClient, filterYear, 'DFC');

  // ── Busca histórico (todos os dados do cliente) ──────────────────────────────
  const { dbData: allHistoryData, loading: loadingHistory, refetch: refetchHistory } = useAllFinancialData(selectedClient);

  const loading = loadingDFC;
  const dbData = dbDataDFC;

  const { runtimeOutput, loading: runtimeLoading } = useInstitutionalRuntime({
    input: {
      clientId: selectedClient,
      dreData: allHistoryData,
      rawFinancialData: {
        filterYear,
        allHistoryData
      }
    }
  });

  const dfcInference = runtimeOutput?.inferences ? (Object.values(runtimeOutput.inferences) as any[]).find(i => i.domain === 'Inteligência de Caixa (DFC)') : null;
  const metrics = dfcInference?.metrics || {};
  const rows = viewMode === 'oficial' ? (metrics.tableRows || []) : (metrics.fiduciary?.tableRows || []);
  const chartData = metrics.chartData || [];
  const fco = metrics.fco || 0;
  const fci = metrics.fci || 0;
  const fcf = metrics.fcf || 0;
  const variacao = metrics.variacaoCaixa || 0;
  const outputAny = runtimeOutput as any;
  const reinvestmentCapacity = metrics.reinvestmentCapacity || 0;
  const isGenerated = metrics.isGenerated || false;
  
  const semanticContext =
    dfcInference?.semanticContext
    ?? dfcInference?.lifecycleProfile
    ?? dfcInference?.metrics?.fiduciary?.lifecycleProfile
    ?? null;

  const semanticAudit = dfcInference?.semanticAudit;
  const semanticSource = semanticAudit?.canonicalRoot ?? dfcInference?.semanticSource ?? 'LEGACY';
  const lifecycleStage = semanticAudit?.lifecycleStage ?? semanticContext?.lifecycleStage ?? outputAny?.institutionalContext?.lifecycleStage ?? 'ESTABLISHED_ANALYSIS';
  const lifecycleLabel = semanticAudit?.lifecycleLabel ?? semanticContext?.lifecycleLabel ?? (lifecycleStage === 'INITIAL_CAPITALIZATION' ? 'Fase Inicial de Capitalização' : lifecycleStage);
  
  const executiveDisplay = metrics.semanticDisplays?.executiveDisplay;

  const featureFlags = { showSemanticAudit: process.env.NODE_ENV !== 'production' };

  useEffect(() => {
    if (featureFlags.showSemanticAudit && semanticAudit) {
      const violation = FiduciaryRuntimeAdapter.DFCSemanticRenderingGuard.auditSemanticRoot(semanticAudit, semanticSource);
      if (violation) {
        console.error(violation.code, violation);
      }
      console.table(semanticAudit);
    }
  }, [semanticAudit, semanticSource]);
  
  // Guard for Executive Semantic Rendering
  useEffect(() => {
    if (semanticSource === 'ELSA' && lifecycleStage === 'INITIAL_CAPITALIZATION' && executiveDisplay && process.env.NODE_ENV !== 'production') {
      const renderedTerms = [
        executiveDisplay.liquidityStatus,
        executiveDisplay.treasuryStatus,
        executiveDisplay.confidenceStatus,
        metrics.fiduciary?.cashConversionDisplay?.status === 'SEVERE_DETERIORATION' ? 'Conversão Severamente Deteriorada' : metrics.fiduciary?.cashConversionDisplay?.label
      ];
      FiduciaryRuntimeAdapter.DFCSemanticRenderingGuard.validateExecutiveDisplay(semanticSource, lifecycleStage, renderedTerms);
    }
  }, [semanticSource, lifecycleStage, executiveDisplay, metrics]);

  const cashQuality = metrics.fiduciary?.cashQuality;
  const earningsQuality = metrics.fiduciary?.earningsQuality;

  const ebitda = metrics.ebitda || 0;
  const lucroLiquido = metrics.lucroLiquido !== undefined ? metrics.lucroLiquido : 0;

  const lucroLiquidoRender = earningsQuality?.netIncome !== undefined && earningsQuality?.netIncome !== null
    ? earningsQuality.netIncome
    : (earningsQuality?.netIncomeTrace?.consumedByEQE !== undefined && earningsQuality?.netIncomeTrace?.consumedByEQE !== null
        ? earningsQuality.netIncomeTrace.consumedByEQE
        : null);

  const radarData = useMemo(() => {
    if (!cashQuality?.dimensions) return [];
    return [
      { subject: 'Conversão', A: cashQuality.dimensions.conversion.score, fullMark: 25 },
      { subject: 'Resiliência', A: cashQuality.dimensions.stress.score, fullMark: 15 },
      { subject: 'Liquidez', A: cashQuality.dimensions.liquidity.score, fullMark: 20 },
      { subject: 'Sócios', A: cashQuality.dimensions.dependency.score, fullMark: 20 },
      { subject: 'Giro', A: cashQuality.dimensions.workingCapital.score, fullMark: 10 },
      { subject: 'Sustentabilidade', A: cashQuality.dimensions.sustainability.score, fullMark: 10 },
    ];
  }, [cashQuality]);

  const earningsRadarData = useMemo(() => {
    if (!earningsQuality?.dimensions) return [];
    return [
      { subject: 'Conversão de Caixa', A: earningsQuality.dimensions.cashBacked.score, fullMark: 25 },
      { subject: 'Integridade de Recorrência', A: earningsQuality.dimensions.recurrence.score, fullMark: 20 },
      { subject: 'Sustentabilidade da Margem', A: earningsQuality.dimensions.sustainability.score, fullMark: 20 },
      { subject: 'Dependência dos Sócios', A: earningsQuality.dimensions.shareholderSupport.score, fullMark: 15 },
      { subject: 'Conservadorismo Contábil', A: earningsQuality.dimensions.accountingAggressiveness.score, fullMark: 10 },
      { subject: 'Estabilidade Longitudinal', A: earningsQuality.dimensions.longitudinalStability.score, fullMark: 10 }
    ];
  }, [earningsQuality]);

  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);



  const cashIndices = [
    { name: 'Fluxo Operacional', val: fco, unit: 'R$', desc: 'Geração de caixa pelas atividades principais', color: 'text-emerald-600' },
    { name: 'Fluxo Investimento', val: fci, unit: 'R$', desc: 'Consumo de caixa em ativos e Capex', color: 'text-blue-600' },
    { name: 'Fluxo Financiamento', val: fcf, unit: 'R$', desc: 'Entradas e saídas de capital e dívidas', color: 'text-purple-600' },
    { name: 'Variação Líquida', val: variacao, unit: 'R$', desc: 'Resultado final das movimentações de caixa', color: 'text-slate-900' },
  ];

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async () => {
    if (!auth.currentUser) {
      showToast('error', 'Você precisa estar logado para excluir dados.');
      return;
    }
    setDeleting(true);
    setShowDeleteConfirm(false);
    try {
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', selectedClient),
        where('type',     '==', 'DFC'),
        where('year',     '==', filterYear)
      );
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'financial_entries', d.id))));
      showToast('success', `${snap.docs.length} registro(s) excluído(s) com sucesso.`);
      refetchDFC();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };



  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade @container">
      <PageHeader 
        title="Fluxo de Caixa (DFC)" 
        subtitle="Análise detalhada de geração e consumo de caixa pelo método indireto."
        icon={WalletCards}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-[24px] border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">

        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={(dbData.length > 0 || isGenerated) ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', (dbData.length > 0 || isGenerated) ? 'text-success' : 'text-muted-foreground/40')}>
              {dbData.length > 0 ? 'Dados Reais' : isGenerated ? 'Cálculo Dinâmico (BP/DRE)' : 'Amostra'}
            </span>
          </div>

          <div className="flex bg-card border border-border p-1 rounded-xl shadow-sm items-center">
            <Calendar size={12} className="ml-2 text-secondary" />
            <select
              onChange={(e) => setFilterYear(Number(e.target.value))}
              value={filterYear}
              className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground appearance-none pr-1"
            >
              {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-3 bg-emerald-500/10 hover:bg-success text-emerald-600 hover:text-white border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={14} /> Lançar Dados
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-3 bg-[#FF8552]/10 hover:bg-[#FF8552] text-[#FF8552] hover:text-[#0E1C2C] border border-[#FF8552]/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload size={14} /> Importar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 bg-[#D01D1C]/10 hover:bg-[#D01D1C] text-[#D01D1C] hover:text-white border border-[#D01D1C]/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      </div>

      {/* Contexto Empresarial Block */}
      {!(viewMode === 'fiduciario' && densityLevel === 'BOARD') && (
        <div className="bg-white p-8 rounded-[32px] mb-10 flex flex-col @3xl:flex-row @3xl:items-center justify-between gap-6 shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-indigo-100/50 shadow-sm whitespace-normal break-words text-balance">
              {dfcInference?.executiveLifecycleContext?.executiveTitle || 'Contexto Empresarial'}
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            {dfcInference?.executiveLifecycleContext?.executiveBadge || 'Contexto empresarial não classificado'}
          </h3>
          <p className="text-slate-500 font-medium text-sm max-w-3xl leading-relaxed">
            {dfcInference?.executiveLifecycleContext?.executiveDescription || 'Os dados disponíveis não permitem determinar com segurança o estágio empresarial.'}
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
          <Database className="text-slate-400 w-8 h-8" />
        </div>
      </div>
      )}

      {/* Toggle Premium para DFC Fiduciária Ajustada */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#0E1C2C]/5 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-[#0E1C2C]/10">
          <button
            onClick={() => setViewMode('oficial')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer",
              viewMode === 'oficial'
                ? "bg-[#0E1C2C] text-white shadow-lg scale-105"
                : "text-[#0E1C2C]/60 hover:text-[#0E1C2C] hover:bg-white/60"
            )}
          >
            DFC Contábil Oficial
          </button>
          <button
            onClick={() => setViewMode('fiduciario')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer",
              viewMode === 'fiduciario'
                ? "bg-[#FF8552] text-[#0E1C2C] shadow-lg scale-105"
                : "text-[#0E1C2C]/60 hover:text-[#0E1C2C] hover:bg-white/60"
            )}
          >
            <span>DFC Fiduciária Ajustada</span>
            {metrics.fiduciary?.isEarlyStage && (
              <span className={cn(
                "text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0",
                viewMode === 'fiduciario'
                  ? "bg-[#0E1C2C]/10 text-[#0E1C2C]"
                  : "bg-amber-500/10 text-amber-600"
              )}>
                Early
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Toggle Premium de Densidade Informativa (EIDF) */}
      {viewMode === 'fiduciario' && (
        <div className="flex justify-center mb-8 animate-in fade-in duration-300">
          <div className="bg-[#0E1C2C]/5 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-[#0E1C2C]/10 text-xs">
            <span className="text-[#0E1C2C]/50 font-black uppercase tracking-widest px-3 py-2 flex items-center select-none text-[10px]">
              Nível EIDF:
            </span>
            {['BOARD', 'EXECUTIVE', 'TECHNICAL'].map((lvl) => {
              const allowed = profile.allowedDensities.includes(lvl as PresentationLayer);
              return (
                <button
                  key={lvl}
                  disabled={!allowed}
                  onClick={() => setDensityLevel(lvl as PresentationLayer)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer",
                    !allowed 
                      ? "text-slate-300 cursor-not-allowed opacity-50"
                      : densityLevel === lvl
                      ? (lvl === 'TECHNICAL' ? "bg-[#BAB86C] text-[#0E1C2C] shadow-md scale-105" : "bg-[#0E1C2C] text-white shadow-md scale-105")
                      : "text-[#0E1C2C]/60 hover:text-[#0E1C2C] hover:bg-white/60"
                  )}
                >
                  {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(
                    lvl === 'BOARD' ? 'Conselho (BOARD)' :
                    lvl === 'EXECUTIVE' ? 'Diretoria (EXECUTIVE)' :
                    'Técnico (TECHNICAL)',
                    densityLevel
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Alertas de Governança Fiduciária */}
      {viewMode === 'fiduciario' && metrics.fiduciary?.lifecycleProfile && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[32px] p-6 mb-8 flex flex-col @3xl:flex-row @3xl:items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-emerald-200/50">
                Fonte Semântica: ELSA
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {metrics.fiduciary.lifecycleProfile.lifecycleStage === 'INITIAL_CAPITALIZATION' ? 'Fase Inicial de Capitalização' : 
               metrics.fiduciary.lifecycleProfile.lifecycleStage === 'EARLY_GROWTH' ? 'Fase de Crescimento Inicial' : 
               metrics.fiduciary.lifecycleProfile.lifecycleStage}
            </h3>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Classificação ELSA: <span className="font-bold">{metrics.fiduciary.lifecycleProfile.lifecycleStage}</span> (Confiança: {metrics.fiduciary.lifecycleProfile.lifecycleConfidence})
            </p>
          </div>
          
          <div className="flex gap-8 bg-white/60 p-4 rounded-2xl border border-emerald-100/50">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fundação</span>
              <span className="text-lg font-black text-slate-800">{metrics.fiduciary.lifecycleProfile.foundationYear || 'N/A'}</span>
            </div>
            <div className="w-px bg-emerald-200/50"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ano Analisado</span>
              <span className="text-lg font-black text-slate-800">{filterYear}</span>
            </div>
            <div className="w-px bg-emerald-200/50"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Idade Empresarial</span>
              <span className="text-lg font-black text-slate-800">
                {metrics.fiduciary.lifecycleProfile.foundationYear ? `${filterYear - metrics.fiduciary.lifecycleProfile.foundationYear} ano(s)` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {viewMode === 'fiduciario' && metrics.fiduciary?.governanceWarnings && metrics.fiduciary.governanceWarnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-[32px] shadow-sm flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-800 uppercase tracking-wider">Alertas de Governança Fiduciária</h4>
              <p className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">Incongruências societárias ou operacionais detectadas no exercício</p>
            </div>
          </div>
          <ul className="grid grid-cols-1 @2xl:grid-cols-2 gap-3 pl-2 mt-2">
            {metrics.fiduciary.governanceWarnings.map((warning: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* KPI Cards Dinâmicos */}
      {viewMode === 'oficial' && (
        <div className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-4 gap-6 mb-10">
          {cashIndices.map((idx, i) => (
            <KpiCard 
              key={i}
              title={idx.name}
              value={formatValue(idx.val, '')}
              suffix="R$"
              icon={WalletCards}
              status={idx.val >= 0 ? 'Verde' : 'Vermelho'}
            />
          ))}
        </div>
      )}

      {/* Histórico de Fluxos de Caixa Chart */}
      {viewMode === 'oficial' && chartData && chartData.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm p-8 space-y-6 mb-10 text-left animate-in fade-in duration-500">
          <div className="flex flex-col @3xl:flex-row @3xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-[#0E1C2C] uppercase tracking-wider">Histórico de Fluxos de Caixa</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Evolução comparativa de geração, investimentos, financiamentos e resultado contábil
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-[9px] font-black uppercase tracking-wider text-slate-600">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0E1C2C]" />
                <span>Operacional (FCO)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF8552]" />
                <span>Investimento (FCI)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#BAB86C]" />
                <span>Financiamento (FCF)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Lucro Líquido</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#6B7280' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#6B7280' }}
                  tickFormatter={(val) => {
                    if (Math.abs(val) >= 1_000_000) return `R$ ${(val / 1_000_000).toFixed(1)}M`;
                    if (Math.abs(val) >= 1_000) return `R$ ${(val / 1_000).toFixed(0)}k`;
                    return `R$ ${val}`;
                  }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(14, 28, 44, 0.03)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#0E1C2C] text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                          <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/50">
                            Ano {payload[0].payload.year}
                          </p>
                          <div className="space-y-1.5 min-w-[180px]">
                            {payload.map((p: any, idx: number) => {
                              let name = p.name;
                              if (p.dataKey === 'operacional') name = 'FCO';
                              else if (p.dataKey === 'investimento') name = 'FCI';
                              else if (p.dataKey === 'financiamento') name = 'FCF';
                              else if (p.dataKey === 'lucroLiquido') name = 'Lucro Líquido';

                              return (
                                <div key={idx} className="flex items-center justify-between gap-8">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
                                    <span className="text-[10px] font-bold text-white/70 uppercase">{name}</span>
                                  </div>
                                  <span className="text-xs font-black font-mono">{formatCurrency(p.value)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="operacional" name="FCO" fill="#0E1C2C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="investimento" name="FCI" fill="#FF8552" radius={[4, 4, 0, 0]} />
                <Bar dataKey="financiamento" name="FCF" fill="#BAB86C" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="lucroLiquido" name="Lucro Líquido" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {viewMode === 'fiduciario' && (() => {
        // 1. Audit and assign fallbacks for the snapshot
        const rawSnapshot = metrics.fiduciary?.dfcExecutiveSnapshot || {};
        const auditTarget = {
          cashGenerationStatus: rawSnapshot.geraCaixa !== undefined && rawSnapshot.geraCaixa !== null ? (rawSnapshot.geraCaixa ? 'Gera Caixa' : 'Consome Caixa') : undefined,
          runwayStatus: rawSnapshot.runway,
          shareholderDependencyStatus: rawSnapshot.dependenciaSocietaria || rawSnapshot.dependenteSocios,
          primaryRisk: rawSnapshot.maiorRisco,
          recommendedAction: rawSnapshot.acaoPrioritaria
        };
        const snapshotAudit = FiduciaryRuntimeAdapter.DFCSnapshotBindingAudit.audit(auditTarget);
        
        const safeSnapshot = {
          geraCaixa: rawSnapshot.geraCaixa ?? false,
          runway: rawSnapshot.runway || 'Não Disponível',
          dependenteSocios: (rawSnapshot.dependenciaSocietaria || rawSnapshot.dependenteSocios) || 'Não Disponível',
          maiorRisco: rawSnapshot.maiorRisco || 'Não Disponível',
          acaoPrioritaria: rawSnapshot.acaoPrioritaria || 'Não Disponível'
        };

        // 2. Resolve and adapt priorities
        const rawPriorities = FiduciaryRuntimeAdapter.ExecutivePriorityResolver.resolve(runtimeOutput);
        const adaptedPriorities = FiduciaryRuntimeAdapter.DFCBoardPriorityPresentationAdapter.adapt(rawPriorities);

        // 3. Compute consequence profile (ECIL)
        const consequence = FiduciaryRuntimeAdapter.ExecutiveConsequenceIntelligenceLayer.evaluate(
          fco,
          metrics.fiduciary?.runway || 0,
          lucroLiquidoRender || lucroLiquido || 0
        );

        // 4. Map early warnings and causal drivers to safe presentation models
        const rawEarlyWarning = metrics.fiduciary?.earlyWarning || {};
        const safeEarlyWarningAlerts = (rawEarlyWarning.alerts || []).map((alert: any) => {
          let safeStatus = alert.status;
          if (alert.status === 'CRITICAL') safeStatus = 'Crítico';
          else if (alert.status === 'WARNING') safeStatus = 'Atenção';
          else if (alert.status === 'ALERT') safeStatus = 'Alerta';
          else if (alert.status === 'WATCH') safeStatus = 'Monitoramento';
          else if (alert.status === 'NORMAL') safeStatus = 'Saudável';

          let safeMessage = alert.message || '';
          safeMessage = safeMessage
            .replace(/\bCRITICAL\b/g, 'Crítico')
            .replace(/\bWARNING\b/g, 'Atenção')
            .replace(/\bNORMAL\b/g, 'Saudável')
            .replace(/\bTECHNICAL\b/g, 'Técnico');

          return {
            metric: alert.metric,
            value: alert.value,
            status: safeStatus,
            message: safeMessage
          };
        });

        const rawDrivers = metrics.fiduciary?.causalIntelligence?.drivers || [];
        const safeDrivers = rawDrivers.map((driver: any) => ({
          label: driver.label,
          type: driver.type === 'DESTROYER' ? 'Drenagem' : 'Geração',
          amount: driver.amount,
          contributionPercent: driver.contributionPercent
        }));

        const auditData = {
          snapshot: safeSnapshot,
          decisionFramework: {
            cashGenerationAssessment: metrics.fiduciary?.cashBoardDecisionFramework?.cashGenerationAssessment,
            primaryConstraint: metrics.fiduciary?.cashBoardDecisionFramework?.primaryConstraint,
            runwayAssessment: metrics.fiduciary?.cashBoardDecisionFramework?.runwayAssessment,
            shareholderDependency: metrics.fiduciary?.cashBoardDecisionFramework?.shareholderDependency,
            boardOutlook: metrics.fiduciary?.cashBoardDecisionFramework?.boardOutlook,
            immediateAction: metrics.fiduciary?.cashBoardDecisionFramework?.immediateAction,
            isOperationSelfSustaining: metrics.fiduciary?.cashBoardDecisionFramework?.isOperationSelfSustaining,
            revenueConversionAssessment: metrics.fiduciary?.cashBoardDecisionFramework?.revenueConversionAssessment
          },
          drivers: safeDrivers,
          earlyWarning: {
            alerts: safeEarlyWarningAlerts
          },
          compressedAdvisory: metrics.fiduciary?.compressedAdvisory,
          consequenceProfile: consequence,
          priorities: adaptedPriorities
        };
        
        const presentationAudit = FiduciaryRuntimeAdapter.ExecutivePresentationAuditEngine.audit(auditData, densityLevel);

        if (densityLevel !== 'TECHNICAL' && (presentationAudit.status === 'DFC_EXECUTIVE_PRESENTATION_VIOLATION' || presentationAudit.status === 'EXECUTIVE_LANGUAGE_LEAK')) {
          console.error('Presentation/Language Violation detected:', presentationAudit.violations);
          const blockMsg = presentationAudit.status === 'EXECUTIVE_LANGUAGE_LEAK'
            ? 'A visualização executiva foi bloqueada por inconsistência de soberania de linguagem institucional. Reprocessar o relatório antes de deliberação.'
            : 'A visualização executiva foi bloqueada por inconsistência de densidade informacional. Reprocessar o relatório antes de deliberação.';
          return (
            <div className="max-w-[1440px] mx-auto p-8 text-center bg-rose-50 border border-rose-200 rounded-[32px] my-10">
              <h3 className="text-xl font-black text-rose-800">Visualização Bloqueada</h3>
              <p className="text-sm text-rose-700 mt-2 font-medium">
                {blockMsg}
              </p>
              {process.env.NODE_ENV !== 'production' && (
                <div className="mt-4 p-4 bg-slate-900 text-white rounded-2xl text-left font-mono text-[10px] overflow-auto max-h-48">
                  <p className="font-bold text-rose-400">Presentation violations detected:</p>
                  {presentationAudit.violations.map((v: string, i: number) => (
                    <p key={i}>- {v}</p>
                  ))}
                </div>
              )}
            </div>
          );
        }

        // 5. Execute EIDF Density compliance audit
        const densityAudit = FiduciaryRuntimeAdapter.DFCDensityComplianceAudit.audit(
          visibleNumberedSections,
          densityLevel
        );

        if (densityAudit.status === 'DFC_DENSITY_VIOLATION') {
          console.error('EIDF Density Violation detected:', densityAudit.details);
          return (
            <div className="max-w-[1440px] mx-auto p-8 text-center bg-rose-50 border border-rose-200 rounded-[32px] my-10">
              <h3 className="text-xl font-black text-rose-800">Visualização Bloqueada</h3>
              <p className="text-sm text-rose-700 mt-2 font-medium">
                A visualização executiva foi bloqueada por inconsistência de densidade informacional. Reprocessar o relatório antes de deliberação.
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* DFC_SNAPSHOT Section */}
            {isSectionVisible('DFC_SNAPSHOT') && (() => {
              const snapshot = safeSnapshot;
              return (
                <div className="bg-gradient-to-br from-[#0E1C2C] via-[#0E1C2C] to-[#07111C] p-8 rounded-[32px] shadow-2xl border border-white/10 space-y-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8552]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-white mt-2">
                        {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(FiduciaryRuntimeAdapter.ExecutivePresentationLabelRegistry.getLabel('DFC_SNAPSHOT_TITLE'), densityLevel)}
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-6 relative z-10">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm hover:bg-white/10 transition-colors">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Geração de Caixa</span>
                      <p className={cn("text-lg font-black mt-1", snapshot.geraCaixa ? "text-emerald-400" : "text-[#D01D1C]")}>
                        {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(snapshot.geraCaixa ? 'Gera Caixa Operacional' : 'Consome Caixa Operacional', densityLevel)}
                      </p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm hover:bg-white/10 transition-colors">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                        {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate('Runway Fiduciário', densityLevel)}
                      </span>
                      <p className="text-lg font-black text-white mt-1">
                        {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(snapshot.runway, densityLevel)}
                      </p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm hover:bg-white/10 transition-colors">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Dependência de Aportes</span>
                      <p className="text-lg font-black text-white mt-1">
                        {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(snapshot.dependenteSocios, densityLevel)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6 relative z-10 border-t border-white/10 pt-4">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm hover:bg-white/10 transition-colors">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Maior Risco Detectado</span>
                      <p className="text-sm font-bold text-slate-200 mt-1">
                        {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(snapshot.maiorRisco, densityLevel)}
                      </p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm hover:bg-white/10 transition-colors">
                      <span className="text-[9px] font-black uppercase text-[#FF8552] tracking-wider">Ação Recomendada</span>
                      <p className="text-sm font-black text-[#FF8552] mt-1">
                        {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(snapshot.acaoPrioritaria, densityLevel)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* DFC_BOARD_PRIORITIES Section */}
            {isSectionVisible('DFC_BOARD_PRIORITIES') && (() => {
              return (
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mt-2">
                        {getSectionHeader('DFC_BOARD_PRIORITIES', 'DFC_BOARD_PRIORITIES_TITLE')}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {adaptedPriorities.slice(0, 3).map((d: any, idx: number) => {
                      const raw = (rawPriorities[idx] || {}) as RawPriorityLike;
                      return (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex-col @3xl:flex-row @3xl:items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{d.theme}</span>
                              <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {d.impact}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 leading-normal">{d.recommendation}</p>
                            
                            {/* Collapse debug section for technical profile */}
                            {densityLevel === 'TECHNICAL' && (
                              <details className="mt-2 text-[8px] font-mono text-slate-400 cursor-pointer select-none">
                                <summary className="hover:text-slate-600 font-bold uppercase tracking-wider">Auditoria Técnica (Debug)</summary>
                                <div className="mt-1 p-2 bg-slate-100 border border-slate-200 rounded-lg space-y-1 text-[8.5px]">
                                  <p><strong>Source Module:</strong> {raw.sourceModule}</p>
                                  <p><strong>Severity Code:</strong> {raw.severity}</p>
                                  <p><strong>Rationale:</strong> {raw.rationale}</p>
                                </div>
                              </details>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* DFC_EXECUTIVE_DIAGNOSIS Section */}
            {isSectionVisible('DFC_EXECUTIVE_DIAGNOSIS') && (
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mt-2">
                      {getSectionHeader('DFC_EXECUTIVE_DIAGNOSIS', 'DFC_DIAGNOSIS_TITLE')}
                    </h3>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#0E1C2C] via-[#0E1C2C] to-[#07111C] text-white rounded-3xl p-6 border border-white/10 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8552]/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Questão Principal</p>
                  <p className="text-sm font-bold text-slate-200">A operação é autossustentável?</p>
                  <p className="text-base font-black text-emerald-400 mt-2 leading-relaxed">
                    {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(metrics.fiduciary?.cashBoardDecisionFramework?.isOperationSelfSustaining, densityLevel)}
                  </p>
                </div>
                <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6 mt-4">
                  <div className="border border-border rounded-2xl p-5 space-y-1 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-[9px] font-black uppercase text-[#0E1C2C]/50 tracking-wider">A operação gera caixa operacional?</span>
                    <p className="text-xs font-bold text-[#0E1C2C] leading-relaxed">
                      {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(metrics.fiduciary?.cashBoardDecisionFramework?.cashGenerationAssessment, densityLevel)}
                    </p>
                  </div>
                  <div className="border border-border rounded-2xl p-5 space-y-1 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-[9px] font-black uppercase text-[#0E1C2C]/50 tracking-wider">Qual a restrição principal de caixa?</span>
                    <p className="text-xs font-bold text-[#0E1C2C] leading-relaxed">
                      {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(metrics.fiduciary?.cashBoardDecisionFramework?.primaryConstraint, densityLevel)}
                    </p>
                  </div>
                  <div className="border border-border rounded-2xl p-5 space-y-1 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-[9px] font-black uppercase text-[#0E1C2C]/50 tracking-wider">Qual o horizonte de sobrevivência (runway)?</span>
                    <p className="text-xs font-bold text-[#0E1C2C] leading-relaxed">
                      {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(metrics.fiduciary?.cashBoardDecisionFramework?.runwayAssessment, densityLevel)}
                    </p>
                  </div>
                  <div className="border border-border rounded-2xl p-5 space-y-1 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-[9px] font-black uppercase text-[#0E1C2C]/50 tracking-wider">Qual a dependência dos sócios?</span>
                    <p className="text-xs font-bold text-[#0E1C2C] leading-relaxed">
                      {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(metrics.fiduciary?.cashBoardDecisionFramework?.shareholderDependency, densityLevel)}
                    </p>
                  </div>
                  <div className="border border-border rounded-2xl p-5 space-y-1 bg-white shadow-sm hover:shadow-md transition-all duration-300 col-span-1 @3xl:col-span-2">
                    <span className="text-[9px] font-black uppercase text-[#0E1C2C]/50 tracking-wider">Qual a perspectiva (outlook) de continuidade?</span>
                    <p className="text-xs font-bold text-[#0E1C2C] leading-relaxed">
                      {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(metrics.fiduciary?.cashBoardDecisionFramework?.boardOutlook, densityLevel)}
                    </p>
                  </div>
                  <div className="border border-[#BAB86C]/30 bg-[#BAB86C]/10 rounded-2xl p-5 space-y-1 col-span-1 @3xl:col-span-2 shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-[9px] font-black uppercase text-[#BAB86C] tracking-wider">Ação imediata recomendada?</span>
                    <p className="text-xs font-bold text-[#0E1C2C] leading-relaxed">
                      {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(metrics.fiduciary?.cashBoardDecisionFramework?.immediateAction, densityLevel)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* DFC_CAUSAL_INTELLIGENCE Section */}
            {isSectionVisible('DFC_CAUSAL_INTELLIGENCE') && (() => {
              const audit = FiduciaryRuntimeAdapter.DFCCausalDriverPresentationAudit.audit(
                metrics.fiduciary?.causalIntelligence?.drivers || []
              );
              return (
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mt-2">
                        {getSectionHeader('DFC_CAUSAL_INTELLIGENCE', 'DFC_CAUSAL_INTELLIGENCE_TITLE')}
                      </h3>
                    </div>
                  </div>
                  {audit.validDrivers.length === 0 ? (
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs font-semibold text-slate-500">
                      Nenhum causador de variação de caixa válido identificado para o período.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-6">
                      {audit.validDrivers.map((driver: any, idx: number) => (
                        <div key={idx} className="border border-border rounded-2xl p-5 space-y-2 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-xs font-black text-[#0E1C2C]">{driver.label}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border shrink-0",
                              driver.type === 'DESTROYER' 
                                ? 'bg-rose-50 text-[#D01D1C] border-[#D01D1C]/20' 
                                : 'bg-emerald-50 text-[#0C7A3A] border-[#0C7A3A]/20'
                            )}>
                              {driver.type === 'DESTROYER' ? 'Drenagem' : 'Geração'}
                            </span>
                          </div>
                          <div>
                            <p className="text-lg font-black text-[#0E1C2C]">
                              {formatCurrency(driver.amount)}
                            </p>
                            <p className="text-[9px] text-[#0E1C2C]/50 font-bold uppercase mt-1">
                              Impacto: {FiduciaryRuntimeAdapter.ExecutiveNumericPresentationGuard.formatSafe(driver.contributionPercent, (val) => `${val.toFixed(1)}%`)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* DFC_EARLY_WARNING Section */}
            {isSectionVisible('DFC_EARLY_WARNING') && metrics.fiduciary?.earlyWarning && (
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mt-2">
                      {getSectionHeader('DFC_EARLY_WARNING', 'DFC_EARLY_WARNING_TITLE')}
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-4">
                  {((densityLevel === 'TECHNICAL' ? rawEarlyWarning.alerts : safeEarlyWarningAlerts) || []).map((alert: any, idx: number) => {
                    const isCritical = alert.status === 'CRITICAL' || alert.status === 'Crítico';
                    const isWarning = alert.status === 'WARNING' || alert.status === 'Atenção';
                    const isAlert = alert.status === 'ALERT' || alert.status === 'Alerta';

                    return (
                      <div key={idx} className={cn(
                        "p-5 rounded-2xl border flex items-start gap-4 shadow-sm",
                        isCritical ? 'bg-[#D01D1C]/5 border-[#D01D1C]/25' :
                        isWarning ? 'bg-[#BAB86C]/10 border-[#BAB86C]/30' :
                        'bg-slate-50 border-slate-100'
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          isCritical ? 'bg-[#D01D1C]/10 text-[#D01D1C]' :
                          isWarning ? 'bg-[#BAB86C]/20 text-[#BAB86C]' :
                          'bg-slate-500/10 text-slate-600'
                        )}>
                          <AlertTriangle size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-[#0E1C2C]">
                              {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(alert.metric, densityLevel)}
                            </span>
                            <span className={cn(
                              "text-[8px] font-black uppercase px-2 py-0.5 rounded border tracking-wider",
                              isCritical ? 'bg-[#D01D1C]/10 text-[#D01D1C] border-[#D01D1C]/20' :
                              isWarning ? 'bg-[#BAB86C]/25 text-[#0E1C2C] border-[#BAB86C]/30' :
                              'bg-slate-200 text-slate-800 border-slate-350'
                            )}>
                              {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(alert.status, densityLevel)}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">
                            {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(alert.message, densityLevel)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DFC_REVENUE_CASH_CONVERSION Section */}
            {isSectionVisible('DFC_REVENUE_CASH_CONVERSION') && (
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mt-2">
                      {getSectionHeader('DFC_REVENUE_CASH_CONVERSION', 'DFC_REVENUE_CASH_CONVERSION_TITLE')}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col @3xl:flex-row items-stretch gap-6 bg-[#0E1C2C]/5 p-6 rounded-[24px] border border-[#0E1C2C]/10 shadow-sm">
                  <div className="flex-1 text-left space-y-2 py-2">
                    <span className="text-[10px] font-black text-[#0E1C2C]/50 uppercase tracking-widest block">Análise de Conversão</span>
                    <p className="text-sm font-semibold text-[#0E1C2C]/80 leading-relaxed">
                      {metrics.fiduciary?.cashConversionAnalysis?.rationale}
                    </p>
                  </div>
                  <div className="bg-white border border-[#0E1C2C]/10 px-8 py-6 rounded-2xl text-center min-w-[220px] shrink-0 shadow-sm flex flex-col justify-center">
                    <span className="text-[10px] font-black text-[#0E1C2C]/50 uppercase tracking-widest block mb-2">Conversão de Faturamento</span>
                    <span className="text-3xl font-black text-[#0E1C2C] tracking-tighter block">
                      {FiduciaryRuntimeAdapter.ExecutiveNumericPresentationGuard.formatSafe(
                        metrics.fiduciary?.cashConversionAnalysis?.cashConversionPer100Revenue,
                        (val) => `R$ ${val.toFixed(2)}`
                      )}
                    </span>
                    <span className="text-[9px] font-bold text-[#0E1C2C]/50 uppercase block mt-1">A cada R$ 100 faturados</span>
                  </div>
                </div>
              </div>
            )}

            {/* DFC_SHAREHOLDER_DEPENDENCY Section */}
            {isSectionVisible('DFC_SHAREHOLDER_DEPENDENCY') && (
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mt-2">
                      {getSectionHeader('DFC_SHAREHOLDER_DEPENDENCY', 'DFC_SHAREHOLDER_DEPENDENCY_TITLE')}
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6">
                  <div className="border border-[#BAB86C]/30 rounded-2xl p-5 space-y-1 bg-[#BAB86C]/10 shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-[9px] font-black uppercase text-[#0E1C2C]/50 tracking-wider">Índice de Autossuficiência Financeira</span>
                    <p className="text-lg font-black text-[#0E1C2C]">
                      {metrics.fiduciary?.shareholderDependencyAnalysis?.autossuficienciaFinanceiraDisplay}
                    </p>
                  </div>
                  <div className="border border-[#BAB86C]/30 rounded-2xl p-5 space-y-1 bg-[#BAB86C]/10 shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-[9px] font-black uppercase text-[#0E1C2C]/50 tracking-wider">Dependência de Capital Externo</span>
                    <p className="text-lg font-black text-[#0E1C2C]">
                      {metrics.fiduciary?.shareholderDependencyAnalysis?.dependenciaCapitalExternoLabel}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                  {metrics.fiduciary?.shareholderDependencyAnalysis?.rationale}
                </p>
              </div>
            )}

            {/* DFC_RUNWAY Section */}
            {isSectionVisible('DFC_RUNWAY') && (
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mt-2">
                      {getSectionHeader('DFC_RUNWAY', 'DFC_RUNWAY_TITLE')}
                    </h3>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#0E1C2C] to-[#07111C] text-white p-8 rounded-[24px] border border-white/10 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8552]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                  <div className="relative z-10 flex flex-col @3xl:flex-row @3xl:items-stretch justify-between gap-8">
                    <div className="space-y-2 flex-1 text-left flex flex-col justify-center">
                      <span className="text-[10px] font-black text-[#FF8552] uppercase tracking-widest block">Diagnóstico de Sobrevivência</span>
                      <h4 className="text-lg font-bold text-slate-200 leading-relaxed">
                        {metrics.fiduciary?.cashBoardDecisionFramework?.runwayAssessment}
                      </h4>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-2xl text-center min-w-[220px] shrink-0 shadow-lg flex flex-col justify-center">
                      <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-2">Cobertura Projetada</span>
                      <span className="text-4xl font-black text-[#FF8552] tracking-tighter block">
                        {FiduciaryRuntimeAdapter.ExecutiveNumericPresentationGuard.formatSafe(
                          metrics.fiduciary?.runway,
                          (val) => val >= 99 ? '99+ meses' : `${val.toFixed(1)} meses`
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DFC_SCENARIO_SIMULATION Section */}
            {isSectionVisible('DFC_SCENARIO_SIMULATION') && metrics.fiduciary?.scenarioIntelligence && (() => {
              const group = metrics.fiduciary.scenarioIntelligence.scenarios[selectedScenarioIndex];
              const sim = group.simulations[selectedSimulationIndex];
              
              const currentRunway = metrics.fiduciary.scenarioIntelligence.currentRunway || 0;
              const currentCash = metrics.fiduciary?.caixaFinalBP || 0;
              const currentFco = metrics.fco || 0;

              const consistency = FiduciaryRuntimeAdapter.ScenarioSimulationConsistencyEngine.evaluate(
                sim.runwaySimulated,
                currentRunway,
                sim.cashSimulated,
                currentCash,
                sim.fcoSimulated,
                currentFco
              );

              return (
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#0E1C2C] mt-2">
                        {getSectionHeader('DFC_SCENARIO_SIMULATION', 'DFC_SCENARIO_SIMULATION_TITLE')}
                      </h3>
                    </div>
                    {densityLevel === 'TECHNICAL' && (
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200">
                        <span>Historical Data: Immutable</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-indigo-600">Scenario Data: Hypothetical / Decision Support Only</span>
                      </div>
                    )}
                  </div>

                  <div className="flex border-b border-slate-100">
                    {metrics.fiduciary.scenarioIntelligence.scenarios.map((g: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedScenarioIndex(idx);
                          setSelectedSimulationIndex(2); // default to max parameter
                        }}
                        className={cn(
                          "pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer",
                          selectedScenarioIndex === idx
                            ? "border-[#FF8552] text-[#0E1C2C]"
                            : "border-transparent text-[#0E1C2C]/50 hover:text-[#0E1C2C] hover:bg-[#0E1C2C]/5 rounded-t-xl"
                        )}
                      >
                        {g.scenarioName}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#0E1C2C]/60 uppercase tracking-wide">Intensidade:</span>
                    <div className="flex gap-2 bg-[#0E1C2C]/5 p-1 rounded-xl">
                      {group.simulations.map((s: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSimulationIndex(idx)}
                          className={cn(
                            "px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                            selectedSimulationIndex === idx
                              ? "bg-[#0E1C2C] text-white shadow-md"
                              : "text-[#0E1C2C]/60 hover:text-[#0E1C2C]"
                          )}
                        >
                          {s.parameter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-6 bg-[#0E1C2C]/5 p-6 rounded-2xl border border-[#0E1C2C]/10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#0E1C2C]/50 uppercase tracking-widest">Caixa Disponível</span>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#0E1C2C]/70">Atual: {formatCurrency(currentCash)}</span>
                        <span className="font-bold text-[#0E1C2C]">Simulado: {formatCurrency(sim.cashSimulated)}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#0E1C2C]/50 uppercase tracking-widest">Runway Estimado</span>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#0E1C2C]/70">Atual: {currentRunway >= 99 ? '99+' : currentRunway.toFixed(1)} meses</span>
                        <span className="font-bold text-[#FF8552]">Simulado: {sim.runwayDisplay}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#0E1C2C]/50 uppercase tracking-widest">Fluxo Operacional (FCO)</span>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#0E1C2C]/70">Atual: {formatCurrency(currentFco)}</span>
                        <span className="font-bold text-[#0E1C2C]">Simulado: {formatCurrency(sim.fcoSimulated)}</span>
                      </div>
                    </div>
                  </div>

                  {consistency.hasConflict && (
                    <div className="p-4 bg-[#BAB86C]/10 border border-[#BAB86C]/30 rounded-2xl flex items-start gap-3">
                      <AlertTriangle className="text-[#BAB86C] shrink-0 mt-0.5" size={16} />
                      <p className="text-xs font-semibold text-[#0E1C2C] leading-normal">
                        {densityLevel === 'TECHNICAL' ? consistency.narrative : consistency.executiveInterpretation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* DFC_EFSI Section */}
            {isSectionVisible('DFC_EFSI') && (() => {
              const efsiScore = metrics.fiduciary?.efsiScore || 0;
              const runwayVal = metrics.fiduciary?.runway || 0;
              const narrative = FiduciaryRuntimeAdapter.TreasurySustainabilityNarrativeEngine.evaluate(
                efsiScore,
                fco,
                runwayVal
              );
              return (
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-[#0E1C2C] mt-2">
                        {getSectionHeader('DFC_EFSI', 'DFC_EFSI_TITLE')}
                      </h3>
                    </div>
                  </div>
                  <div className="bg-[#0E1C2C]/5 p-6 rounded-2xl border border-[#0E1C2C]/10 text-xs text-[#0E1C2C] leading-relaxed font-semibold">
                    {narrative}
                  </div>
                </div>
              );
            })()}

            {/* DFC_BOARD_ADVISORY Section */}
            {isSectionVisible('DFC_BOARD_ADVISORY') && (() => {
              const advisory = metrics.fiduciary?.compressedAdvisory || { situacaoAtual: 'Não Disponível', restricaoPrincipal: 'Não Disponível', prioridadeEstrategica: 'Não Disponível', outlook: 'Não Disponível' };
              return (
                <div className="bg-gradient-to-br from-[#0E1C2C] via-[#0E1C2C] to-[#07111C] text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden space-y-6 text-left border border-white/10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8552]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black">
                        {getSectionHeader('DFC_BOARD_ADVISORY', 'DFC_BOARD_ADVISORY_TITLE')}
                      </h3>
                    </div>
                    {metrics.fiduciary?.isEarlyStage && (
                      <span className="bg-[#BAB86C]/10 text-[#BAB86C] border border-[#BAB86C]/20 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 whitespace-normal break-words text-balance text-center inline-block">
                        Maturidade de Early-Stage
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Situação Atual</p>
                        <p className="text-sm font-bold text-slate-200 leading-relaxed">
                          {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(advisory.situacaoAtual, densityLevel)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-1">Restrição Principal</p>
                        <p className="text-sm font-bold text-rose-200 leading-relaxed">
                          {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(advisory.restricaoPrincipal, densityLevel)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">Prioridade Estratégica</p>
                        <p className="text-sm font-bold text-blue-200 leading-relaxed">
                          {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(advisory.prioridadeEstrategica, densityLevel)}
                        </p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mt-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#BAB86C] mb-1">Outlook Fiduciário</p>
                        <p className="text-xs font-semibold leading-relaxed text-[#BAB86C]/90">
                          {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(advisory.outlook, densityLevel)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Executive Consequence Intelligence Layer (ECIL) */}
                  <div className="border-t border-white/10 pt-6 mt-6 grid grid-cols-1 @3xl:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#BAB86C] mb-1">Consequência da Ação</p>
                        <p className="text-xs font-bold text-slate-200 leading-relaxed">
                          {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(consequence.consequenceOfAction, densityLevel)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-1">Consequência da Inação</p>
                        <p className="text-xs font-bold text-rose-200 leading-relaxed">
                          {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(consequence.consequenceOfInaction, densityLevel)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 @sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Horizonte do Impacto</p>
                          <p className="text-xs font-bold text-slate-200">
                            {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(consequence.impactHorizon, densityLevel)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Reversibilidade</p>
                          <div>
                            <span className={cn(
                              "inline-block px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wider whitespace-normal break-words text-balance text-center",
                              consequence.reversibility.startsWith('Alta') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              consequence.reversibility.startsWith('Recuperação possível') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            )}>
                              {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(consequence.reversibility, densityLevel)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* DFC_RECONCILIATION_SUMMARY Section */}
            {isSectionVisible('DFC_RECONCILIATION_SUMMARY') && (
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-[#0E1C2C] mt-2">
                      {getSectionHeader('DFC_RECONCILIATION_SUMMARY', 'DFC_RECONCILIATION_SUMMARY_TITLE')}
                    </h3>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-normal break-words text-balance text-center",
                    metrics.fiduciary?.reconciliationMismatch 
                      ? "bg-[#D01D1C]/10 text-[#D01D1C] border border-[#D01D1C]/20" 
                      : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  )}>
                    {metrics.fiduciary?.reconciliationMismatch ? "Divergência Detectada" : "Conciliado (Diferença R$ 0)"}
                  </span>
                </div>
                <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6 bg-[#0E1C2C]/5 p-6 rounded-2xl border border-[#0E1C2C]/10">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0E1C2C]/50 block mb-1">Cálculo DFC</span>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#0E1C2C]/70">Caixa Inicial DFC:</span>
                      <span className="text-[#0E1C2C] font-semibold">{formatCurrency(metrics.fiduciary?.caixaInicialDFC || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#0E1C2C]/70">Variação DFC:</span>
                      <span className="text-[#0E1C2C] font-semibold">{formatCurrency(metrics.fiduciary?.variacaoDFC || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold border-t border-[#0E1C2C]/10 pt-2">
                      <span className="text-[#0E1C2C]">Caixa Final Estimado:</span>
                      <span className="text-[#0E1C2C] font-bold">{formatCurrency(metrics.fiduciary?.caixaFinalEstimadoDFC || 0)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0E1C2C]/50 block mb-1">Valores BP (Real)</span>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#0E1C2C]/70">Caixa Inicial Real (BP):</span>
                      <span className="text-[#0E1C2C] font-semibold">{formatCurrency(metrics.fiduciary?.caixaInicialBP || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#0E1C2C]/70">Variação Real (BP):</span>
                      <span className="text-[#0E1C2C] font-semibold">{formatCurrency(metrics.fiduciary?.variacaoLiquidaConciliada || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold border-t border-[#0E1C2C]/10 pt-2">
                      <span className="text-[#0E1C2C]">Caixa Final Real (BP):</span>
                      <span className="text-[#0E1C2C] font-bold">{formatCurrency(metrics.fiduciary?.caixaFinalBP || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DFC_TECHNICAL_LAYER Section */}
            {isSectionVisible('DFC_TECHNICAL_LAYER') && (
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-[#0E1C2C] mt-2">
                      {getSectionHeader('DFC_TECHNICAL_LAYER', 'DFC_TECHNICAL_LAYER_TITLE')}
                    </h3>
                  </div>
                  <button
                    onClick={() => setTechnicalTableOpen(!technicalTableOpen)}
                    className="px-4 py-2 border border-[#0E1C2C]/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0E1C2C]/5 text-[#0E1C2C] transition-all select-none cursor-pointer"
                  >
                    {technicalTableOpen ? 'Ocultar Detalhes' : 'Visualizar Detalhes'}
                  </button>
                </div>

                {technicalTableOpen && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-4">
                      {Object.entries(cashQuality?.dimensions || {}).map(([key, dim]: [string, any]) => {
                        let title = '';
                        if (key === 'conversion') title = 'Conversão Operacional';
                        else if (key === 'dependency') title = 'Independência dos Sócios';
                        else if (key === 'liquidity') title = 'Integridade da Liquidez';
                        else if (key === 'stress') title = 'Resiliência de Tesouraria';
                        else if (key === 'workingCapital') title = 'Giro Operacional';
                        else title = 'Sustentabilidade do Caixa';

                        return (
                          <div key={key} className="border border-[#0E1C2C]/10 rounded-xl p-4 bg-[#0E1C2C]/5 text-xs space-y-2 text-[#0E1C2C]">
                            <span className="font-bold text-[#0E1C2C] block border-b border-[#0E1C2C]/10 pb-1">{title}</span>
                            <div className="space-y-1">
                              <p className="text-[10px] text-[#0E1C2C]/70"><strong className="text-[#0E1C2C]">Score:</strong> {dim.score}</p>
                              <p className="text-[10px] text-[#0E1C2C]/70"><strong className="text-[#0E1C2C]">Fórmula:</strong> {dim.formula}</p>
                              <p className="text-[10px] text-[#0E1C2C]/70"><strong className="text-[#0E1C2C]">Linhagem:</strong> {dim.lineage}</p>
                              <p className="text-[10px] text-[#0E1C2C]/70"><strong className="text-[#0E1C2C]">Racional:</strong> {dim.rationale}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border border-[#0E1C2C]/10 rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-[#0E1C2C]/5 px-6 py-3 border-b border-[#0E1C2C]/10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0E1C2C]/60">Tabela de Reclassificação Fiduciária</span>
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-[#0E1C2C]/5 border-b border-[#0E1C2C]/10">
                            <th className="text-left py-3 px-6 font-bold text-[#0E1C2C]/50 uppercase tracking-wider">Descrição</th>
                            <th className="text-right py-3 px-6 font-bold text-[#0E1C2C]/50 uppercase tracking-wider">Valor (R$)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0E1C2C]/10">
                          {rows.map((row: any, idx: number) => {
                            const cleanItemName = (row.conta || row.category || row.item || '');
                            const isIndented = cleanItemName.startsWith('  ');
                            const hasBullet = cleanItemName.startsWith('  * ');
                            const displayItemName = cleanItemName.replace(/^  * |^  /, '');

                            const isReclassified = row.item && (
                              row.item.includes('Relacionada') || 
                              row.item.includes('Partes Relacionadas') || 
                              row.item.includes('Societário') || 
                              row.item.includes('Capitalização') ||
                              row.item.includes('Capitalizacao') ||
                              row.item.includes('Artificial')
                            );

                            return (
                              <tr 
                                key={idx} 
                                className={cn(
                                  'hover:bg-[#0E1C2C]/5 transition-colors', 
                                  (row.isTotal || row.isSubTotal) ? 'bg-[#0E1C2C]/5 font-bold text-[#0E1C2C]' : '',
                                  isReclassified ? 'bg-[#BAB86C]/10 font-bold' : ''
                                )}
                              >
                                <td className="py-3 px-6">
                                  <span className={cn(
                                    'block flex items-center gap-1.5 flex-wrap',
                                    isIndented ? (hasBullet ? 'pl-6' : 'pl-4') : '',
                                    isReclassified ? 'text-[#0E1C2C]' : 'text-slate-600'
                                  )}>
                                    {hasBullet && <span className="w-1.5 h-1.5 rounded-full bg-[#BAB86C] shrink-0" />}
                                    <span>{displayItemName}</span>
                                  </span>
                                </td>
                                <td className={cn(
                                  "py-3 px-6 text-right font-mono", 
                                  (row.val || row.valor || row.value || 0) < 0 
                                    ? "text-[#D01D1C]" 
                                    : (isReclassified ? "text-[#0E1C2C]" : "text-slate-700")
                                )}>
                                  {formatCurrency(row.val || row.valor || row.value || 0)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DFC_EQE_SUMMARY Section (Earnings Quality Engine subordinate block) */}
            {isSectionVisible('DFC_EQE_SUMMARY') && earningsQuality && (
              <div className="bg-white border border-[#0E1C2C]/10 rounded-[32px] shadow-sm p-8 space-y-8 mb-10">
                <div>
                  <h3 className="text-xl font-black text-[#0E1C2C] uppercase tracking-wider">
                    {getEQETitle()}
                  </h3>
                  <p className="text-xs text-[#0E1C2C]/50 font-bold uppercase tracking-widest mt-1">
                    Avaliação fiduciária de integridade, sustentabilidade e recorrência da lucratividade operacional
                  </p>
                </div>

                <div className="grid grid-cols-1 @xl:grid-cols-2 @5xl:grid-cols-3 gap-8 items-center">
                  <div className="bg-[#0E1C2C]/5 border border-[#0E1C2C]/10 rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-full min-h-[300px]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0E1C2C]/50 mb-6">Nível de Sustentabilidade dos Resultados</span>
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(14, 28, 44, 0.1)" strokeWidth="8" />
                        <circle 
                          cx="50" cy="50" r="40" 
                          fill="transparent" 
                          stroke={
                            earningsQuality.score >= 85 ? '#10b981' :
                            earningsQuality.score >= 70 ? '#FF8552' :
                            earningsQuality.score >= 50 ? '#BAB86C' :
                            '#D01D1C'
                          } 
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * earningsQuality.score) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="text-center z-10">
                        <span className="text-4xl font-black text-[#0E1C2C] tracking-tighter">{earningsQuality.score}</span>
                        <span className="text-sm font-bold text-[#0E1C2C]/40">/100</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-2">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm text-center whitespace-normal break-words text-balance inline-block",
                        earningsQuality.score >= 85 ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                        earningsQuality.score >= 70 ? "bg-[#FF8552]/10 text-[#FF8552] border border-[#FF8552]/20" :
                        earningsQuality.score >= 50 ? "bg-[#BAB86C]/10 text-[#0E1C2C] border border-[#BAB86C]/20" :
                        "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      )}>
                        {earningsQuality.semanticLabel || earningsQuality.level}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#0E1C2C]/5 border border-[#0E1C2C]/10 rounded-[32px] p-4 flex items-center justify-center h-full min-h-[300px]">
                    <div className="w-full h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={earningsRadarData}>
                          <PolarGrid stroke="rgba(14, 28, 44, 0.1)" />
                          <PolarAngleAxis dataKey="subject" tick={renderPolarAngleAxisTick} />
                          <PolarRadiusAxis angle={30} domain={[0, 25]} tick={false} axisLine={false} />
                          <Radar name="Score" dataKey="A" stroke="#FF8552" fill="#FF8552" fillOpacity={0.15} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 justify-center h-full">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0E1C2C]/50">Alertas de Qualidade do Lucro</h4>
                    {earningsQuality.alerts.length === 0 ? (
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                          <Info size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-emerald-800">Conformidade de Lucro</p>
                          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Nenhum risco de integridade ou descompasso contábil relevante detectado.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                        {earningsQuality.alerts.filter((alert: string) => !['LOSS_WITH_CASH_CONSUMPTION', 'PROFIT_WITHOUT_CASH', 'NET_INCOME_SOURCE_MISSING', 'PREJUIZO_OPERACIONAL'].includes(alert)).map((alert: string, idx: number) => (
                          <div key={idx} className="bg-[#BAB86C]/10 border border-[#BAB86C]/25 p-4 rounded-2xl flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#BAB86C]/20 flex items-center justify-center text-[#0E1C2C] shrink-0 mt-0.5">
                              <AlertTriangle size={14} />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-[#0E1C2C]">Ponto de Atenção</p>
                              <p className="text-[10px] text-[#0E1C2C]/80 font-semibold mt-0.5 leading-relaxed">{alert}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {isSectionVisible('DFC_EQE_LINEAGE') && (
                  <div className="border-t border-slate-100 pt-8 space-y-4">
                    <div>
                      <h4 className="text-sm font-black text-[#0E1C2C] uppercase tracking-widest">
                        {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate('Explicabilidade & Rastreabilidade do Lucro (EQE)', densityLevel)}
                      </h4>
                      <p className="text-[10px] text-[#0E1C2C]/50 font-bold uppercase tracking-widest mt-0.5">Fórmula, linhagem contábil, racional e triggers de proteção de maturidade</p>
                    </div>

                    {earningsQuality?.netIncomeTrace && (
                      <div className="bg-[#0E1C2C]/5 border border-[#0E1C2C]/10 rounded-3xl p-5 mt-4 flex flex-col @3xl:flex-row @3xl:items-center justify-between gap-4 shadow-xs text-[#0E1C2C]">
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-[#0E1C2C]/50">Auditoria de Linhagem do Lucro Líquido</h5>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-[#0E1C2C]/80">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-black uppercase text-[#0E1C2C]/40 tracking-wider">Fonte</span>
                            <span className="text-[#0E1C2C]">{earningsQuality.netIncomeTrace.source}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-black uppercase text-[#0E1C2C]/40 tracking-wider">Valor na DRE</span>
                            <span className="text-[#0E1C2C]">
                              {earningsQuality.netIncomeTrace.sourceValue !== null 
                                ? formatCurrency(earningsQuality.netIncomeTrace.sourceValue) 
                                : 'Não identificado na DRE'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-black uppercase text-[#0E1C2C]/40 tracking-wider">
                              {FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate('Valor usado pelo EQE', densityLevel)}
                            </span>
                            <span className="text-[#0E1C2C]">{formatCurrency(earningsQuality.netIncomeTrace.consumedByEQE)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-4">
                      {Object.entries(earningsQuality?.dimensions || {}).map(([key, dim]: [string, any]) => {
                        const isExpanded = expandedDimension === key;
                        let title = '';
                        let colorClass = '';
                        if (key === 'cashBacked') { title = 'Conversão em Caixa (Cash-Backed)'; colorClass = 'text-emerald-600'; }
                        else if (key === 'recurrence') { title = 'Recorrência Econômica'; colorClass = 'text-blue-600'; }
                        else if (key === 'sustainability') { title = 'Sustentabilidade da Margem'; colorClass = 'text-indigo-600'; }
                        else if (key === 'shareholderSupport') { title = 'Suporte dos Sócios'; colorClass = 'text-purple-600'; }
                        else if (key === 'accountingAggressiveness') { title = 'Ponto de Atenção'; colorClass = 'text-amber-600'; }
                        else { title = 'Estabilidade Longitudinal'; colorClass = 'text-rose-600'; }

                        title = FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard.translate(title, densityLevel);

                        return (
                          <div 
                            key={key}
                            onClick={() => setExpandedDimension(isExpanded ? null : key)}
                            className={cn(
                              "border rounded-2xl p-5 cursor-pointer transition-all duration-300 select-none text-left",
                              isExpanded 
                                ? "border-[#0E1C2C] bg-[#0E1C2C] text-white shadow-lg" 
                                : "border-[#0E1C2C]/10 bg-[#0E1C2C]/5 hover:bg-[#0E1C2C]/10 hover:border-[#0E1C2C]/20 text-[#0E1C2C]"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={cn("text-[9px] font-black uppercase tracking-wider", isExpanded ? "text-white/60" : colorClass)}>{title}</p>
                                <p className={cn("text-[10px] font-semibold mt-1", isExpanded ? "text-white/80" : "text-[#0E1C2C]/70")}>Score: {dim.score}</p>
                              </div>
                            </div>
                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-white/10 space-y-3.5 text-xs animate-in fade-in duration-300">
                                <div>
                                  <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Fórmula Econômica</p>
                                  <code className="block bg-black/30 p-2 rounded-lg mt-1 font-mono text-[10px] text-indigo-400 break-all">{dim.formula}</code>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Linhagem de Contas (Lineage)</p>
                                  <p className="text-[10px] font-medium text-white/80 mt-1">{dim.lineage}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {viewMode === 'oficial' && (
        <div className="bg-white border border-[#0E1C2C]/10 rounded-[32px] shadow-sm overflow-hidden mb-10">
          <div className="px-5 md:px-8 py-4 md:py-6 border-b border-[#0E1C2C]/10 flex items-center justify-between bg-[#0E1C2C]/5">
            <h4 className="text-sm font-black text-[#0E1C2C] uppercase tracking-widest">
              Detalhamento da DFC
            </h4>
            <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-[#FF8552]/10 text-[#FF8552] border border-[#FF8552]/20">
              Fluxo de Caixa Indireto
            </span>
          </div>
          {metrics.fiduciary?.tableRows?.some((r: any) => r.isReconstructed) && (
            <div className="mx-5 md:mx-8 mt-6 p-4 bg-[#BAB86C]/10 border border-[#BAB86C]/30 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="text-[#BAB86C] shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs font-bold text-[#0E1C2C]">Aviso de Conciliação</p>
                <p className="text-xs text-[#0E1C2C]/80 mt-1">
                  Potential omitted related-party movement detected from Balance Sheet reconciliation.
                </p>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0E1C2C]/5 border-b border-[#0E1C2C]/10">
                  <th className="text-left py-3.5 px-5 md:px-8 text-[10px] font-bold text-[#0E1C2C]/50 uppercase tracking-widest">Descrição</th>
                  <th className="text-right py-3.5 px-5 md:px-8 text-[10px] font-bold text-[#0E1C2C]/50 uppercase tracking-widest">Valor (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0E1C2C]/10">
                {rows.map((row: any, i: number) => {
                   const cleanItemName = (row.conta || row.category || row.item || '');
                   const isIndented = cleanItemName.startsWith('  ');
                   const hasBullet = cleanItemName.startsWith('  * ');
                   const displayItemName = cleanItemName.replace(/^  * |^  /, '');
                   const isReclassified = false;
                   const isTotalRow = row.isTotal || row.isSubTotal;

                   return (
                     <tr 
                       key={i} 
                       className={cn(
                         'hover:bg-[#0E1C2C]/5 transition-colors group', 
                         isTotalRow ? 'bg-[#0E1C2C]/5 font-bold text-[#0E1C2C]' : '',
                         isReclassified ? 'bg-amber-500/5 hover:bg-amber-500/10' : ''
                       )}
                     >
                       <td className="py-3 px-5 md:px-8">
                         <span className={cn(
                           'block overflow-visible break-words flex items-center gap-1.5 flex-wrap', 
                           (isTotalRow || row.level === 1) ? 'text-[#0E1C2C] font-bold' : 'text-[#0E1C2C]/80 font-medium',
                           isIndented ? (hasBullet ? 'pl-8' : 'pl-6') : '',
                           isReclassified ? 'text-amber-700 dark:text-amber-500 font-bold' : ''
                         )}>
                           {hasBullet && <span className="w-1.5 h-1.5 rounded-full bg-[#FF8552] shrink-0" />}
                           <span>{displayItemName}</span>
                           {row.isReconstructed && (
                             <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#BAB86C]/10 text-[#0E1C2C] border border-[#BAB86C]/30 select-none uppercase tracking-wide shrink-0">
                               Reconstruído a partir do BP
                             </span>
                           )}
                         </span>
                       </td>
                       <td className={cn(
                         "py-3 px-5 md:px-8 text-right font-mono", 
                         (row.val || row.valor || row.value || 0) < 0 
                           ? "text-[#D01D1C]" 
                           : (isTotalRow ? "text-[#0E1C2C] font-bold" : "text-[#0E1C2C]/80")
                       )}>
                         {formatCurrency(row.val || row.valor || row.value || 0)}
                       </td>
                     </tr>
                   );
                 })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Advisory Institutions Layer */}
      {viewMode === 'oficial' && dfcInference?.narrative && (
        <div className="bg-gradient-to-br from-[#0E1C2C] via-[#0E1C2C] to-[#07111C] text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden mb-10 border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8552]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <p className="text-[10px] text-[#FF8552] uppercase font-bold tracking-widest mb-1 relative z-10">Diagnóstico de Caixa & Estratégia</p>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <Info size={22} className="text-[#FF8552]" />
              <h3 className="text-xl font-black tracking-tight text-white">Advisory Institucional</h3>
            </div>
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-300 relative z-10">
            {dfcInference.narrative.executiveNarrative || dfcInference.narrative.diagnostic}
          </p>
        </div>
      )}
      {showImportModal && (
        <ImportFinancialModal
          type="DFC"
          clientId={selectedClient}
          year={filterYear}
          clients={clients}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            refetchDFC();
            refetchHistory();
            showToast('success', 'Dados importados com sucesso!');
          }}
        />
      )}

      {showManualModal && (
        <ManualFinancialModal
          type="DFC"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => setShowManualModal(false)}
          onSuccess={() => {
            setShowManualModal(false);
            refetchDFC();
            refetchHistory();
            showToast('success', 'Dados salvos com sucesso!');
          }}
        />
      )}

      {showDeleteConfirm && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md min-w-[300px] md:min-w-[400px] shadow-2xl shrink-0">
            <h3 className="text-xl font-black text-slate-900 mb-2">Excluir Dados?</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">
              Esta ação removerá todos os registros da DFC para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-rose-500 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
              >
                {deleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {toast && typeof document !== 'undefined' && createPortal(
        <div className={cn(
          'fixed bottom-8 right-8 px-5 md:px-8 py-2.5 md:py-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 transition-all',
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        )}>
          <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
        </div>,
        document.body
      )}
    </div>
  );
}

