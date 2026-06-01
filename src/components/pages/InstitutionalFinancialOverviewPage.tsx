import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Target, 
  Activity, 
  DollarSign, 
  ArrowRightLeft, 
  BookOpen, 
  TrendingUp, 
  Layers, 
  AlertTriangle,
  Loader2,
  Calendar,
  Layers3,
  Briefcase,
  Users,
  Compass,
  FileText
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { PageHeader } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { getComputedBPSummary, getComputedDreMetrics } from '../../core/orchestration/financial-math-adapter';
import { useLanguage } from '../../contexts/LanguageContext';
import { executiveRuntime, ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { InstitutionalCausalRootCausesPanel } from '../panels/causal-intelligence/InstitutionalCausalRootCausesPanel';
import { SurvivabilityDependencyGraphPanel } from '../panels/causal-intelligence/SurvivabilityDependencyGraphPanel';
import { OperationalStressCascadePanel } from '../panels/causal-intelligence/OperationalStressCascadePanel';

interface OverviewPageProps {
  clients?: any[];
  selectedClient: string;
  setSelectedClient?: (id: string) => void;
  selectedMonth?: number;
  setSelectedMonth?: (month: number) => void;
  selectedYear: number;
  setSelectedYear?: (year: number) => void;
  onNavigate?: (page: string) => void;
}

const PanelHeader = ({ title, type }: { title: string; type: string }) => {
  const typeColors: Record<string, string> = {
    executivo: 'bg-blue-50 text-blue-700 border-blue-200',
    fiduciário: 'bg-purple-50 text-purple-700 border-purple-200',
    auditoria: 'bg-amber-50 text-amber-700 border-amber-200',
    operacional: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    sobrevivência: 'bg-rose-50 text-rose-700 border-rose-200',
    conselho: 'bg-slate-100 text-slate-700 border-slate-300'
  };
  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</h4>
      <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full border", typeColors[type] || typeColors.conselho)}>
        {type}
      </span>
    </div>
  );
};

const LiquidityClassificationPanel = ({ data }: { data: any }) => {
  if (!data) return null;
  const isHealthy = data.severity === 'SAUDÁVEL' || data.severity === 'SENSÍVEL';
  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col gap-4 bg-white shadow-sm hover:border-slate-400 hover:shadow-md transition-all", isHealthy ? "border-emerald-100" : "border-rose-100")}>
      <PanelHeader title="Liquidity Classification" type="executivo" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-black uppercase px-2 py-0.5 rounded border",
            isHealthy ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
          )}>
            {data.label}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase">Confiança: {data.confidence}</span>
        </div>
        <p className="text-xs font-medium text-slate-600 leading-relaxed">{data.rationale}</p>
      </div>
      <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span>Severidade: {data.severity}</span>
      </div>
    </div>
  );
};

