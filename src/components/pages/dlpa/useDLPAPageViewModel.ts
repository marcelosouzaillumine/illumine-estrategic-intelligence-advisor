import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAnnualFinancialData, useAllFinancialData } from '../../../hooks/useFinancialData';
import { DLPAApplicationService } from './DLPAApplicationService';
import { DLPAExecutiveRenderingGuard, DLPALegacyLabelScanner, LifecycleRenderAudit } from '../../../services/FiduciaryRuntimeAdapter';


import type { DLPAViolation } from '../../../services/FiduciaryRuntimeAdapter';

export interface NormalizedDLPARow {
  id: string | number;
  description: string;
  value: number;
  isTotal: boolean;
  nature: 'positive' | 'negative' | 'neutral';
}

export function normalizeDLPARow(row: any, index: number): NormalizedDLPARow {
  const v = Number(row.val || row.valor || row.value || 0);
  const desc = String(row.conta || row.category || row.nome || '—');
  const lowerDesc = desc.toLowerCase();
  const isTotal = lowerDesc.includes('total') ||
    lowerDesc.includes('saldo') ||
    lowerDesc.includes('lucro liquido') ||
    lowerDesc.includes('resultado');
  
  return {
    id: row.id || index,
    description: desc,
    value: v,
    isTotal,
    nature: v < 0 ? 'negative' : v > 0 ? 'positive' : 'neutral'
  };
}

export function resolveDisplayLabel(semanticSource: string, resolvedValue: string | undefined, rawValue: string, fallback: string) {
  if (semanticSource === 'ELSA' && resolvedValue) return resolvedValue;
  return rawValue ?? fallback;
}

export function getRetentionLabel(status: string) {
  const map: Record<string, { label: string; tone: 'success' | 'warning' | 'critical' | 'info' | 'neutral' }> = {
    'ALTA_RETENÇÃO':              { label: 'Alta Retenção',             tone: 'success' },
    'RETENÇÃO_MODERADA':          { label: 'Retenção Moderada',         tone: 'info' },
    'DISTRIBUIÇÃO_EXCESSIVA':     { label: 'Distribuição Excessiva',    tone: 'warning' },
    'DESCAPITALIZAÇÃO_DELIBERADA':{ label: 'Descapitalização Deliberada', tone: 'critical' },
    'NÃO_APLICÁVEL_SEM_LUCRO':   { label: 'N/A — Sem Lucro',           tone: 'neutral' },
    'NÃO_APLICÁVEL':              { label: 'N/A',                       tone: 'neutral' },
    'AUSÊNCIA_DE_CAPACIDADE_DISTRIBUTIVA': { label: 'Sem Capacidade Distributiva', tone: 'neutral' },
    'RETENÇÃO_COMPULSÓRIA_POR_PREJUÍZO':   { label: 'Retenção por Prejuízo', tone: 'critical' },
    
    // New fiduciaries
    'STRATEGIC_RETENTION':        { label: 'Retenção Estratégica',      tone: 'success' },
    'FORCED_RETENTION':           { label: 'Retenção Compulsória',      tone: 'neutral' },
    'EMERGENCY_CAPITAL_PRESERVATION': { label: 'Preservação Emergencial', tone: 'warning' },
    'SURVIVAL_STAGE_CAPITAL_STRUCTURE': { label: 'Estrutura de Sobrevivência', tone: 'critical' },
    'UNSUSTAINABLE_PRESERVATION': { label: 'Preservação Insustentável', tone: 'warning' },
    'GOVERNANCE_RETENTION':       { label: 'Retenção de Governança',    tone: 'info' },
    'RETENTION_NOT_ELIGIBLE':     { label: 'Inelegível para Retenção',  tone: 'neutral' },
  };
  return map[status] || map['NÃO_APLICÁVEL'];
}

