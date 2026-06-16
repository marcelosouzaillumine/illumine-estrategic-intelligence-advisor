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
import { DREEconomicBreakdownSection } from './dre/DREEconomicBreakdownSection';
import { DREBoardDecisionSupportSection } from './dre/DREBoardDecisionSupportSection';
import { DREExecutiveAdvisorySection } from './dre/DREExecutiveAdvisorySection';
import { DreExecutiveViewModelBuilder } from '../../core/runtime/dre/DreExecutiveViewModelBuilder';
import { DreContractGuard } from '../../core/runtime/dre/DreContractGuard';
import { DRETechnicalLayerSection } from './dre/DRETechnicalLayerSection';


type ToastType = { type: 'success' | 'error'; message: string } | null;

export function DREPage({ clients, selectedClient, selectedYear }: any) {
  const { translateLabel, t } = useLanguage();
  const [filterYear, setFilterYear] = useState<number>(Number(selectedYear) || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [, setThemeTrigger] = useState(0);

  const { session } = useInstitutionalAuth();
  const userRole = session?.role || 'BOARD_MEMBER';
  const profile = useMemo(() => FiduciaryRuntimeAdapter.getProfile(FiduciaryRuntimeAdapter.mapOfficialRoleToProfileId(userRole)), [userRole]);
  const [densityLevel, setDensityLevel] = useState<PresentationLayer>(profile.defaultDensity);  
  
  useEffect(() => {
    setDensityLevel(profile.defaultDensity);
  }, [userRole, profile]);

  useEffect(() => {
    setDensityLevel(profile.defaultDensity);
  }, [userRole, profile]);

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
  const [dreViewModel, setDreViewModel] = useState<any>(null);

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

      try {
        const vm = DreExecutiveViewModelBuilder.build({
          dreData: dbData,
          historicalDreData: allHistoryData,
          bpData: dbDataBP,
          dlpaData: dbDataDLPA,
          dfcData: dbDataDFC,
          filterYear
        });
        setDreViewModel(vm);
      } catch (e) {
        console.error(e);
      }
    }
    runAnalysis();
  }, [dbData, dbDataBP, dbDataDLPA, dbDataDFC, allHistoryData, filterYear, segmentoEmpresa, docIds.length]);


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

  const hasDreData = dbData.length > 0 && !!dreViewModel;

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





      
      {/* 2. DIAGNÓSTICO ECONÔMICO (EXECUTIVE ADVISORY) */}
      {isSectionVisible('DRE_ADVISORY') && dreViewModel?.policy?.executiveDiagnosis && (
        <DREExecutiveAdvisorySection 
          viewModel={dreViewModel.policy.executiveDiagnosis}
          selectedYear={selectedYear}
        />
      )}

      {/* 3 & 4. ESTRUTURA ECONÔMICA E CONSUMO */}
      <DREEconomicBreakdownSection
        isVisibleStructure={isSectionVisible('DRE_ESTRUTURA_ECONOMICA')}
        isVisibleBurnRate={isSectionVisible('DRE_CONSUMO_ECONOMICO')}
        isVisibleBreakEven={isSectionVisible('DRE_BREAK_EVEN')}
        viewModel={dreViewModel}
      />

      {/* 5. BOARD DECISION SUPPORT FRAMEWORK (PAINÉIS DIMENSIONAIS) */}
      {isSectionVisible('DRE_DECISION_SUPPORT') && dreViewModel?.policy?.boardQuestions && (
        <DREBoardDecisionSupportSection viewModel={{
          ...dreViewModel.policy.boardQuestions,
          overallStatus: dreViewModel.policy.economicPositioning,
          confidenceScore: dreViewModel.policy.confidenceScore
        }} />
      )}

      {/* 7. CAMADA TÉCNICA (COLAPSADA) */}
      {isSectionVisible('DRE_TECHNICAL_LAYER') && dreViewModel?.technicalLayer?.rows && dreViewModel.technicalLayer.rows.length > 0 && (
        <div className="mb-10">
          <DRETechnicalLayerSection viewModel={dreViewModel.technicalLayer} />
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
      <p className="text-sm text-executive-secondary mb-8 font-medium">
              Esta ação removerá todos os registros da DRE para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
        className="flex-1 py-3 text-sm font-bold text-executive-secondary hover:bg-surface-container/30 rounded-2xl transition-all"
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