const ArtificialLiquidityPanel = ({ data }: { data: any }) => {
  if (!data) return null;
  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col gap-4 bg-white shadow-sm hover:border-slate-400 hover:shadow-md transition-all", data.isArtificial ? "border-rose-200 bg-rose-50/10" : "border-slate-200")}>
      <PanelHeader title="Artificial Liquidity Detection" type="fiduciário" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-black uppercase px-2 py-0.5 rounded border",
            data.isArtificial ? "bg-rose-100 text-rose-700 border-rose-300 animate-pulse" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          )}>
            {data.isArtificial ? 'Liquidez Artificial Detectada' : 'Normalidade'}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-600 leading-relaxed">{data.rationale}</p>
        {data.liquidityDistortionFactors.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.liquidityDistortionFactors.map((f: string, i: number) => (
              <span key={i} className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-mono">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StructuralReconciliationPanel = ({ data }: { data: any }) => {
  if (!data) return null;
  const isHealthy = data.isReconcilable;
  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col gap-4 bg-white shadow-sm hover:border-slate-400 hover:shadow-md transition-all", isHealthy ? "border-slate-200" : "border-red-200 bg-red-50/10")}>
      <PanelHeader title="Structural Reconciliation" type="auditoria" />
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            "text-[10px] font-black uppercase px-2 py-0.5 rounded border",
            data.reconciliationStatus === 'RECONCILED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
          )}>
            Status: {data.reconciliationStatus}
          </span>
          <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700">
            Divergência: {(data.variancePercentage * 100).toFixed(2)}%
          </span>
        </div>
        <p className="text-xs font-medium text-slate-600 leading-relaxed">
          {data.disclosures[0] || 'DFC conciliada com sucesso em relação aos saldos do Balanço Patrimonial.'}
        </p>
        {data.alerts.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.alerts.map((a: string, i: number) => (
              <span key={i} className="text-[8px] bg-red-50 text-red-700 border border-red-200 rounded px-1.5 py-0.5 font-bold uppercase">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const OperationalSustainabilityPanel = ({ data }: { data: any }) => {
  if (!data) return null;
  const isHealthy = data.resilienceScore >= 60;
  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col gap-4 bg-white shadow-sm hover:border-slate-400 hover:shadow-md transition-all", isHealthy ? "border-emerald-100" : "border-amber-100")}>
      <PanelHeader title="Operational Sustainability" type="operacional" />
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded">
            Autofinanciamento: {data.selfFinancingCapacity}
          </span>
          <span className={cn(
            "text-[10px] font-black uppercase px-2 py-0.5 rounded border",
            isHealthy ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
          )}>
            Resiliência: {data.resilienceScore}/100
          </span>
        </div>
        <p className="text-xs font-medium text-slate-600 leading-relaxed">{data.longitudinalConsistency}</p>
        <div className="text-[9px] text-slate-400 font-bold uppercase">Tendência: {data.dependencyTrend} | Consistência: {data.operationalCashConsistency}</div>
      </div>
    </div>
  );
};

const InstitutionalContinuityPanel = ({ data }: { data: any }) => {
  if (!data) return null;
  const isCritical = data.continuityRisk === 'CRITICAL' || data.continuityRisk === 'HIGH';
  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col gap-4 bg-white shadow-sm hover:border-slate-400 hover:shadow-md transition-all", isCritical ? "border-red-200 bg-red-50/5" : "border-slate-200")}>
      <PanelHeader title="Institutional Continuity" type="sobrevivência" />
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            "text-[10px] font-black uppercase px-2 py-0.5 rounded border",
            isCritical ? "bg-red-100 text-red-700 border-red-300 animate-pulse" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          )}>
            Risco: {data.continuityRisk}
          </span>
          <span className="text-[10px] font-bold bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700">
            Survival Horizon: {data.projectedRunwayMonths === 99 ? 'Estável / ILIMITADO' : `${data.projectedRunwayMonths} Meses`}
          </span>
        </div>
        <div className="text-xs font-medium text-slate-600 leading-relaxed">
          Estabilidade do Horizonte: <span className="font-bold text-slate-800">{data.runwayStability}</span>
        </div>
        {data.continuityRiskDrivers.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.continuityRiskDrivers.map((d: string, i: number) => (
              <span key={i} className="text-[8px] bg-slate-100 text-slate-500 border border-slate-200 rounded px-1.5 py-0.5 font-mono">
                {d}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FiduciaryAdvisoryPanel = ({ data, narrative }: { data: any; narrative: any }) => {
  if (!data) return null;
  return (
    <div className="p-6 rounded-3xl border border-slate-200 flex flex-col gap-4 bg-white shadow-sm hover:border-slate-400 hover:shadow-md transition-all col-span-1 md:col-span-2 lg:col-span-3">
      <PanelHeader title="Fiduciary Advisory" type="conselho" />
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">Opinião Fiduciária Principal</h5>
          <p className="text-xs font-bold text-slate-800">{narrative.fiduciaryOpinion}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Ações de Sobrevivência Recomendadas</h5>
            <ul className="space-y-1.5">
              {data.recommendedActions.map((act: string, i: number) => (
                <li key={i} className="text-xs text-slate-700 flex gap-2 items-start">
                  <span className="text-slate-400 mt-1 shrink-0">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
          {narrative.fiduciaryWarnings.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-[9px] font-black uppercase text-rose-400 tracking-wider">Alertas e Restrições de Interpretação</h5>
              <ul className="space-y-1.5">
                {narrative.fiduciaryWarnings.map((warn: string, i: number) => (
                  <li key={i} className="text-xs text-rose-700 flex gap-2 items-start font-medium">
                    <span className="text-rose-400 mt-1 shrink-0">⚠</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function InstitutionalFinancialOverviewPage({
  clients,
  selectedClient,
  setSelectedClient,
  selectedYear,
  setSelectedYear,
  onNavigate
}: OverviewPageProps) {
  const { t } = useLanguage();
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [loadingCashFlow, setLoadingCashFlow] = useState(false);
  const [showExplainability, setShowExplainability] = useState(false);
  const [executiveReport, setExecutiveReport] = useState<ExecutiveIntelligenceReport | null>(null);

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  // Load Balance Sheet & DRE & DLPA
  const { dbData: bpEntries, loading: loadingBP } = useAnnualFinancialData(selectedClient, filterYear, 'BP');
  const { dbData: dreEntries, loading: loadingDRE } = useAnnualFinancialData(selectedClient, filterYear, 'DRE');
  const { dbData: dlpaEntries, loading: loadingDLPA } = useAnnualFinancialData(selectedClient, filterYear, 'DLPA');
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  // Load DFC/CashFlow data directly from firestore
  useEffect(() => {
    async function fetchCashFlow() {
      if (!selectedClient) return;
      setLoadingCashFlow(true);
      try {
        const q = query(
          collection(db, 'cash_flows'),
          where('clientId', '==', selectedClient)
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => d.data());
        const filteredDocs = docs.filter(d => Number(d.year) === filterYear || Number(d.ano) === filterYear);
        setCashFlowData(filteredDocs);
      } catch (err) {
        console.error('Error fetching cash flows:', err);
      } finally {
        setLoadingCashFlow(false);
      }
    }
    fetchCashFlow();
  }, [selectedClient, filterYear]);

  // Compute BP and DRE values
  const bpSummary = useMemo(() => getComputedBPSummary(bpEntries), [bpEntries]);

  const { ebitda, lucroLiquido } = useMemo(() => getComputedDreMetrics(dreEntries), [dreEntries]);

  // Run Executive Intelligence Runtime
  useEffect(() => {
    if (loadingBP || loadingDRE || loadingDLPA || loadingHistory || loadingCashFlow) return;

    const clientObj = clients?.find((c: any) => c.id === selectedClient);
    const segment = clientObj?.segmento || 'Default';

    // Map historical year PL and other variables
    const historyByYear = allHistoryData.reduce((acc: any, item: any) => {
      const yr = item.year;
      if (!acc[yr]) acc[yr] = {};
      const contaNorm = (item.conta || '').toLowerCase();
      if (contaNorm.includes('patrimônio líquido') || contaNorm === 'pl') {
        acc[yr].pl = (acc[yr].pl || 0) + (item.val || 0);
      }
      return acc;
    }, {});

    const prevPl = historyByYear[filterYear - 1]?.pl || 0;

    let calculatedCycles = Object.keys(historyByYear ?? {}).filter((year) => {
      const data = historyByYear[year];
      return data && data.pl !== undefined; // using pl as an indicator of valid statements in this file's historyByYear
    }).length || 1;

    const payload = {
      clientProfile: clientObj,
      rawFinancialData: {
        bpSummary,
        ebitda,
        lucroLiquido,
        segmentoEmpresa: segment,
        prevPl,
        dreDataLength: dreEntries.length,
        historicalCyclesCount: calculatedCycles,
        filterYear: filterYear,
        allHistoryData: allHistoryData
      },
      bpData: bpEntries,
      dreData: dreEntries,
      dlpaData: dlpaEntries,
      cashFlowData: cashFlowData,
      historicalCyclesCount: calculatedCycles,
      isMockData: bpEntries.length === 0 && dreEntries.length === 0
    };

    try {
      const report = executiveRuntime.generateExecutiveReport(payload);
      setExecutiveReport(report);
    } catch (err) {
      console.error('Error generating executive report in overview:', err);
    }
  }, [bpSummary, ebitda, lucroLiquido, dreEntries, bpEntries, dlpaEntries, cashFlowData, filterYear, allHistoryData, clients, selectedClient, loadingBP, loadingDRE, loadingDLPA, loadingHistory, loadingCashFlow]);

  const isLoading = loadingBP || loadingDRE || loadingDLPA || loadingHistory || loadingCashFlow || !executiveReport;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <Loader2 size={40} className="animate-spin text-slate-700" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Carregando inteligência institucional...
        </span>
      </div>
    );
  }

  // Extract variables from report
  const thesis = executiveReport.financialThesis?.thesis || executiveReport.orchestratedNarrative?.leadParagraph || 'Tese Indisponível';
  const pressures = executiveReport.financialThesis?.pressures || [];
  const structuralRisks = executiveReport.financialThesis?.structuralRisks || [];
  const tensions = executiveReport.crossStatementCausality?.tensions || [];
  const actionMatrix = executiveReport.advisory?.actionMatrix || [];
  const scores = executiveReport.scores;

  const propagationChains = executiveReport.propagationChains || [];
  const fiduciaryRationale = executiveReport.fiduciaryRationale;

  return (
    <>
      <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      {/* Header */}
      <PageHeader 
        title="EFOS — Executive Financial Operating System" 
        subtitle="Infraestrutura integrada de interpretação do capital e governança fiduciária."
        icon={Layers3}
        color="executive"
      />

      {/* Selectors Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/50 p-4 rounded-2xl border border-slate-200 backdrop-blur-md shadow-sm -mt-6">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-3">
            <Calendar size={14} className="text-slate-500" />
            <select
              onChange={(e) => {
                const yr = Number(e.target.value);
                setFilterYear(yr);
                if (setSelectedYear) setSelectedYear(yr);
              }}
              value={filterYear}
              className="bg-transparent text-xs font-bold uppercase tracking-wider outline-none cursor-pointer text-slate-700 appearance-none pr-1"
            >
              {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
            Modo: {t(`runtime.${executiveReport.compliance?.runtimeMode}`)}
          </span>
          <div className="group relative cursor-pointer">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 flex items-center gap-1">
              Confiabilidade: {t(`runtime.${executiveReport.compliance?.confidenceLevel}`)}
              <AlertTriangle size={12} className="opacity-50" />
            </span>
            {fiduciaryRationale?.confidenceDecomposition && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <h4 className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-wider">Decomposição de Confiança</h4>
                <div className="space-y-3">
                  {fiduciaryRationale.confidenceDecomposition.degradationFactors.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-rose-400">Fatores de Degradação</span>
                      <ul className="space-y-1">
                        {fiduciaryRationale.confidenceDecomposition.degradationFactors.map((f: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 leading-tight flex gap-1"><span className="text-rose-500">-</span> {f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {fiduciaryRationale.confidenceDecomposition.sustainmentFactors.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-emerald-400">Fatores de Sustentação</span>
                      <ul className="space-y-1">
                        {fiduciaryRationale.confidenceDecomposition.sustainmentFactors.map((f: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 leading-tight flex gap-1"><span className="text-emerald-500">+</span> {f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Tese Institucional (Hero Section) */}
      <div 
        className="bg-slate-900 text-slate-100 rounded-3xl p-8 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden cursor-pointer hover:border-slate-700 transition-all group"
        onClick={() => setShowExplainability(true)}
      >
        <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 opacity-10 pointer-events-none transition-transform group-hover:scale-105 group-hover:-rotate-3">
          <ShieldCheck size={320} />
        </div>
        
        <div className="max-w-4xl relative z-10 flex flex-col h-full justify-between space-y-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Target size={18} className="text-amber-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Financial Thesis</span>
            </div>
            
            {/* Status Badge */}
            <div className={cn(
              "px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
              executiveReport.severity?.level === 'CRÍTICO' || executiveReport.severity?.level === 'COLAPSO' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
              executiveReport.severity?.level === 'ESTRESSADO' || executiveReport.severity?.level === 'RESTRITIVO' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
              executiveReport.severity?.level === 'SENSÍVEL' || executiveReport.severity?.level === 'PRESSIONADO' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
              "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            )}>
              <span className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                executiveReport.severity?.level === 'CRÍTICO' || executiveReport.severity?.level === 'COLAPSO' ? "bg-rose-500" :
                executiveReport.severity?.level === 'ESTRESSADO' || executiveReport.severity?.level === 'RESTRITIVO' ? "bg-orange-500" :
                executiveReport.severity?.level === 'SENSÍVEL' || executiveReport.severity?.level === 'PRESSIONADO' ? "bg-amber-500" :
                "bg-emerald-500"
              )} />
              {executiveReport.severity?.level === 'CRÍTICO' || executiveReport.severity?.level === 'COLAPSO' ? 'Cenário Crítico' :
               executiveReport.severity?.level === 'ESTRESSADO' || executiveReport.severity?.level === 'RESTRITIVO' ? 'Cenário de Alerta' :
               executiveReport.severity?.level === 'SENSÍVEL' || executiveReport.severity?.level === 'PRESSIONADO' ? 'Cenário em Atenção' :
               'Cenário Sustentável'}
            </div>
          </div>
          
          <h1 className="text-xl md:text-[1.75rem] font-medium tracking-tight leading-relaxed text-slate-200">
            "{thesis}"
          </h1>
          
          <div className="flex items-center gap-6 pt-6 border-t border-slate-800/80 text-[10px] uppercase font-black tracking-widest text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Score Composto: <span className="text-slate-300 ml-1">{scores.composite}/100</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span>Clique para ver evidências matemáticas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Pressures, Risks & Tensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Tensions & Vectors */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={18} className="text-violet-500" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Tensões Cross-Statement</h3>
          </div>
          {propagationChains.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Nenhuma cadeia de propagação identificada no período.</p>
          ) : (
            <div className="space-y-6">
              {propagationChains.map((chain: any, i) => (
                <div key={chain.id || i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cadeia de Propagação {i + 1}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                      chain.chainSeverity === 'CRÍTICA' ? 'text-red-600 bg-red-50 border-red-200' :
                      chain.chainSeverity === 'ALTA' ? 'text-rose-600 bg-rose-50 border-rose-200' :
                      'text-amber-600 bg-amber-50 border-amber-200'
                    )}>
                      {chain.chainSeverity}
                    </span>
                  </div>
                  
                  {/* SVG Chain Visualization */}
                  <div className="relative pt-2 pb-6 px-4 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between relative z-10">
                      {chain.nodes.map((node: string, nodeIdx: number) => (
                        <div key={nodeIdx} className="flex flex-col items-center">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black border-2 bg-white shadow-sm z-10",
                            nodeIdx === 0 ? "border-slate-800 text-slate-800" :
                            nodeIdx === chain.nodes.length - 1 ? "border-rose-500 text-rose-500" :
                            "border-amber-500 text-amber-600"
                          )}>
                            {node}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* SVG Connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                      <defs>
                        <linearGradient id="grad-line" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#94a3b8" />
                          <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                      </defs>
                      <path d={`M 40,32 L ${100}%,32`} stroke="url(#grad-line)" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
                    </svg>
                    
                    <div className="mt-4 text-[10px] text-slate-500 font-mono text-center">
                      Impacto: {chain.systemicImpact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pressures & Risks */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-500" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Pressões & Riscos Estruturais</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pressures list */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pressões Imediatas</h4>
              {pressures.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sem pressões ativas registradas.</p>
              ) : (
                <ul className="space-y-2">
                  {pressures.map((press: string, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{t(`runtime.${press}`)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Structural risks list */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Riscos de Longo Prazo</h4>
              {structuralRisks.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sem riscos estruturais detectados.</p>
              ) : (
                <ul className="space-y-2">
                  {structuralRisks.map((risk: string, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-xs text-slate-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                      <span>{t(`runtime.${risk}`)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Institutional Cash Sustainability */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <DollarSign size={20} className="text-emerald-500" />
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Institutional Cash Sustainability</h3>
        </div>
        
        {!executiveReport.cashSustainabilityReport ? (
           <p className="text-sm text-slate-500 italic">Relatório de Sustentabilidade de Caixa indisponível neste ciclo.</p>
        ) : (
          <>
            {/* Reconciliation Disclosure */}
            {executiveReport.cashSustainabilityReport.reconciliationAlerts?.disclosures?.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Notas Fiduciárias de Conciliação</h4>
                <ul className="space-y-1">
                  {executiveReport.cashSustainabilityReport.reconciliationAlerts.disclosures.map((disc: string, i: number) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400">•</span> {disc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {executiveReport.cashSustainabilityReport.isAvailable ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LiquidityClassificationPanel data={executiveReport.cashSustainabilityReport.liquidityClassification} />
                <ArtificialLiquidityPanel data={executiveReport.cashSustainabilityReport.artificialLiquidityDetected} />
                <StructuralReconciliationPanel data={executiveReport.cashSustainabilityReport.reconciliationAlerts} />
                <OperationalSustainabilityPanel data={executiveReport.cashSustainabilityReport.legacyOperationalSustainabilityAssessment} />
                <InstitutionalContinuityPanel data={executiveReport.cashSustainabilityReport.continuityRisk} />
                <FiduciaryAdvisoryPanel data={executiveReport.cashSustainabilityReport.continuityRisk} narrative={executiveReport.cashSustainabilityReport.fiduciaryNarrative} />
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-center">
                <p className="text-sm font-medium text-rose-600">{executiveReport.cashSustainabilityReport.liquidityClassification?.rationale || 'DFC indisponível ou bloqueada.'}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Causal Sustainability Intelligence */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-purple-500" />
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Causal Sustainability Intelligence</h3>
          </div>
          {executiveReport.causalIntelligenceReport?.lineageHash && (
            <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono">
              <span>Assinatura Fiduciária: {executiveReport.causalIntelligenceReport.lineageHash.substring(0, 16)}...</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase font-sans font-bold">
                Confiança: {executiveReport.causalIntelligenceReport.confidenceLevel}
              </span>
            </div>
          )}
        </div>

        {!executiveReport.causalIntelligenceReport ? (
          <p className="text-sm text-slate-500 italic">Relatório de Inteligência Causal indisponível neste ciclo.</p>
        ) : (
          <>
            {executiveReport.causalIntelligenceReport.causalOpinion && (
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Parecer Causal Executivo</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  {executiveReport.causalIntelligenceReport.causalOpinion}
                </p>
              </div>
            )}

            {executiveReport.causalIntelligenceReport.isAvailable ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InstitutionalCausalRootCausesPanel rootCauses={executiveReport.causalIntelligenceReport.rootCauses} />
                <OperationalStressCascadePanel cascadePath={executiveReport.causalIntelligenceReport.stressCascadePath} />
                <SurvivabilityDependencyGraphPanel graph={executiveReport.causalIntelligenceReport.dependencyGraph} />
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-center">
                <p className="text-sm font-medium text-rose-600">
                  {executiveReport.causalIntelligenceReport.causalOpinion || 'Análise causal retida devido a inconsistências críticas ou histórico insuficiente.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>


      {/* Governança de Capital (DLPA) - Preserved from old Overview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-blue-500" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Governança de Capital (DLPA)</span>
          </div>
          <span className={cn(
            "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
            executiveReport.capitalGovernanceReport?.isAvailable ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-slate-500 bg-slate-50 border-slate-200'
          )}>
            {executiveReport.capitalGovernanceReport?.isAvailable ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {executiveReport.capitalGovernanceReport?.overallNarrative}
        </p>
      </div>

      {/* Consolidated Action Matrix */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-slate-700" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Agenda de Prioridades Executivas</h3>
        </div>

        {actionMatrix.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Nenhuma prioridade fiduciária listada com os dados atuais.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actionMatrix.map((item: any, i) => (
              <div key={i} className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      {item.category}
                    </span>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                      item.priority === 'Alta' ? 'text-red-700 bg-red-50 border-red-200' : 'text-slate-600 bg-slate-50 border-slate-200'
                    )}>
                      {item.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.expectedImpact}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Evidência Fiduciária</div>
                  <div className="text-[10px] text-slate-700 font-medium">{item.fiduciaryEvidence}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Quick Links */}
      <div className="space-y-8">
        
        {/* Layer 1: Contábil & Fiduciário */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-slate-200"></span>
            Camada Contábil & Fiduciária
            <span className="w-8 h-[1px] bg-slate-200"></span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => onNavigate && onNavigate('bp')}
              className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
            >
              <BookOpen size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 text-center leading-tight">Posição<br/>Patrimonial (BP)</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('dre')}
              className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
            >
              <FileText size={24} className="text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 text-center leading-tight">Desempenho<br/>Econômico (DRE)</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('dfc')}
              className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
            >
              <Layers size={24} className="text-teal-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 text-center leading-tight">Posição de<br/>Liquidez (DFC)</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('dlpa')}
              className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
            >
              <Compass size={24} className="text-violet-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 text-center leading-tight">Governança de<br/>Capital (DLPA)</span>
            </button>
          </div>
        </div>

        {/* Layer 2: Gerencial & Inteligência */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-slate-200"></span>
            Camada Gerencial & Inteligência
            <span className="w-8 h-[1px] bg-slate-200"></span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:w-1/2 mx-auto">
            <button 
              onClick={() => onNavigate && onNavigate('caixa')}
              className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
            >
              <DollarSign size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 text-center leading-tight">Fluxo de Caixa<br/><span className="text-[10px] text-slate-500 font-normal">Gerencial</span></span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('analise_financeira')}
              className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
            >
              <Activity size={24} className="text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 text-center leading-tight">Inteligência de<br/>Capital</span>
            </button>
          </div>
        </div>

      </div>

    </div>

      {/* Drawer: Racional Fiduciário (Explainability) */}
      {showExplainability && fiduciaryRationale && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">Racional Fiduciário</h2>
                <p className="text-[10px] text-slate-500 font-medium">Explainability Layers & Fiduciary Evidence</p>
              </div>
              <button 
                onClick={() => setShowExplainability(false)}
                className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors"
              >
                X
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Layer 1: Executive Summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-[10px] font-black text-slate-500">L1</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{fiduciaryRationale.executiveSummary.title}</h3>
                </div>
                <p className="text-[11px] text-slate-600 pl-8">{fiduciaryRationale.executiveSummary.description}</p>
                <div className="pl-8 space-y-2">
                  {fiduciaryRationale.executiveSummary.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-500">{item.label}</span>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-wider",
                        item.severity === 'CRÍTICA' ? 'text-red-600' :
                        item.severity === 'ALTA' ? 'text-rose-600' :
                        item.severity === 'MODERADA' ? 'text-amber-600' :
                        'text-emerald-600'
                      )}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 2: Structural Drivers */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-blue-50 text-[10px] font-black text-blue-500">L2</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{fiduciaryRationale.structuralDrivers.title}</h3>
                </div>
                <p className="text-[11px] text-slate-600 pl-8">{fiduciaryRationale.structuralDrivers.description}</p>
                <div className="pl-8 space-y-2">
                  {fiduciaryRationale.structuralDrivers.items.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col gap-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] uppercase font-bold text-slate-400">{item.label}</span>
                      <span className="text-[11px] font-bold text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 3: Mathematical Evidence */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-50 text-[10px] font-black text-emerald-500">L3</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{fiduciaryRationale.mathematicalEvidence.title}</h3>
                </div>
                <p className="text-[11px] text-slate-600 pl-8">{fiduciaryRationale.mathematicalEvidence.description}</p>
                <div className="pl-8 space-y-2">
                  {fiduciaryRationale.mathematicalEvidence.items.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col gap-1 p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[9px] uppercase font-bold text-slate-500">{item.label}</span>
                      <span className="text-[11px] font-mono text-emerald-400 leading-relaxed">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
