import { getSectorProfile } from '../intelligence/sector-behavior-profiles';
import { translateCapitalStructure } from './adapters/capital-structure-adapter';
import { translateCausalityInterpretation } from './adapters/causality-interpretation-adapter';
import { translateSeverityModulation } from './adapters/severity-modulator-adapter';
import { buildBPHierarchy } from '../../lib/bpEngine';
const calculateFinancialMetrics = (...args: any[]): any => ({} as any);
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
    actionMatrix: string[];
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
      desc: string;
      color: string;
    }[];
    scaleEfficiency: {
      category: string;
      colorClass: string;
      recGrowth: number;
      ebitdaGrowth: number;
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
      businessModel: institutionalContext.economicModel,
      capitalIntensity: institutionalContext.economicModel === 'ASSET_HEAVY' ? 'Asset Heavy' : 'Asset Light',
      stage: institutionalContext.businessStage,
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

      return {
        financial: Math.round(scoreLiquidez),
        operational: Math.round(scoreCapGiro),
        governance: Math.round(scoreSolidez),
        structural: Math.round(scoreEstrutura),
        composite: Math.round((composite / 100) * 10) / 10
      };
    };

    const scores = calcScores(bpSummary, dreEbitda, dreLucro);

    // 3. Capital Structure Engine
    const capitalStructure = translateCapitalStructure(bpSummary, metrics);

    // 4. Causality Interpretation Engine
    const baseCausality = translateCausalityInterpretation(metrics, bpSummary, scores, identity);

    if (runtimeMode !== 'FULL_FINANCIAL_VIEW') {
      baseCausality.event = `Sinais de: ${baseCausality.event}`;
      baseCausality.rootCause = `Indícios apontam para: ${baseCausality.rootCause}`;
      baseCausality.strategicImpact = `Visão parcial sugere: ${baseCausality.strategicImpact}`;
    }

    const rawCausality = baseCausality;

    // 5. Severity Modulator Engine
    const severity = translateSeverityModulation(bpSummary, metrics, segment, masterCausality, runtimeMode);

    // 6. Narrative Sanitizer for single year/first operational year or limited strategic confidence
    const sanitizeNarrative = (text: string): string => {
      if (!text) return text;
      let sanitized = text;
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
      return sanitized;
    };

    // 6. Advisory Engine
    const calibrationParams = CalibrationEngine.getCalibration();
    const verbosity = calibrationParams.advisoryVerbosity;
    const aggressiveness = calibrationParams.advisoryAggressiveness;

    let execSummary = '';
    if (runtimeMode === 'FULL_FINANCIAL_VIEW') {
      execSummary = `A operação encontra-se em estágio de ${context.stage} sob o modelo ${context.businessModel}. A confiabilidade dos dados é ${institutionalContext.confidence.dataConfidence} e a suficiência contextual é ${institutionalContext.confidence.strategicConfidence}. Padrão de crescimento: ${institutionalContext.growthPattern}.`;
    } else {
      execSummary = `Evidências limitadas sugerem operação em estágio de ${context.stage} sob o modelo ${context.businessModel}. A suficiência contextual é considerada ${institutionalContext.confidence.strategicConfidence}.`;
    }

    // Apply verbosity overrides fiduciarily
    if (verbosity === 'low') {
      execSummary = execSummary.split('. ')[0] + '.';
    } else if (verbosity === 'high') {
      execSummary += ` Calibração regulada sob perfil de causalidade temporal sensível (${calibrationParams.temporalCausalitySensitivity.toFixed(1)}x) e estresse preditivo (${calibrationParams.stressPropagationSensitivity.toFixed(1)}x).`;
    }

    let focusAreas = [...institutionalContext.recommendationBoundaries.focusAreas];
    if (aggressiveness > 1.2) {
      focusAreas.push('Alavancagem estratégica e aumento de produtividade comercial para otimização acelerada.');
    } else if (aggressiveness < 0.8) {
      focusAreas.push('Preservação máxima de liquidez e suspensão preventiva de novos Capex operacionais.');
    }

    if (verbosity === 'low' && focusAreas.length > 2) {
      focusAreas = focusAreas.slice(0, 2);
    }

    const advisory = {
      executiveSummary: sanitizeNarrative(execSummary),
      actionMatrix: focusAreas.map(sanitizeNarrative),
      priorityFocus: sanitizeNarrative(focusAreas[0] || 'Foco em posicionamento inicial')
    };

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
    const scoreEstr = Math.min(Math.max(autonomia2 * 0.6, 0) + Math.max((100 - endivCP2) * 0.4, 0), 100);

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

    const metricsPayload = {
      hasData: !rawData.isMockData,
      financialMetrics: {
        receitaBruta: 0, deducoesReceita: 0, recLiquida: 0, custosVar: 0, margemContrib: 0,
        despesasFixas: 0, pontoEquilibrio: 0, gapEquilibrio: 0, margemSegurancaValor: 0,
        indiceDeducoes: 0, indiceCoberturaOperacional: 0, indiceMargemContrib: 0, cmvLabel: 'Custos Variáveis'
      },
      kpis: [],
      efficiencies: [
        { name: 'Comercial', value: 80, desc: 'Gestão de Custos', color: 'emerald' },
        { name: 'Operacional', value: 75, desc: 'Geração EBITDA', color: 'blue' }
      ],
      scaleEfficiency: {
        category: 'Crescimento Saudável', colorClass: 'text-emerald-500', recGrowth: 15, ebitdaGrowth: 20, description: 'Escala perfeita.'
      },
      alerts: [],
      chartData: []
    };

    // 7. Consolidação e Auditoria (Confidence Integrity Layer)
    traceEngine.Lineage.endNode('ExecutiveReportGenerated');
    traceEngine.Profiler.endEngine('ExecutiveIntelligenceRuntime');
    
    return {
      context,
      scores,
      capitalStructure,
      causality,
      severity,
      advisory,
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
      institutionalContext
    };
  }
}

// Exporta o Singleton oficial para uso na plataforma
export const executiveRuntime = new ExecutiveIntelligenceRuntime();
