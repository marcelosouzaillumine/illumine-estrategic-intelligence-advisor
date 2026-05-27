import { getSectorProfile } from '../intelligence/sector-behavior-profiles';
import { translateCapitalStructure } from './adapters/capital-structure-adapter';
import { translateCausalityInterpretation } from './adapters/causality-interpretation-adapter';
import { translateSeverityModulation } from './adapters/severity-modulator-adapter';
import { buildBPHierarchy } from '../../lib/bpEngine';
import { calculateDreCascade } from '../../lib/dreCascade';
import { generateDreInsights, DreMetrics } from '../../lib/dreInsights';
import { DRE_OFFICIAL_STRUCTURE } from '../../constants/dreStructure';
import { calculateFinancialMetrics } from '../../lib/financial-engine';
import { inferBusinessIdentity } from '../../lib/business-identity-engine';
import { evaluateMasterCausality } from '../../lib/master-causal-engine';
import { ConsolidatedRuntimeOutputExt } from './consolidated/consolidated-types';
import { TemporalCausalityOutput } from '../intelligence/temporal-causality-engine';
import { ScenarioOutput } from './scenario-intelligence/scenario-types';
import { RuntimeExecutionTrace } from './observability/observability-types';
import { RuntimeTraceEngine } from './observability/RuntimeTraceEngine';
import { InstitutionalContextEngine } from './institutional-context/InstitutionalContextEngine';
import { InstitutionalContextProfile } from './institutional-context/types';
import { CalibrationEngine } from './calibration/CalibrationEngine';
import { InstitutionalMemoryEngine } from './institutional-memory/InstitutionalMemoryEngine';
import { InstitutionalMemoryProfile } from './institutional-memory/types';
import { StructuralCapitalOrchestrator } from './structural-capital/StructuralCapitalOrchestrator';
import { StructuralCapitalProfile } from './structural-capital/types';
import { InstitutionalCausalityOrchestrator } from './institutional-causality/InstitutionalCausalityOrchestrator';
import { InstitutionalCausalityProfile } from './institutional-causality/types';
import { ExecutivePriorityCascadeResolver } from './institutional-causality/ExecutivePriorityCascadeResolver';
import { ExecutiveNarrativeSanitizer } from './institutional-causality/ExecutiveNarrativeSanitizer';
import { getIndustryOkrs } from '../../lib/industry-engine';

// Integrity Engines (RC-1.3A)
import { EmptyCycleIntegrityEngine } from './integrity/EmptyCycleIntegrityEngine';
import { BenchmarkGovernanceRegistry } from './integrity/BenchmarkGovernanceRegistry';
import { BenchmarkReferenceEngine } from './integrity/BenchmarkReferenceEngine';
import { ScaleEfficiencyIntegrityEngine } from './integrity/ScaleEfficiencyIntegrityEngine';
import { InvalidMetricGuard } from './integrity/InvalidMetricGuard';
import { ExecutiveActionMatrixEngine, ExecutiveActionItem } from './integrity/ExecutiveActionMatrixEngine';
import { HistoricalSeriesIntegrityEngine } from './integrity/HistoricalSeriesIntegrityEngine';
import { ExecutiveEmptyStateResolver } from './integrity/ExecutiveEmptyStateResolver';
import { ExecutiveDiagnosisComposer } from '../executive-experience/ExecutiveDiagnosisComposer';

/**
 * INSTITUTIONAL RUNTIME ENFORCER
 * 
 * ============================================================================
 * PRINCÍPIO CENTRAL: Nenhuma inteligência pode nascer fora do Core Institucional.
 * ============================================================================
 * 
 * Este contrato (ExecutiveIntelligenceReport) é a SINGLE SOURCE OF TRUTH da plataforma.
 * Toda página React, Hook ou Modal operará exclusivamente como DUMMY RENDERER.
 * 
 * É PROIBIDO em camadas de UI:
 * - Fazer if/else para calcular severidade (ex: if liquidez < 1).
 * - Gerar narrativas ou diagnósticos parciais.
 * - Alterar pesos matemáticos ou classificações financeiras.
 */
export interface ExecutiveIntelligenceReport extends ConsolidatedRuntimeOutputExt {
  context: {
    segment: string;
    businessModel: string;
    capitalIntensity: string;
    stage: string;
    operationalProfile: string;
  };
  institutionalContext: InstitutionalContextProfile;
  scores: {
    financial: number;
    operational: number;
    governance: number;
    structural: number;
    composite: number;
    financialStress?: {
      isStressed: boolean;
      stressFactors: string[];
      runwayImpact: number;
      recommendedActions: string[];
    };
  };
  capitalStructure: {
    qualityRating: string;
    elasticity: string;
    rolloverRisk: string;
    operationalDependency: string;
  };
  causality: {
    event: string;
    rootCause: string;
    financialPropagation: string;
    absorptionCapacity: string;
    strategicImpact: string;
    insights: {
      category: string;
      text: string;
      colorClass: string;
      bgClass: string;
      dotClass: string;
    }[];
  };
  severity: {
    // Escala oficial da Severity Modulator Engine
    level: 'SAUDÁVEL' | 'SENSÍVEL' | 'PRESSIONADO' | 'RESTRITIVO' | 'ESTRESSADO' | 'CRÍTICO' | 'COLAPSO';
    justification: string;
  };
  advisory: {
    executiveSummary: string;
    actionMatrix: any[];
    priorityFocus: string;
  };
  decomposition: {
    label: string;
    value: number;
    severityColor: string; // The UI will just use this class blindly
    explanation: string;
  }[];
  metrics: {
    hasData: boolean;
    financialMetrics: Record<string, any>;
    kpis: {
      name: string;
      val: number | string;
      unit: string;
      status: 'Verde' | 'Amarelo' | 'Vermelho' | 'Neutro';
      trend: string;
      tooltip?: string;
    }[];
    efficiencies: {
      name: string;
      value: number;
      score?: number;
      unit?: string;
      desc: string;
      color: string;
    }[];
    scaleEfficiency: {
      category: string;
      colorClass: string;
      recGrowth: number | null;
      ebitdaGrowth: number | null;
      description: string;
    };
    alerts: {
      type: 'danger' | 'warning';
      msg: string;
    }[];
    chartData: any[];
  };
  compliance: {
    runtimeMode: 'BALANCE_SHEET_ONLY' | 'DRE_ONLY' | 'CASHFLOW_ONLY' | 'PARTIAL_FINANCIAL_VIEW' | 'FULL_FINANCIAL_VIEW';
    confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';
    dataCompleteness: number; // percentage or fraction
    causalDepth: 'SHALLOW' | 'MODERATE' | 'DEEP';
    narrativeRestrictions: string[];
    auditFlags: string[];
  };
  temporalCausality?: TemporalCausalityOutput;
  // Scenario Simulation
  scenarioProjections?: ScenarioOutput[];
  
  // Observability (Phase 4)
  runtimeMetadata?: RuntimeExecutionTrace;
  institutionalMemory?: InstitutionalMemoryProfile;
  institutionalCausality?: InstitutionalCausalityProfile;
  structuralCapital?: StructuralCapitalProfile;
}

