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
  Radar
} from 'recharts';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { PageHeader, KpiCard } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../hooks/useInstitutionalRuntime';
import { useLanguage } from '../../contexts/LanguageContext';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { DFCSemanticRenderingGuard } from '../../core/runtime/lifecycle/DFCSemanticRenderingGuard';
import { useInstitutionalAuth } from '../../core/security/auth/InstitutionalAuthProvider';
import { ExecutiveInformationDensityFramework } from '../../core/runtime/presentation-governance/ExecutiveInformationDensityFramework';
import { getProfile, mapOfficialRoleToProfileId, PresentationLayer } from '../../core/runtime/presentation-governance/ExecutiveAudienceProfile';
import { ExecutivePriorityResolver } from '../../core/runtime/decision-intelligence/ExecutivePriorityResolver';
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
  const profile = useMemo(() => getProfile(mapOfficialRoleToProfileId(userRole)), [userRole]);

  const [densityLevel, setDensityLevel] = useState<PresentationLayer>(profile.defaultDensity);

  useEffect(() => {
    setDensityLevel(profile.defaultDensity);
  }, [userRole, profile]);

  const isSectionVisible = (sectionName: string) => {
    return ExecutiveInformationDensityFramework.isSectionVisible(sectionName, densityLevel);
  };

  const isBoardMode = densityLevel === 'BOARD';

  const [technicalTableOpen, setTechnicalTableOpen] = useState(false);

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

  const dfcInference = runtimeOutput?.inferences ? Object.values(runtimeOutput.inferences).find(i => i.domain === 'Inteligência de Caixa (DFC)') : null;
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
      const violation = DFCSemanticRenderingGuard.auditSemanticRoot(semanticAudit, semanticSource);
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
      DFCSemanticRenderingGuard.validateExecutiveDisplay(semanticSource, lifecycleStage, renderedTerms);
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
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Fluxo de Caixa (DFC)" 
        subtitle="Análise detalhada de geração e consumo de caixa pelo método indireto."
        icon={WalletCards}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">

        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={(dbData.length > 0 || isGenerated) ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', (dbData.length > 0 || isGenerated) ? 'text-success' : 'text-muted-foreground/40')}>
              {dbData.length > 0 ? 'Dados Reais' : isGenerated ? 'Cálculo Dinâmico (BP/DRE)' : 'Amostra'}
            </span>
          </div>

          <div className="flex bg-card border border-border p-1 rounded-md shadow-sm items-center">
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
            className="px-4 py-3 bg-success/10 hover:bg-success text-success hover:text-white border border-success/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Lançar Dados
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-3 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Upload size={14} /> Importar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      </div>

      {/* Contexto Empresarial Block */}
      <div className="bg-white p-8 rounded-[32px] mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-indigo-100/50 shadow-sm">
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

      {/* Toggle Premium para DFC Fiduciária Ajustada */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-slate-200/50">
          <button
            onClick={() => setViewMode('oficial')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
              viewMode === 'oficial'
                ? "bg-white text-slate-900 shadow-md scale-105"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
            )}
          >
            DFC Contábil Oficial
          </button>
          <button
            onClick={() => setViewMode('fiduciario')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
              viewMode === 'fiduciario'
                ? "bg-slate-950 text-white shadow-lg scale-105"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
            )}
          >
            <span>DFC Fiduciária Ajustada</span>
            {metrics.fiduciary?.isEarlyStage && (
              <span className="bg-amber-500/20 text-amber-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0">
                Early
              </span>
            )}
          </button>
          <button
            onClick={() => setViewMode('lucro')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
              viewMode === 'lucro'
                ? "bg-indigo-950 text-white shadow-lg scale-105"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
            )}
          >
            <span>Qualidade do Lucro (EQE)</span>
          </button>
        </div>
      </div>

      {/* Toggle Premium de Densidade Informativa (EIDF) */}
      {viewMode === 'fiduciario' && (
        <div className="flex justify-center mb-8 animate-in fade-in duration-300">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-slate-200/50 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-widest px-3 py-2 flex items-center select-none text-[10px]">
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
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                    !allowed 
                      ? "text-slate-300 cursor-not-allowed opacity-50"
                      : densityLevel === lvl
                      ? "bg-slate-900 text-white shadow-md scale-105"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                  )}
                >
                  {lvl === 'BOARD' ? 'Conselho (BOARD)' :
                   lvl === 'EXECUTIVE' ? 'Diretoria (EXECUTIVE)' :
                   'Técnico (TECHNICAL)'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Alertas de Governança Fiduciária */}
      {viewMode === 'fiduciario' && metrics.fiduciary?.lifecycleProfile && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[32px] p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
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
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2 mt-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
      
      {viewMode === 'fiduciario' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          {/* Seção 1: Contexto Empresarial */}
          {isSectionVisible('DFC_CONTEXTO') && (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                  Seção 1 de 9
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Contexto Empresarial</h3>
              </div>
              <div className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-indigo-100/50 shadow-sm">
                {dfcInference?.executiveLifecycleContext?.executiveTitle || 'Análise de Estágio'}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estágio de Ciclo de Vida</span>
                <span className="text-base font-black text-slate-800">{lifecycleLabel}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ano de Fundação</span>
                <span className="text-base font-black text-slate-800">{metrics.fiduciary?.lifecycleProfile?.foundationYear || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Idade Empresarial</span>
                <span className="text-base font-black text-slate-800">
                  {metrics.fiduciary?.lifecycleProfile?.foundationYear ? `${filterYear - metrics.fiduciary.lifecycleProfile.foundationYear} ano(s)` : 'N/A'}
                </span>
              </div>
            </div>
            <p className="text-slate-600 font-medium text-sm leading-relaxed">
              {dfcInference?.executiveLifecycleContext?.executiveDescription || 'Descrição não disponível.'}
            </p>
            </div>
          )}

          {/* Seção 2: Health Score de Caixa */}
          {isSectionVisible('DFC_HEALTH_SCORE') && (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  Seção 2 de 9
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Health Score de Caixa (CQS)</h3>
              </div>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm text-center",
                cashQuality?.score >= 85 ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                cashQuality?.score >= 70 ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                cashQuality?.score >= 50 ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                "bg-rose-500/10 text-rose-600 border border-rose-500/20"
              )}>
                {cashQuality?.semanticLabel || cashQuality?.level}
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 flex flex-col items-center justify-center text-center min-h-[250px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Pontuação de Integridade</span>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke={
                        cashQuality?.score >= 85 ? '#10b981' :
                        cashQuality?.score >= 70 ? '#3b82f6' :
                        cashQuality?.score >= 50 ? '#f59e0b' :
                        '#ef4444'
                      } 
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * (cashQuality?.score || 0)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-center z-10">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">{cashQuality?.score}</span>
                    <span className="text-xs font-bold text-slate-400">/100</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-4 flex items-center justify-center min-h-[250px]">
                <div className="w-full h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={renderPolarAngleAxisTick} />
                      <PolarRadiusAxis angle={30} domain={[0, 25]} tick={false} axisLine={false} />
                      <Radar name="Score" dataKey="A" stroke="#0f172a" fill="#0f172a" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-center min-h-[250px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alertas de Caixa</span>
                {cashQuality?.alerts.length === 0 ? (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <p className="text-xs font-bold text-emerald-800">Conformidade Plena</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {cashQuality?.alerts.map((alert: string, idx: number) => (
                      <div key={idx} className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-start gap-2">
                        <AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-rose-700 font-semibold leading-normal">{alert}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
          )}

          {/* Seção 3: Diagnóstico Executivo */}
          {isSectionVisible('DFC_DIAGNOSTICO_EXECUTIVO') && (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg">
                  Seção 3 de 9
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Diagnóstico Executivo</h3>
              </div>
            </div>

            <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-md">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Questão Principal</p>
              <p className="text-sm font-bold text-slate-200">A operação é autossustentável?</p>
              <p className="text-base font-black text-emerald-400 mt-2 leading-relaxed">
                {metrics.fiduciary?.cashBoardDecisionFramework?.isOperationSelfSustaining}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="border border-slate-100 rounded-2xl p-5 space-y-1 bg-slate-50/50">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">A operação gera caixa operacional?</span>
                <p className="text-xs font-bold text-slate-800">{metrics.fiduciary?.cashBoardDecisionFramework?.cashGenerationAssessment}</p>
              </div>
              <div className="border border-slate-100 rounded-2xl p-5 space-y-1 bg-slate-50/50">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Qual a restrição principal de caixa?</span>
                <p className="text-xs font-bold text-slate-800">{metrics.fiduciary?.cashBoardDecisionFramework?.primaryConstraint}</p>
              </div>
              <div className="border border-slate-100 rounded-2xl p-5 space-y-1 bg-slate-50/50">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Qual o horizonte de sobrevivência (runway)?</span>
                <p className="text-xs font-bold text-slate-800">{metrics.fiduciary?.cashBoardDecisionFramework?.runwayAssessment}</p>
              </div>
              <div className="border border-slate-100 rounded-2xl p-5 space-y-1 bg-slate-50/50">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Qual a dependência dos sócios?</span>
                <p className="text-xs font-bold text-slate-800">{metrics.fiduciary?.cashBoardDecisionFramework?.shareholderDependency}</p>
              </div>
              <div className="border border-slate-100 rounded-2xl p-5 space-y-1 bg-slate-50/50 col-span-1 md:col-span-2">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Qual a perspectiva (outlook) de continuidade?</span>
                <p className="text-xs font-bold text-slate-800">{metrics.fiduciary?.cashBoardDecisionFramework?.boardOutlook}</p>
              </div>
              <div className="border border-amber-200/60 bg-amber-500/5 rounded-2xl p-5 space-y-1 col-span-1 md:col-span-2">
                <span className="text-[9px] font-black uppercase text-amber-600 tracking-wider">Ação imediata recomendada?</span>
                <p className="text-xs font-bold text-amber-800">{metrics.fiduciary?.cashBoardDecisionFramework?.immediateAction}</p>
              </div>
            </div>
            </div>
          )}

          {/* Seção: Top 3 Prioridades */}
          {isSectionVisible('DFC_TOP_3_PRIORITIES') && (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                    Prioridades do Conselho
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">Top 3 Prioridades</h3>
                </div>
              </div>
              <div className="space-y-4">
                {ExecutivePriorityResolver.resolve(runtimeOutput).map((d: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className={cn(
                      "w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-black shrink-0",
                      d.severity === 'CRITICAL' ? 'bg-rose-600' :
                      d.severity === 'HIGH' ? 'bg-amber-600' :
                      d.severity === 'MODERATE' ? 'bg-blue-600' : 'bg-slate-600'
                    )}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{d.sourceModule}</span>
                        <span className={cn(
                          "text-[7px] font-black uppercase tracking-widest px-1 rounded",
                          d.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          d.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                          d.severity === 'MODERATE' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                        )}>{d.severity}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-normal">{d.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">{d.rationale}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seção 4: Conversão Receita → Caixa */}
          {isSectionVisible('DFC_REVENUE_CONVERSION') && (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                  Seção 4 de 9
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Conversão Receita → Caixa</h3>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                metrics.fiduciary?.cashConversionAnalysis?.classification === 'GERA_CAIXA' ? 'bg-emerald-500/10 text-emerald-600' :
                metrics.fiduciary?.cashConversionAnalysis?.classification === 'EQUILIBRADO' ? 'bg-slate-500/10 text-slate-600' :
                'bg-rose-500/10 text-rose-600'
              )}>
                {metrics.fiduciary?.cashConversionAnalysis?.classification === 'GERA_CAIXA' ? 'Gera Caixa' :
                 metrics.fiduciary?.cashConversionAnalysis?.classification === 'EQUILIBRADO' ? 'Equilibrado' :
                 'Consome/Destrói Caixa'}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="text-left space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversão Financeira por Venda</span>
                <p className="text-2xl font-black text-slate-900 leading-tight">
                  {metrics.fiduciary?.cashConversionAnalysis?.cashConversionPer100Revenue < 0 ? '-' : ''}
                  R$ {Math.abs(metrics.fiduciary?.cashConversionAnalysis?.cashConversionPer100Revenue || 0)}
                </p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">A cada R$ 100 faturados</p>
              </div>
              <p className="text-sm font-semibold text-slate-700 max-w-xl text-left md:text-right leading-relaxed">
                {metrics.fiduciary?.cashConversionAnalysis?.rationale}
              </p>
            </div>
            </div>
          )}

          {/* Seção 5: Dependência dos Sócios */}
          {isSectionVisible('DFC_SHAREHOLDER_DEPENDENCY') && (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
                  Seção 5 de 9
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Dependência dos Sócios</h3>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                metrics.fiduciary?.shareholderDependencyAnalysis?.classification === 'AUTONOMA' ? 'bg-emerald-500/10 text-emerald-600' :
                metrics.fiduciary?.shareholderDependencyAnalysis?.classification === 'BAIXA_DEPENDENCIA' ? 'bg-blue-500/10 text-blue-600' :
                'bg-rose-500/10 text-rose-600'
              )}>
                {metrics.fiduciary?.shareholderDependencyAnalysis?.classification === 'AUTONOMA' ? 'Autônoma' :
                 metrics.fiduciary?.shareholderDependencyAnalysis?.classification === 'BAIXA_DEPENDENCIA' ? 'Baixa Dependência' :
                 metrics.fiduciary?.shareholderDependencyAnalysis?.classification === 'MODERADA_DEPENDENCIA' ? 'Mod. Dependência' :
                 'Alta/Crítica Dependência'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-100 rounded-2xl p-5 space-y-1 bg-slate-50">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Índice de Autossuficiência Financeira</span>
                <p className="text-lg font-black text-slate-800">
                  {metrics.fiduciary?.shareholderDependencyAnalysis?.autossuficienciaFinanceiraDisplay}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Aportes dos Sócios / |FCO Operacional|</p>
              </div>
              <div className="border border-slate-100 rounded-2xl p-5 space-y-1 bg-slate-50">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Dependência de Capital Externo</span>
                <p className="text-lg font-black text-slate-800">
                  {metrics.fiduciary?.shareholderDependencyAnalysis?.dependenciaCapitalExternoLabel}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Classificação fiduciária da dependência de funding</p>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
              {metrics.fiduciary?.shareholderDependencyAnalysis?.rationale}
            </p>
            </div>
          )}

          {/* Seção 6: Runway Fiduciário */}
          {isSectionVisible('DFC_RUNWAY') && (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                  Seção 6 de 9
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Runway Fiduciário</h3>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                (metrics.fiduciary?.runway || 0) < 3 ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                (metrics.fiduciary?.runway || 0) < 6 ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              )}>
                {(metrics.fiduciary?.runway || 0) < 3 ? 'Crítico' : (metrics.fiduciary?.runway || 0) < 6 ? 'Atenção' : 'Estável'}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Horizonte de Sobrevivência</span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {(metrics.fiduciary?.runway || 0) >= 99 ? '99+' : (metrics.fiduciary?.runway || 0).toFixed(1)} meses
                </p>
              </div>
              
              <div className="text-left md:text-right max-w-xl">
                {((metrics.fiduciary?.runway || 0) < 3) ? (
                  <p className="text-sm font-bold text-rose-600 bg-rose-500/5 border border-rose-200/50 p-4 rounded-xl leading-relaxed">
                    A organização possui menos de um trimestre de cobertura operacional caso a atual taxa de consumo de caixa permaneça inalterada.
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    A companhia apresenta runway confortável para sustentar a queima de caixa operacional.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 text-xs">
                <span className="text-slate-400 font-bold block mb-1">Caixa Disponível</span>
                <span className="font-bold text-slate-800">{formatCurrency(metrics.fiduciary?.runwayAudit?.caixaDisponivel || 0)}</span>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 text-xs">
                <span className="text-slate-400 font-bold block mb-1">FCO Operacional</span>
                <span className="font-bold text-slate-800">{formatCurrency(metrics.fiduciary?.runwayAudit?.fcoUsado || 0)}</span>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 text-xs">
                <span className="text-slate-400 font-bold block mb-1">Consumo Mensal Médio</span>
                <span className="font-bold text-slate-800">{formatCurrency(metrics.fiduciary?.runwayAudit?.consumoMensalMedio || 0)}</span>
              </div>
            </div>
            </div>
          )}

          {/* Seção 7: Advisory do Conselho */}
          {isSectionVisible('DFC_ADVISORY') && (
            <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden space-y-6 text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                  Seção 7 de 9
                </span>
                <h3 className="text-xl font-black">Advisory do Conselho</h3>
              </div>
              {metrics.fiduciary?.isEarlyStage && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0">
                  Maturidade de Early-Stage
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Interpretação Executiva</p>
                <p className="text-sm font-bold text-slate-200 leading-relaxed">
                  {metrics.fiduciary?.cashExecutiveAdvisory?.interpretacaoExecutiva}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Parecer Consolidado</p>
                <p className="text-xs font-semibold leading-relaxed text-slate-300">
                  {metrics.fiduciary?.cashExecutiveAdvisory?.parecerConsolidado}
                </p>
              </div>
            </div>
            </div>
          )}

          {/* Seção 8: Reconciliação BP × DFC */}
          {isSectionVisible('DFC_RECONCILIATION_DETAIL') && (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  Seção 8 de 9
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Reconciliação BP × DFC</h3>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                metrics.fiduciary?.reconciliationMismatch 
                  ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" 
                  : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              )}>
                {metrics.fiduciary?.reconciliationMismatch ? "Divergência Detectada" : "Conciliado (Diferença R$ 0)"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Cálculo DFC</span>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Caixa Inicial DFC:</span>
                  <span className="text-slate-800">{formatCurrency(metrics.fiduciary?.caixaInicialDFC || 0)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Variação DFC:</span>
                  <span className="text-slate-800">{formatCurrency(metrics.fiduciary?.variacaoDFC || 0)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold border-t border-slate-200/60 pt-2">
                  <span className="text-slate-700">Caixa Final Estimado:</span>
                  <span className="text-slate-900">{formatCurrency(metrics.fiduciary?.caixaFinalEstimadoDFC || 0)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Valores BP (Real)</span>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Caixa Inicial Real (BP):</span>
                  <span className="text-slate-800">{formatCurrency(metrics.fiduciary?.caixaInicialBP || 0)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Variação Real (BP):</span>
                  <span className="text-slate-800">{formatCurrency(metrics.fiduciary?.variacaoLiquidaConciliada || 0)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold border-t border-slate-200/60 pt-2">
                  <span className="text-slate-700">Caixa Final Real (BP):</span>
                  <span className="text-slate-900">{formatCurrency(metrics.fiduciary?.caixaFinalBP || 0)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4 text-xs font-bold">
              <span className="text-slate-600">Reconciliation Gap:</span>
              <span className={cn(
                "text-sm font-black",
                metrics.fiduciary?.reconciliationMismatch ? "text-rose-600" : "text-emerald-600"
              )}>
                {formatCurrency(metrics.fiduciary?.reconciliationGap || 0)}
              </span>
            </div>
            </div>
          )}

          {/* Seção 9: Camada Técnica */}
          {isSectionVisible('DFC_CQS_COMPONENTS') && (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                  Seção 9 de 9
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Camada Técnica</h3>
              </div>
              <button
                onClick={() => setTechnicalTableOpen(!technicalTableOpen)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all select-none"
              >
                {technicalTableOpen ? 'Ocultar Detalhes' : 'Visualizar Detalhes'}
              </button>
            </div>

            {technicalTableOpen && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(cashQuality?.dimensions || {}).map(([key, dim]: [string, any]) => {
                    let title = '';
                    if (key === 'conversion') title = 'Conversão Operacional';
                    else if (key === 'dependency') title = 'Independência dos Sócios';
                    else if (key === 'liquidity') title = 'Integridade da Liquidez';
                    else if (key === 'stress') title = 'Resiliência de Tesouraria';
                    else if (key === 'workingCapital') title = 'Giro Operacional';
                    else title = 'Sustentabilidade do Caixa';

                    return (
                      <div key={key} className="border border-slate-100 rounded-xl p-4 bg-slate-50 text-xs space-y-2">
                        <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">{title}</span>
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-500"><strong>Score:</strong> {dim.score}</p>
                          <p className="text-[10px] text-slate-500"><strong>Fórmula:</strong> {dim.formula}</p>
                          <p className="text-[10px] text-slate-500"><strong>Linhagem:</strong> {dim.lineage}</p>
                          <p className="text-[10px] text-slate-500"><strong>Racional:</strong> {dim.rationale}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tabela de Reclassificação Fiduciária</span>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100/50 border-b border-slate-200">
                        <th className="text-left py-3 px-6 font-bold text-slate-400 uppercase tracking-wider">Descrição</th>
                        <th className="text-right py-3 px-6 font-bold text-slate-400 uppercase tracking-wider">Valor (R$)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.map((row: any, idx: number) => {
                        const cleanItemName = (row.conta || row.category || row.item || '');
                        const isIndented = cleanItemName.startsWith('  ');
                        const hasBullet = cleanItemName.startsWith('  * ');
                        const displayItemName = cleanItemName.replace(/^  \* |^  /, '');

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
                              'hover:bg-slate-50 transition-colors', 
                              (row.isTotal || row.isSubTotal) ? 'bg-slate-50/50 font-bold' : '',
                              isReclassified ? 'bg-amber-500/5 font-bold' : ''
                            )}
                          >
                            <td className="py-3 px-6">
                              <span className={cn(
                                'block flex items-center gap-1.5 flex-wrap',
                                isIndented ? (hasBullet ? 'pl-6' : 'pl-4') : '',
                                isReclassified ? 'text-amber-700' : 'text-slate-600'
                              )}>
                                {hasBullet && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                                <span>{displayItemName}</span>
                              </span>
                            </td>
                            <td className={cn(
                              "py-3 px-6 text-right font-mono", 
                              (row.val || row.valor || row.value || 0) < 0 
                                ? "text-rose-500" 
                                : (isReclassified ? "text-amber-600" : "text-slate-700")
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
        </div>
      )}

      {viewMode === 'lucro' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KpiCard 
            title="Lucro Líquido Contábil"
            value={lucroLiquidoRender === null ? 'Não identificado na DRE' : formatValue(lucroLiquidoRender, '')}
            suffix={lucroLiquidoRender === null ? '' : 'R$'}
            icon={WalletCards}
            status={lucroLiquidoRender === null ? 'Amarelo' : (lucroLiquidoRender >= 0 ? 'Verde' : 'Vermelho')}
          />
          <KpiCard 
            title="EBITDA Ajustado"
            value={formatValue(ebitda || 0, '')}
            suffix="R$"
            icon={TrendingUp}
            status={(ebitda || 0) >= 0 ? 'Verde' : 'Vermelho'}
          />
          <KpiCard 
            title="FCO Operacional Real"
            value={formatValue(metrics.fiduciary?.fcoOperacionalReal || 0, '')}
            suffix="R$"
            icon={WalletCards}
            status={(metrics.fiduciary?.fcoOperacionalReal || 0) >= 0 ? 'Verde' : 'Vermelho'}
          />
          <KpiCard 
            title="Score Qualidade Lucro"
            value={(earningsQuality?.score || 0).toFixed(0)}
            suffix="/100"
            icon={Info}
            status={(earningsQuality?.score || 0) >= 70 ? 'Verde' : (earningsQuality?.score || 0) >= 50 ? 'Amarelo' : 'Vermelho'}
          />
        </div>
      )}

      {viewMode !== 'fiduciario' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {viewMode === 'lucro' ? 'Conversão e Geração de Lucro' : 'Origens e Aplicações'}
                </h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">
                  {viewMode === 'lucro' ? 'Comparativo Histórico de Resultados e Caixa' : 'Comparativo Histórico de Fluxos'}
                </p>
              </div>
              {viewMode === 'lucro' ? (
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Lucro Líq.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">EBITDA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">FCO Real</span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">F.O.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">F.I.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">F.F.</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/50">{payload[0].payload.year}</p>
                            <div className="space-y-1.5">
                              {payload.map((p: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between gap-8">
                                  <span className="text-[10px] font-bold text-white/70 uppercase">{p.name}</span>
                                  <span className="text-xs font-black">{formatCurrency(p.value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {viewMode === 'lucro' ? (
                    <>
                      <Bar dataKey="lucroLiquido" name="Lucro Líquido" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="ebitda" name="EBITDA Ajustado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="operacionalReal" name="FCO Operacional Real" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </>
                  ) : (
                    <>
                      <Bar dataKey={viewMode === 'oficial' ? "operacional" : "operacionalReal"} name={viewMode === 'oficial' ? "Operacional" : "Operacional Real"} fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="investimento" name="Investimento" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="financiamento" name="Financiamento" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <h3 className="text-lg font-black mb-1">Destaques</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8">
              {viewMode === 'lucro' ? 'Análise do Resultado' : 'Análise de Liquidez'}
            </p>
            
            {viewMode === 'oficial' ? (
              <div className="space-y-6 flex-1">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Saldo Final Estimado</p>
                    <p className="text-sm font-bold">{formatCurrency(variacao)}</p>
                    <p className="text-[9px] text-white/30 font-medium mt-1 italic">Fluxo líquido do período</p>
                 </div>
                 
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Capacidade de Reinvestimento</p>
                    <p className="text-sm font-bold">{fco > 0 ? ((Math.abs(fci || 0) / fco) * 100).toFixed(1) : 0}%</p>
                    <p className="text-[9px] text-white/30 font-medium mt-1 italic">% do FCO aplicado em Investimentos</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                 <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Conversão (FCO Real / Lucro Líquido)</p>
                    <p className="text-sm font-bold">
                      {lucroLiquido > 0 ? `${((metrics.fiduciary?.fcoOperacionalReal || 0) / lucroLiquido * 100).toFixed(1)}%` : 'N/A'}
                    </p>
                    <p className="text-[8px] text-white/30 font-medium mt-0.5 italic">Rescaldo financeiro do resultado de competência</p>
                 </div>
                 <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Confiança Longitudinal</p>
                      <p className="text-[8px] text-white/30 font-medium mt-0.5 italic">Baseado em ciclos históricos</p>
                    </div>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                      semanticSource === 'ELSA' && lifecycleStage === 'INITIAL_CAPITALIZATION' ? 'bg-indigo-500/20 text-indigo-400' :
                      earningsQuality?.confidence === 'HIGH_CONFIDENCE' ? 'bg-emerald-500/20 text-emerald-400' :
                      earningsQuality?.confidence === 'MODERATE_CONFIDENCE' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    )}>
                      {semanticSource === 'ELSA' && lifecycleStage === 'INITIAL_CAPITALIZATION' ? executiveDisplay?.confidenceStatus :
                       earningsQuality?.confidence === 'HIGH_CONFIDENCE' ? 'Alta (>3 ciclos)' :
                       earningsQuality?.confidence === 'MODERATE_CONFIDENCE' ? 'Média (2-3 ciclos)' :
                       'Baixa (<2 ciclos)'}
                    </span>
                 </div>
                 <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Qualidade da Geração</p>
                      <p className="text-[8px] text-white/30 font-medium mt-0.5 italic">Relação entre EBITDA e Lucro</p>
                    </div>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                      (earningsQuality?.score || 0) >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                      (earningsQuality?.score || 0) >= 50 ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    )}>
                      {(earningsQuality?.score || 0) >= 85 ? 'Excelente' :
                       (earningsQuality?.score || 0) >= 70 ? 'Saudável' :
                       (earningsQuality?.score || 0) >= 50 ? 'Regular' :
                       'Crítica'}
                    </span>
                 </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Database size={18} className="text-white" />
               </div>
               <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Inteligência de Dados</p>
                 <p className="text-[10px] font-medium text-white/70 italic">Análise baseada em ciclos históricos</p>
               </div>
            </div>
          </div>
        </div>
      )}


      {/* Bloco Earnings Quality Engine (EQE) */}
      {viewMode === 'lucro' && earningsQuality && (
        <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Qualidade do Lucro (Earnings Quality Score - EQS)</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Avaliação fiduciária de integridade, sustentabilidade e recorrência da lucratividade operacional
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Esquerda: Gauge Card & Alertas */}
            <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-full min-h-[300px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Earnings Integrity Level</p>
              
              {/* Circular score display */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="#e2e8f0" 
                    strokeWidth="8"
                  />
                  {/* Score arc */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke={
                      earningsQuality.score >= 85 ? '#10b981' :
                      earningsQuality.score >= 70 ? '#3b82f6' :
                      earningsQuality.score >= 50 ? '#f59e0b' :
                      '#ef4444'
                    } 
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * earningsQuality.score) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="text-center z-10">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{earningsQuality.score}</span>
                  <span className="text-sm font-bold text-slate-400">/100</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-6 flex flex-col items-center gap-2">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm text-center",
                  earningsQuality.score >= 85 ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                  earningsQuality.score >= 70 ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                  earningsQuality.score >= 50 ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                  "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                )}>
                  {earningsQuality.semanticLabel || earningsQuality.level}
                </span>
                {(earningsQuality.rawRiskLevel && earningsQuality.rawRiskLevel !== earningsQuality.semanticLabel) && (
                  <span className="text-[10px] text-slate-500 font-medium">
                    Severidade matemática: {earningsQuality.rawRiskLevel}
                  </span>
                )}
              </div>

              {/* Confidence Badge */}
              <span className={cn(
                "mt-3 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider",
                earningsQuality.confidence === 'HIGH_CONFIDENCE' ? "bg-emerald-500/10 text-emerald-500" :
                earningsQuality.confidence === 'MODERATE_CONFIDENCE' ? "bg-amber-500/10 text-amber-500" :
                "bg-rose-500/10 text-rose-500"
              )}>
                {earningsQuality.confidence === 'HIGH_CONFIDENCE' ? 'Confiança Longitudinal: Alta (>3 ciclos)' :
                 earningsQuality.confidence === 'MODERATE_CONFIDENCE' ? 'Confiança Longitudinal: Média (2-3 ciclos)' :
                 'Confiança Longitudinal: Baixa (<2 ciclos)'}
              </span>
            </div>

            {/* Centro: Radar Chart */}
            <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-4 flex items-center justify-center h-full min-h-[300px]">
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={earningsRadarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={renderPolarAngleAxisTick}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 25]} 
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Direita: Alertas Relacionados */}
            <div className="flex flex-col gap-4 justify-center h-full">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alertas de Qualidade do Lucro</h4>
              {earningsQuality.alerts.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center gap-3">
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
                    <div key={idx} className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                        <AlertTriangle size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-amber-800">Sensibilidade Contábil</p>
                        <p className="text-[10px] text-amber-700 font-semibold mt-0.5 leading-relaxed">{alert}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seção Explainability & Auditability */}
          <div className="border-t border-slate-100 pt-8 space-y-4">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Explicabilidade & Rastreabilidade do Lucro (EQE)</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Clique em cada dimensão para ver a fórmula, linhagem contábil, racional e triggers de proteção de maturidade</p>
            </div>

            {/* Bloco de Mini-Auditoria de Linhagem do Lucro */}
            {earningsQuality?.netIncomeTrace && (
              <div className="bg-slate-50/80 border border-slate-100 rounded-3xl p-5 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                <div>
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auditoria de Linhagem do Lucro Líquido</h5>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">
                    Comparação e conformidade entre a DRE soberana e o consumo pelo EQE.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-600">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Fonte</span>
                    <span className="text-slate-800">{earningsQuality.netIncomeTrace.source}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Valor na DRE</span>
                    <span className="text-slate-800">
                      {earningsQuality.netIncomeTrace.sourceValue !== null 
                        ? formatCurrency(earningsQuality.netIncomeTrace.sourceValue) 
                        : 'Não identificado na DRE'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Valor usado pelo EQE</span>
                    <span className="text-slate-800">
                      {earningsQuality.netIncomeTrace.consumedByEQE !== null 
                        ? formatCurrency(earningsQuality.netIncomeTrace.consumedByEQE) 
                        : 'Não identificado na DRE'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Valor renderizado</span>
                    <span className="text-slate-800">
                      {lucroLiquidoRender !== null 
                        ? formatCurrency(lucroLiquidoRender) 
                        : 'Não identificado na DRE'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Status da Linhagem</span>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                      earningsQuality.netIncomeTrace.status === 'CONSISTENT' || earningsQuality.netIncomeTrace.status === 'NOT_RENDERED'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : (earningsQuality.netIncomeTrace.status === 'MISSING_SOURCE'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-rose-500/10 text-rose-600')
                    )}>
                      {earningsQuality.netIncomeTrace.status === 'CONSISTENT' || earningsQuality.netIncomeTrace.status === 'NOT_RENDERED' ? 'Consistente' :
                       earningsQuality.netIncomeTrace.status === 'MISSING_SOURCE' ? 'Fonte Ausente' : 'Inconsistente'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(earningsQuality?.dimensions || {}).map(([key, dim]: [string, any]) => {
                const isExpanded = expandedDimension === key;
                let title = '';
                let colorClass = '';
                let bgClass = '';
                
                if (key === 'cashBacked') { title = 'Conversão em Caixa (Cash-Backed)'; colorClass = 'text-emerald-600'; bgClass = 'bg-emerald-50'; }
                else if (key === 'recurrence') { title = 'Recorrência Econômica'; colorClass = 'text-blue-600'; bgClass = 'bg-blue-50'; }
                else if (key === 'sustainability') { title = 'Sustentabilidade da Margem'; colorClass = 'text-indigo-600'; bgClass = 'bg-indigo-50'; }
                else if (key === 'shareholderSupport') { title = 'Suporte dos Sócios (RP/Aporte)'; colorClass = 'text-purple-600'; bgClass = 'bg-purple-50'; }
                else if (key === 'accountingAggressiveness') { title = 'Sensibilidade / Postura Contábil'; colorClass = 'text-amber-600'; bgClass = 'bg-amber-50'; }
                else { title = 'Estabilidade Longitudinal'; colorClass = 'text-rose-600'; bgClass = 'bg-rose-50'; }

                return (
                  <div 
                    key={key}
                    onClick={() => setExpandedDimension(isExpanded ? null : key)}
                    className={cn(
                      "border rounded-2xl p-5 cursor-pointer transition-all duration-300 select-none text-left",
                      isExpanded 
                        ? "border-slate-800 bg-slate-900 text-white shadow-lg" 
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn("text-[9px] font-black uppercase tracking-wider", isExpanded ? "text-slate-400" : colorClass)}>{title}</p>
                        <p className={cn("text-[10px] font-medium mt-1 font-semibold", isExpanded ? "text-white/70" : "text-slate-500")}>
                          {key === 'cashBacked' ? `Valor: ${((dim?.value ?? 0) * 100).toFixed(1)}%` :
                           key === 'recurrence' ? `Recorrência: ${((dim?.value ?? 0) * 100).toFixed(1)}%` :
                           key === 'sustainability' ? `Margem Bruta: ${((dim?.value ?? 0) * 100).toFixed(1)}%` :
                           key === 'shareholderSupport' ? `Suporte/EBITDA: ${((dim?.value ?? 0) * 100).toFixed(1)}%` :
                           key === 'accountingAggressiveness' ? `Depreciação: ${((dim?.value ?? 0) * 100).toFixed(2)}%` :
                           `Ciclos Históricos: ${dim?.value ?? 0}`}
                        </p>
                      </div>
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0",
                        isExpanded ? "bg-white/10 text-white" : `${bgClass} ${colorClass}`
                      )}>
                        {dim.score}/{key === 'cashBacked' ? 25 : key === 'recurrence' ? 20 : key === 'sustainability' ? 20 : key === 'shareholderSupport' ? 15 : 10}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-3.5 text-xs animate-in fade-in duration-300">
                        {!isBoardMode && (
                          <>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fórmula Econômica</p>
                              <code className="block bg-black/30 p-2 rounded-lg mt-1 font-mono text-[10px] text-indigo-400 break-all">{dim.formula}</code>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Linhagem de Contas (Lineage)</p>
                              <p className="text-[10px] font-medium text-white/80 mt-1">{dim.lineage}</p>
                            </div>
                          </>
                        )}
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ajuste Fiduciário / Proteção de Maturidade</p>
                          <p className="text-[10px] font-medium text-white/80 mt-1">{dim.adjustments}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Racional de Governança</p>
                          <p className="text-[10px] font-medium text-slate-400 leading-relaxed mt-1">{dim.rationale}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {viewMode !== 'fiduciario' && (
        <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden mb-10">
          <div className="px-5 md:px-8 py-3 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              {viewMode === 'oficial' ? 'Detalhamento da DFC' : 'Reconstrução e Fluxos do Resultado (EQE)'}
            </h4>
            <span className={cn(
              "text-[9px] font-black uppercase px-3 py-1 rounded-full",
              viewMode === 'oficial' ? "bg-blue-50 text-blue-600" : "bg-indigo-950 text-white"
            )}>
              {viewMode === 'oficial' ? 'Fluxo de Caixa Indireto' : 'Reconciliação e Qualidade do Lucro'}
            </span>
          </div>
          {viewMode === 'oficial' && metrics.fiduciary?.tableRows?.some((r: any) => r.isReconstructed) && (
            <div className="mx-5 md:mx-8 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs font-bold text-amber-800">Aviso de Conciliação</p>
                <p className="text-xs text-amber-700 mt-1">
                  Potential omitted related-party movement detected from Balance Sheet reconciliation.
                </p>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descrição</th>
                  <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row: any, i: number) => {
                   const cleanItemName = (row.conta || row.category || row.item || '');
                   const isIndented = cleanItemName.startsWith('  ');
                   const hasBullet = cleanItemName.startsWith('  * ');
                   const displayItemName = cleanItemName.replace(/^  \* |^  /, '');

                   const isReclassified = false;

                   return (
                     <tr 
                       key={i} 
                       className={cn(
                         'hover:bg-surface-container/50 transition-colors group', 
                         (row.isTotal || row.isSubTotal) ? 'bg-surface-container/30 font-bold' : '',
                         isReclassified ? 'bg-amber-500/5 hover:bg-amber-500/10' : ''
                       )}
                     >
                       <td className="py-2.5 md:py-4 px-5 md:px-8">
                         <span className={cn(
                           'block overflow-visible break-words flex items-center gap-1.5 flex-wrap', 
                           (row.isTotal || row.isSubTotal || row.level === 1) ? 'text-secondary font-bold' : 'text-muted-foreground font-medium',
                           isIndented ? (hasBullet ? 'pl-8' : 'pl-6') : '',
                           isReclassified ? 'text-amber-700 dark:text-amber-500 font-bold' : ''
                         )}>
                           {hasBullet && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                           <span>{displayItemName}</span>
                           {row.isReconstructed && (
                             <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 select-none uppercase tracking-wide shrink-0">
                               Reconstruído a partir do BP
                             </span>
                           )}
                         </span>
                       </td>
                       <td className={cn(
                         "py-2.5 md:py-4 px-5 md:px-8 text-right font-mono", 
                         (row.val || row.valor || row.value || 0) < 0 
                           ? "text-rose-500" 
                           : (isReclassified ? "text-amber-600 dark:text-amber-500 font-bold" : "text-slate-700")
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
      {viewMode !== 'fiduciario' && dfcInference?.narrative && (
        <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden mb-10">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Info size={24} className="text-secondary" />
              <h3 className="text-xl font-black">Advisory Institucional</h3>
            </div>
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-300">
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

