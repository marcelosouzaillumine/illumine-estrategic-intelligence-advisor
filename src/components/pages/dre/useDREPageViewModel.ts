import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAnnualFinancialData, useAllFinancialData } from '../../../hooks/useFinancialData';
import { useInstitutionalAuth } from '../../../hooks/useInstitutionalAuth';
import { FiduciaryRuntimeAdapter, PresentationLayer } from '../../../services/FiduciaryRuntimeAdapter';
import { DREApplicationService } from './DREApplicationService';
import { InstitutionalDecisionOS } from '../../../../packages/intelligence/executive-intelligence-layer/src/orchestration/InstitutionalDecisionOS';
import { DashboardStateBuilder } from '../../../../packages/intelligence/executive-intelligence-layer/src/presentation/DashboardStateBuilder';

export type ToastType = { type: 'success' | 'error'; message: string } | null;

export function useDREPageViewModel(clients: any[], selectedClient: string, selectedYear: number) {
  const [filterYear, setFilterYear] = useState<number>(Number(selectedYear) || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [, setThemeTrigger] = useState(0);

  const { session } = useInstitutionalAuth();
  const userRole = session?.role || 'BOARD_MEMBER';
  const profile = useMemo(() => FiduciaryRuntimeAdapter.getProfile(FiduciaryRuntimeAdapter.mapOfficialRoleToProfileId(userRole)), [userRole]);
  const [densityLevel, setDensityLevel] = useState<PresentationLayer>(profile.defaultDensity);  

  useEffect(() => {
    setDensityLevel(profile.defaultDensity);
  }, [userRole, profile]);

  useEffect(() => {
    if (selectedYear) setFilterYear(Number(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => prev + 1);
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const currentClient = clients?.find((c: any) => c.id === selectedClient);
  const segmentoEmpresa = (currentClient?.segmentoAtuacao || currentClient?.segmento || 'Serviços').toLowerCase();

  const { dbData: dbDataDRE, docIds: docIdsDRE, loading: loadingDRE, refetch: refetchDRE } = useAnnualFinancialData(selectedClient, filterYear, 'DRE');
  const { dbData: dbDataBP } = useAnnualFinancialData(selectedClient, filterYear, 'BP');
  const { dbData: dbDataDLPA } = useAnnualFinancialData(selectedClient, filterYear, 'DLPA');
  const { dbData: dbDataDFC } = useAnnualFinancialData(selectedClient, filterYear, 'DFC');
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  const loading = loadingDRE;
  const dbData = dbDataDRE;
  const docIds = docIdsDRE;

  const [executiveReport, setExecutiveReport] = useState<any>(null);
  const [dreViewModel, setDreViewModel] = useState<any>(null);

  useEffect(() => {
    if (!dbData) return;
    const { executiveReport: report, dreViewModel: vm } = DREApplicationService.buildExecutiveViewModel({
      dbData,
      dbDataBP,
      dbDataDLPA,
      dbDataDFC,
      allHistoryData,
      filterYear,
      currentClient,
      segmentoEmpresa,
      docIdsLength: docIds.length
    });
    setExecutiveReport(report);
    setDreViewModel(vm);
  }, [dbData, dbDataBP, dbDataDLPA, dbDataDFC, allHistoryData, filterYear, segmentoEmpresa, docIds.length, currentClient]);

  const hasDreData = dbData.length > 0 && !!dreViewModel;

  const presentationModel = useMemo(() => {
    if (!hasDreData) return null;
    const financialData = {
      assets: 1000000, // fallback
      liabilities: 500000,
      equity: 500000,
      liquidity: 1.5,
      ebitda: dreViewModel?.ebitda || 0,
      revenue: dreViewModel?.receitaLiquida || 0
    };
    const boardPackage = InstitutionalDecisionOS.runSession(
      { 
        id: 'q-2', 
        text: 'Avaliação Econômica (DRE)', 
        questionType: 'UNKNOWN', 
        askedBy: 'System', 
        askedAt: new Date(),
        decisionContext: { currentState: 'Sessão Automática', constraints: [], strategicMoment: 'N/A' },
        businessProblem: 'N/A', decisionToEnable: 'N/A', strategicHypothesis: 'N/A', financialImpact: 'N/A',
        timeHorizon: 'N/A', decisionMaker: 'System', decisionCriteria: [], successDefinition: 'N/A',
        nonNegotiables: [], stakeholders: []
      },
      undefined,
      financialData
    );
    return boardPackage.assessments.economicAssessment;
  }, [hasDreData, dreViewModel]);

  const showToastMsg = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    setShowDeleteConfirm(false);
    try {
      const deletedCount = await DREApplicationService.deleteDREData(selectedClient, filterYear);
      showToastMsg('success', `${deletedCount} registro(s) excluído(s) com sucesso.`);
      refetchDRE();
    } catch (err: any) {
      showToastMsg('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };

  const isSectionVisible = useCallback((sectionName: string) => {
    return FiduciaryRuntimeAdapter.ExecutiveInformationDensityFramework.isSectionVisible(sectionName, densityLevel);
  }, [densityLevel]);


  return {
    state: {
      filterYear,
      toast,
      deleting,
      showDeleteConfirm,
      showImportModal,
      showManualModal,
      densityLevel,
      loading,
      loadingHistory,
      hasDreData,
      executiveReport,
      dreViewModel,
      assessment: presentationModel
    },
    computed: {
      isSectionVisible
    },
    actions: {
      setFilterYear,
      setShowDeleteConfirm,
      setShowImportModal,
      setShowManualModal,
      handleDelete,
      showToastMsg,
      refetchDRE
    }
  };
}