export class ExecutiveIntelligenceRuntime {
  /**
   * Fluxo Oficial Obrigatório:
   * Importação -> Governança -> Contextualização -> Causalidade -> Modulação -> Advisory -> Executive Report -> UI
   */
  public generateExecutiveReport(rawData: any): ExecutiveIntelligenceReport {
    // Validação de "Não-Bypass": Sem dados brutos válidos, aborta a execução
    if (!rawData || typeof rawData !== 'object' || (!rawData.bpData && !rawData.rawFinancialData)) {
      throw new Error('VIOLAÇÃO DE GOVERNAÇA NÚCLEO: Impossível gerar relatório de inteligência executiva sem dados de entrada válidos.');
    }

    const traceEngine = new RuntimeTraceEngine('SINGLE_ENTITY');
    traceEngine.Profiler.startEngine('ExecutiveIntelligenceRuntime');
    traceEngine.Lineage.startNode('ExecutiveIntelligenceRuntime', ['rawData']);

    // ── Dicionário de tradução de enums para português fluido ──────────────────────────
    const enumLabels: Record<string, string> = {
      // BusinessStage
      FIRST_OPERATIONAL_YEAR:          'Primeiro Ano Operacional',
      EARLY_STAGE_CONSOLIDATION:       'Consolidação Inicial',
      GROWTH_STAGE:                    'Estágio de Crescimento',
      SCALE_STAGE:                     'Estágio de Escala',
      MATURE_OPERATION:                'Operação Madura',
      TURNAROUND_DISTRESS:             'Turnaround / Recuperação',
      DECLINE_STAGE:                   'Estágio de Declinio',
      TRANSITION_STAGE:                'Estágio de Transição',
      // EconomicModel
      ASSET_HEAVY:                     'Intensivo em Ativos',
      ASSET_LIGHT:                     'Leve em Ativos',
      CAPITAL_INTENSIVE:               'Intensivo em Capital',
      INVENTORY_DEPENDENT:             'Dependente de Estoques',
      LABOR_INTENSIVE:                 'Intensivo em Mão de Obra',
      RECURRING_REVENUE:               'Receita Recorrente',
      SEASONAL_REVENUE:                'Receita Sazonal',
      SERVICE_BASED:                   'Baseado em Serviços',
      INDUSTRIAL:                      'Industrial',
      DISTRIBUTION:                    'Distribuição',
      SAAS:                            'SaaS',
      HEALTHCARE:                      'Saúde',
      HOLDING_STRUCTURE:               'Holding',
      FINANCIAL_OPERATION:             'Operação Financeira',
      // HistoricalDensity
      SINGLE_YEAR_ONLY:                'Apenas um Exercício Disponível',
      LOW_HISTORICAL_DENSITY:          'Histórico Inicial (< 2 anos)',
      MODERATE_HISTORY:                'Histórico Moderado (2–3 anos)',
      STRONG_HISTORICAL_BASE:          'Base Histórica Sólida (4+ anos)',
      // StrategicConfidence
      HIGH:                            'Alta',
      MODERATE:                        'Moderada',
      LOW:                             'Baixa',
      LIMITED_CONTEXT:                 'Contexto Limitado',
      UNVERIFIABLE:                    'Insuficiência de Dados',
      // GrowthPattern
      HEALTHY_GROWTH:                  'Crescimento Saudável',
      ARTIFICIAL_GROWTH:               'Crescimento Artificial',
      CASHLESS_GROWTH:                 'Crescimento sem Geração de Caixa',
      DEBT_FINANCED_GROWTH:            'Crescimento Financiado por Dívida',
      SHAREHOLDER_FINANCED_GROWTH:     'Crescimento Financiado por Sócios',
      SUSTAINABLE_OPERATIONAL_EXPANSION: 'Expansão Operacional Sustentável',
      PREMATURE_EXPANSION:             'Expansão Prematura',
      STAGNATION:                      'Estagnação',
      CONTRACTION:                     'Contração',
      // runtimeMode
      FULL_FINANCIAL_VIEW:             'Visão Financeira Completa',
      PARTIAL_FINANCIAL_VIEW:          'Visão Financeira Parcial',
      BALANCE_SHEET_ONLY:              'Apenas Balanço Patrimonial',
      DRE_ONLY:                        'Apenas DRE',
      CASHFLOW_ONLY:                   'Apenas Fluxo de Caixa',
      // confidenceLevel
      HIGH_CONFIDENCE:                 'Alta Confiabilidade',
      MEDIUM_CONFIDENCE:               'Confiabilidade Moderada',
      LOW_CONFIDENCE:                  'Confiabilidade Reduzida',
    };
    const pt = (key: string): string => enumLabels[key] || key.replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase());


    // Initialize Institutional Memory
    const memoryProfile = InstitutionalMemoryEngine.buildMemory(rawData.runtimeHistory || []);

    // Initialize Institutional Causality
    const causalityProfile = InstitutionalCausalityOrchestrator.evaluate(rawData.runtimeHistory || []);

    // 0. Runtime Context Awareness
    const hasDRE = !!rawData.dreData && Array.isArray(rawData.dreData) && rawData.dreData.length > 0;
    // Accept either raw bpData array OR pre-computed bpSummary from the page
    const hasBP = (!!rawData.bpData && Array.isArray(rawData.bpData) && rawData.bpData.length > 0)
               || (!!rawData.rawFinancialData?.bpSummary && Object.keys(rawData.rawFinancialData.bpSummary).length > 0);
    const hasCashFlow = !!rawData.cashFlowData && Array.isArray(rawData.cashFlowData) && rawData.cashFlowData.length > 0;

    let runtimeMode: 'BALANCE_SHEET_ONLY' | 'DRE_ONLY' | 'CASHFLOW_ONLY' | 'PARTIAL_FINANCIAL_VIEW' | 'FULL_FINANCIAL_VIEW' = 'PARTIAL_FINANCIAL_VIEW';

    if (hasBP && hasDRE && hasCashFlow) {
      runtimeMode = 'FULL_FINANCIAL_VIEW';
    } else if (hasBP && hasDRE) {
      runtimeMode = 'PARTIAL_FINANCIAL_VIEW';
    } else if (hasBP && !hasDRE && !hasCashFlow) {
      runtimeMode = 'BALANCE_SHEET_ONLY';
    } else if (!hasBP && hasDRE && !hasCashFlow) {
      runtimeMode = 'DRE_ONLY';
    } else if (!hasBP && !hasDRE && hasCashFlow) {
      runtimeMode = 'CASHFLOW_ONLY';
    } else {
      runtimeMode = 'PARTIAL_FINANCIAL_VIEW';
    }

    // Confidence Integrity Layer
    let confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' = 'HIGH_CONFIDENCE';
    let causalDepth: 'SHALLOW' | 'MODERATE' | 'DEEP' = 'DEEP';
    let dataCompleteness = 1.0;

    if (memoryProfile.recurrenceConfidence === 'LOW' && memoryProfile.historicalDensityRequirement === 'SUFFICIENT') {
      confidenceLevel = 'LOW_CONFIDENCE';
    }

    if (runtimeMode === 'FULL_FINANCIAL_VIEW') {
       confidenceLevel = 'HIGH_CONFIDENCE';
       causalDepth = 'DEEP';
       dataCompleteness = 1.0;
    } else if (runtimeMode === 'PARTIAL_FINANCIAL_VIEW') {
       confidenceLevel = 'MEDIUM_CONFIDENCE';
       causalDepth = 'MODERATE';
       dataCompleteness = 0.66;
    } else if (runtimeMode === 'BALANCE_SHEET_ONLY') {
       // BP alone is sufficient to display the score — treat as medium confidence
       confidenceLevel = 'MEDIUM_CONFIDENCE';
       causalDepth = 'MODERATE';
       dataCompleteness = 0.5;
    } else {
       confidenceLevel = 'LOW_CONFIDENCE';
       causalDepth = 'SHALLOW';
       dataCompleteness = 0.33;
    }

    // Narrative Governance
    const narrativeRestrictions: string[] = [];
    if (runtimeMode !== 'FULL_FINANCIAL_VIEW') {
       narrativeRestrictions.push(
         'NÃO inferir turnaround estrutural.',
         'NÃO inferir colapso irreversível.',
         'NÃO inferir deterioração longitudinal conclusiva.',
         'Utilizar linguagem de evidências limitadas ("sinais", "indícios", "visão parcial").'
       );
    }

