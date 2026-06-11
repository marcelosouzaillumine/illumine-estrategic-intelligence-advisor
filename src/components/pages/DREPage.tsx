import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Loader2, Upload, Trash2, Plus, BarChart3, Database, TrendingUp, TrendingDown, Info, PieChart as PieChartIcon, AlertTriangle, Sparkles, Bug, Target, Shield, Activity, Layers, Scale, Zap, Building2, Coins, Receipt, Briefcase, CheckCircle, AlertCircle, RefreshCw, BarChart2, Eye, ShieldAlert, Cpu } from 'lucide-react';
import { DATA } from '../../data';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  ExecutiveChart,
  ExecutiveChartGrid,
  ExecutiveChartXAxis,
  ExecutiveChartYAxis,
  ExecutiveChartTooltip
} from '../ui/executive-chart';
import { cn, formatCurrency, formatValue, getThemeColors } from '../../lib/utils';
import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { PageHeader, KpiCard } from '../Common';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
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
import {
  mapEconomicDiagnosis,
  mapRevenueEconomicStructure,
  mapEconomicBurnRate,
  mapBreakEvenAnalysis,
  mapBoardDecisionSupport,
  mapExecutiveAdvisory,
  mapScaleEfficiency,
  mapEarningsQuality,
  mapHighlights,
  mapTechnicalRows,
  mapChartsSection
} from './dre/mappers';
import { DREEconomicDiagnosisSection } from './dre/DREEconomicDiagnosisSection';
import { DREEconomicBreakdownSection } from './dre/DREEconomicBreakdownSection';
import { DREBoardDecisionSupportSection } from './dre/DREBoardDecisionSupportSection';
import { DREExecutiveAdvisorySection } from './dre/DREExecutiveAdvisorySection';
import { DREScaleEfficiencySection } from './dre/DREScaleEfficiencySection';
import { DREHighlightsSection } from './dre/DREHighlightsSection';
import { DREChartsSection } from './dre/DREChartsSection';
import { DRETechnicalLayerSection } from './dre/DRETechnicalLayerSection';


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

  const economicDiagnosisVM = economicDiagnosis ? mapEconomicDiagnosis(economicDiagnosis) : undefined;
  const structureVM = revenueEconomicStructure ? mapRevenueEconomicStructure(revenueEconomicStructure) : undefined;
  const burnRateVM = economicBurnRate ? mapEconomicBurnRate(economicBurnRate) : undefined;
  const breakEvenVM = breakEvenAnalysis ? mapBreakEvenAnalysis(breakEvenAnalysis, operationalAbsorption) : undefined;
  const decisionSupportVM = dreBoardDecisionSupport ? mapBoardDecisionSupport(dreBoardDecisionSupport) : undefined;
  const executiveAdvisoryVM = mapExecutiveAdvisory(dreExecutiveAdvisoryFull, dreExecutiveAdvisory || managementDiscussion);
  const scaleEfficiencyVM = scaleEfficiency ? mapScaleEfficiency(scaleEfficiency, t) : undefined;
  const earningsQualityVM = earningsQualityAssessment ? mapEarningsQuality(earningsQualityAssessment) : undefined;
  const highlightsVM = mapHighlights({
    receitaBruta, deducoesReceita, recLiquida, custosVar, margemContrib,
    despesasFixas, pontoEquilibrio, gapEquilibrio, margemSegurancaValor,
    indiceCoberturaOperacional, indiceMargemContrib, cmvLabel,
    hasRealData: dbData.length > 0
  });
  const chartsVM = mapChartsSection(chartData, cmvLabel);
  
  // To avoid breaking the existing array structure, we map standardDreRows to TechnicalRowInput format.
  // The table will still render via the decomposed technical layer.
  const technicalRowsInput = standardDreRows.map(row => {
    const name = row.name || (row as any).conta || (row as any).category || '';
    let baseForAV = recLiquida;
    const nameLower = name.toLowerCase();
    if (nameLower.includes('receita operacional bruta') || nameLower.includes('receita bruta') || nameLower.includes('faturamento') || nameLower.includes('deduções') || nameLower.includes('impostos sobre vendas') || nameLower.includes('abatimentos')) {
      baseForAV = receitaBruta;
    }
    const val = row.val || 0;
    const av = baseForAV > 0 ? (val / baseForAV) * 100 : 0;
    const prev1Val = getPastValue(1, name);
    const ah1 = prev1Val > 0 ? ((val / prev1Val) - 1) * 100 : null;
    const prev2Val = getPastValue(2, name);
    const ah2 = prev2Val > 0 ? ((val / prev2Val) - 1) * 100 : null;
    const prev3Val = getPastValue(3, name);
    const ah3 = prev3Val > 0 ? ((val / prev3Val) - 1) * 100 : null;

    return {
      name,
      val,
      level: row.level ?? 1,
      av,
      ah1,
      ah2,
      ah3
    };
  });
  const technicalLayerVM = mapTechnicalRows(technicalRowsInput, translateLabel);
  const hasDreData = dbData.length > 0 && !!cascadeResult && (recLiquida !== 0 || lucroLiq !== 0 || receitaBruta !== 0);

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
          <div className="bg-card border border-border/50 shadow-sm rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={hasDreData ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', hasDreData ? 'text-success' : 'text-muted-foreground')}>
              {hasDreData ? 'Dados Reais' : 'Amostra'}
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

        {hasDreData && (
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
        )}
      </div>

      {!hasDreData ? (
        <div className="mb-12">
          <ExecutiveEmptyState
            title="Demonstração do Resultado"
            description="Ainda não existem dados de resultado suficientes para gerar inteligência executiva deste exercício. O lançamento da DRE permitirá analisar receitas, margens, eficiência operacional e lucro líquido."
            actionLabel="Lançar Dados da DRE"
            onAction={() => setShowManualModal(true)}
            secondaryActionLabel="Importar"
            onSecondaryAction={() => setShowImportModal(true)}
          />
        </div>
      ) : (
        <>





      
      {/* 2. DIAGNÓSTICO ECONÔMICO E BOARD DECISION FRAMEWORK */}
      {isSectionVisible('DRE_DIAGNOSTICO') && economicDiagnosisVM && (
        <DREEconomicDiagnosisSection viewModel={economicDiagnosisVM} />
      )}

      {/* 3 & 4 & 5. ESTRUTURA ECONÔMICA, CONSUMO E COBERTURA */}
      <DREEconomicBreakdownSection
        isVisibleStructure={isSectionVisible('DRE_ESTRUTURA_ECONOMICA')}
        isVisibleBurnRate={isSectionVisible('DRE_CONSUMO_ECONOMICO')}
        isVisibleBreakEven={isSectionVisible('DRE_BREAK_EVEN')}
        structureVM={structureVM}
        burnRateVM={burnRateVM}
        breakEvenVM={breakEvenVM}
      />

      {/* 5.5 BOARD DECISION SUPPORT FRAMEWORK */}
      {isSectionVisible('DRE_DECISION_SUPPORT') && decisionSupportVM && (
        <DREBoardDecisionSupportSection viewModel={decisionSupportVM} />
      )}

      {/* 5.6 HEALTH SCORE EXPLAINABILITY */}
      {isSectionVisible('DRE_HEALTH_SCORE') && healthExplainability && (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4 flex-wrap gap-y-4">
            <div className="w-10 h-10 rounded-xl bg-surface-container/30 border border-border flex items-center justify-center text-muted-foreground shrink-0">
              <Activity size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-black text-primary">{t('dre.health.title')}</h4>
              <p className="text-secondary">{t('dre.health.economics_diagnosis')}</p>
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
                healthExplainability.classificationColor === 'emerald' ? 'bg-success-soft text-emerald-700 border-emerald-200' :
                healthExplainability.classificationColor === 'amber' ? 'bg-warning-soft text-amber-700 border-amber-200' :
                healthExplainability.classificationColor === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                healthExplainability.classificationColor === 'rose' ? 'bg-critical-soft text-rose-700 border-rose-200' : 'bg-red-50 text-red-700 border-red-200'
              )}>{healthExplainability.classification}</span>
            </div>
          </div>
          {healthExplainability.drivers.length > 0 && (
            <div>
              <p className="text-secondary">Principais Determinantes</p>
              <ul className="space-y-2">
                {healthExplainability.drivers.map((driver: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                    {driver}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 6. EXECUTIVE ADVISORY — Bloco unificado */}
      {isSectionVisible('DRE_ADVISORY') && executiveAdvisoryVM && (
        <DREExecutiveAdvisorySection 
          viewModel={executiveAdvisoryVM} 
          context={{
            moduleContext: 'DRE',
            activeFiduciaryRestrictions: [],
            fiduciaryClassification: economicDiagnosis?.status || 'HEALTHY',
            mathematicalClassification: '',
            globalScore: 70,
            primaryIndicators: {},
            technicalDrivers: {
              receitaLiquida: recLiquida,
              ebitda: ebitda,
              margemEbitda: (recLiquida > 0 ? ebitda / recLiquida : 0)
            },
            contextualAlerts: []
          }}
        />
      )}

      {/* 7. CAMADA TÉCNICA (COLAPSADA) */}
      {isSectionVisible('DRE_TECHNICAL_LAYER') && (
        <div className="mb-10">
        <button 
          onClick={() => setShowTechnicalLayer(!showTechnicalLayer)}
          className="w-full bg-surface-container hover:bg-slate-200 transition-colors border border-border rounded-2xl p-4 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-muted-foreground group-hover:text-muted-foreground transition-colors">
              <Database size={16} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black text-primary">Camada Técnica & KPIs</h4>
              <p className="text-secondary">Métricas Contábeis, Gráficos e Tabelas</p>
            </div>
          </div>
          <div className="text-muted-foreground font-bold text-xs uppercase tracking-wider flex items-center gap-2">
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
            <DREScaleEfficiencySection scaleVM={scaleEfficiencyVM} qualityVM={earningsQualityVM} />
            
            {/* CHARTS E HIGHLIGHTS */}
            <div className="grid grid-cols-1 gap-8">
              <DREChartsSection viewModel={chartsVM} />
              <DREHighlightsSection viewModel={highlightsVM} />
            </div>

            <DRETechnicalLayerSection viewModel={technicalLayerVM} />

      {trendNote && (
        <div className="bg-gradient-to-br from-white to-slate-50 border border-border rounded-[40px] shadow-xl shadow-slate-200/40 p-8 mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-sm">
              <TrendingUp size={22} />
            </div>
            <div>
              <h4 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">{t('dre.notes.title')}</h4>
              <p className="text-secondary">Tendência Histórica Acumulada ({trendNote.period})</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-card rounded-3xl border border-border flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-secondary" title={t('dre.notes.revenue_growth')}>{t('dre.notes.revenue_growth')}</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.receita > 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-rose-500" />}
                <p className={cn("text-3xl font-black", trendNote.receita > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.receita > 0 ? '+' : ''}{trendNote.receita.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-5 bg-card rounded-3xl border border-border flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-secondary" title={`Evolução de ${cmvLabel}`}>Evolução de {cmvLabel}</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.cmv > 0 ? <TrendingUp size={18} className="text-rose-500" /> : <TrendingDown size={18} className="text-emerald-500" />}
                <p className={cn("text-3xl font-black", trendNote.cmv > 0 ? "text-rose-500" : "text-emerald-500")}>
                  {trendNote.cmv > 0 ? '+' : ''}{trendNote.cmv.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-5 bg-card rounded-3xl border border-border flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-secondary" title={t('dre.notes.ebitda_growth')}>{t('dre.notes.ebitda_growth')}</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.ebitda > 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-rose-500" />}
                <p className={cn("text-3xl font-black", trendNote.ebitda > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.ebitda > 0 ? '+' : ''}{trendNote.ebitda.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-5 bg-card rounded-3xl border border-border flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-secondary" title={t('dre.notes.profit_growth')}>{t('dre.notes.profit_growth')}</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.lucro > 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-rose-500" />}
                <p className={cn("text-3xl font-black", trendNote.lucro > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.lucro > 0 ? '+' : ''}{trendNote.lucro.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-secondary mt-6 leading-relaxed">
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
      </>
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
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card rounded-[32px] p-8 w-full max-w-md min-w-[300px] md:min-w-[400px] shadow-2xl shrink-0">
            <h3 className="text-xl font-black text-primary mb-2">Excluir Dados?</h3>
            <p className="text-sm text-secondary mb-8 font-medium">
              Esta ação removerá todos os registros da DRE para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-sm font-bold text-muted-foreground hover:bg-surface-container/30 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-critical-soft0 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
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
          toast.type === 'success' ? 'bg-success-soft0 text-white' : 'bg-critical-soft0 text-white'
        )}>
          <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
        </div>,
        document.body
      )}
    </div>
  );
}
