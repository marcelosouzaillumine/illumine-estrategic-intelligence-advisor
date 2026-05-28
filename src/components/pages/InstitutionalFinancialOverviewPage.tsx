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
import { executiveRuntime, ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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

export function InstitutionalFinancialOverviewPage({
  clients,
  selectedClient,
  setSelectedClient,
  selectedYear,
  setSelectedYear,
  onNavigate
}: OverviewPageProps) {
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [loadingCashFlow, setLoadingCashFlow] = useState(false);
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
        setCashFlowData(docs);
      } catch (err) {
        console.error('Error fetching cash flows:', err);
      } finally {
        setLoadingCashFlow(false);
      }
    }
    fetchCashFlow();
  }, [selectedClient]);

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

    let calculatedCycles = Object.keys(historyByYear).length || 1;
    if (clientObj?.dataFundacao) {
      let fundacaoYear = null;
      if (clientObj.dataFundacao.includes('/')) {
        const parts = clientObj.dataFundacao.split('/');
        if (parts.length === 3) fundacaoYear = parseInt(parts[2]);
      } else if (clientObj.dataFundacao.includes('-')) {
        const parts = clientObj.dataFundacao.split('-');
        if (parts.length >= 1) fundacaoYear = parseInt(parts[0]);
      }
      if (fundacaoYear && !isNaN(fundacaoYear)) {
        calculatedCycles = Math.max(1, filterYear - fundacaoYear);
      }
    }

    const payload = {
      rawFinancialData: {
        bpSummary,
        ebitda,
        lucroLiquido,
        segmentoEmpresa: segment,
        prevPl,
        dreDataLength: dreEntries.length,
        historicalCyclesCount: calculatedCycles
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

  return (
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
              {Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 3 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
            Modo: {executiveReport.compliance?.runtimeMode}
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
            Confiabilidade: {executiveReport.compliance?.confidenceLevel}
          </span>
        </div>
      </div>

      {/* Grid: Tese Institucional (Hero Section) */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 opacity-10 pointer-events-none">
          <ShieldCheck size={320} />
        </div>
        <div className="max-w-4xl relative z-10 space-y-6">
          <div className="flex items-center gap-2 text-amber-500">
            <Target size={20} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">InstitutionalFinancialThesis (Tese Financeira)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-relaxed text-white">
            "{thesis}"
          </h1>
          <div className="flex items-center gap-4 pt-4 border-t border-slate-800/80 text-[10px] uppercase font-black tracking-wider text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Score Composto: {scores.composite}/100</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Risco Geral: {executiveReport.severity?.level}</span>
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
          
          {tensions.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Nenhuma tensão cross-statement significativa identificada no período.</p>
          ) : (
            <div className="space-y-4">
              {tensions.map((tension: any, i) => (
                <div key={tension.id || i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{tension.title}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                      tension.severity === 'CRÍTICA' ? 'text-red-600 bg-red-50 border-red-200' :
                      tension.severity === 'SEVERA' ? 'text-rose-600 bg-rose-50 border-rose-200' :
                      'text-amber-600 bg-amber-50 border-amber-200'
                    )}>
                      {tension.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{tension.description}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Evidência: {tension.evidence}
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
                      <span>{press}</span>
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
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Capital Sustainability Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cash Flow report status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-500" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Dinâmica de Caixa (DFC)</span>
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
              executiveReport.cashFlowReport?.isAvailable ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-50 border-slate-200'
            )}>
              {executiveReport.cashFlowReport?.isAvailable ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {executiveReport.cashFlowReport?.overallNarrative}
          </p>
        </div>

        {/* DLPA report status */}
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

      {/* Navigation Quick Links Grid */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Navegação e Demonstrativos de Capital</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button 
            onClick={() => onNavigate && onNavigate('bp')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
          >
            <BookOpen size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Balanço Patrimonial</span>
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('dre')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
          >
            <FileText size={24} className="text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">DRE Contábil</span>
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('caixa')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
          >
            <DollarSign size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Dinâmica de Caixa</span>
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('dlpa')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
          >
            <Compass size={24} className="text-violet-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Governança de Capital</span>
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('analise_financeira')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
          >
            <Activity size={24} className="text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Inteligência de Capital</span>
          </button>
        </div>
      </div>

    </div>
  );
}