    // 1. Camada Base Institucional de Inteligência Contextual
    const institutionalContext = InstitutionalContextEngine.resolve(rawData);

    if (!institutionalContext || !institutionalContext.businessStage || !institutionalContext.economicModel || !institutionalContext.historicalDensity) {
      throw new Error('VIOLAÇÃO DE GOVERNAÇA NÚCLEO: Impossível gerar relatório de inteligência executiva sem um InstitutionalContextProfile válido.');
    }

    // Contextualização (Segment Intelligence Matrix integrada ao Perfil Institucional)
    const segment = rawData.rawFinancialData?.segmentoEmpresa || 'Default';
    const sectorProfile = getSectorProfile(segment);

    const context = {
      segment: sectorProfile.name, 
      businessModel: pt(institutionalContext.economicModel),
      capitalIntensity: institutionalContext.economicModel === 'ASSET_HEAVY' ? 'Intensivo em Ativos' : 'Leve em Ativos',
      stage: pt(institutionalContext.businessStage),
      operationalProfile: institutionalContext.operationalProfile.financialCycle
    };

    // 2. Data Initialization for Core Engines
    let bpSummary: any = undefined;
    if (rawData.bpData && Array.isArray(rawData.bpData) && rawData.bpData.length > 0) {
      // Raw entries array: build hierarchy first
      const hierarchy = buildBPHierarchy(rawData.bpData);
      bpSummary = hierarchy.summary;
    } else if (rawData.rawFinancialData?.bpSummary && Object.keys(rawData.rawFinancialData.bpSummary).length > 0) {
      // Pre-computed summary passed directly from the page (BalanceSheetPage)
      bpSummary = rawData.rawFinancialData.bpSummary;
    }

    // Attempt to extract Ebitda and Lucro Liquido if DRE exists
    const dreEbitda = hasDRE
      ? (rawData.dreData.find((r: any) => r.category === 'EBITDA')?.value || 0)
      : (rawData.rawFinancialData?.ebitda || 0);
    const dreLucro = hasDRE
      ? (rawData.dreData.find((r: any) => r.category === 'LUCRO LÍQUIDO DO EXERCÍCIO')?.value || 0)
      : (rawData.rawFinancialData?.lucroLiquido || 0);

    const metrics = calculateFinancialMetrics(bpSummary as any, dreEbitda, dreLucro, segment);
    const anosHistorico = rawData.historicalCyclesCount || 0;
    const identity = inferBusinessIdentity(segment, anosHistorico, bpSummary as any, undefined, undefined);
    const masterCausality = hasBP ? evaluateMasterCausality(bpSummary as any, metrics, identity) : undefined;
    const temporalCausality = masterCausality?.temporalIntelligence;

    // ── Score Engine: Cálculo Real a partir dos dados do BP ─────────────────
    // Cada dimensão é calculada a partir de índices financeiros reais.
    // Retorna 0 se não há dados; nunca retorna valor hardcoded.
    const calcScores = (bp: any, ebitda: number, lucroLiq: number) => {
      if (!bp || !bp.ativoTotal || bp.ativoTotal === 0) {
        return { financial: 0, operational: 0, governance: 0, structural: 0, composite: 0 };
      }

      const calibration = CalibrationEngine.getCalibration();
      const stressSens = calibration.stressPropagationSensitivity;
      const causalitySens = calibration.temporalCausalitySensitivity;

      const at = bp.ativoTotal || 0;
      const ac = bp.ativoCirculante || 0;
      const pc = bp.passivoCirculante || 0;
      const pt = bp.passivoTotal || 0;
      const pl = bp.patrimonioLiquido || 0;
      const cx = bp.caixaEquivalentes || 0;
      const est = bp.estoques || 0;

      // 1. Liquidez (peso calibrado) — Corrente, Seca (com inventoryPenaltyFactor), Imediata
      const liqCorrente = pc > 0 ? Math.min((ac / pc) * 45, 100) : 80;
      const adjustedEst = est * institutionalContext.scoreCalibrationRules.inventoryPenaltyFactor;
      const liqSec = pc > 0 ? Math.min((Math.max(ac - adjustedEst, 0) / pc) * 40, 100) : 70;
      const liqImediata = pc > 0 ? Math.min((cx / pc) * 15, 100) : 60;
      const scoreLiquidez = Math.min(liqCorrente * 0.5 + liqSec * 0.35 + liqImediata * 0.15, 100);

      // 2. Estrutura de Capital (peso calibrado) — Autonomia, qualidade endividamento
      const autonomia = at > 0 ? (pl / at) * 100 : 0; // % PL/Ativo
      const endivCP = pt > 0 ? (pc / pt) * 100 : 50; // % dívida no CP
      const scoreEstrutura = Math.min(
        Math.max(autonomia * 0.6, 0) + Math.max((100 - endivCP) * 0.4, 0),
        100
      );

      // 3. Capital de Giro (peso calibrado) — Equilíbrio NCG
      const ncg = ac - pc;
      const ncgRatio = at > 0 ? (ncg / at) * 100 : 0;
      const scoreCapGiro = Math.min(Math.max(50 + ncgRatio * 2, 0), 100);

      // 4. Solidez / Solvência (peso calibrado) — Cobertura passivo total pelo PL com lossPenaltyFactor e stressSens
      let coberturaPL = pt > 0 ? Math.min((pl / pt) * 100, 100) : 80;
      if (lucroLiq < 0) {
        coberturaPL = Math.max(coberturaPL - (Math.abs(lucroLiq) / (pl || 1)) * 10 * institutionalContext.scoreCalibrationRules.lossPenaltyFactor * stressSens, 0);
      }
      const scoreSolidez = Math.min(coberturaPL, 100);

      // 5. Evolução PL histórica (peso calibrado)
      const prevPl = rawData.rawFinancialData?.prevPl || 0;
      let scoreEvolucao = 60;
      if (prevPl > 0 && pl > 0) {
        const growthPct = ((pl - prevPl) / Math.abs(prevPl)) * 100;
        scoreEvolucao = Math.min(Math.max(50 + growthPct, 0), 100);
      } else if (pl > 0 && prevPl === 0) {
        scoreEvolucao = 65;
      }

      // Proporções de pesos calibradas pelo modelo de negócio e sensibilidade
      let evWeight = institutionalContext.scoreCalibrationRules.evolutionWeight;
      let profWeight = institutionalContext.scoreCalibrationRules.profitabilityWeight;

      if (causalitySens !== 1.0) {
        // Adjust evolution weight fiduciarily
        evWeight = Math.min(Math.max(evWeight * causalitySens, 0.05), 0.40);
        const remaining = 1.0 - evWeight;
        const defaultRemaining = 1.0 - institutionalContext.scoreCalibrationRules.evolutionWeight;
        const ratio = profWeight / (defaultRemaining || 1);
        profWeight = remaining * ratio;
      }

      const remainderWeight = 1.0 - evWeight - profWeight;
      const liqWeight = remainderWeight * 0.4;
      const estWeight = remainderWeight * 0.3;
      const giroWeight = remainderWeight * 0.3;

      const composite =
        scoreLiquidez * liqWeight * 100 +
        scoreEstrutura * estWeight * 100 +
        scoreCapGiro * giroWeight * 100 +
        scoreSolidez * profWeight * 100 +
        scoreEvolucao * evWeight * 100;

      let finalComposite = Math.round((composite / 100) * 10) / 10;
      let finalStructural = Math.round(scoreEstrutura);

      // Memory penalty: ONLY if sufficient history
      if (memoryProfile.historicalDensityRequirement === 'SUFFICIENT') {
        if (memoryProfile.recurrenceSeverity === 'CRITICAL_STRUCTURAL_RECURRENCE') {
          finalComposite = Math.max(finalComposite - 15, 0);
          finalStructural = Math.max(finalStructural - 15, 0);
        } else if (memoryProfile.recurrenceSeverity === 'HIGH_RECURRENCE') {
          finalComposite = Math.max(finalComposite - 10, 0);
          finalStructural = Math.max(finalStructural - 10, 0);
        } else if (memoryProfile.recurrenceSeverity === 'MODERATE_RECURRENCE') {
          finalComposite = Math.max(finalComposite - 5, 0);
          finalStructural = Math.max(finalStructural - 5, 0);
        }
      }

      return {
        financial: Math.round(scoreLiquidez),
        operational: Math.round(scoreCapGiro),
        governance: Math.round(scoreSolidez),
        structural: finalStructural,
        composite: finalComposite
      };
    };

