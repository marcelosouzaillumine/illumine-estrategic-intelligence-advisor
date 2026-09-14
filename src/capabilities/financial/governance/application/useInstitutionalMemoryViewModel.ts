import { useState, useMemo } from 'react';
import { useAllFinancialData } from '../../../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../../../hooks/useInstitutionalRuntime';

export interface InstitutionalMemoryViewModelProps {
  selectedClient?: string;
  selectedYear?: number;
}

export function useInstitutionalMemoryViewModel({ selectedClient, selectedYear }: InstitutionalMemoryViewModelProps) {
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

  const memoryInference = useMemo(() => {
    return runtimeOutput?.inferences?.['InstitutionalMemoryEngine'];
  }, [runtimeOutput]);

  const metrics = memoryInference?.metrics || {};

  const {
    imsScore = 70,
    imsLevel = 'Transitional Institutional Consistency',
    trajectoryClassification = 'VOLATILE',
    isEarlyStage = false,
    domains = {
      treasury: { score: 70 },
      earnings: { score: 70 },
      governance: { score: 70 },
      advisory: { score: 70 },
      drift: { score: 70 },
      strategic: { score: 70 }
    },
    alerts = [],
    timeline = [],
    heatmaps = {
      treasury: [],
      governance: [],
      advisory: [],
      drift: [],
      strategic: [],
      recoveryMomentum: []
    },
    auditability = {}
  } = metrics;

  const radarData = useMemo(() => {
    return [
      { subject: 'Treasury Persistence', value: domains.treasury?.score ?? 70 },
      { subject: 'Earnings Recurrence', value: domains.earnings?.score ?? 70 },
      { subject: 'Governance Memory', value: domains.governance?.score ?? 70 },
      { subject: 'Advisory Compliance', value: domains.advisory?.score ?? 70 },
      { subject: 'Institutional Drift', value: domains.drift?.score ?? 70 },
      { subject: 'Strategic Consistency', value: domains.strategic?.score ?? 70 }
    ];
  }, [domains]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getLabelKey = (val: number): string => {
    return val >= 85 ? 'ESTAVEL' : val >= 70 ? 'MODERADO' : val >= 50 ? 'ALTO' : 'CRITICO';
  };

  const currentLabelKey = getLabelKey(imsScore);

  const scoreColorsMap: Record<string, string> = {
    ESTAVEL: 'text-emerald-400',
    MODERADO: 'text-yellow-400',
    ALTO: 'text-amber-500',
    CRITICO: 'text-rose-500'
  };

  const scoreBgMap: Record<string, string> = {
    ESTAVEL: 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400',
    MODERADO: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    ALTO: 'bg-warning-soft0/10 border-amber-500/20 text-amber-500',
    CRITICO: 'bg-critical-soft0/10 border-rose-500/20 text-rose-500'
  };

  const getStatusText = (val: number): string => {
    return val >= 85 ? 'ORGANIZAÇÃO APRENDENTE' : val >= 70 ? 'ESTÁVEL' : val >= 50 ? 'TRANSIÇÃO' : 'CRÍTICO';
  };

  const getHeatmapBg = (val: number): string => {
    return val >= 85 ? 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400' :
           val >= 70 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
           val >= 50 ? 'bg-warning-soft0/10 border-amber-500/20 text-amber-500' :
           'bg-critical-soft0/10 border-rose-500/20 text-rose-500';
  };

  const getMomentumBg = (momentum: string): string => {
    return momentum === 'ACCELERATING' ? 'bg-success-soft0/15 border-emerald-500/30 text-emerald-400' :
           momentum === 'STABILIZING' ? 'bg-teal-500/15 border-teal-500/30 text-teal-400' :
           'bg-critical-soft0/15 border-rose-500/30 text-rose-500';
  };

  const getStatusBadge = (status: string) => {
    const maps: Record<string, string> = {
      ACTIVE: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      RESOLVED: 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400',
      MITIGATED: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
      RECURRING: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      ESCALATED: 'bg-critical-soft0/10 border-rose-500/20 text-rose-500'
    };
    return maps[status] || 'bg-slate-800 border-border text-muted-foreground';
  };

  const loading = loadingHistory || runtimeLoading;

  return {
    state: {
      expandedSection,
      loading
    },
    computed: {
      imsScore,
      imsLevel,
      trajectoryClassification,
      isEarlyStage,
      alerts,
      timeline,
      heatmaps,
      auditability,
      radarData,
      currentLabelKey,
      scoreColorsMap,
      scoreBgMap,
      getStatusText,
      getHeatmapBg,
      getMomentumBg,
      getStatusBadge
    },
    actions: {
      toggleSection
    }
  };
}
