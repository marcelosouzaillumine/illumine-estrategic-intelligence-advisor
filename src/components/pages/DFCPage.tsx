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

  const rawSemanticSource =
    semanticContext?.semanticSource
    ?? dfcInference?.semanticSource
    ?? 'LEGACY';

  const rawLifecycleStage = semanticContext?.lifecycleStage ?? outputAny?.institutionalContext?.lifecycleStage ?? 'ESTABLISHED_ANALYSIS';
  const executiveDisplay = metrics.semanticDisplays?.executiveDisplay;
  
  const cqsSemantic = dfcInference?.cqsSemantic;
  const eqsSemantic = dfcInference?.eqsSemantic;
  const executiveNarrative = dfcInference?.executiveNarrative;

  const semanticEvidenceIsElsa =
    (cqsSemantic as any)?.lifecycleStage === 'INITIAL_CAPITALIZATION' ||
    cqsSemantic === 'Estrutura de Caixa Dependente de Capitalização Inicial' ||
    (eqsSemantic as any)?.lifecycleStage === 'INITIAL_CAPITALIZATION' ||
    eqsSemantic === 'Risco de Resultado em Fase Inicial de Capitalização' ||
    executiveNarrative?.toLowerCase().includes('fase inicial de capitalização');

  const semanticSource = semanticEvidenceIsElsa ? 'ELSA' : rawSemanticSource;
  const lifecycleStage = semanticEvidenceIsElsa ? 'INITIAL_CAPITALIZATION' : rawLifecycleStage;
  
  const debugSemanticSource = {
    root: dfcInference?.semanticSource,
    semanticContext: dfcInference?.semanticContext?.semanticSource,
    lifecycleProfile: dfcInference?.lifecycleProfile?.semanticSource,
    fiduciary: dfcInference?.metrics?.fiduciary?.semanticSource,
    resolvedRoot: semanticSource
  };

  const featureFlags = { showSemanticAudit: process.env.NODE_ENV !== 'production' };

  useEffect(() => {
    if (featureFlags.showSemanticAudit) {
      const violation = DFCSemanticRenderingGuard.auditSemanticRoot(
        rawSemanticSource,
        cqsSemantic,
        eqsSemantic,
        executiveNarrative
      );
      if (violation) {
        console.error('DFC_SEMANTIC_ROOT_MISMATCH:', violation);
      }
      console.table({
        semanticSource,
        lifecycleProfile: dfcInference?.lifecycleProfile,
        semanticContext,
        cqsSemantic,
        eqsSemantic,
        advisoryNarrative: executiveNarrative
      });
    }
  }, [rawSemanticSource, semanticSource, dfcInference, semanticContext, cqsSemantic, eqsSemantic, executiveNarrative]);
  
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
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-md px-4 py-2 flex flex-col items-start gap-0.5 shadow-sm">
            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Contexto Empresarial</span>
            <span className="text-[10px] font-bold text-indigo-700">
              Estágio: {lifecycleStage === 'INITIAL_CAPITALIZATION' ? 'Fase Inicial de Capitalização' : lifecycleStage}
              <span className="mx-2">|</span>
              Fonte: {semanticSource}
            </span>
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-1 text-[8px] bg-black/5 p-1 rounded font-mono w-full">
                Audit: {JSON.stringify(debugSemanticSource)}
              </div>
            )}
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <KpiCard 
            title="FCO Operacional Real"
            value={formatValue(metrics.fiduciary?.fcoOperacionalReal || 0, '')}
            suffix="R$"
            icon={WalletCards}
            status={(metrics.fiduciary?.fcoOperacionalReal || 0) >= 0 ? 'Verde' : 'Vermelho'}
          />
          <KpiCard 
            title="FCO Ajustado"
            value={formatValue(metrics.fiduciary?.fcoAjustado || 0, '')}
            suffix="R$"
            icon={WalletCards}
            status={(metrics.fiduciary?.fcoAjustado || 0) >= 0 ? 'Verde' : 'Vermelho'}
          />
          <KpiCard 
            title="Runway Fiduciário"
            value={(metrics.fiduciary?.runway || 0) >= 99 ? '99+' : (metrics.fiduciary?.runway || 0).toFixed(1)}
            suffix="meses"
            icon={TrendingUp}
            status={(metrics.fiduciary?.runway || 0) >= 12 ? 'Verde' : (metrics.fiduciary?.runway || 0) >= 6 ? 'Amarelo' : 'Vermelho'}
          />
          <KpiCard 
            title="Intensidade Partes Relacionadas"
            value={((metrics.fiduciary?.intensidadePartesRelacionadas || 0) * 100).toFixed(1)}
            suffix="%"
            icon={Info}
            status={(metrics.fiduciary?.intensidadePartesRelacionadas || 0) <= 0.1 ? 'Verde' : (metrics.fiduciary?.intensidadePartesRelacionadas || 0) <= 0.25 ? 'Amarelo' : 'Vermelho'}
          />
          <KpiCard 
            title="Drenagem Societária"
            value={((metrics.fiduciary?.drenagemSocietaria || 0) * 100).toFixed(1)}
            suffix="%"
            icon={TrendingDown}
            status={(metrics.fiduciary?.drenagemSocietaria || 0) <= 0.05 ? 'Verde' : (metrics.fiduciary?.drenagemSocietaria || 0) <= 0.15 ? 'Amarelo' : 'Vermelho'}
          />
          <KpiCard 
            title="Liquidez Operacional Real"
            value={(metrics.fiduciary?.liquidezOperacionalReal || 0).toFixed(2)}
            suffix="x"
            icon={WalletCards}
            status={(metrics.fiduciary?.liquidezOperacionalReal || 0) >= 1.2 ? 'Verde' : (metrics.fiduciary?.liquidezOperacionalReal || 0) >= 0.8 ? 'Amarelo' : 'Vermelho'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Conciliação BP x DFC */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Conciliação BP x DFC</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Auditabilidade de saldos e disponibilidades</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-2">
              <div className="border-b border-slate-100 pb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Fluxo Contábil DFC:</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Caixa Inicial DFC =</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(metrics.fiduciary?.caixaInicialDFC || 0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Variação DFC =</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(metrics.fiduciary?.variacaoDFC || 0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Caixa Final Estimado DFC =</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(metrics.fiduciary?.caixaFinalEstimadoDFC || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-100 pb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Posição Patrimonial BP:</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Caixa Inicial Real =</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(metrics.fiduciary?.caixaInicialBP || 0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Caixa Final BP =</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(metrics.fiduciary?.caixaFinalBP || 0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Variação BP =</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(metrics.fiduciary?.variacaoLiquidaConciliada || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Gap =</span>
                  <span className={cn(
                    metrics.fiduciary?.reconciliationMismatch ? "text-rose-600" : "text-emerald-600"
                  )}>
                    {formatCurrency(metrics.fiduciary?.reconciliationGap || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Status =</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                    metrics.fiduciary?.reconciliationMismatch 
                      ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" 
                      : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  )}>
                    {metrics.fiduciary?.reconciliationMismatch ? "Divergência" : "Conciliado"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Qualidade da Reconciliação */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Qualidade da Reconciliação</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Grau de confiabilidade do modelo longitudinal</p>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                semanticSource === 'ELSA' && lifecycleStage === 'INITIAL_CAPITALIZATION' ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20" :
                earningsQuality?.confidence === 'HIGH_CONFIDENCE' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                earningsQuality?.confidence === 'MODERATE_CONFIDENCE' ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                "bg-rose-500/10 text-rose-600 border border-rose-500/20"
              )}>
                {semanticSource === 'ELSA' && lifecycleStage === 'INITIAL_CAPITALIZATION' ? executiveDisplay?.confidenceStatus :
                 earningsQuality?.confidence === 'HIGH_CONFIDENCE' ? "Alta Confiança" :
                 earningsQuality?.confidence === 'MODERATE_CONFIDENCE' ? "Média Confiança" :
                 "Baixa Confiança"}
              </span>
            </div>

            <div className="space-y-3 mt-2 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  earningsQuality?.confidence === 'HIGH_CONFIDENCE' ? "bg-emerald-500" :
                  earningsQuality?.confidence === 'MODERATE_CONFIDENCE' ? "bg-amber-500" :
                  "bg-rose-500"
                )} />
                <p className="text-xs text-slate-600 font-medium">
                  {earningsQuality?.confidence === 'HIGH_CONFIDENCE' 
                    ? "Modelo possui dados de 3 ou mais ciclos históricos, permitindo previsibilidade e auditoria de alta acurácia."
                    : earningsQuality?.confidence === 'MODERATE_CONFIDENCE'
                    ? "Modelo baseado em 2 ciclos históricos. Estabilidade moderada das tendências longitudinais."
                    : "Modelo baseado em ciclo único. Capacidade longitudinal limitada de previsão fiduciária."
                  }
                </p>
              </div>
              <div className="flex justify-between text-[10px] uppercase font-black tracking-wider text-slate-400 pt-2">
                <span>Ciclos Históricos Auditáveis até {filterYear}:</span>
                <span className="text-slate-700">{allHistoryData ? [...new Set(allHistoryData.filter((d: any) => d.year <= filterYear).map((d: any) => d.year))].length : 0}</span>
              </div>
              {lifecycleStage === 'INITIAL_CAPITALIZATION' && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-indigo-50 border border-indigo-100 rounded text-indigo-700 text-xs font-medium">
                  <Info className="w-4 h-4" />
                  Fase inicial de capitalização ativada
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Auditoria do Runway Fiduciário */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Auditoria do Runway Fiduciário</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Horizonte de sobrevivência operacional</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-2">
              <div className="border-b border-slate-100 pb-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Caixa Disponível =</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(metrics.fiduciary?.runwayAudit?.caixaDisponivel || 0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">FCO Operacional =</span>
                    <span className="font-semibold text-rose-600">{formatCurrency(metrics.fiduciary?.runwayAudit?.fcoUsado || 0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Consumo Mensal =</span>
                    <span className="font-semibold text-amber-600">{formatCurrency(metrics.fiduciary?.runwayAudit?.consumoMensalMedio || 0)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Runway Estimado</p>
                  <p className="text-sm font-black text-slate-800">{(metrics.fiduciary?.runwayAudit?.runwayMeses || 0).toFixed(2)} meses</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Fórmula</p>
                  <p className="text-[10px] text-slate-500 max-w-[150px] leading-tight">
                    {metrics.fiduciary?.runwayAudit?.formula || 'Caixa ÷ Consumo Mensal'}
                    <br/>(Base: {metrics.fiduciary?.runwayAudit?.periodoBase || '12 meses'})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
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
                  <p className="text-sm font-bold">{fco > 0 ? ((Math.abs(fci) / fco) * 100).toFixed(1) : 0}%</p>
                  <p className="text-[9px] text-white/30 font-medium mt-1 italic">% do FCO aplicado em Investimentos</p>
               </div>
            </div>
          ) : viewMode === 'fiduciario' ? (
            <div className="space-y-4 flex-1">
               <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Conversão EBITDA → Caixa</p>
                  <p className="text-sm font-bold">
                    {metrics.fiduciary?.cashConversionDisplay?.status === 'SEVERE_DETERIORATION' ? 'Conversão Severamente Deteriorada' :
                     metrics.fiduciary?.cashConversionDisplay?.status === 'NOT_APPLICABLE' ? 'Não Aplicável' :
                     metrics.fiduciary?.cashConversionDisplay?.label || 'N/A'}
                  </p>
                  <p className="text-[8px] text-white/30 font-medium mt-0.5 italic">Eficiência fiduciária da geração operacional</p>
               </div>
               <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Stress de Liquidez</p>
                    <p className="text-[8px] text-white/30 font-medium mt-0.5 italic">Com base no passivo circulante</p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                    semanticSource === 'ELSA' && lifecycleStage === 'INITIAL_CAPITALIZATION' ? 'bg-indigo-500/20 text-indigo-400' :
                    metrics.fiduciary?.stressLiquidez === 'Estável' ? 'bg-emerald-500/20 text-emerald-400' :
                    metrics.fiduciary?.stressLiquidez === 'Atenção' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  )}>
                    {semanticSource === 'ELSA' && lifecycleStage === 'INITIAL_CAPITALIZATION' ? executiveDisplay?.liquidityStatus : (metrics.fiduciary?.stressLiquidez || 'Estável')}
                  </span>
               </div>
               <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Sustentabilidade de Tesouraria</p>
                    <p className="text-[8px] text-white/30 font-medium mt-0.5 italic">Autonomia operacional de caixa</p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                    semanticSource === 'ELSA' && lifecycleStage === 'INITIAL_CAPITALIZATION' ? 'bg-indigo-500/20 text-indigo-400' :
                    metrics.fiduciary?.sustentabilidadeTesouraria === 'Sustentável' ? 'bg-emerald-500/20 text-emerald-400' :
                    metrics.fiduciary?.sustentabilidadeTesouraria === 'Sensível' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  )}>
                    {semanticSource === 'ELSA' && lifecycleStage === 'INITIAL_CAPITALIZATION' ? executiveDisplay?.treasuryStatus : (metrics.fiduciary?.sustentabilidadeTesouraria || 'Sustentável')}
                  </span>
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

      {/* Bloco Cash Quality Score (CQS) */}
      {viewMode === 'fiduciario' && cashQuality && (
        <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Qualidade do Caixa (Cash Quality Score - CQS)</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Avaliação fiduciária de integridade, sustentabilidade e autonomia da geração de caixa
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Esquerda: Gauge Card & Alertas */}
            <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-full min-h-[300px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Treasury Integrity Level</p>
              
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
                      cashQuality.score >= 85 ? '#10b981' :
                      cashQuality.score >= 70 ? '#3b82f6' :
                      cashQuality.score >= 50 ? '#f59e0b' :
                      '#ef4444'
                    } 
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * cashQuality.score) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="text-center z-10">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{cashQuality.score}</span>
                  <span className="text-sm font-bold text-slate-400">/100</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-6 flex flex-col items-center gap-2">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm text-center",
                  cashQuality.score >= 85 ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                  cashQuality.score >= 70 ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                  cashQuality.score >= 50 ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                  "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                )}>
                  {cashQuality.semanticLabel || cashQuality.level}
                </span>
                {(cashQuality.rawRiskLevel && cashQuality.rawRiskLevel !== cashQuality.semanticLabel) && (
                  <span className="text-[10px] text-slate-500 font-medium">
                    Severidade matemática: {cashQuality.rawRiskLevel}
                  </span>
                )}
              </div>
            </div>

            {/* Centro: Radar Chart */}
            <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-4 flex items-center justify-center h-full min-h-[300px]">
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
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
                      stroke="#0f172a"
                      fill="#0f172a"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Direita: Alertas Relacionados */}
            <div className="flex flex-col gap-4 justify-center h-full">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alertas de Integridade de Caixa</h4>
              {cashQuality.alerts.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <Info size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-emerald-800">Conformidade Plena</p>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Nenhum risco relevante ou suporte artificial detectado na tesouraria.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {cashQuality.alerts.map((alert: string, idx: number) => (
                    <div key={idx} className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
                        <AlertTriangle size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-rose-800">Alerta de Risco</p>
                        <p className="text-[10px] text-rose-700 font-semibold mt-0.5 leading-relaxed">{alert}</p>
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
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Explicabilidade & Rastreabilidade Fiduciária</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Clique em cada dimensão para ver a fórmula, linhagem contábil, e auditoria dos lançamentos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(cashQuality.dimensions).map(([key, dim]: [string, any]) => {
                const isExpanded = expandedDimension === key;
                let title = '';
                let colorClass = '';
                let bgClass = '';
                
                if (key === 'conversion') { title = 'Conversão Operacional'; colorClass = 'text-emerald-600'; bgClass = 'bg-emerald-50'; }
                else if (key === 'dependency') { title = 'Independência dos Sócios'; colorClass = 'text-blue-600'; bgClass = 'bg-blue-50'; }
                else if (key === 'liquidity') { title = 'Integridade da Liquidez'; colorClass = 'text-indigo-600'; bgClass = 'bg-indigo-50'; }
                else if (key === 'stress') { title = 'Resiliência de Tesouraria'; colorClass = 'text-purple-600'; bgClass = 'bg-purple-50'; }
                else if (key === 'workingCapital') { title = 'Giro Operacional'; colorClass = 'text-amber-600'; bgClass = 'bg-amber-50'; }
                else { title = 'Sustentabilidade do Caixa'; colorClass = 'text-rose-600'; bgClass = 'bg-rose-50'; }

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
                          {key === 'conversion' ? `Valor: ${(dim.value * 100).toFixed(1)}%` :
                           key === 'dependency' ? `Dependência: ${(dim.value * 100).toFixed(1)}%` :
                           key === 'liquidity' ? `Liquidez: ${dim.value.toFixed(2)}x` :
                           key === 'stress' ? `Runway: ${dim.value >= 99 ? '99+' : dim.value.toFixed(1)} meses` :
                           `Pontuação: ${dim.value}`}
                        </p>
                      </div>
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0",
                        isExpanded ? "bg-white/10 text-white" : `${bgClass} ${colorClass}`
                      )}>
                        {dim.score}/{key === 'conversion' ? 25 : key === 'liquidity' ? 20 : key === 'dependency' ? 20 : key === 'stress' ? 15 : 10}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-3.5 text-xs animate-in fade-in duration-300">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fórmula Econômica</p>
                          <code className="block bg-black/30 p-2 rounded-lg mt-1 font-mono text-[10px] text-emerald-400 break-all">{dim.formula}</code>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Linhagem de Contas (Lineage)</p>
                          <p className="text-[10px] font-medium text-white/80 mt-1">{dim.lineage}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ajuste Fiduciário</p>
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
              {Object.entries(earningsQuality.dimensions).map(([key, dim]: [string, any]) => {
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
                          {key === 'cashBacked' ? `Valor: ${(dim.value * 100).toFixed(1)}%` :
                           key === 'recurrence' ? `Recorrência: ${(dim.value * 100).toFixed(1)}%` :
                           key === 'sustainability' ? `Margem Bruta: ${(dim.value * 100).toFixed(1)}%` :
                           key === 'shareholderSupport' ? `Suporte/EBITDA: ${(dim.value * 100).toFixed(1)}%` :
                           key === 'accountingAggressiveness' ? `Depreciação: ${(dim.value * 100).toFixed(2)}%` :
                           `Ciclos Históricos: ${dim.value}`}
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
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fórmula Econômica</p>
                          <code className="block bg-black/30 p-2 rounded-lg mt-1 font-mono text-[10px] text-indigo-400 break-all">{dim.formula}</code>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Linhagem de Contas (Lineage)</p>
                          <p className="text-[10px] font-medium text-white/80 mt-1">{dim.lineage}</p>
                        </div>
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

      <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden mb-10">
        <div className="px-5 md:px-8 py-3 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            {viewMode === 'oficial' ? 'Detalhamento da DFC' : 
             viewMode === 'fiduciario' ? 'Detalhamento da DFC Fiduciária Ajustada' : 
             'Reconstrução e Fluxos do Resultado (EQE)'}
          </h4>
          <span className={cn(
            "text-[9px] font-black uppercase px-3 py-1 rounded-full",
            viewMode === 'oficial' ? "bg-blue-50 text-blue-600" : 
            viewMode === 'fiduciario' ? "bg-slate-950 text-white" : 
            "bg-indigo-950 text-white"
          )}>
            {viewMode === 'oficial' ? 'Fluxo de Caixa Indireto' : 
             viewMode === 'fiduciario' ? 'Reclassificação Fiduciária' : 
             'Reconciliação e Qualidade do Lucro'}
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

                 const isReclassified = viewMode === 'fiduciario' && row.item && (
                   row.item.includes('Relacionada') || 
                   row.item.includes('Partes Relacionadas') || 
                   row.item.includes('Societário') || 
                   row.item.includes('Capitalização') ||
                   row.item.includes('Capitalizacao') ||
                   row.item.includes('Artificial')
                 );

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

      {/* Advisory Institutions Layer */}
      {dfcInference?.narrative && (
        <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden mb-10">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Info size={24} className="text-secondary" />
              <h3 className="text-xl font-black">Advisory Institucional {viewMode === 'fiduciario' && 'Fiduciário'}</h3>
            </div>
            {viewMode === 'fiduciario' && metrics.fiduciary?.isEarlyStage && (
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0">
                Proteção Early-Stage Ativa
              </span>
            )}
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