    const scores = calcScores(bpSummary, dreEbitda, dreLucro);

    // 3. Capital Structure Engine
    const capitalStructure = translateCapitalStructure(bpSummary, metrics);

    // 4. Causality Interpretation Engine
    const baseCausality = translateCausalityInterpretation(metrics, bpSummary, scores, identity);

    if (runtimeMode !== 'FULL_FINANCIAL_VIEW') {
      if (!baseCausality.event.includes('INSUFFICIENT_DATA')) {
        baseCausality.event = `Sinais de: ${baseCausality.event}`;
      }
      if (!baseCausality.rootCause.includes('INSUFFICIENT_DATA')) {
        baseCausality.rootCause = `Indícios apontam para: ${baseCausality.rootCause}`;
      }
      if (!baseCausality.strategicImpact.includes('INSUFFICIENT_DATA')) {
        baseCausality.strategicImpact = `Visão parcial sugere: ${baseCausality.strategicImpact}`;
      }
    }

    const rawCausality = baseCausality;

    // 5. Severity Modulator Engine
    const severity = translateSeverityModulation(bpSummary, metrics, segment, masterCausality, runtimeMode);

    // 6. Narrative Sanitizer for single year/first operational year or limited strategic confidence
    const sanitizeNarrative = (text: string): string => {
      if (!text) return text;
      let sanitized = text;
      
      // Remove raw tags completely
      sanitized = sanitized.replace(/\[INSUFFICIENT_DATA\]/g, '')
                           .replace(/\[NOT_APPLICABLE\]/g, '')
                           .replace(/\s{2,}/g, ' ')
                           .trim();

      if (!sanitized) return '';

      const isInitialOrLimited = 
        institutionalContext.historicalDensity === 'SINGLE_YEAR_ONLY' || 
        institutionalContext.businessStage === 'FIRST_OPERATIONAL_YEAR' ||
        institutionalContext.confidence.strategicConfidence === 'LIMITED_CONTEXT' ||
        institutionalContext.confidence.strategicConfidence === 'UNVERIFIABLE';

      if (isInitialOrLimited) {
        sanitized = sanitized
          .replace(/proteção de market share/gi, 'foco em posicionamento inicial')
          .replace(/robustez operacional/gi, 'estruturação operacional')
          .replace(/estabilidade estrutural/gi, 'alinhamento estrutural inicial')
          .replace(/caixa livre para expansão/gi, 'preservação de caixa')
          .replace(/caixa livre/gi, 'saldo de caixa')
          .replace(/análise evolutiva/gi, 'diagnóstico estático');
      }
      return ExecutiveNarrativeSanitizer.sanitize(sanitized);
    };

    // 6. Advisory Engine
    const calibrationParams = CalibrationEngine.getCalibration();
    const verbosity = calibrationParams.advisoryVerbosity;
    const aggressiveness = calibrationParams.advisoryAggressiveness;

    let execSummary = '';
    const stageLabel = pt(institutionalContext.businessStage);
    const modelLabel = pt(institutionalContext.economicModel);
    const growthLabel = pt(institutionalContext.growthPattern);
    const confidenceLabel = pt(institutionalContext.confidence.strategicConfidence);
    const dataConfLabel = pt(institutionalContext.confidence.dataConfidence);

    if (runtimeMode === 'FULL_FINANCIAL_VIEW') {
      execSummary = `A operação encontra-se no estágio de ${stageLabel}, operando sob o modelo ${modelLabel}. A confiabilidade dos dados é ${dataConfLabel} e a suficiência contextual é ${confidenceLabel}. Padrão de crescimento: ${growthLabel}.`;
    } else {
      execSummary = `Com base nos dados disponíveis, a operação encontra-se no estágio de ${stageLabel}, sob o modelo ${modelLabel}. A suficiência contextual é considerada ${confidenceLabel}.`;
    }

    if (memoryProfile.historicalDensityRequirement === 'INSUFFICIENT') {
      execSummary += ' Histórico insuficiente para inferência evolutiva — as análises de tendência requerem ao menos dois exercícios financeiros.';
    } else {
      if (memoryProfile.ignoredRecommendations.length > 0) {
        execSummary += ' ' + memoryProfile.ignoredRecommendations[0];
      }
      if (memoryProfile.recurrencePatterns.length > 0) {
        execSummary += ' ' + memoryProfile.recurrencePatterns[0];
      }
    }

    // Apply verbosity overrides fiduciarily
    if (verbosity === 'low') {
      execSummary = execSummary.split('. ')[0] + '.';
    } else if (verbosity === 'high') {
      execSummary += ` Calibração regulada sob perfil de causalidade temporal sensível (${calibrationParams.temporalCausalitySensitivity.toFixed(1)}x) e estresse preditivo (${calibrationParams.stressPropagationSensitivity.toFixed(1)}x).`;
    }

    let focusAreas = [...institutionalContext.recommendationBoundaries.focusAreas];
    if (memoryProfile.historicalDensityRequirement === 'SUFFICIENT') {
      if (memoryProfile.decisionPatterns.length > 0) {
        focusAreas.push(...memoryProfile.decisionPatterns);
      }
      if (memoryProfile.deteriorationSignals.length > 0) {
        focusAreas.push(...memoryProfile.deteriorationSignals);
      }
    }

    if (aggressiveness > 1.2) {
      focusAreas.push('Alavancagem estratégica e aumento de produtividade comercial para otimização acelerada.');
    } else if (aggressiveness < 0.8) {
      focusAreas.push('Preservação máxima de liquidez e suspensão preventiva de novos Capex operacionais.');
    }

    if (verbosity === 'low' && focusAreas.length > 2) {
      focusAreas = focusAreas.slice(0, 2);
    }

    let advisory = {
      executiveSummary: sanitizeNarrative(execSummary),
      actionMatrix: focusAreas.map(sanitizeNarrative),
      priorityFocus: sanitizeNarrative(focusAreas[0] || 'Foco em posicionamento inicial')
    };

    // Apply the priority cascade resolver based on causality
    advisory = ExecutivePriorityCascadeResolver.resolve(advisory, causalityProfile);

    const causality = {
      ...rawCausality,
      event: sanitizeNarrative(rawCausality.event),
      rootCause: sanitizeNarrative(rawCausality.rootCause),
      financialPropagation: sanitizeNarrative(rawCausality.financialPropagation),
      absorptionCapacity: sanitizeNarrative(rawCausality.absorptionCapacity),
      strategicImpact: sanitizeNarrative(rawCausality.strategicImpact),
      insights: rawCausality.insights?.map((ins: any) => ({
        ...ins,
        text: sanitizeNarrative(ins.text)
      })) || []
    };

    // ── Integração Structural Capital (Phase 4) ─────────────────────────
    const structuralCapital = hasBP 
      ? StructuralCapitalOrchestrator.analyze(bpSummary, institutionalContext)
      : undefined;