export function getDistributionLabel(pressure: string) {
  const map: Record<string, { label: string; tone: 'success' | 'warning' | 'critical' | 'info' | 'neutral' }> = {
    'BAIXA':                   { label: 'Conservadora',              tone: 'success' },
    'MODERADA':                { label: 'Equilibrada',               tone: 'info' },
    'ALTA':                    { label: 'Agressiva',                  tone: 'warning' },
    'CRÍTICA':                 { label: 'Predatória',                 tone: 'critical' },
    'NÃO_APLICÁVEL_SEM_LUCRO': { label: 'Sem distribuição no período', tone: 'neutral' },
    'NÃO_APLICÁVEL':           { label: 'N/A',                        tone: 'neutral' },
  };
  return map[pressure] || map['NÃO_APLICÁVEL'];
}

export function getPreservationLabel(status: string) {
  const map: Record<string, { label: string; tone: 'success' | 'warning' | 'critical' | 'info' | 'neutral' }> = {
    'PRESERVAÇÃO_SAUDÁVEL':   { label: 'Preservação Saudável',       tone: 'success' },
    'EROSÃO_MODERADA':        { label: 'Erosão Moderada',             tone: 'info' },
    'EROSÃO_RELEVANTE':       { label: 'Erosão Relevante',            tone: 'warning' },
    'FRAGILIDADE_PATRIMONIAL':{ label: 'Fragilidade Patrimonial',     tone: 'critical' },
    'NEUTRO':                 { label: 'Patrimônio Preservado',       tone: 'neutral' },
    'DEPENDÊNCIA_DE_CAPITALIZAÇÃO':{ label: 'Dependência de Capital', tone: 'critical' },
    'SUSTENTAÇÃO_PATRIMONIAL_EXTERNA':{ label: 'Sustentação Externa', tone: 'warning' },
    'EROSÃO_PATRIMONIAL_OPERACIONAL':{ label: 'Erosão Operacional', tone: 'critical' },
    // legado
    'PRESERVADO':             { label: 'Preservado',                  tone: 'success' },
    'DRENADO':                { label: 'Erosão Relevante',             tone: 'warning' },
    // fiduciários novos
    'PRESERVED':              { label: 'Preservado',                  tone: 'success' },
    'PRESSURED':              { label: 'Pressionado',                 tone: 'info' },
    'SEVERELY_ERODED':        { label: 'Erosão Severa',               tone: 'warning' },
    'CAPITAL_COLLAPSE_RISK':  { label: 'Risco de Colapso',            tone: 'critical' },
    // CPI classifications
    'CAPITAL_EXPANSION':      { label: 'Expansão de Capital',         tone: 'success' },
    'CAPITAL_PRESERVED':      { label: 'Capital Preservado',          tone: 'success' },
    'MODERATE_EROSION':       { label: 'Erosão Moderada',             tone: 'info' },
    'HIGH_EROSION':           { label: 'High Capital Erosion',        tone: 'warning' },
    'CRITICAL_EROSION':       { label: 'Erosão Crítica',              tone: 'critical' },
    'CAPITAL_COLLAPSE':       { label: 'Colapso de Capital',          tone: 'critical' },
    'Capitalização em Consolidação': { label: 'Capitalização em Consolidação', tone: 'info' },
    'Estrutura de Capital em Formação': { label: 'Estrutura de Capital em Formação', tone: 'neutral' },
    'Estrutura Patrimonial em Formação': { label: 'Estrutura Patrimonial em Formação', tone: 'neutral' }
  };
  return map[status] || map['NEUTRO'];
}

