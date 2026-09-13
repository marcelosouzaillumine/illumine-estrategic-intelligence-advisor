import { useState, useMemo } from 'react';
import { useAllFinancialData } from '../../../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../../../hooks/useInstitutionalRuntime';

export interface CreditCommitteeViewModelProps {
  selectedClient?: string;
  selectedYear?: number;
}

export function useCreditCommitteeViewModel({ selectedClient, selectedYear }: CreditCommitteeViewModelProps) {
  const filterYear = selectedYear || new Date().getFullYear();

  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient || '');

  const { runtimeOutput, loading: runtimeLoading } = useInstitutionalRuntime({
    input: {
      clientId: selectedClient,
      rawFinancialData: {
        filterYear,
        allHistoryData
      }
    }
  });

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(2);
  const [showDeltaView, setShowDeltaView] = useState<boolean>(true);

  const ccsInference = useMemo(() => {
    return runtimeOutput?.inferences?.['CreditCommitteeSimulatorEngine'];
  }, [runtimeOutput]);

  const brmInference = useMemo(() => {
    return runtimeOutput?.inferences?.['BoardRiskMatrixAdapter'];
  }, [runtimeOutput]);

  const metrics = ccsInference?.metrics || {};
  const brmMetrics = brmInference?.metrics || {};

  const {
    ccsScore = 70,
    creditReadinessLevel = 'Transitional Credit Consistency',
    suggestedCreditRating = 'BBB',
    creditDecisionSimulation = 'CONDITIONAL_APPROVAL',
    institutionalFundingGrade = 'B',
    treasuryFundingGrade = 'B',
    covenantResilienceGrade = 'B',
    institutionalCreditConfidence = 'MODERATE_CONFIDENCE',
    refinancingRiskLevel = 'LOW',
    bankingExposureLevel = 'LOW',
    covenantThresholds = {
      maxNetDebtEbitda: 3.5,
      minDscr: 1.2,
      minLiquidityStDebt: 0.20,
      minRunway: 6,
      minEbitdaCoverage: 1.5
    },
    recoveryMomentum = 'STABILIZING_RECOVERY',
    fundingGapTimeline = {
      '30d': 0,
      '90d': 0,
      '180d': 0,
      '360d': 0
    },
    fractures = [],
    activeShields = {
      capexExpansionActive: false,
      restructuringActive: false,
      acquisitionCycleActive: false,
      industrialMaturationActive: false
    },
    domains = {
      treasury: { score: 70 },
      earnings: { score: 70 },
      capital: { score: 70 },
      governance: { score: 70 },
      longitudinal: { score: 70 },
      covenant: { score: 70 }
    },
    alerts = [],
    stressScenarios = [],
    heatmaps = {
      covenantStress: [],
      treasuryFunding: [],
      refinancingDependency: [],
      governanceReliability: [],
      institutionalStability: []
    },
    auditability = {},
    isEarlyStage = false,
    narrative
  } = metrics;

  const bankingReadinessScore = brmMetrics.bankingReadinessScore ?? 70;
  const bankingReadinessLevel = brmMetrics.bankingReadinessLevel ?? 'Restricted Credit Readiness';

  const radarData = useMemo(() => {
    return [
      { subject: 'Tesouraria (25%)', value: domains.treasury?.score ?? 70 },
      { subject: 'Lucratividade (20%)', value: domains.earnings?.score ?? 70 },
      { subject: 'Estrutura Capital (20%)', value: domains.capital?.score ?? 70 },
      { subject: 'Governança (15%)', value: domains.governance?.score ?? 70 },
      { subject: 'Estabilidade Long. (10%)', value: domains.longitudinal?.score ?? 70 },
      { subject: 'Covenants Stress (10%)', value: domains.covenant?.score ?? 70 }
    ];
  }, [domains]);

  const activeScenario = useMemo(() => {
    if (stressScenarios && stressScenarios.length > selectedScenarioIndex) {
      return stressScenarios[selectedScenarioIndex];
    }
    return null;
  }, [stressScenarios, selectedScenarioIndex]);

  const baseScenario = useMemo(() => {
    return stressScenarios.find((s: any) => s.name === 'Base Institutional Scenario');
  }, [stressScenarios]);

  const chartData = useMemo(() => {
    if (!baseScenario || !activeScenario) return [];
    return baseScenario.trajectory.map((basePt: any, idx: number) => {
      const activePt = activeScenario.trajectory[idx] || {};
      return {
        month: `Mês ${basePt.month}`,
        'Caixa Base': basePt.cash,
        'Caixa Estressado': activePt.cash,
        'Liquidez Base': basePt.liquidityStDebt,
        'Liquidez Estressada': activePt.liquidityStDebt
      };
    });
  }, [baseScenario, activeScenario]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const hasAnyWaiver = Object.values(activeShields).some(Boolean);

  const loading = loadingHistory || runtimeLoading;

  return {
    state: {
      expandedSection,
      selectedScenarioIndex,
      showDeltaView,
      loading
    },
    computed: {
      recoveryMomentum,
      suggestedCreditRating,
      ccsScore,
      creditReadinessLevel,
      creditDecisionSimulation,
      institutionalCreditConfidence,
      refinancingRiskLevel,
      radarData,
      bankingReadinessScore,
      bankingReadinessLevel,
      stressScenarios,
      activeScenario,
      baseScenario,
      chartData,
      fundingGapTimeline,
      hasAnyWaiver,
      fractures,
      narrative,
      auditability,
      isEarlyStage
    },
    actions: {
      toggleSection,
      setSelectedScenarioIndex,
      setShowDeltaView
    }
  };
}