    if (structuralCapital) {
      scores.composite = Math.max(
        Math.round((scores.composite + structuralCapital.scoreAdjustment) * 10) / 10,
        0
      );
      
      // Reordena o advisory com base nos riscos estruturais detectados
      advisory.actionMatrix = StructuralCapitalOrchestrator.reprioritizeAdvisory(
        structuralCapital,
        advisory.actionMatrix
      );
      
      institutionalContext.structuralCapitalStage = structuralCapital.structuralStage;
    }

    // ── Decomposition: valores reais por dimensão ──────────────────────────
    const getSeverityColor = (v: number) =>
      v >= 75 ? 'emerald' : v >= 55 ? 'blue' : v >= 40 ? 'amber' : 'rose';

    const bp = bpSummary || {} as any;
    const at2 = bp.ativoTotal || 0;
    const ac2 = bp.ativoCirculante || 0;
    const pc2 = bp.passivoCirculante || 0;
    const pt2 = bp.passivoTotal || 0;
    const pl2 = bp.patrimonioLiquido || 0;
    const cx2 = bp.caixaEquivalentes || 0;
    const est2 = bp.estoques || 0;

    const liqCorr = pc2 > 0 ? ac2 / pc2 : 0;
    const liqSec = pc2 > 0 ? (ac2 - est2) / pc2 : 0;
    const liqImId = pc2 > 0 ? cx2 / pc2 : 0;
    const scoreLiq = Math.min(liqCorr * 45 * 0.5 + liqSec * 40 * 0.35 + liqImId * 15 * 0.15, 100);

    const autonomia2 = at2 > 0 ? (pl2 / at2) * 100 : 0;
    const endivCP2 = pt2 > 0 ? (pc2 / pt2) * 100 : 50;
    let scoreEstr = Math.min(Math.max(autonomia2 * 0.6, 0) + Math.max((100 - endivCP2) * 0.4, 0), 100);

    if (memoryProfile.historicalDensityRequirement === 'SUFFICIENT') {
      if (memoryProfile.recurrenceSeverity === 'CRITICAL_STRUCTURAL_RECURRENCE') {
        scoreEstr = Math.max(scoreEstr - 15, 0);
      } else if (memoryProfile.recurrenceSeverity === 'HIGH_RECURRENCE') {
        scoreEstr = Math.max(scoreEstr - 10, 0);
      } else if (memoryProfile.recurrenceSeverity === 'MODERATE_RECURRENCE') {
        scoreEstr = Math.max(scoreEstr - 5, 0);
      }
    }

    const ncg2 = ac2 - pc2;
    const scoreGiro = Math.min(Math.max(50 + (at2 > 0 ? (ncg2 / at2) * 100 * 2 : 0), 0), 100);

    const cobert2 = pt2 > 0 ? Math.min((pl2 / pt2) * 100, 100) : 80;
    const scoreSolid = Math.min(cobert2, 100);

    const prevPlDec = rawData.rawFinancialData?.prevPl || 0;
    let scoreEvol = 60;
    if (prevPlDec > 0 && pl2 > 0) {
      scoreEvol = Math.min(Math.max(50 + ((pl2 - prevPlDec) / Math.abs(prevPlDec)) * 100, 0), 100);
    } else if (pl2 > 0) {
      scoreEvol = 65;
    }

    const decomposition = at2 > 0 ? [
      {
        label: 'Liquidez (25%)',
        value: Math.round(scoreLiq),
        severityColor: getSeverityColor(scoreLiq),
        explanation: `Liquidez Corrente: ${liqCorr.toFixed(2)}x | Seca: ${liqSec.toFixed(2)}x | Imediata: ${liqImId.toFixed(2)}x`
      },
      {
        label: 'Estrutura (25%)',
        value: Math.round(scoreEstr),
        severityColor: getSeverityColor(scoreEstr),
        explanation: `Autonomia Financeira: ${autonomia2.toFixed(1)}% | Dívida CP/Total: ${endivCP2.toFixed(1)}%`
      },
      {
        label: 'Cap. Giro (20%)',
        value: Math.round(scoreGiro),
        severityColor: getSeverityColor(scoreGiro),
        explanation: `NCG: R$ ${ncg2.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} | ${at2 > 0 ? ((ncg2 / at2) * 100).toFixed(1) : 0}% do Ativo Total`
      },
      {
        label: 'Solidez (20%)',
        value: Math.round(scoreSolid),
        severityColor: getSeverityColor(scoreSolid),
        explanation: `Cobertura do Passivo pelo PL: ${cobert2.toFixed(1)}%`
      },
      {
        label: 'Evolução (10%)',
        value: Math.round(scoreEvol),
        severityColor: getSeverityColor(scoreEvol),
        explanation: prevPlDec > 0
          ? `Variação YoY do PL: ${(((pl2 - prevPlDec) / Math.abs(prevPlDec)) * 100).toFixed(1)}%`
          : 'Sem histórico anterior disponível para comparação YoY'
      }
    ] : [];