export function getMaturityLabel(maturity: string) {
  const map: Record<string, { label: string; color: string; bg: string; border: string; score: number }> = {
    'MATURA':           { label: 'Governança Matura',           color: 'text-emerald-700', bg: 'bg-success-soft', border: 'border-emerald-200', score: 90 },
    'EM_DESENVOLVIMENTO':{ label: 'Em Desenvolvimento',         color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    score: 65 },
    'FRAGILIZADA':      { label: 'Governança Fragilizada',      color: 'text-amber-700',   bg: 'bg-warning-soft',   border: 'border-amber-200',   score: 38 },
    'EM_ESTRUTURAÇÃO':  { label: 'Em Estruturação',             color: 'text-muted-foreground',   bg: 'bg-surface-container/30',   border: 'border-border',   score: 28 },
    'FRÁGIL':           { label: 'Governança Frágil',           color: 'text-amber-700',   bg: 'bg-warning-soft',   border: 'border-amber-200',   score: 40 },
    'DESTRUTIVA':       { label: 'Governança Destrutiva',       color: 'text-rose-700',    bg: 'bg-critical-soft',    border: 'border-rose-200',    score: 10 },
    
    // Modern CGE statuses mapping
    'Governança Estruturada': { label: 'Governança Estruturada', color: 'text-emerald-700', bg: 'bg-success-soft border-emerald-100', border: 'border-emerald-200', score: 90 },
    'Governança Estruturada com Risco de Capital': { label: 'Governança Estruturada com Risco de Capital', color: 'text-emerald-700', bg: 'bg-success-soft border-emerald-100', border: 'border-emerald-200', score: 85 },
    'Governança em Consolidação': { label: 'Governança em Consolidação', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', border: 'border-blue-200', score: 70 },
    'Governança Fragilizada': { label: 'Governança Fragilizada', color: 'text-amber-700', bg: 'bg-warning-soft border-amber-100', border: 'border-amber-200', score: 50 },
    'Governança Crítica': { label: 'Governança Crítica', color: 'text-rose-700', bg: 'bg-critical-soft border-rose-100', border: 'border-rose-200', score: 30 },
    'Governança em Estruturação': { label: 'Governança em Estruturação', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', border: 'border-blue-200', score: 50 }
  };
  return map[maturity] || { label: maturity, color: 'text-muted-foreground', bg: 'bg-surface-container/30 border-border', border: 'border-border', score: 50 };
}

type ToastType = { type: 'success' | 'error'; message: string } | null;

export function useDLPAPageViewModel(clients: any[], selectedClient: string, selectedYear: number) {
  const [filterYear, setFilterYear] = useState<number>(Number(selectedYear) || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showElsaPanel, setShowElsaPanel] = useState(false);
  const [renderingViolations, setRenderingViolations] = useState<DLPAViolation[]>([]);

  useEffect(() => {
    if (selectedYear) setFilterYear(Number(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        setShowElsaPanel(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { dbData: dbDataDLPA, docIds: docIdsDLPA, loading: loadingDLPA, refetch: refetchDLPA } =
    useAnnualFinancialData(selectedClient, filterYear, 'DLPA');

  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  const dlpaMetrics = useMemo(() => {
    if (dbDataDLPA.length === 0) return null;

    const normalize = (s: string) =>
      (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const bpEntries = allHistoryData.filter((d: any) =>
      Number(d.year) === filterYear &&
      ['bp', 'balanço patrimonial', 'balanco patrimonial', 'balanco'].includes(normalize(d.docType || d.type || ''))
    );

    let bpPlFim = 0;
    if (bpEntries.length > 0) {
      const plEntry = bpEntries.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return (n === 'patrimonio liquido' || n === 'pl' || n === 'total do patrimonio liquido') && e.type === 'pl';
      });
      if (plEntry) {
        bpPlFim = Number(plEntry.val || plEntry.valor || plEntry.value || 0);
      }
    }

    const bpEntriesPrev = allHistoryData.filter((d: any) =>
      Number(d.year) === (filterYear - 1) &&
      ['bp', 'balanço patrimonial', 'balanco patrimonial', 'balanco'].includes(normalize(d.docType || d.type || ''))
    );

    let bpPlInicio = 0;
    if (bpEntriesPrev.length > 0) {
      const plEntry = bpEntriesPrev.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return (n === 'patrimonio liquido' || n === 'pl' || n === 'total do patrimonio liquido') && e.type === 'pl';
      });
      if (plEntry) {
        bpPlInicio = Number(plEntry.val || plEntry.valor || plEntry.value || 0);
      }
    }

    const findVal = (...terms: string[]) => {
      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return terms.some(t => n.includes(normalize(t)));
      });
      return Number(entry?.val || entry?.valor || entry?.value || 0);
    };

    const getNetIncomeValue = () => {
      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        if (n.includes('acumulado') || n.includes('saldo inicial') || n.includes('saldo final') || n.includes('saldo anterior') || n.includes('periodo anterior') || n.includes('inicio') || n.includes('fim')) {
          return false;
        }
        return [
          'lucro liquido', 'lucro do exercicio', 'resultado liquido',
          'prejuizo liquido', 'prejuizo do exercicio', 'prejuizo liquido do exercicio',
          'resultado do exercicio', 'resultado liquido do exercicio', 'prejuizo do periodo', 'lucro do periodo',
          'lucro/prejuizo do exercicio', 'lucro ou prejuizo do exercicio'
        ].some(term => n.includes(normalize(term))) || (n.includes('lucro') || n.includes('prejuizo') || n.includes('resultado do exercicio'));
      });
      if (!entry) return 0;
      let val = Number(entry.val ?? entry.valor ?? entry.value ?? 0);
      const n = normalize(entry.conta || entry.category || '');
      if ((n.includes('prejuizo') || n.includes('(-)')) && val > 0) {
        val = -val;
      }
      return val;
    };

    const getPlInicioValue = () => {
      if (bpPlInicio > 0) return bpPlInicio;
      
      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        const isSubAccount = n.includes('lucro') || n.includes('prejuizo') || n.includes('reserva');
        if (isSubAccount) return false;
        
        return [
          'pl inicio', 'saldo inicial', 'patrimonio inicio',
          'saldo no inicio', 'saldo anterior', 'saldo no inicio do periodo',
          'saldo de abertura'
        ].some(term => n.includes(normalize(term))) || (n.includes('saldo') && n.includes('inicio'));
      });
      return Number(entry?.val || entry?.valor || entry?.value || 0);
    };

    const getPlFimValue = () => {
      if (bpPlFim > 0) return bpPlFim;

      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        const isSubAccount = n.includes('lucro') || n.includes('prejuizo') || n.includes('reserva');
        if (isSubAccount) return false;

        return [
          'pl fim', 'saldo final', 'patrimonio fim', 'patrimonio liquido',
          'saldo no fim', 'saldo atual', 'saldo no fim do periodo',
          'saldo de encerramento'
        ].some(term => n.includes(normalize(term))) || (n.includes('saldo') && n.includes('fim'));
      });

      return Number(entry?.val || entry?.valor || entry?.value || 0);
    };

    const getCapitalSocial = () => {
      const bpCapitalSocialEntry = bpEntries.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return n === 'capital social' || n === 'capital social integralizado' || n === 'capital integralizado' || n === 'capital subscrito';
      });
      if (bpCapitalSocialEntry) {
        return Math.abs(Number(bpCapitalSocialEntry.val || bpCapitalSocialEntry.valor || bpCapitalSocialEntry.value || 0));
      }

      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return n.includes('capital social') || n.includes('capital integralizado');
      });
      return Number(entry?.val || entry?.valor || entry?.value || bpPlFim || 0);
    };

    const getStartingLucrosPrejuizos = () => {
      const entry = dbDataDLPA.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return (n.includes('saldo anterior') || n.includes('saldo inicial') || n.includes('inicio') || n.includes('abertura') || n.includes('anterior')) && 
               (n.includes('lucros') || n.includes('prejuizos') || n.includes('acumulados') || n.includes('lucros/prejuizos') || n.includes('lucros ou prejuizos'));
      });
      let val = Number(entry?.val ?? entry?.valor ?? entry?.value ?? 0);
      if (entry) {
        const nameNorm = normalize(entry.conta || entry.category || '');
        if ((nameNorm.includes('prejuizo') || nameNorm.includes('(-)')) && val > 0) {
          val = -val;
        }
      }
      return val;
    };

    return {
      lucroLiquido: getNetIncomeValue(),
      dividendos: Math.abs(findVal('dividendo', 'distribuicao', 'jcp', 'juros sobre capital')),
      reservaLegal: findVal('reserva legal'),
      reservaEstatutaria: findVal('reserva estatutaria', 'outras reservas'),
      plInicio: getPlInicioValue() || getPlFimValue(),
      plFim: getPlFimValue() || getPlInicioValue(),
      aumentoCapital: findVal('aumento de capital', 'integralizacao'),
      lucrosPrejuizosInicio: getStartingLucrosPrejuizos(),
      capitalSocial: getCapitalSocial()
    };
  }, [dbDataDLPA, allHistoryData, filterYear]);

  const capitalGov = useMemo(() => {
    return DLPAApplicationService.processGovernance(
      dbDataDLPA,
      dlpaMetrics,
      allHistoryData,
      clients,
      selectedClient,
      filterYear
    );
  }, [dbDataDLPA, dlpaMetrics, allHistoryData, clients, selectedClient, filterYear]);

  const chartData = useMemo(() => {
    return [4, 3, 2, 1, 0].map(offset => {
      const y = filterYear - offset;
      const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y);

      const normalize = (s: string) =>
        (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const findYearVal = (docTypes: string[], terms: string[]) => {
        const match = yearEntries
          .filter((d: any) => docTypes.some(dt => normalize(d.docType || d.type || '') === normalize(dt)))
          .find((d: any) => terms.some(t => normalize(d.conta || d.category || '').includes(normalize(t))));
        return Number(match?.val || match?.valor || match?.value || 0);
      };

      const ll    = findYearVal(['dre', 'dre gerencial'], ['lucro liquido', 'lucro do exercicio']);
      const divid = Math.abs(findYearVal(['dlpa'], ['dividendo', 'distribuicao', 'jcp']));
      const rl    = findYearVal(['dlpa'], ['reserva legal']);

      return { year: y.toString(), LucroLíquido: ll, Dividendos: divid, ReservaLegal: rl };
    });
  }, [allHistoryData, filterYear]);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleDeleteAll = useCallback(async () => {
    if (!selectedClient || docIdsDLPA.length === 0) return;
    setDeleting(true);
    try {
      await DLPAApplicationService.deleteDLPAData(selectedClient, filterYear);
      showToast('success', 'Dados DLPA excluídos com sucesso.');
      refetchDLPA();
    } catch {
      showToast('error', 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [selectedClient, docIdsDLPA, filterYear, refetchDLPA, showToast]);

  const executiveLayer = (capitalGov as any)?.executiveLayer;

  const dlpaPayload = useMemo(() => {
    return DLPAApplicationService.generateStrategicDiagnosisPayload(executiveLayer, dlpaMetrics, filterYear);
  }, [executiveLayer, dlpaMetrics, filterYear]);

  const loading = loadingDLPA || loadingHistory;
  const hasData = dbDataDLPA.length > 0 && !!dlpaMetrics && (dlpaMetrics.lucroLiquido !== 0 || dlpaMetrics.dividendos !== 0 || dlpaMetrics.plFim !== 0);

  const retention    = (capitalGov as any)?.diagnostics?.retention;
  const distribution = (capitalGov as any)?.diagnostics?.distribution;
  const preservation = (capitalGov as any)?.diagnostics?.preservation;
  const behavior     = (capitalGov as any)?.diagnostics?.behavior;
  const fiduciaryOutput = (capitalGov as any)?.diagnostics?.fiduciaryOutput;
  const narrative    = (capitalGov as any)?.narrative || '';
  const lifecycleContext = (capitalGov as any)?.semantic?.semanticContext || {};
  const isValidLifecycleContext = lifecycleContext?.semanticSource && lifecycleContext?.lifecycleStage;

  const semanticSource = isValidLifecycleContext ? lifecycleContext.semanticSource : ((capitalGov as any)?.semanticSource || 'LEGACY');
  const lifecycleStage = isValidLifecycleContext ? lifecycleContext.lifecycleStage : ((capitalGov as any)?.diagnostics?.fiduciaryOutput?.lifecycleStage || (capitalGov as any)?.lifecycleStage || 'ESTABLISHED_ANALYSIS');

  const capitalSocialValue = dlpaMetrics?.capitalSocial ?? 0;
  const cpi = capitalSocialValue === 0 ? 1 : ((dlpaMetrics?.plFim ?? 0) / capitalSocialValue);

  const cpiStatus = useMemo(() => {
    const raw = preservation?.preservationStatus || 'NEUTRO';
    const resolved = (capitalGov as any)?.semantic?.resolvedCapitalStatus || (capitalGov as any)?.resolvedCapitalStatus;
    return resolveDisplayLabel(semanticSource, resolved, raw, 'NEUTRO');
  }, [capitalGov, preservation, semanticSource]);

  const retentionStyle    = getRetentionLabel(retention?.retentionStatus || 'NÃO_APLICÁVEL');
  const distributionStyle = getDistributionLabel(distribution?.distributionPressure || 'NÃO_APLICÁVEL');
  const preservationStyle = getPreservationLabel(cpiStatus || 'NEUTRO');

  const alignedMaturity = useMemo(() => {
    const raw = behavior?.governanceMaturity || 'Governança Crítica';
    const resolved = (capitalGov as any)?.semantic?.resolvedGovernanceStatus || (capitalGov as any)?.resolvedGovernanceStatus;
    return resolveDisplayLabel(semanticSource, resolved, raw, 'Governança Crítica');
  }, [capitalGov, behavior, semanticSource]);

  const featureFlags = useMemo(() => ({ showSemanticAudit: true }), []);

  useEffect(() => {
    if (capitalGov && process.env.NODE_ENV !== 'production') {
      LifecycleRenderAudit.validate({
        governanceStatus: behavior?.governanceMaturity,
        resolvedGovernanceStatus: (capitalGov as any)?.resolvedGovernanceStatus,
        capitalStatus: preservation?.preservationStatus,
        resolvedCapitalStatus: (capitalGov as any)?.resolvedCapitalStatus,
        semanticSource: (capitalGov as any)?.semanticSource,
        resolvedSemanticSource: (capitalGov as any)?.semanticSource
      });
    }
  }, [capitalGov, behavior, preservation]);

  const maturityStyle = getMaturityLabel(alignedMaturity);

  useEffect(() => {
    if (capitalGov) {
      const renderedTerms = [
        maturityStyle.label,
        preservationStyle.label,
        narrative,
        cpiStatus
      ];
      
      if (semanticSource === 'ELSA') {
        try {
          DLPALegacyLabelScanner.scanRenderedLabels(semanticSource, renderedTerms);
        } catch (e) {
          console.error(e);
        }
      }

      const viols = DLPAExecutiveRenderingGuard.validateExecutiveDisplay(semanticSource, lifecycleStage, renderedTerms);
      setRenderingViolations(viols);
    }
  }, [semanticSource, lifecycleStage, maturityStyle.label, preservationStyle.label, narrative, capitalGov, cpiStatus]);

  const lucrosPrejuizosFinal = useMemo(() => {
    if (!dlpaMetrics) return 0;
    if (retention?.lucrosPrejuizos != null && retention.lucrosPrejuizos !== 0) {
      return retention.lucrosPrejuizos;
    }
    return (dlpaMetrics.lucrosPrejuizosInicio || 0) + (dlpaMetrics.lucroLiquido || 0);
  }, [dlpaMetrics, retention]);

  const parsedTaxaRetencao = retention ? retention.retentionRatio * 100 : 0;
  const parsedTaxaDistribuicao = distribution ? distribution.distributionRatio * 100 : 0;
  const retentionValue = retention ? retention.retainedEarnings : 0;

  const executiveNarrativeInsight = useMemo(() => {
    return DLPAApplicationService.generateExecutiveNarrative(chartData);
  }, [chartData]);

  return {
    state: {
      filterYear,
      toast,
      deleting,
      showDeleteConfirm,
      showImportModal,
      showManualModal,
      showElsaPanel,
      renderingViolations,
      featureFlags,
      loading,
      hasData,
      capitalGov,
      executiveLayer,
      dlpaPayload,
      dbDataDLPA,
      chartData,
      dlpaMetrics,
      cpiStatus,
      retentionStyle,
      distributionStyle,
      preservationStyle,
      alignedMaturity,
      maturityStyle,
      lucrosPrejuizosFinal,
      semanticSource,
      lifecycleStage,
      fiduciaryOutput,
      distribution,
      preservation,
      narrative,
      executiveNarrativeInsight,
    },
    computed: {
    },
    actions: {
      setFilterYear,
      setShowDeleteConfirm,
      setShowImportModal,
      setShowManualModal,
      setShowElsaPanel,
      handleDeleteAll,
      refetchDLPA,
      showToast
    }
  };
}
