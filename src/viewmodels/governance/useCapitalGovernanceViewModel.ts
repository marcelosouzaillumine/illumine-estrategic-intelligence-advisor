import { useMemo } from 'react';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../hooks/useInstitutionalRuntime';
import { formatCurrency } from '../../lib/utils';

export interface CapitalGovernanceViewModelProps {
  selectedClient?: string;
  selectedYear?: number;
}

export function useCapitalGovernanceViewModel({ selectedClient, selectedYear }: CapitalGovernanceViewModelProps) {
  const filterYear = selectedYear || new Date().getFullYear();

  // Fetch historical client data
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient || '');

  // Run the full institutional context pipeline
  const { runtimeOutput, loading: runtimeLoading } = useInstitutionalRuntime({
    input: {
      clientId: selectedClient,
      rawFinancialData: {
        filterYear,
        allHistoryData
      }
    }
  });

  const cgeInference = useMemo(() => {
    return runtimeOutput?.inferences?.['CapitalGovernanceAdapter'];
  }, [runtimeOutput]);

  const cgeMetrics = cgeInference?.metrics || {};

  const {
    cgs = 50,
    cgsStatus = 'Moderate Governance',
    cpi = 1.0,
    cpiStatus = 'Capital Preserved',
    cdi = 0.0,
    cdiStatus = 'Independent',
    ddi = 'NOT_APPLICABLE',
    ddiStatus = 'NOT_APPLICABLE',
    eri = 'NOT_APPLICABLE',
    eriStatus = 'NOT_APPLICABLE',
    erir = 0.3,
    erirStatus = 'Moderate',
    cmi = 50,
    trajectory = 'STABILIZING',
    capitalSocial = 0,
    patrimonioLiquido = 0,
    plInicio = 0,
    netIncome,
    dividendos = 0,
    capitalInjections = 0,
    capitalizacoesAcumuladas = 0
  } = cgeMetrics;

  // Rendered values in UI (directly from state/variables)
  const renderedNetIncome = netIncome;
  const renderedCapitalSocial = capitalSocial;
  const renderedPreservation = cgeMetrics.capitalPreservation;
  const renderedIntegrity = cgeMetrics.capitalIntegrity;
  const renderedResilience = cgeMetrics.capitalResilience;

  // Runtime values (directly from CGE metrics payload)
  const runtimeNetIncome = cgeMetrics.netIncome;
  const runtimeCapitalSocial = cgeMetrics.capitalSocial;
  const runtimePreservation = cgeMetrics.capitalPreservation;
  const runtimeIntegrity = cgeMetrics.capitalIntegrity;
  const runtimeResilience = cgeMetrics.capitalResilience;

  const hasMismatches = 
    (renderedNetIncome !== runtimeNetIncome) ||
    (renderedCapitalSocial !== runtimeCapitalSocial) ||
    (renderedPreservation !== runtimePreservation) ||
    (renderedIntegrity !== runtimeIntegrity) ||
    (renderedResilience !== runtimeResilience);

  const radarData = useMemo(() => {
    return [
      { subject: 'Integridade Patrimonial', value: Math.max(0, Math.min(100, Math.round(cgeMetrics.capitalIntegrity ?? 50))) },
      { subject: 'Resiliência (ERI-R)', value: Math.max(0, Math.min(100, Math.round(cgeMetrics.capitalResilience ?? 50))) },
      { subject: 'Dependência (CDI)', value: Math.max(0, Math.min(100, Math.round((1 - cdi) * 100))) },
      { subject: 'Disciplina (DDI)', value: ddi === 'NOT_APPLICABLE' ? 70 : Math.max(0, Math.min(100, Math.round((1 - (ddi as number)) * 100))) },
      { subject: 'Retenção (ERI)', value: eri === 'NOT_APPLICABLE' ? 50 : Math.max(0, Math.min(100, Math.round((eri as number) * 100))) }
    ];
  }, [cgeMetrics, cdi, ddi, eri]);

  // Extract years and dependency metrics for the heatmap
  const historicalDependencyList = useMemo(() => {
    const years = [filterYear - 4, filterYear - 3, filterYear - 2, filterYear - 1, filterYear].filter(y => y > 2000);
    return years.map(y => {
      const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y);
      
      let yearCapitalSocial = 0;
      let yearPlFim = 0;
      let yearCapInj = 0;

      const normalize = (s: string) =>
        (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      yearEntries.forEach((d: any) => {
        const normConta = normalize(d.conta || d.category || '');
        const val = Math.abs(d.val || d.valor || d.value || 0);

        if (normConta.includes('capital social') || normConta.includes('capital integralizado')) {
          yearCapitalSocial = val;
        }
        if (normConta.includes('patrimonio liquido') || normConta.includes('pl fim') || normConta.includes('saldo final')) {
          yearPlFim = Number(d.val || d.valor || d.value || 0);
        }
        if (normConta.includes('aumento de capital') || normConta.includes('integralizacao') || normConta.includes('capitalizacao')) {
          yearCapInj = val;
        }
      });

      if (yearPlFim === 0 && yearCapitalSocial > 0) yearPlFim = yearCapitalSocial;

      const yearCdi = yearPlFim > 0 ? yearCapInj / yearPlFim : 0;
      let status = 'Independent';
      if (yearCdi >= 1.0) status = 'Critical Dependency';
      else if (yearCdi >= 0.5) status = 'High Dependency';
      else if (yearCdi >= 0.2) status = 'Moderate Dependency';

      return {
        year: y,
        injections: yearCapInj,
        equity: yearPlFim,
        cdi: yearCdi,
        status
      };
    });
  }, [allHistoryData, filterYear]);

  // Trajectory timeline definition
  const trajectoryTimeline = useMemo(() => {
    const list = [
      { state: 'RECOVERING', label: 'Recuperando Base de Capital', color: 'text-emerald-400 border-emerald-500/20 bg-success-soft0/5' },
      { state: 'STABILIZING', label: 'Estrutura Estabilizada', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
      { state: 'VOLATILE', label: 'Erosão Oscilante / Volatilidade', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' },
      { state: 'DEPENDENT', label: 'Dependência de Reforço Recorrente', color: 'text-amber-500 border-amber-500/20 bg-warning-soft0/5' },
      { state: 'DETERIORATING', label: 'Deterioração Progressiva do Capital', color: 'text-rose-400 border-rose-500/20 bg-critical-soft0/5' }
    ];
    return list;
  }, []);

  const loading = loadingHistory || runtimeLoading;

  const translateCpiStatus = (status: string) => {
    if (status === 'Capital Expansion') return 'Expansão de Capital';
    if (status === 'Capital Strengthening') return 'Fortalecimento de Capital';
    if (status === 'Capital Preserved' || status === 'Preserved Capital') return 'Capital Preservado';
    if (status === 'Moderate Erosion' || status === 'Capital Erosion') return 'Erosão Moderada';
    if (status === 'High Erosion' || status === 'Severe Erosion') return 'Erosão Patrimonial Elevada';
    if (status === 'Critical Erosion') return 'Erosão Crítica';
    if (status === 'Capital Collapse') return 'Colapso de Capital';
    return status;
  };

  return {
    state: {
      loading
    },
    computed: {
      cgeInference,
      cgeMetrics,
      cgs,
      cgsStatus,
      cpi,
      cpiStatus,
      cdi,
      cdiStatus,
      ddi,
      ddiStatus,
      eri,
      eriStatus,
      erir,
      erirStatus,
      cmi,
      trajectory,
      capitalSocial,
      patrimonioLiquido,
      plInicio,
      netIncome,
      dividendos,
      capitalInjections,
      capitalizacoesAcumuladas,
      renderedNetIncome,
      renderedCapitalSocial,
      renderedPreservation,
      renderedIntegrity,
      renderedResilience,
      runtimeNetIncome,
      runtimeCapitalSocial,
      runtimePreservation,
      runtimeIntegrity,
      runtimeResilience,
      hasMismatches,
      radarData,
      historicalDependencyList,
      trajectoryTimeline,
      translateCpiStatus
    },
    actions: {}
  };
}