    // ── DRE Real Metrics Engine ────────────────────────────────────────────────
    // When dreData is present, compute ALL real financial metrics via the cascade engine.
    const buildDreMetricsPayload = () => {
      if (!hasDRE || !rawData.dreData || rawData.dreData.length === 0) {
        return {
          hasData: false,
          financialMetrics: {
            receitaBruta: 0, deducoesReceita: 0, recLiquida: 0, custosVar: 0, margemContrib: 0,
            despesasFixas: 0, pontoEquilibrio: 0, gapEquilibrio: 0, margemSegurancaValor: 0,
            indiceDeducoes: 0, indiceCoberturaOperacional: 0, indiceMargemContrib: 0, cmvLabel: 'Custos Variáveis',
            cascadeResult: [],
          },
          kpis: [],
          efficiencies: [
            { name: 'Comercial', value: 0, desc: 'Gestão de Custos', color: 'slate' },
            { name: 'Operacional', value: 0, desc: 'Geração EBITDA', color: 'slate' }
          ],
          scaleEfficiency: { category: 'Sem Dados', colorClass: 'text-slate-400', recGrowth: 0, ebitdaGrowth: 0, description: 'Aguardando dados financeiros.' },
          alerts: [],
          chartData: []
        };
      }

      const dreRawData = rawData.dreData;
      const filterYear = rawData.rawFinancialData?.filterYear || new Date().getFullYear();
      const segmentoEmpresa = (rawData.rawFinancialData?.segmentoEmpresa || 'Serviços').toLowerCase();

      // Map entries to the cascade format (same logic as LegacyDREAdapter)
      const yearEntries = dreRawData.filter((d: any) => {
        const et = (d.entryType || '').toLowerCase();
        return et !== 'ativo' && et !== 'passivo' && et !== 'patrimônio líquido';
      });

      const mappedEntries = yearEntries
        .sort((a: any, b: any) => (a.ordem || 0) - (b.ordem || 0))
        .map((d: any) => {
          let parentId = d.parentId;
          const cat = (d.conta || d.category || '').toLowerCase();

          // Skip calculated totals from legacy flat data
          if (!parentId && (
            cat.includes('receita líquida') || cat.includes('receita operacional líquida') ||
            cat.includes('lucro bruto') || cat.includes('ebitda') || cat === 'ebit' ||
            cat.includes('resultado operacional líquido') || cat.includes('lajida') ||
            cat.includes('lucro líquido') || cat.includes('lair') || cat.includes('resultado antes')
          )) return null;

          if (!parentId) {
            if (cat.includes('receita operacional bruta') || cat === 'receita bruta' || cat.includes('faturamento') ||
               (cat.includes('receita') && !cat.includes('líquida') && !cat.includes('financeir') && !cat.includes('outras'))) {
              parentId = 'ROB';
            } else if (cat.includes('deduç') || cat.includes('imposto sobre') || cat.includes('abatimento') || cat.includes('devoluç') || cat.includes('cancelamento')) {
              parentId = 'DED';
            } else if (cat.includes('custo') || cat.includes('cmv') || cat.includes('cpv') || cat.includes('csv') || cat.includes('csp')) {
              parentId = 'CUSTOS';
            } else if (cat.includes('deprecia') || cat.includes('amortiza')) {
              parentId = 'DEP_AMORT';
            } else if (cat.includes('financeir') || cat.includes('juros')) {
              parentId = 'RESULT_FIN';
            } else if (cat.includes('provisão') || cat.includes('irpj') || cat.includes('csll') || cat.includes('imposto de renda') || cat.includes('contribuição social')) {
              parentId = 'PROV_IR_CSLL';
            } else if (cat.includes('outras receitas') || cat.includes('outra receita') || cat.includes('outras despesas operacionais')) {
              parentId = 'OUTRAS_REC_DESP';
            } else {
              parentId = 'DESP_OPER';
            }
          }
          return { ...d, parentId, value: d.val || d.valor || d.value || 0 };
        })
        .filter(Boolean);

      const allRows = [
        ...DRE_OFFICIAL_STRUCTURE.map((account: any) => ({ ...account, value: 0 })),
        ...mappedEntries
      ];

      const cascadeResult = calculateDreCascade(allRows);

      const getV = (id: string) => {
        const row = cascadeResult.find((r: any) => r.id === id);
        if (!row) return 0;
        return row.computedValue !== undefined ? row.computedValue : (row.val || row.value || 0);
      };

      const receitaBruta    = getV('ROB');
      const deducoesReceita = getV('DED');
      const recLiquida      = getV('ROL');
      const custosVar       = getV('CUSTOS');
      const lucroBruto      = getV('LUCRO_BRUTO');
      const despesasFixas   = getV('DESP_OPER');
      const ebitda          = getV('EBITDA');
      const depreciacao     = getV('DEP_AMORT');
      const ebitVal         = getV('EBIT');
      const despFin         = getV('RESULT_FIN');
      const provisaoIR      = getV('PROV_IR_CSLL');
      const lucroLiq        = getV('LUCRO_LIQ');

      const cmvRow = cascadeResult.find((r: any) => r.parentId === 'CUSTOS' && r.tipo !== 'SINTETICA') ||
                     cascadeResult.find((r: any) => r.id === 'CUSTOS');
      const cmvLabelRaw = cmvRow ? (cmvRow.conta || cmvRow.category || cmvRow.nome || 'Custos Variáveis') : 'Custos Variáveis';
      const cmvLabel = cmvLabelRaw.replace(/^[(-/+)\s]+/, '').trim();

      const margemContrib     = lucroBruto;
      const indiceMargemContrib = recLiquida > 0 ? margemContrib / recLiquida : 0;
      const indiceDeducoes    = receitaBruta > 0 ? (deducoesReceita / receitaBruta) * 100 : 0;

      let pontoEquilibrio = 0;
      if (indiceMargemContrib > 0) pontoEquilibrio = Math.abs(despesasFixas) / indiceMargemContrib;
      if (!isFinite(pontoEquilibrio)) pontoEquilibrio = 0;

      const gapEquilibrio         = pontoEquilibrio - recLiquida;
      const margemSegurancaValor  = recLiquida > pontoEquilibrio ? recLiquida - pontoEquilibrio : -gapEquilibrio;
      const indiceCoberturaOperacional = pontoEquilibrio > 0 ? (recLiquida / pontoEquilibrio) * 100 : 0;

      const mbVal             = recLiquida > 0 ? (lucroBruto / recLiquida) * 100 : 0;
      const cmvVal            = recLiquida > 0 ? (custosVar / recLiquida) * 100 : 0;
      const ebitdaVal         = recLiquida > 0 ? (ebitda / recLiquida) * 100 : 0;
      const margemOperacional = recLiquida !== 0 ? (ebitVal / recLiquida) * 100 : 0;
      const margemLiquida     = recLiquida !== 0 ? (lucroLiq / recLiquida) * 100 : 0;
      const capacidadeAbsorcaoEstrutura = despesasFixas > 0 ? margemContrib / despesasFixas : margemContrib > 0 ? Infinity : 0;
      const indiceConversaoOperacional  = lucroBruto !== 0 ? (ebitVal / lucroBruto) * 100 : 0;
      const receitaMediaDiaria = recLiquida / 360;
      const breakEvenDays     = receitaMediaDiaria > 0 ? pontoEquilibrio / receitaMediaDiaria : 0;

      const despVendas = cascadeResult
        .filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('venda'))
        .reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);
      const despAdmin = cascadeResult
        .filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('admin'))
        .reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);

      const indiceDespesasAdministrativas = recLiquida > 0 ? (despAdmin / recLiquida) * 100 : 0;
      const indiceDespesasComerciais      = recLiquida > 0 ? (despVendas / recLiquida) * 100 : 0;
      const indiceDespesasFinanceiras     = recLiquida > 0 ? (despFin / recLiquida) * 100 : 0;

      // Resolve benchmarks via BenchmarkReferenceEngine
      const economicModelName = pt(institutionalContext.economicModel);
      const benchComercial = BenchmarkReferenceEngine.resolve('cmvVal', segmentoEmpresa, economicModelName, rawData.clientConfig);
      const benchOperacional = BenchmarkReferenceEngine.resolve('ebitdaVal', segmentoEmpresa, economicModelName, rawData.clientConfig);
      const benchAdministrativa = BenchmarkReferenceEngine.resolve('despAdmin', segmentoEmpresa, economicModelName, rawData.clientConfig);
      const benchFinanceira = BenchmarkReferenceEngine.resolve('despFin', segmentoEmpresa, economicModelName, rawData.clientConfig);
      const benchTributaria = BenchmarkReferenceEngine.resolve('burdenTributario', segmentoEmpresa, economicModelName, rawData.clientConfig);
      const benchEstrutural = BenchmarkReferenceEngine.resolve('capacidadeAbsorcao', segmentoEmpresa, economicModelName, rawData.clientConfig);

      const targetCmvMax = benchComercial.target;
      const targetEbitdaMin = benchOperacional.target;
      const targetAdminMax = benchAdministrativa.target;
      const targetFinMax = benchFinanceira.target;
      const targetTribMax = benchTributaria.target;
      const targetAbsorcaoMin = benchEstrutural.target;

      let cmvMax = targetCmvMax || 60;
      let cmvCritical = 75;

      const burdenTributario = receitaBruta > 0 ? (deducoesReceita + Math.abs(provisaoIR)) / receitaBruta : 0;
      const burdenTributarioPerc = burdenTributario * 100;

      const calcScore = (real: number, target: number, isLowerBetter: boolean) => {
        if (target === 0) return 100;
        if (isLowerBetter) {
          return real <= target ? 100 : Math.max(100 - (((real - target) / target) * 100), 0);
        } else {
          return real >= target ? 100 : Math.max((real / target) * 100, 0);
        }
      };

      const eficienciaComercial  = calcScore(cmvVal, targetCmvMax, true);
      const eficienciaOperacional= calcScore(ebitdaVal, targetEbitdaMin, false);
      const eficienciaAdministrativa = calcScore(indiceDespesasAdministrativas, targetAdminMax, true);
      const eficienciaFinanceira = calcScore(indiceDespesasFinanceiras, targetFinMax, true);
      const eficienciaTributaria = calcScore(burdenTributarioPerc, targetTribMax, true);
      const eficienciaEstrutural = calcScore(capacidadeAbsorcaoEstrutura, targetAbsorcaoMin, false);

      // Chart data (historical trend)
      const allHistoryData = Array.isArray(rawData.historicalSeries) && rawData.historicalSeries.length > 0 
        ? rawData.historicalSeries 
        : dreRawData;
      const chartData = [5, 4, 3, 2, 1, 0].map(offset => {
        const y = filterYear - offset;
        const yearHist = allHistoryData.filter((d: any) =>
          Number(d.year) === y && (d.type === 'DRE' || !d.type) &&
          (d.entryType || '').toLowerCase() !== 'ativo' &&
          (d.entryType || '').toLowerCase() !== 'passivo'
        );
        let rl = 0, ebt = 0, ll = 0, cmv = 0;
        if (yearHist.length > 0) {
          const m = yearHist.map((d: any) => ({ ...d, value: d.val || d.valor || d.value || 0 }));
          const res = calculateDreCascade([...DRE_OFFICIAL_STRUCTURE.map((a: any) => ({ ...a, value: 0 })), ...m]);
          rl  = res.find((r: any) => r.id === 'ROL')?.computedValue || 0;
          ebt = res.find((r: any) => r.id === 'EBITDA')?.computedValue || 0;
          ll  = res.find((r: any) => r.id === 'LUCRO_LIQ')?.computedValue || 0;
          cmv = Math.abs(res.find((r: any) => r.id === 'CUSTOS')?.computedValue || 0);
        }
        return { year: y.toString(), receita: rl, cmv, ebitda: ebt, lucro: ll };
      }).filter((d: any) => d.receita > 0 || d.ebitda > 0 || d.lucro > 0 || d.cmv > 0 || d.year === filterYear.toString());

      // Scale efficiency & trend
      let recGrowth = 0, ebitdaGrowth = 0, trendNote: any = null;
      if (chartData.length >= 2) {
        const current = chartData[chartData.length - 1];
        const oldest  = chartData.find((d: any) => d.receita > 0) || chartData[0];
        if (oldest && oldest.year !== current.year) {
          recGrowth    = oldest.receita  !== 0 ? ((current.receita  / oldest.receita)  - 1) * 100 : 0;
          ebitdaGrowth = oldest.ebitda   !== 0 ? ((current.ebitda   / oldest.ebitda)   - 1) * 100 : 0;
          const cmvGrowth   = oldest.cmv   !== 0 ? ((current.cmv   / oldest.cmv)   - 1) * 100 : 0;
          const lucroGrowth = oldest.lucro !== 0 ? ((current.lucro / oldest.lucro) - 1) * 100 : 0;
          trendNote = { period: `${oldest.year} a ${current.year}`, receita: recGrowth, ebitda: ebitdaGrowth, cmv: cmvGrowth, lucro: lucroGrowth };
        }
      }

      // DRE Insights (alerts + smart insights)
      const internalAuditErrors: string[] = [];
      if (recLiquida !== 0) {
        const calcLB = recLiquida - Math.abs(custosVar);
        if (lucroBruto !== 0 && Math.abs(calcLB - lucroBruto) > (Math.abs(recLiquida) * 0.01)) {
          internalAuditErrors.push('Divergência matemática detectada: Lucro Bruto.');
        }
      }

      const dreMetrics: DreMetrics = {
        recLiquida, lucroBruto, pontoEquilibrio, gapEquilibrio, indiceCoberturaOperacional,
        margemSegurancaValor, cmvVal, cmvCritical, cmvLabel, capacidadeAbsorcaoEstrutura,
        margemOperacional, margemLiquida, indiceDespesasAdministrativas, indiceDespesasFinanceiras,
        breakEvenDays, indiceConversaoOperacional, ebitda, recGrowth, ebitdaGrowth, internalAuditErrors
      };
      const dreInsights = generateDreInsights(dreMetrics);

      // KPIs
      const kpis = recLiquida > 0 ? [
        { name: 'Receita Líquida',       val: recLiquida,          unit: 'currency', status: 'Verde' as const,    trend: 'Operacional',    tooltip: 'Receita após deduções e impostos sobre vendas.' },
        { name: 'EBITDA',                val: ebitda,              unit: 'currency', status: ebitda >= 0 ? 'Verde' as const : 'Vermelho' as const, trend: ebitda >= 0 ? 'Positivo' : 'Negativo', tooltip: 'Geração de caixa operacional antes de juros, IR, depreciação e amortização.' },
        { name: 'Lucro Líquido',         val: lucroLiq,            unit: 'currency', status: lucroLiq >= 0 ? 'Verde' as const : 'Vermelho' as const, trend: lucroLiq >= 0 ? 'Lucrativo' : 'Prejuízo', tooltip: 'Resultado líquido após todos os custos, despesas e impostos.' },
        { name: 'Margem EBITDA',         val: ebitdaVal,           unit: '%',        status: ebitdaVal >= 15 ? 'Verde' as const : ebitdaVal >= 8 ? 'Amarelo' as const : 'Vermelho' as const, trend: 'EBITDA / ROL', tooltip: 'Percentual da receita líquida convertido em EBITDA.' },
        { name: 'Margem Bruta',          val: mbVal,               unit: '%',        status: mbVal >= 30 ? 'Verde' as const : mbVal >= 15 ? 'Amarelo' as const : 'Vermelho' as const,   trend: 'LB / ROL',    tooltip: 'Percentual da receita líquida restante após os custos diretos.' },
        { name: 'Margem Líquida',        val: margemLiquida,       unit: '%',        status: margemLiquida >= 5 ? 'Verde' as const : margemLiquida >= 0 ? 'Amarelo' as const : 'Vermelho' as const, trend: 'LL / ROL', tooltip: 'Percentual final de resultado sobre a receita líquida.' },
        { name: 'Ponto de Equilíbrio',   val: pontoEquilibrio,     unit: 'currency', status: recLiquida >= pontoEquilibrio ? 'Verde' as const : 'Vermelho' as const, trend: recLiquida >= pontoEquilibrio ? 'Coberto' : 'Descoberto', tooltip: 'Receita mínima necessária para cobrir todos os custos e despesas fixas.' },
        { name: 'Índice de Cobertura',   val: indiceCoberturaOperacional, unit: '%', status: indiceCoberturaOperacional >= 100 ? 'Verde' as const : indiceCoberturaOperacional >= 85 ? 'Amarelo' as const : 'Vermelho' as const, trend: 'ROL / PE', tooltip: 'Quanto da receita atual cobre o ponto de equilíbrio.' }
      ] : [];

      // Scale efficiency classification
      let scaleCategory = 'Análise Inicial';
      let scaleColorClass = 'text-slate-400';
      if (recGrowth > 0 && ebitdaGrowth > recGrowth)       { scaleCategory = 'Crescimento Saudável';    scaleColorClass = 'text-emerald-500'; }
      else if (recGrowth > 0 && ebitdaGrowth > 0)          { scaleCategory = 'Absorção de Estrutura';   scaleColorClass = 'text-blue-500'; }
      else if (recGrowth > 0 && ebitdaGrowth < 0)          { scaleCategory = 'Crescimento Destrutivo';  scaleColorClass = 'text-rose-500'; }
      else if (recGrowth <= 0 && ebitdaGrowth < 0)         { scaleCategory = 'Destruição de Valor';     scaleColorClass = 'text-red-600'; }
      else if (recGrowth < 0 && ebitdaGrowth > 0)          { scaleCategory = 'Eficiência sob Retração'; scaleColorClass = 'text-amber-500'; }

      // DRE Health Score (same algorithm as LegacyDREAdapter)
      let dreHealthScoreBase = 0;
      if (recLiquida > 0) {
        const scoreMargemBruta   = Math.min(Math.max((mbVal / 40) * 100, 0), 100) * 0.15;
        let scoreCMV = 0;
        if (cmvVal <= cmvMax) scoreCMV = 100;
        else if (cmvVal >= cmvCritical) scoreCMV = 0;
        else scoreCMV = 100 - (((cmvVal - cmvMax) / (cmvCritical - cmvMax)) * 100);
        scoreCMV *= 0.10;
        const scoreMargemEbitda  = Math.min(Math.max((ebitdaVal / 15) * 100, 0), 100) * 0.15;
        const scoreMargemOp      = Math.min(Math.max(((margemOperacional + 10) / 25) * 100, 0), 100) * 0.15;
        const scoreCobertura     = Math.min(Math.max((indiceCoberturaOperacional / 100) * 100, 0), 100) * 0.15;
        const scoreEstrut        = Math.min(Math.max(capacidadeAbsorcaoEstrutura * 100, 0), 100) * 0.10;
        const scoreCaixa         = Math.min(Math.max((indiceConversaoOperacional / 80) * 100, 0), 100) * 0.10;
        const debtRatio          = ebitda > 0 ? despFin / ebitda : despFin > 0 ? 1 : 0;
        const scoreDivida        = Math.max((1 - debtRatio) * 100, 0) * 0.10;
        dreHealthScoreBase = scoreMargemBruta + scoreCMV + scoreMargemEbitda + scoreMargemOp + scoreCobertura + scoreEstrut + scoreCaixa + scoreDivida;
        if (mbVal > 30 && capacidadeAbsorcaoEstrutura < 1) dreHealthScoreBase += 10;
        if (trendNote && trendNote.receita > 0) dreHealthScoreBase += Math.min((trendNote.receita / 20) * 10, 10);
        if (ebitda < 0 || margemOperacional < 0 || recLiquida < pontoEquilibrio) dreHealthScoreBase = Math.min(dreHealthScoreBase, 40);
      }
      const dreHealthScore = Math.round(Math.min(Math.max(dreHealthScoreBase, 0), 100));

      return {
        hasData: true,
        financialMetrics: {
          cascadeResult,
          receitaBruta, deducoesReceita, recLiquida, custosVar, margemContrib,
          despesasFixas, pontoEquilibrio, gapEquilibrio, margemSegurancaValor,
          indiceDeducoes, indiceCoberturaOperacional, indiceMargemContrib,
          cmvLabel, mbVal, cmvVal, ebitdaVal, margemOperacional, margemLiquida,
          indiceConversaoOperacional, capacidadeAbsorcaoEstrutura, breakEvenDays,
          trendNote, dreHealthScore,
        },
        kpis,
        efficiencies: [
          { name: 'Comercial',      value: mbVal,                     score: eficienciaComercial,      desc: `Margem Bruta (Meta: >${(100 - targetCmvMax).toFixed(0)}%) — ${benchComercial.label}`, color: eficienciaComercial >= 80 ? 'emerald' : eficienciaComercial >= 50 ? 'amber' : 'rose', unit: '%' },
          { name: 'Operacional',    value: ebitdaVal,                 score: eficienciaOperacional,    desc: `Margem EBITDA (Meta: >${targetEbitdaMin}%) — ${benchOperacional.label}`, color: eficienciaOperacional >= 80 ? 'emerald' : eficienciaOperacional >= 50 ? 'amber' : 'rose', unit: '%' },
          { name: 'Administrativa', value: indiceDespesasAdministrativas, score: eficienciaAdministrativa, desc: `Desp. Adm/ROL (Meta: <${targetAdminMax}%) — ${benchAdministrativa.label}`,  color: eficienciaAdministrativa >= 80 ? 'emerald' : eficienciaAdministrativa >= 50 ? 'amber' : 'rose', unit: '%' },
          { name: 'Financeira',     value: indiceDespesasFinanceiras, score: eficienciaFinanceira,     desc: `Desp. Fin/ROL (Meta: <${targetFinMax}%) — ${benchFinanceira.label}`,    color: eficienciaFinanceira >= 80 ? 'emerald' : eficienciaFinanceira >= 50 ? 'amber' : 'rose', unit: '%' },
          { name: 'Tributária',     value: burdenTributarioPerc,      score: eficienciaTributaria,     desc: `Carga Tributária (Meta: <${targetTribMax}%) — ${benchTributaria.label}`,   color: eficienciaTributaria >= 80 ? 'emerald' : eficienciaTributaria >= 50 ? 'amber' : 'rose', unit: '%' },
          { name: 'Estrutural',     value: capacidadeAbsorcaoEstrutura, score: eficienciaEstrutural,   desc: `Absorção Estrutura (Meta: >${targetAbsorcaoMin}x) — ${benchEstrutural.label}`, color: eficienciaEstrutural >= 80 ? 'emerald' : eficienciaEstrutural >= 50 ? 'amber' : 'rose', unit: 'x' },
        ],
        scaleEfficiency: {
          category: scaleCategory,
          colorClass: scaleColorClass,
          recGrowth,
          ebitdaGrowth,
          description: dreInsights.performanceNote
        },
        alerts: dreInsights.systemAlerts as any[],
        chartData
      };
    };

    const metricsPayload = buildDreMetricsPayload();

    // 7. Consolidação e Auditoria (Confidence Integrity Layer)
    traceEngine.Lineage.endNode('ExecutiveReportGenerated');
    traceEngine.Profiler.endEngine('ExecutiveIntelligenceRuntime');
    
    // Enrich the action matrix before consolidation
    const enrichedActionMatrix = ExecutiveActionMatrixEngine.buildMatrix(
      advisory.actionMatrix,
      metrics,
      bpSummary,
      causality,
      severity.level
    );

    const initialReport: ExecutiveIntelligenceReport = {
      context,
      scores,
      capitalStructure,
      causality,
      severity,
      advisory: {
        ...advisory,
        actionMatrix: enrichedActionMatrix
      },
      decomposition,
      metrics: metricsPayload,
      compliance: {
        runtimeMode,
        confidenceLevel,
        dataCompleteness,
        causalDepth,
        narrativeRestrictions: [
          ...narrativeRestrictions,
          ...institutionalContext.narrativeConstraints.blockedNarrativeClaims.map(c => `NÃO reivindicar: ${c}`),
          ...institutionalContext.narrativeConstraints.allowedNarrativeFrame.map(f => `Diretriz: ${f}`)
        ],
        auditFlags: []
      },
      temporalCausality,
      runtimeMetadata: traceEngine.finalizeTrace(),
      institutionalContext,
      institutionalMemory: memoryProfile,
      institutionalCausality: causalityProfile,
      structuralCapital
    };

    let report = initialReport;

    // Apply Trilha 1: Empty Cycle Fail-Closed
    if (EmptyCycleIntegrityEngine.evaluate(rawData)) {
      report = EmptyCycleIntegrityEngine.applyFailClosed(report);
    } else {
      // Apply Trilha 3: Scale Efficiency Fail-Closed
      if (ScaleEfficiencyIntegrityEngine.evaluate(anosHistorico)) {
        report = ScaleEfficiencyIntegrityEngine.applyFailClosed(report);
      }
      
      // Apply Trilha 6: Historical Series validation
      if (!HistoricalSeriesIntegrityEngine.validate(metricsPayload.chartData)) {
        report = HistoricalSeriesIntegrityEngine.applyFailClosed(report);
      }
    }

    // Apply Trilha 7: Terminology Hardening
    report = ExecutiveDiagnosisComposer.hardenReportStrings(report);

    return report;
  }
}

// Exporta o Singleton oficial para uso na plataforma
export const executiveRuntime = new ExecutiveIntelligenceRuntime();
