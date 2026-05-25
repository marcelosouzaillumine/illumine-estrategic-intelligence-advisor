import { getSectorProfile } from '../intelligence/sector-behavior-profiles';
import { translateCapitalStructure } from './adapters/capital-structure-adapter';
import { translateCausalityInterpretation } from './adapters/causality-interpretation-adapter';
import { translateSeverityModulation } from './adapters/severity-modulator-adapter';
import { buildBPHierarchy } from '../../lib/bpEngine';
import { calculateFinancialMetrics } from '../../lib/financial-engine';
import { inferBusinessIdentity } from '../../lib/business-identity-engine';
import { evaluateMasterCausality } from '../../lib/master-causal-engine';

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
export interface ExecutiveIntelligenceReport {
  context: {
    segment: string;
    businessModel: string;
    capitalIntensity: string;
    stage: string;
    operationalProfile: string;
  };
  scores: {
    financial: number;
    operational: number;
    governance: number;
    structural: number;
    composite: number;
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
}

export class ExecutiveIntelligenceRuntime {
  /**
   * Fluxo Oficial Obrigatório:
   * Importação -> Governança -> Contextualização -> Causalidade -> Modulação -> Advisory -> Executive Report -> UI
   */
  public generateExecutiveReport(rawData: any): ExecutiveIntelligenceReport {
    // 0. Runtime Context Awareness
    const hasDRE = !!rawData.dreData && Array.isArray(rawData.dreData) && rawData.dreData.length > 0;
    const hasBP = !!rawData.bpData && Array.isArray(rawData.bpData) && rawData.bpData.length > 0;
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

    // 1. Contextualização (Segment Intelligence Matrix)
    const segment = rawData.rawFinancialData?.segmentoEmpresa || 'Default';
    const sectorProfile = getSectorProfile(segment);

    const context = {
      segment: sectorProfile.name, 
      businessModel: 'Default',
      capitalIntensity: sectorProfile.expectedAssetType === 'Heavy' ? 'Asset Heavy' : 'Asset Light',
      stage: 'Consolidação',
      operationalProfile: 'Recorrente'
    };

    // 2. Data Initialization for Core Engines
    let bpSummary = undefined;
    if (hasBP) {
      // If we have raw bpData from the page, parse it
      const hierarchy = buildBPHierarchy(rawData.bpData);
      bpSummary = hierarchy.summary;
    }

    // Attempt to extract Ebitda and Lucro Liquido if DRE exists
    const dreEbitda = hasDRE ? (rawData.dreData.find((r: any) => r.category === 'EBITDA')?.value || 0) : 0;
    const dreLucro = hasDRE ? (rawData.dreData.find((r: any) => r.category === 'LUCRO LÍQUIDO DO EXERCÍCIO')?.value || 0) : 0;

    const metrics = calculateFinancialMetrics(bpSummary as any, dreEbitda, dreLucro, segment);
    const anosHistorico = rawData.historicalCyclesCount || 0;
    const identity = inferBusinessIdentity(segment, anosHistorico, bpSummary as any, undefined, undefined);
    const masterCausality = hasBP ? evaluateMasterCausality(bpSummary as any, metrics, identity) : undefined;

    // TODO: Injetar os cálculos reais do score-engine
    const scores = {
      financial: 85,
      operational: 82,
      governance: 78,
      structural: 88,
      composite: 83.25
    };

    // 3. Capital Structure Engine
    const capitalStructure = translateCapitalStructure(bpSummary, metrics);

    // 4. Causality Interpretation Engine
    const baseCausality = translateCausalityInterpretation(metrics, bpSummary, scores, identity);

    if (runtimeMode !== 'FULL_FINANCIAL_VIEW') {
      baseCausality.event = `Sinais de: ${baseCausality.event}`;
      baseCausality.rootCause = `Indícios apontam para: ${baseCausality.rootCause}`;
      baseCausality.strategicImpact = `Visão parcial sugere: ${baseCausality.strategicImpact}`;
    }

    const causality = baseCausality;

    // 5. Severity Modulator Engine
    const severity = translateSeverityModulation(bpSummary, metrics, segment, masterCausality, runtimeMode);

    // 6. Advisory Engine
    const advisory = {
      executiveSummary: runtimeMode === 'FULL_FINANCIAL_VIEW'
        ? 'A operação encontra-se em patamar institucional robusto, com funding aderente ao segmento e baixa dependência bancária curta.'
        : 'Evidências limitadas sugerem patamar operacional robusto, mas necessita validação integrada com fluxo de caixa e histórico completo.',
      actionMatrix: [
        'Avaliar oportunidades de alocação de caixa livre em expansão',
        'Manter otimização da cadeia de fornecedores'
      ],
      priorityFocus: 'Proteção de Market Share'
    };

    // TODO: Adicionar os valores matemáticos puros vindos das engines para exibir na UI
    const decomposition = [
      { label: 'Liquidez (25%)', value: 85, severityColor: 'emerald', explanation: 'Memória de Cálculo: Liquidez Corrente (1.5) e Real (1.2). Pondera a capacidade de honrar passivos curtos.' },
      { label: 'Estrutura (25%)', value: 88, severityColor: 'blue', explanation: 'Memória de Cálculo: Qualidade do Endividamento (20% curto prazo). Penaliza alta concentração no curto prazo.' },
      { label: 'Cap. Giro (20%)', value: 82, severityColor: 'amber', explanation: 'Memória de Cálculo: NCG equilibrada vs AC.' },
      { label: 'Solidez (20%)', value: 78, severityColor: 'purple', explanation: 'Memória de Cálculo: Autonomia Financeira alta. Mede a proteção do passivo pelo capital próprio.' },
      { label: 'Evolução (10%)', value: 90, severityColor: 'indigo', explanation: 'Memória de Cálculo: Crescimento YoY do Patrimônio Líquido positivo.' }
    ];

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
        narrativeRestrictions,
        auditFlags: []
      }
    };
  }
}

// Exporta o Singleton oficial para uso na plataforma
export const executiveRuntime = new ExecutiveIntelligenceRuntime();
