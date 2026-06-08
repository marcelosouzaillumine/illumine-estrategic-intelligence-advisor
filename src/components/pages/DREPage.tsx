import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Loader2, Upload, Trash2, Plus, BarChart3, Database, TrendingUp, TrendingDown, Info, PieChart as PieChartIcon, AlertTriangle, Sparkles, Bug, Target, Shield, Activity, Layers, Scale, Zap, Building2, Coins, Receipt, Briefcase, CheckCircle, AlertCircle, RefreshCw, BarChart2, Eye, ShieldAlert, Cpu } from 'lucide-react';
import { DATA } from '../../data';
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
  Pie
} from 'recharts';
import { cn, formatCurrency, formatValue, getThemeColors } from '../../lib/utils';
import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { PageHeader, KpiCard } from '../Common';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { FiduciaryRuntimeAdapter, PresentationLayer, ExecutiveIntelligenceReport, ExecutiveLabelResolver } from '../../services/FiduciaryRuntimeAdapter';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { DRE_OFFICIAL_STRUCTURE } from '../../constants/dreStructure';
import { useInstitutionalAuth } from '../../core/security/auth/InstitutionalAuthProvider';
import {
  collection,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

type ToastType = { type: 'success' | 'error'; message: string } | null;

export function DREPage({ clients, selectedClient, selectedYear }: any) {
  const { translateLabel, t } = useLanguage();
  const [filterYear, setFilterYear] = useState<number>(Number(selectedYear) || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTechnicalLayer, setShowTechnicalLayer] = useState(false);
  const [, setThemeTrigger] = useState(0);

  const { session } = useInstitutionalAuth();
  const userRole = session?.role || 'BOARD_MEMBER';
  const profile = useMemo(() => FiduciaryRuntimeAdapter.getProfile(FiduciaryRuntimeAdapter.mapOfficialRoleToProfileId(userRole)), [userRole]);
  const [densityLevel, setDensityLevel] = useState<PresentationLayer>(profile.defaultDensity);  
  
  useEffect(() => {
    setDensityLevel(profile.defaultDensity);
  }, [userRole, profile]);

  useEffect(() => {
    if (densityLevel !== 'TECHNICAL') {
      setShowTechnicalLayer(false);
    }
  }, [densityLevel]);

  const isSectionVisible = (sectionName: string) => {
    return FiduciaryRuntimeAdapter.ExecutiveInformationDensityFramework.isSectionVisible(sectionName, densityLevel);
  };

  const currentClient = clients?.find((c: any) => c.id === selectedClient);
  const segmentoEmpresa = (currentClient?.segmentoAtuacao || currentClient?.segmento || 'Serviços').toLowerCase();
  
  useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => prev + 1);
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const colors = getThemeColors();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    if (selectedYear) setFilterYear(Number(selectedYear));
  }, [selectedYear]);


  // ── Busca dados anuais ──────────────────────────────────────────────────────
  const { dbData: dbDataDRE, docIds: docIdsDRE, loading: loadingDRE, refetch: refetchDRE } =
    useAnnualFinancialData(selectedClient, filterYear, 'DRE');

  const { dbData: dbDataBP } = useAnnualFinancialData(selectedClient, filterYear, 'BP');
  const { dbData: dbDataDLPA } = useAnnualFinancialData(selectedClient, filterYear, 'DLPA');
  const { dbData: dbDataDFC } = useAnnualFinancialData(selectedClient, filterYear, 'DFC');

  // ── Busca histórico (todos os dados do cliente) ──────────────────────────────
  const { dbData: allHistoryData, loading: loadingHistory, historicalFinancialSeries } = useAllFinancialData(selectedClient);

  const loading = loadingDRE;
  const dbData = dbDataDRE;
  const docIds = docIdsDRE;

  // ── Runtime Institucional (Centralizado) ──────────────────────
  const [executiveReport, setExecutiveReport] = useState<ExecutiveIntelligenceReport | null>(null);

  useEffect(() => {
    async function runAnalysis() {
      if (!dbData) return;
      const input = {
        clientProfile: currentClient,
        dreData: dbData,
        bpData: dbDataBP,
        dlpaData: dbDataDLPA,
        cashFlowData: dbDataDFC,
        rawFinancialData: { 
          filterYear, 
          segmentoEmpresa,
          allHistoryData 
        },
        historicalCyclesCount: docIds.length,
        isMockData: dbData.length === 0,
        historicalSeries: allHistoryData
      };
      const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);
      setExecutiveReport(report);
    }
    runAnalysis();
  }, [dbData, dbDataBP, dbDataDLPA, dbDataDFC, allHistoryData, filterYear, segmentoEmpresa, docIds.length]);

  const finalHealthScore = (executiveReport?.metrics.financialMetrics as any)?.dreHealthScore 
    ?? executiveReport?.scores.operational 
    ?? 0;
  
  const {
    receitaBruta = 0, deducoesReceita = 0, recLiquida = 0, custosVar = 0, margemContrib = 0,
    despesasFixas = 0, pontoEquilibrio = 0, gapEquilibrio = 0, margemSegurancaValor = 0,
    indiceDeducoes = 0, indiceCoberturaOperacional = 0, indiceMargemContrib = 0, cmvLabel = 'Custos Variáveis',
    capacidadeAbsorcaoEstrutura = 0, receitaPorOpex = 0, ebitdaVal = 0, margemLiquida = 0, ebitda = 0, lucroLiq = 0,
    cascadeResult = [], trendNote = null as any
  } = (executiveReport?.metrics.financialMetrics as any) || {};

  const qualityReport = (executiveReport?.metrics as any)?.dreInsights?.qualityReport;
  const rootCauseReport = (executiveReport?.metrics as any)?.dreInsights?.rootCauseReport;
  const economicValueAssessment = (executiveReport?.metrics as any)?.dreInsights?.economicValueAssessment;
  const earningsQualityAssessment = (executiveReport?.metrics as any)?.dreInsights?.earningsQualityAssessment;
  const confidenceAssessment = (executiveReport?.metrics as any)?.dreInsights?.confidenceAssessment;
  const managementDiscussion = (executiveReport?.metrics as any)?.dreInsights?.managementDiscussion;
  
  const revenueEconomicStructure = (executiveReport?.metrics as any)?.dreInsights?.revenueEconomicStructure;
  const economicBurnRate = (executiveReport?.metrics as any)?.dreInsights?.economicBurnRate;
  const breakEvenAnalysis = (executiveReport?.metrics as any)?.dreInsights?.breakEvenAnalysis;
  const operationalAbsorption = (executiveReport?.metrics as any)?.dreInsights?.operationalAbsorption;
  const economicDiagnosis = (executiveReport?.metrics as any)?.dreInsights?.economicDiagnosis;
  const dreExecutiveAdvisory = (executiveReport?.metrics as any)?.dreInsights?.dreExecutiveAdvisory;
  const dreExecutiveAdvisoryFull = (executiveReport?.metrics as any)?.dreInsights?.dreExecutiveAdvisoryFull;
  const dreBoardDecisionSupport = (executiveReport?.metrics as any)?.dreInsights?.dreBoardDecisionSupport;
  const healthExplainability = (executiveReport?.metrics as any)?.dreInsights?.healthExplainability;

  const kpis = executiveReport?.metrics.kpis || [];
  const scaleEfficiency = executiveReport?.metrics.scaleEfficiency;
  const smartInsights = executiveReport?.causality.insights || [];
  const systemAlerts = executiveReport?.metrics.alerts || [];
  const chartData = executiveReport?.metrics.chartData || [];
  const performanceNote = executiveReport?.advisory.executiveSummary || 'Aguardando dados estruturados para análise operacional.';

  const marginIndices = [
    { 
      name: 'Margem Bruta',  
      val: (executiveReport?.metrics.financialMetrics as any)?.mbVal || 0, 
      unit: '%', 
      status: 'Verde',
      trend: 'Sólida'
    },
    { 
      name: 'Índice de CMV', 
      val: (executiveReport?.metrics.financialMetrics as any)?.cmvVal || 0,  
      unit: '%', 
      status: 'Verde',
      trend: 'Saudável'
    },
    { 
      name: 'Margem EBITDA', 
      val: (executiveReport?.metrics.financialMetrics as any)?.ebitdaVal || 0,     
      unit: '%', 
      status: 'Verde',
      trend: 'Forte'
    },
    { 
      name: 'Margem Operacional', 
      val: (executiveReport?.metrics.financialMetrics as any)?.margemOperacional || 0,     
      unit: '%', 
      status: 'Verde',
      trend: 'Saudável'
    },
    { 
      name: 'Margem Líquida', 
      val: (executiveReport?.metrics.financialMetrics as any)?.margemLiquida || 0,     
      unit: '%', 
      status: 'Verde',
      trend: 'Lucrativa'
    },
    { 
      name: 'Conversão Operacional', 
      val: (executiveReport?.metrics.financialMetrics as any)?.indiceConversaoOperacional || 0,     
      unit: '%', 
      status: 'Verde',
      trend: 'Forte'
    },
    { 
      name: 'Absorção de Estrutura', 
      val: (executiveReport?.metrics.financialMetrics as any)?.capacidadeAbsorcaoEstrutura || 0,     
      unit: 'x', 
      status: 'Verde',
      trend: 'Sustentada'
    },
    { 
      name: 'Break-Even Days', 
      val: (executiveReport?.metrics.financialMetrics as any)?.breakEvenDays || 0, 
      unit: 'd', 
      status: 'Verde',
      trend: 'Eficiente'
    },
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
        where('type',     '==', 'DRE'),
        where('year',     '==', filterYear)
      );
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'financial_entries', d.id))));
      showToast('success', `${snap.docs.length} registro(s) excluído(s) com sucesso.`);
      refetchDRE();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };



  // Histórico para AH dos últimos 3 anos
  const pastYearsData = useMemo(() => {
    const dataByYear: Record<number, any[]> = {};
    [1, 2, 3].forEach(offset => {
      const prevEntries = allHistoryData.filter((d: any) => {
        if (Number(d.year) !== (filterYear - offset)) return false;
        const et = (d.entryType || '').toLowerCase();
        if (['receitas', 'despesas', 'dre', 'resultado'].includes(et)) return true;
        if (!['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes(et) && d.type === 'DRE') return true;
        return false;
      });
      if (prevEntries.length > 0) {
        const agg: any = {};
        prevEntries.forEach((d: any) => {
          const key = d.conta || d.category;
          if (!agg[key]) agg[key] = { ...d, val: 0 };
          agg[key].val += (d.val || d.valor || d.value || 0);
        });
        dataByYear[offset] = Object.values(agg);
      } else {
        dataByYear[offset] = [];
      }
    });
    return dataByYear;
  }, [allHistoryData, filterYear]);

  const getPastValue = (offset: number, name: string) => {
    const searchRows = pastYearsData[offset] || [];
    const normalizedName = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const row = searchRows.find((r: any) => {
      const c = (r.conta || r.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      return c.includes(normalizedName);
    });
    return row?.val || row?.valor || 0;
  };

  // STANDARDIZED DRE LAYOUT (ESPELHO DO MANUAL)
  const standardDreRows = useMemo(() => {
    const getVal = (id: string) => {
      const match = (cascadeResult as any[]).find((r: any) => r.id === id);
      return match ? (match.computedValue !== undefined ? match.computedValue : match.value || match.val || 0) : 0;
    };

    const getChildren = (parentId: string) => {
      return (cascadeResult as any[])
        .filter((r: any) => r.parentId === parentId && r.tipo !== 'SINTETICA' && r.tipo !== 'RESULTADO_CALCULADO' && r.dreTipo !== 'SINTETICA' && r.dreTipo !== 'RESULTADO_CALCULADO')
        .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
        .map((r: any) => ({
           name: r.conta || r.category || r.nome,
           val: r.value || r.val || 0,
           level: 2,
           id: r.id || r.conta || r.category,
           docId: r.docId,
           parentId: r.parentId,
           ordem: r.ordem || 0,
           category: r.category,
           conta: r.conta
      }));
    };

    return [
      { name: '(+) Receita Operacional Bruta', val: getVal('ROB'), level: 1, id: 'ROB' },
      ...getChildren('ROB'),
      
      { name: '(-) Deduções da Receita Bruta', val: -Math.abs(getVal('DED')), level: 1, id: 'DED' },
      ...getChildren('DED'),

      { name: '(=) Receita Operacional Líquida', val: getVal('ROL'), level: 1, id: 'ROL' },
      
      { name: '(-) Custos Mercadorias/Produtos/Serviços', val: -Math.abs(getVal('CUSTOS')), level: 1, id: 'CUSTOS' },
      ...getChildren('CUSTOS'),

      { name: '(=) Lucro Bruto', val: getVal('LUCRO_BRUTO'), level: 1, id: 'LUCRO_BRUTO' },
      
      { name: '(-) Despesas Operacionais', val: -Math.abs(getVal('DESP_OPER')), level: 1, id: 'DESP_OPER' },
      ...getChildren('DESP_OPER'),

      { name: '(=) EBITDA', val: getVal('EBITDA'), level: 1, id: 'EBITDA' },
      
      { name: '(-) Depreciação e Amortização', val: -Math.abs(getVal('DEP_AMORT')), level: 1, id: 'DEP_AMORT' },
      ...getChildren('DEP_AMORT'),

      { name: '(=) Resultado Operacional Líquido (EBIT)', val: getVal('EBIT'), level: 1, id: 'EBIT' },
      
      { name: '(+/-) Resultado Financeiro', val: getVal('RESULT_FIN'), level: 1, id: 'RESULT_FIN' },
      ...getChildren('RESULT_FIN'),

      { name: '(+/-) Outras Receitas / Despesas Operacionais', val: getVal('OUTRAS_REC_DESP'), level: 1, id: 'OUTRAS_REC_DESP' },
      ...getChildren('OUTRAS_REC_DESP'),

      { name: '(=) Resultado Antes de IR e CSLL', val: getVal('RAIR_CSLL'), level: 1, id: 'RAIR_CSLL' },

      { name: '(-) Provisões (IRPJ/CSLL)', val: -Math.abs(getVal('PROV_IR_CSLL')), level: 1, id: 'PROV_IR_CSLL' },
      ...getChildren('PROV_IR_CSLL'),

      { name: '(=) Lucro Líquido do Exercício', val: getVal('LUCRO_LIQ'), level: 1, id: 'LUCRO_LIQ' }
    ];
  }, [cascadeResult]);

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      {(executiveReport?.isSandbox || executiveReport?.isDemonstrative) && (
        <SandboxWarningOverlay type={executiveReport.isSandbox ? 'sandbox' : 'demonstrative'} />
      )}
      <PageHeader 
        title="Demonstração do Resultado (DRE)" 
        subtitle="Análise de performance operacional, lucratividade e rentabilidade do exercício contábil."
        icon={BarChart3}
        color="executive"
      />


      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={dbData.length > 0 ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', dbData.length > 0 ? 'text-success' : 'text-muted-foreground')}>
              {dbData.length > 0 ? 'Dados Reais' : 'Amostra'}
            </span>
          </div>

          <div className="flex bg-card border border-border p-1 rounded-md shadow-sm items-center">
            <Calendar size={12} className="ml-2 text-muted-foreground" />
            <select
              onChange={(e) => setFilterYear(Number(e.target.value))}
              value={filterYear}
              className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground"
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
            className="px-4 py-3 bg-surface-container hover:bg-success hover:text-white text-success border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Lançar Dados
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-3 bg-surface-container hover:bg-secondary hover:text-white text-secondary border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Upload size={14} /> Importar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 bg-surface-container hover:bg-destructive hover:text-white text-destructive border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      </div>




      
      {/* 2. DIAGNÓSTICO ECONÔMICO E BOARD DECISION FRAMEWORK */}
      {isSectionVisible('DRE_DIAGNOSTICO') && economicDiagnosis && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <Activity size={20} />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900">{t('dre.diagnosis.title')}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('dre.diagnosis.subtitle')}</p>
            </div>
          </div>

          <div className="flex flex-col 2xl:flex-row gap-6 items-stretch">
            {/* Core Metrics Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-start justify-start shadow-sm transition-all hover:shadow-md">
                <span className="text-[10px] uppercase font-black text-slate-400 block mb-2 tracking-[0.2em]">{t('dre.diagnosis.value_creation')}</span>
                <span className="text-base font-bold text-slate-800 leading-snug">{economicDiagnosis.valueCreationAssessment}</span>
              </div>
              <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100/50 flex flex-col items-start justify-start shadow-sm transition-all hover:shadow-md">
                <span className="text-[10px] uppercase font-black text-rose-400 block mb-2 tracking-[0.2em]">{t('dre.diagnosis.primary_constraint')}</span>
                <span className="text-base font-bold text-rose-700 leading-snug">{economicDiagnosis.primaryConstraint}</span>
              </div>
              <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100/50 flex flex-col items-start justify-start shadow-sm transition-all hover:shadow-md">
                <span className="text-[10px] uppercase font-black text-amber-500 block mb-2 tracking-[0.2em]">{t('dre.diagnosis.recoverability')}</span>
                <span className="text-base font-bold text-amber-700 leading-snug">{economicDiagnosis.recoverabilityAssessment}</span>
              </div>
              <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50 flex flex-col items-start justify-start shadow-sm transition-all hover:shadow-md">
                <span className="text-[10px] uppercase font-black text-emerald-500 block mb-2 tracking-[0.2em]">{t('dre.diagnosis.strategic_priority')}</span>
                <span className="text-base font-bold text-emerald-700 leading-snug">{economicDiagnosis.strategicPriority}</span>
              </div>
            </div>
            
            {/* Featured Outlook Panel */}
            <div className="w-full 2xl:w-[420px] bg-gradient-to-br from-blue-50/80 to-indigo-50/30 p-8 rounded-[32px] border border-blue-100 flex flex-col justify-center shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <Activity size={120} className="text-blue-600 transform -rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-center">
                <span className="text-[10px] uppercase font-black text-blue-500 block mb-4 tracking-[0.2em]">
                  {t('dre.diagnosis.outlook_directional')}
                </span>
                <p className="text-lg font-bold text-blue-900/90 leading-relaxed">
                  {economicDiagnosis.boardOutlook}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3 & 4 & 5. ESTRUTURA ECONÔMICA, CONSUMO E COBERTURA */}
      {(isSectionVisible('DRE_ESTRUTURA_ECONOMICA') || isSectionVisible('DRE_CONSUMO_ECONOMICO') || isSectionVisible('DRE_BREAK_EVEN')) && (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mb-10">
        
        {/* ESTRUTURA ECONÔMICA DA RECEITA */}
        {isSectionVisible('DRE_ESTRUTURA_ECONOMICA') && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Layers size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800">Estrutura Econômica</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Para cada R$ 100 vendidos</p>
            </div>
          </div>
          
            <div className="flex-1 flex flex-col justify-center">
              {revenueEconomicStructure?.available ? (
                 <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center shadow-inner h-full flex items-center">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line w-full">
                      {revenueEconomicStructure.value.narrativa}
                    </p>
                 </div>
              ) : (
                 <p className="text-sm font-medium text-slate-500 text-center">{FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(revenueEconomicStructure?.reason || 'INSUFFICIENT_DATA')}</p>
              )}
          </div>
        </div>
        )}

        {/* CONSUMO ECONÔMICO (BURN RATE) */}
        {isSectionVisible('DRE_CONSUMO_ECONOMICO') && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800">Consumo Econômico</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Consumo Econômico do Resultado</p>
            </div>
          </div>
          
           <div className="flex-1 flex flex-col justify-center">
              {economicBurnRate?.available ? (
                economicBurnRate.value.monthlyEconomicBurn !== null ? (
                 <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 text-center shadow-inner h-full flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-rose-800 leading-relaxed whitespace-pre-line mb-4">
                      {economicBurnRate.value.narrativa}
                    </p>
                    <div className="w-full flex justify-between px-4">
                       <div className="text-center">
                          <p className="text-[9px] font-bold uppercase text-rose-400/80 mb-1">Déficit Econômico Mensal</p>
                          <p className="font-black text-rose-600">{formatCurrency(economicBurnRate.value.monthlyEconomicBurn)}</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[9px] font-bold uppercase text-rose-400/80 mb-1">Déficit Econômico do Exercício</p>
                          <p className="font-black text-rose-600">{formatCurrency(economicBurnRate.value.annualEconomicBurn)}</p>
                       </div>
                    </div>
                 </div>
                ) : (
                 <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 text-center shadow-inner h-full flex items-center justify-center">
                    <p className="text-sm font-bold text-emerald-700 leading-relaxed w-full">
                      {economicBurnRate.value.narrativa}
                    </p>
                 </div>
                )
              ) : (
                 <p className="text-sm font-medium text-slate-500 text-center">{FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(economicBurnRate?.reason || 'INSUFFICIENT_DATA')}</p>
              )}
          </div>
        </div>
        )}

        {/* PONTO DE EQUILÍBRIO E COBERTURA */}
        {isSectionVisible('DRE_BREAK_EVEN') && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Target size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800">Ponto de Equilíbrio</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Absorção & Cobertura</p>
            </div>
          </div>
          
           <div className="flex-1 flex flex-col justify-center">
              {breakEvenAnalysis?.available && breakEvenAnalysis.value.breakEvenRevenue > 0 ? (
                 <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center shadow-inner h-full flex items-center justify-center flex-col">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line mb-3">
                      {breakEvenAnalysis.value.narrativa}
                    </p>
                    {operationalAbsorption?.available && (
                        <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border mt-2", 
                        operationalAbsorption.value.classificacao === 'Plena' || operationalAbsorption.value.classificacao === 'Adequada' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        operationalAbsorption.value.classificacao === 'Parcial' ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-rose-50 text-rose-600 border-rose-200"
                        )}>
                        Absorção {operationalAbsorption.value.classificacao}
                        </span>
                    )}
                 </div>
              ) : (
                 <p className="text-sm font-medium text-slate-500 text-center">{FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(breakEvenAnalysis?.reason || 'INSUFFICIENT_DATA')}</p>
              )}
          </div>
        </div>
        )}

      </div>
      )}

      {/* 5.5 BOARD DECISION SUPPORT FRAMEWORK */}
      {isSectionVisible('DRE_DECISION_SUPPORT') && dreBoardDecisionSupport && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900">DRE Board Decision Support Framework</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Diagnóstico Executivo Diretivo</p>
            </div>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {/* P1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">P1 — Criação de Valor</p>
                <h5 className="text-xs font-bold text-slate-800 mb-2">A empresa cria ou destrói valor?</h5>
                <p className={cn("text-xs font-medium leading-relaxed", dreBoardDecisionSupport.geraValor === 'Sim' ? 'text-emerald-600' : 'text-rose-600')}>
                  {dreBoardDecisionSupport.criacaoDeValor || dreBoardDecisionSupport.geraValor}
                </p>
              </div>

              {/* P2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">P2 — Sustentação</p>
                <h5 className="text-xs font-bold text-slate-800 mb-2">O faturamento sustenta a estrutura?</h5>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {dreBoardDecisionSupport.faturamentoSustaenta || dreBoardDecisionSupport.problemaPrincipal}
                </p>
              </div>

              {/* P3 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">P3 — Equilíbrio</p>
                <h5 className="text-xs font-bold text-slate-800 mb-2">Quanto falta para o equilíbrio?</h5>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {dreBoardDecisionSupport.lacunaEquilibrio || '—'}
                </p>
              </div>

              {/* P4 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">P4 — Restrição</p>
                <h5 className="text-xs font-bold text-slate-800 mb-2">Qual é a principal restrição econômica?</h5>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {dreBoardDecisionSupport.restricaoPrincipal || dreBoardDecisionSupport.problemaPrincipal}
                </p>
              </div>

              {/* P5 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">P5 — Oportunidade</p>
                <h5 className="text-xs font-bold text-slate-800 mb-2">Qual é a principal oportunidade econômica?</h5>
                <p className="text-xs font-medium text-emerald-700 leading-relaxed">
                  {dreBoardDecisionSupport.oportunidadePrincipal || '—'}
                </p>
              </div>

              {/* P6 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">P6 — Inação</p>
                <h5 className="text-xs font-bold text-slate-800 mb-2">Se nada for feito, o que acontece?</h5>
                <p className={cn("text-xs font-medium leading-relaxed", dreBoardDecisionSupport.geraValor === 'Sim' ? 'text-emerald-600' : 'text-rose-600')}>
                  {dreBoardDecisionSupport.consequenciaDaInacao || dreBoardDecisionSupport.risco}
                </p>
              </div>

              {/* P7 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 xl:col-span-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">P7 — Prioridade do Conselho</p>
                <h5 className="text-xs font-bold text-slate-800 mb-2">Qual é a prioridade estratégica?</h5>
                <p className="text-xs font-medium text-blue-700 leading-relaxed">
                  {dreBoardDecisionSupport.prioridadeConselho || dreBoardDecisionSupport.prioridade}
                </p>
              </div>
            </div>
        </div>
      )}

      {/* 5.6 HEALTH SCORE EXPLAINABILITY */}
      {isSectionVisible('DRE_HEALTH_SCORE') && healthExplainability && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 flex-wrap gap-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
              <Activity size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-black text-slate-900">{t('dre.health.title')}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('dre.health.economics_diagnosis')}</p>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <span className={cn(
                "text-2xl font-black",
                healthExplainability.classificationColor === 'emerald' ? 'text-emerald-600' :
                healthExplainability.classificationColor === 'amber' ? 'text-amber-500' :
                healthExplainability.classificationColor === 'orange' ? 'text-orange-500' :
                healthExplainability.classificationColor === 'rose' ? 'text-rose-600' : 'text-red-700'
              )}>{healthExplainability.score}/100</span>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border text-center break-words whitespace-normal leading-snug",
                healthExplainability.classificationColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                healthExplainability.classificationColor === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                healthExplainability.classificationColor === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                healthExplainability.classificationColor === 'rose' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-red-50 text-red-700 border-red-200'
              )}>{healthExplainability.classification}</span>
            </div>
          </div>
          {healthExplainability.drivers.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Principais Determinantes</p>
              <ul className="space-y-2">
                {healthExplainability.drivers.map((driver: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                    {driver}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 6. EXECUTIVE ADVISORY — Bloco unificado (substitui Síntese + Sumário duplicados) */}
      {isSectionVisible('DRE_ADVISORY') && (dreExecutiveAdvisoryFull || dreExecutiveAdvisory || managementDiscussion) && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Briefcase size={20} />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900">{t('dre.advisory.title')}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('dre.advisory.subtitle')}</p>
            </div>
          </div>

          {dreExecutiveAdvisoryFull ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
              {[
                { label: 'Situação Atual', content: dreExecutiveAdvisoryFull.situacaoAtual, color: 'border-l-slate-400' },
                { label: 'Principal Restrição', content: dreExecutiveAdvisoryFull.restricaoPrincipal, color: 'border-l-rose-400' },
                { label: 'Principal Oportunidade', content: dreExecutiveAdvisoryFull.oportunidadePrincipal, color: 'border-l-emerald-400' },
                { label: 'Prioridade Estratégica', content: dreExecutiveAdvisoryFull.prioridadeEstrategica, color: 'border-l-blue-400' },
                { label: 'Outlook', content: dreExecutiveAdvisoryFull.outlook, color: 'border-l-indigo-400' },
              ].map((item, i) => (
                <div key={i} className={cn('bg-slate-50 rounded-2xl p-5 border border-slate-100 border-l-4', item.color)}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">{item.label}</p>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          ) : dreExecutiveAdvisory ? (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">{dreExecutiveAdvisory}</p>
            </div>
          ) : null}
        </div>
      )}

      {/* 7. CAMADA TÉCNICA (COLAPSADA) */}
      {isSectionVisible('DRE_TECHNICAL_LAYER') && (
        <div className="mb-10">
        <button 
          onClick={() => setShowTechnicalLayer(!showTechnicalLayer)}
          className="w-full bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 rounded-2xl p-4 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 group-hover:text-slate-700 transition-colors">
              <Database size={16} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black text-slate-700">Camada Técnica & KPIs</h4>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Métricas Contábeis, Gráficos e Tabelas</p>
            </div>
          </div>
          <div className="text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            {showTechnicalLayer ? 'Ocultar Detalhes' : 'Expandir Detalhes'}
            <div className={cn("transform transition-transform", showTechnicalLayer ? "rotate-180" : "rotate-0")}>
              ▼
            </div>
          </div>
        </button>

        {showTechnicalLayer && (
          <div className="mt-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {kpis.map((idx, i) => {
                const isCurrency = idx.unit === 'currency';
                const formattedValue = typeof idx.val === 'string'
                  ? idx.val
                  : isCurrency
                    ? formatValue(idx.val as number, 'currency')
                    : isFinite(idx.val as number)
                      ? (idx.val as number).toFixed(2)
                      : '0.0';
                const displaySuffix = isCurrency ? '' : (idx.unit === '%' ? '%' : idx.unit === 'd' ? ' dias' : idx.unit === 'x' ? 'x' : '');
                return (
                  <KpiCard
                    key={i}
                    title={idx.name}
                    value={formattedValue}
                    suffix={displaySuffix}
                    status={idx.status as any}
                    trend={idx.trend}
                    tooltip={idx.tooltip}
                  />
                );
              })}
            </div>

            {/* SCALE EFFICIENCY E QUALIDADE */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {scaleEfficiency && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                      <Scale size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-800">{t('dre.scale.subtitle')}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('dre.scale.desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 justify-center">
                    <div className="text-center mb-8">
                        <span className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-black uppercase tracking-wider text-center break-words whitespace-normal leading-snug",
                          scaleEfficiency.colorClass?.replace('text-', 'bg-').replace('400', '50/50').replace('500', '50/50'),
                          scaleEfficiency.colorClass?.replace('text-', 'border-').replace('400', '200').replace('500', '200'),
                          scaleEfficiency.colorClass
                        )}>
                          <Zap size={16} />
                          {ExecutiveLabelResolver.resolve(scaleEfficiency.category, t)}
                        </span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Crescimento de Receita</p>
                          <p className={cn("text-3xl font-black", (scaleEfficiency.recGrowth || 0) >= 0 ? "text-emerald-600" : "text-rose-600")}>
                            {scaleEfficiency.recGrowth === null ? 'N/A' : `${scaleEfficiency.recGrowth > 0 ? '+' : ''}${scaleEfficiency.recGrowth.toFixed(2)}%`}
                          </p>
                        </div>
                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Crescimento de EBITDA</p>
                          <p className={cn("text-3xl font-black", (scaleEfficiency.ebitdaGrowth || 0) >= 0 ? "text-emerald-600" : "text-rose-600")}>
                            {scaleEfficiency.ebitdaGrowth === null ? 'N/A' : `${scaleEfficiency.ebitdaGrowth > 0 ? '+' : ''}${scaleEfficiency.ebitdaGrowth.toFixed(2)}%`}
                          </p>
                        </div>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-500 mt-8 text-center leading-relaxed">
                      {scaleEfficiency.description}
                    </p>
                  </div>
                </div>
              )}

              {earningsQualityAssessment && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Qualidade Contábil do Resultado</h4>
                  <h3 className={cn("text-lg font-black mb-2", 
                    earningsQualityAssessment.classification === 'HIGH_QUALITY_EARNINGS' ? 'text-emerald-600' :
                    earningsQualityAssessment.classification === 'LOW_QUALITY_EARNINGS' ? 'text-rose-600' : 
                    earningsQualityAssessment.classification === 'UNDETERMINED_EARNINGS_QUALITY' ? 'text-slate-400' : 'text-amber-500'
                  )}>
                    {earningsQualityAssessment.classification === 'HIGH_QUALITY_EARNINGS' ? 'Alta Qualidade (Operacional)' :
                    earningsQualityAssessment.classification === 'LOW_QUALITY_EARNINGS' ? 'Baixa Qualidade (Extraordinário)' : 
                    earningsQualityAssessment.classification === 'UNDETERMINED_EARNINGS_QUALITY' ? 'Qualidade Indeterminada' : 'Qualidade Média'}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4">{earningsQualityAssessment.rationale}</p>
                  {earningsQualityAssessment.classification !== 'UNDETERMINED_EARNINGS_QUALITY' && (
                    <div className="mt-auto flex flex-col gap-2">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500" style={{ width: `${earningsQualityAssessment.recurringRevenueWeight}%` }} />
                        <div className="h-full bg-rose-400" style={{ width: `${earningsQualityAssessment.nonRecurringWeight}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400">
                        <span>Operacional: {earningsQualityAssessment.recurringRevenueWeight.toFixed(0)}%</span>
                        <span>Extraordinário: {earningsQualityAssessment.nonRecurringWeight.toFixed(0)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>            {/* CHARTS E HIGHLIGHTS */}
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-[40px] border border-slate-200/60 shadow-xl shadow-slate-200/40 flex flex-col">
                <div className="flex items-center justify-between mb-8 shrink-0 flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">{t('dre.evolution.title')}</h3>
                    <p className="text-[10px] text-slate-400/80 uppercase font-bold tracking-widest mt-1">Receita, EBITDA e Lucro</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-[9px] font-bold uppercase text-slate-500">{t('dre.metrics.net_revenue')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="text-[9px] font-bold uppercase text-slate-500">{cmvLabel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold uppercase text-slate-500">{t('dre.metrics.ebitda')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-[9px] font-bold uppercase text-slate-500">{t('dre.metrics.net_result')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                      <XAxis 
                        dataKey="year" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: colors.mutedForeground }} 
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
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
                      <Bar dataKey="receita" name="Receita Líquida" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="cmv" name={cmvLabel} fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="lucro" name="Resultado Líquido" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border border-slate-700/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                <h3 className="text-xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">{t('dre.highlights.title')}</h3>
                <p className="text-[10px] text-blue-400/80 uppercase font-bold tracking-widest mb-8">{t('dre.highlights.subtitle')}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2 relative z-10 h-fit">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('dre.highlights.composition')}</p>
                    
                    <div className="flex justify-between items-center text-xs text-white/70 mb-2">
                      <span>Receita Operacional Bruta:</span>
                      <span className="font-bold">{formatCurrency(receitaBruta)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-white/70 mb-3">
                      <span>(-) Deduções da Receita:</span>
                      <span className="font-bold text-rose-300">{formatCurrency(deducoesReceita)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-white font-bold border-t border-white/10 pt-3 mt-2">
                      <span>(=) Receita Operacional Líquida:</span>
                      <span className="text-emerald-400">{formatCurrency(recLiquida)}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 relative z-10 h-fit flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Ponto de Equilíbrio & Cobertura</p>
                      
                      <div className="flex justify-between items-center text-xs text-white/70 mb-2">
                        <span>Receita Operacional Líquida:</span>
                        <span className="font-bold">{formatCurrency(recLiquida)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-white/70 mb-3">
                        <span>(-) {cmvLabel}:</span>
                        <span className="font-bold text-rose-300">{formatCurrency(custosVar)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-white font-bold border-t border-white/10 pt-3 mt-2">
                        <span>(=) Margem de Contribuição ({ (indiceMargemContrib * 100).toFixed(2) }%):</span>
                        <span className="text-emerald-400">{formatCurrency(margemContrib)}</span>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs text-white/70">
                          <span>Despesas Fixas:</span>
                          <span className="font-bold text-rose-300">{formatCurrency(despesasFixas)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-white font-bold bg-white/5 p-3 rounded-xl mt-2 border border-white/5">
                          <span>Ponto de Equilíbrio (Absoluto):</span>
                          <span className="text-blue-400">{dbData.length > 0 ? formatCurrency(pontoEquilibrio) : '---'}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs text-white/70">
                          <span>Gap para Equilíbrio:</span>
                          <span className="font-bold text-rose-300">{dbData.length > 0 ? formatCurrency(gapEquilibrio) : '---'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-white/70">
                          <span>Margem de Segurança:</span>
                          <span className="font-bold text-emerald-400">{dbData.length > 0 ? formatCurrency(margemSegurancaValor) : '---'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-white/70">
                          <span>Índice de Cobertura Operacional:</span>
                          <span className={cn("font-bold text-sm", indiceCoberturaOperacional >= 100 ? "text-emerald-400" : indiceCoberturaOperacional >= 85 ? "text-blue-400" : indiceCoberturaOperacional >= 60 ? "text-amber-400" : "text-rose-400")}>
                            {dbData.length > 0 ? `${indiceCoberturaOperacional.toFixed(2)}%` : '---'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


      <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden mb-10">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{translateLabel('Detalhamento da DRE')}</h4>
          <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-600">
            {translateLabel('Análise Horizontal e Vertical')}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{translateLabel('Conta')}</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{translateLabel('Valor (R$)')}</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{translateLabel('AV (%)')}</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{translateLabel('AH (1 Ano)')}</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{translateLabel('AH (2 Anos)')}</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{translateLabel('AH (3 Anos)')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {standardDreRows.length > 0 ? (
                // ── Espelho Estrutural: Renderiza a base analítica das 14 linhas com os filhos aninhados ──
                standardDreRows.map((row: any, i: number) => {
                    const name = row.name || row.conta || row.category || '';
                    const label = translateLabel(name);
                    if (!label) return null;

                    const val = row.val || 0;
                    const level = row.level ?? 1;
                    
                    let baseForAV = recLiquida;
                    const nameLower = name.toLowerCase();
                    if (nameLower.includes('receita operacional bruta') || nameLower.includes('receita bruta') || nameLower.includes('faturamento') || nameLower.includes('deduções') || nameLower.includes('impostos sobre vendas') || nameLower.includes('abatimentos')) {
                      baseForAV = receitaBruta;
                    }
                    const av = baseForAV > 0 ? (val / baseForAV) * 100 : 0;
                    const prev1Val = getPastValue(1, name);
                    const ah1 = prev1Val > 0 ? ((val / prev1Val) - 1) * 100 : null;
                    const prev2Val = getPastValue(2, name);
                    const ah2 = prev2Val > 0 ? ((val / prev2Val) - 1) * 100 : null;
                    const prev3Val = getPastValue(3, name);
                    const ah3 = prev3Val > 0 ? ((val / prev3Val) - 1) * 100 : null;
                    const isTotal = level === 1;

                    return (
                      <tr key={i} className={cn('hover:bg-slate-50 transition-colors group', isTotal ? 'bg-slate-50/30 font-bold' : '')}>
                        <td className="py-2.5 md:py-4 px-5 md:px-8">
                          <span
                            className={cn('block break-words overflow-visible', isTotal ? 'text-primary font-bold' : 'text-slate-600 font-medium')}
                            style={{ paddingLeft: level > 1 ? `${(level - 1) * 20}px` : '0px' }}
                          >
                            {level > 1 && (
                              <span className="inline-block w-2 h-2 border-b border-l border-slate-300 mr-2 mb-0.5" />
                            )}
                            {label}
                          </span>
                        </td>
                        <td className={cn("py-2.5 md:py-4 px-5 md:px-8 text-right font-mono", val < 0 ? "text-rose-500" : "text-slate-700")}>
                          {formatCurrency(val)}
                        </td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right font-bold text-slate-500 text-xs">
                          {av.toFixed(2)}%
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          ah1 === null ? "text-slate-300" : ah1 > 0 ? "text-emerald-500" : ah1 < 0 ? "text-rose-500" : "text-slate-300"
                        )}>
                          {ah1 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {ah1 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(ah1).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          ah2 === null ? "text-slate-300" : ah2 > 0 ? "text-emerald-500" : ah2 < 0 ? "text-rose-500" : "text-slate-300"
                        )}>
                          {ah2 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {ah2 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(ah2).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          ah3 === null ? "text-slate-300" : ah3 > 0 ? "text-emerald-500" : ah3 < 0 ? "text-rose-500" : "text-slate-300"
                        )}>
                          {ah3 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {ah3 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(ah3).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                 [
                    { name: 'Receita Operacional Bruta', level: 1 },
                    { name: '(-) Deduções e Impostos', level: 2 },
                    { name: 'Receita Líquida', level: 1 },
                    { name: '(-) Custos (CPV/CSP)', level: 2 },
                    { name: 'Lucro Bruto', level: 1 },
                    { name: '(-) Despesas Operacionais', level: 2 },
                    { name: 'EBITDA', level: 1 },
                    { name: '(-) Depreciação e Amortização', level: 2 },
                    { name: 'EBIT', level: 1 },
                    { name: '(+/-) Resultado Financeiro', level: 2 },
                    { name: 'LAIR (Lucro Antes do IR)', level: 1 },
                    { name: '(-) Provisão IR/CSLL', level: 2 },
                    { name: 'Lucro Líquido', level: 1 },
                  ].map((row, i) => {
                    const isTotal = row.level === 1;
                    return (
                      <tr key={i} className={cn('transition-colors group', isTotal ? 'bg-slate-50/30 font-bold' : '')}>
                        <td className="py-2.5 md:py-4 px-5 md:px-8">
                          <span
                            className={cn('block break-words overflow-visible', isTotal ? 'text-slate-300 font-bold' : 'text-slate-200 font-medium')}
                            style={{ paddingLeft: row.level > 1 ? `${(row.level - 1) * 20}px` : '0px' }}
                          >
                            {row.level > 1 && (
                              <span className="inline-block w-2 h-2 border-b border-l border-slate-200 mr-2 mb-0.5" />
                            )}
                            {row.name}
                          </span>
                        </td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right font-mono text-slate-200">R$ 0,00</td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right text-slate-200 text-xs">0,00%</td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right text-slate-200 text-xs">—</td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right text-slate-200 text-xs">—</td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right text-slate-200 text-xs">—</td>
                      </tr>
                    );
                  })
              )}
              </tbody>
          </table>
        </div>
      </div>

      {trendNote && (
        <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 rounded-[40px] shadow-xl shadow-slate-200/40 p-8 mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-sm">
              <TrendingUp size={22} />
            </div>
            <div>
              <h4 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">{t('dre.notes.title')}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400/80 mt-1">Tendência Histórica Acumulada ({trendNote.period})</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-slate-200/60 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 truncate" title={t('dre.notes.revenue_growth')}>{t('dre.notes.revenue_growth')}</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.receita > 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-rose-500" />}
                <p className={cn("text-3xl font-black", trendNote.receita > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.receita > 0 ? '+' : ''}{trendNote.receita.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-slate-200/60 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 truncate" title={`Evolução de ${cmvLabel}`}>Evolução de {cmvLabel}</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.cmv > 0 ? <TrendingUp size={18} className="text-rose-500" /> : <TrendingDown size={18} className="text-emerald-500" />}
                <p className={cn("text-3xl font-black", trendNote.cmv > 0 ? "text-rose-500" : "text-emerald-500")}>
                  {trendNote.cmv > 0 ? '+' : ''}{trendNote.cmv.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-slate-200/60 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 truncate" title={t('dre.notes.ebitda_growth')}>{t('dre.notes.ebitda_growth')}</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.ebitda > 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-rose-500" />}
                <p className={cn("text-3xl font-black", trendNote.ebitda > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.ebitda > 0 ? '+' : ''}{trendNote.ebitda.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-slate-200/60 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 truncate" title={t('dre.notes.profit_growth')}>{t('dre.notes.profit_growth')}</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.lucro > 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-rose-500" />}
                <p className={cn("text-3xl font-black", trendNote.lucro > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.lucro > 0 ? '+' : ''}{trendNote.lucro.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-6 leading-relaxed">
            A análise histórica demonstra um {trendNote.receita > 0 ? 'crescimento' : 'decréscimo'} de <strong>{Math.abs(trendNote.receita).toFixed(2)}%</strong> nas receitas líquidas no período de {trendNote.period}.
            Este movimento foi acompanhado por uma variação de <strong>{trendNote.cmv > 0 ? '+' : ''}{trendNote.cmv.toFixed(2)}%</strong> em <strong>{cmvLabel}</strong>.
            No que tange à geração de caixa operacional, o EBITDA obteve uma variação de <strong>{trendNote.ebitda > 0 ? '+' : ''}{trendNote.ebitda.toFixed(2)}%</strong>, resultando
            finalmente num impacto na linha de Lucro Líquido de <strong>{trendNote.lucro > 0 ? '+' : ''}{trendNote.lucro.toFixed(2)}%</strong> no acumulado de cinco anos.
          </p>
        </div>
      )}
        </div>
      )}
        </div>
      )}


      {/* ExecutiveCommentary retired in ENGF v1.1 — Executive Advisory is the single narrative source */}

      {showImportModal && (
        <ImportFinancialModal
          type="DRE"
          clientId={selectedClient}
          year={filterYear}
          clients={clients}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            refetchDRE();
            showToast('success', 'Dados importados com sucesso!');
          }}
        />
      )}

      {showManualModal && (
        <ManualFinancialModal
          type="DRE"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => setShowManualModal(false)}
          onSuccess={() => {
            setShowManualModal(false);
            refetchDRE();
            showToast('success', 'Dados salvos com sucesso!');
          }}
        />
      )}

      {showDeleteConfirm && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md min-w-[300px] md:min-w-[400px] shadow-2xl shrink-0">
            <h3 className="text-xl font-black text-slate-900 mb-2">Excluir Dados?</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">
              Esta ação removerá todos os registros da DRE para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
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
