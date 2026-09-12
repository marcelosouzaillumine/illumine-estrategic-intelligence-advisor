import { 
  InstitutionalContextProfile, 
  IResolverContext, 
  BusinessStage, 
  EconomicModel, 
  HistoricalDensity, 
  LiabilityNature, 
  OperationalProfile, 
  GrowthPattern, 
  StrategicConfidence, 
  NarrativeGovernance 
} from './types';
import { BusinessStageResolver } from './BusinessStageResolver';
import { EconomicModelResolver } from './EconomicModelResolver';
import { HistoricalDensityResolver } from './HistoricalDensityResolver';
import { LiabilityNatureResolver } from './LiabilityNatureResolver';
import { OperationalProfileResolver } from './OperationalProfileResolver';
import { GrowthPatternResolver } from './GrowthPatternResolver';
import { StrategicConfidenceResolver } from './StrategicConfidenceResolver';
import { NarrativeGovernanceResolver } from './NarrativeGovernanceResolver';
import { buildBPHierarchy } from '../../../lib/bpEngine';
import { InstitutionalLocaleGuard } from '../locale/InstitutionalLocaleGuard';
import { SegmentIntelligenceRegistry } from '../segment-intelligence/SegmentIntelligenceRegistry';
import { SegmentCode, SegmentConfidenceScore } from '../segment-intelligence/types';

export class InstitutionalContextEngine {
  static resolve(rawData: any): InstitutionalContextProfile {
    const industry = rawData?.rawFinancialData?.segmentoEmpresa || rawData?.segment || 'Default';
    const historicalCyclesCount = rawData?.historicalCyclesCount || 0;

    // Extrair ou calcular o bpSummary
    let bpSummary: any = {};
    if (rawData?.bpData && Array.isArray(rawData.bpData) && rawData.bpData.length > 0) {
      const hierarchy = buildBPHierarchy(rawData.bpData);
      bpSummary = hierarchy.summary;
    } else if (rawData?.rawFinancialData?.bpSummary && Object.keys(rawData.rawFinancialData.bpSummary).length > 0) {
      bpSummary = rawData.rawFinancialData.bpSummary;
    }

    // Extrair dreCascade
    let dreCascade: any[] = [];
    if (rawData?.dreData && Array.isArray(rawData.dreData) && rawData.dreData.length > 0) {
      dreCascade = rawData.dreData;
    }

    // Extrair dados anteriores para cálculo de crescimento
    const previousPl = rawData?.rawFinancialData?.prevPl || rawData?.previousPl || 0;
    const previousEbitda = rawData?.rawFinancialData?.previousEbitda || rawData?.previousEbitda || 0;
    const previousCash = rawData?.rawFinancialData?.previousCash || rawData?.previousCash || 0;

    const ctx: IResolverContext = {
      rawData,
      bpSummary,
      dreCascade,
      historicalCyclesCount,
      industry,
      previousPl,
      previousEbitda,
      previousCash
    };

    // Resoluções sequenciais
    const businessStage = BusinessStageResolver.resolve(ctx);
    const economicModel = EconomicModelResolver.resolve(ctx);
    const historicalDensity = HistoricalDensityResolver.resolve(ctx);
    const liabilityProfile = LiabilityNatureResolver.resolve(ctx);
    const operationalProfile = OperationalProfileResolver.resolve(ctx);
    const growthPattern = GrowthPatternResolver.resolve(ctx);
    const confidence = StrategicConfidenceResolver.resolve(ctx);
    const narrativeConstraints = NarrativeGovernanceResolver.resolve(
      ctx,
      businessStage,
      economicModel,
      historicalDensity
    );

    // 1. Definição de Recommendation Boundaries (Fronteiras de recomendação recomendadas/bloqueadas)
    let focusAreas: string[] = [];
    let blockedRecommendations: string[] = [];

    if (businessStage === 'RESTRUCTURING_OPERATION') {
      focusAreas = ['Reestruturação de passivos', 'Redução drástica de despesas operacionais', 'Controle rígido do fluxo de caixa diário'];
      blockedRecommendations = ['Expansão física ou Capex imobiliário', 'Investimento agressivo em novas frentes comerciais', 'Estoque de antecipação'];
    } else if (businessStage === 'INITIAL_OPERATION' || businessStage === 'STRUCTURING_OPERATION') {
      focusAreas = ['Definição do ponto de equilíbrio (Break-even)', 'Validação de Unit Economics', 'Preservação de caixa mínimo'];
      blockedRecommendations = ['Distribuição de lucros ou dividendos', 'Financiamento bancário de longo horizonte estruturado'];
    } else if (businessStage === 'EXPANDING_OPERATION') {
      focusAreas = ['Garantia de margem de contribuição saudável', 'Aceleração comercial', 'Otimização de capital de giro'];
      blockedRecommendations = ['Redução desmedida do time de vendas', 'Desaceleração do investimento em produto/tecnologia'];
    } else {
      focusAreas = ['Maximizar retorno sobre capital empregado (ROCE)', 'Otimização de custos administrativos (SG&A)', 'Políticas de dividendos e governança'];
      blockedRecommendations = [];
    }

    // 2. Score Calibration Rules (Calibração matemática dos scores a depender do modelo econômico)
    let evolutionWeight = 0.15;
    let profitabilityWeight = 0.25;
    let lossPenaltyFactor = 1.3;
    let inventoryPenaltyFactor = 1.0;

    if (economicModel === 'SAAS' || economicModel === 'ASSET_LIGHT') {
      evolutionWeight = 0.20;
      profitabilityWeight = 0.30;
      lossPenaltyFactor = 1.5; // Penaliza forte perdas em modelos escaláveis
      inventoryPenaltyFactor = 0.1; // Desconsidera penalidade de estoque
    } else if (economicModel === 'INDUSTRIAL' || economicModel === 'DISTRIBUTION' || economicModel === 'INVENTORY_DEPENDENT') {
      evolutionWeight = 0.10;
      profitabilityWeight = 0.20;
      lossPenaltyFactor = 1.2;
      inventoryPenaltyFactor = 1.8; // Penaliza severamente estoques inflados ou lentos
    }

    // Regra Determinística Obrigatória: Recalibração de Score para Early-Stage
    if (businessStage === 'INITIAL_OPERATION' || businessStage === 'STRUCTURING_OPERATION') {
      inventoryPenaltyFactor = 0.3; // Reduz o peso da concentração de estoques (formação operacional)
      lossPenaltyFactor = 0.5; // Atenua peso de prejuízo inicial (expansão)
      // O peso da capitalização dos sócios será indiretamente maximizado pela não punição excessiva do loss e do estoque.
    }

    // 3. Operational Segment Construction
    let segmentCode = 'Não informado';
    let segmentSource: "client_registry" | "metadata" | "inferred" | "missing" = "missing";

    const cp = rawData?.clientProfile || rawData?.client || {};
    
    if (cp.segmentoAtuacao) {
      segmentCode = cp.segmentoAtuacao;
      segmentSource = "client_registry";
    } else if (cp.segmento_de_atuacao) {
      segmentCode = cp.segmento_de_atuacao;
      segmentSource = "client_registry";
    } else if (cp.segment) {
      segmentCode = cp.segment;
      segmentSource = "client_registry";
    } else if (cp.segmento) {
      segmentCode = cp.segmento;
      segmentSource = "client_registry";
    } else if (rawData?.clientProfile?.segmentoAtuacao) {
      segmentCode = rawData.clientProfile.segmentoAtuacao;
      segmentSource = "client_registry";
    } else if (rawData?.client?.segmentoAtuacao) {
      segmentCode = rawData.client.segmentoAtuacao;
      segmentSource = "client_registry";
    } else if (rawData?.metadata?.segmentoAtuacao) {
      segmentCode = rawData.metadata.segmentoAtuacao;
      segmentSource = "metadata";
    } else if (rawData?.metadata?.industry) {
      segmentCode = rawData.metadata.industry;
      segmentSource = "metadata";
    } else if (rawData?.segment) {
      segmentCode = rawData.segment;
      segmentSource = "metadata";
    } else if (rawData?.rawFinancialData?.segmentoEmpresa) {
      segmentCode = rawData.rawFinancialData.segmentoEmpresa;
      segmentSource = "client_registry";
    }

    // Map raw segment to formal SegmentCode
    let normalizedCode: SegmentCode = 'GENERIC_OPERATION';
    let confidenceVal = 0.3; // Fallback defaults
    let infMode: 'direct' | 'heuristic' | 'fallback' = 'fallback';

    const normalizedLower = segmentCode.toLowerCase();
    
    if (normalizedLower.includes('comérc') || normalizedLower.includes('distrib') || normalizedLower.includes('varej') || normalizedLower.includes('atacad')) {
      normalizedCode = 'COMMERCE_DISTRIBUTION';
      confidenceVal = 0.9;
      infMode = segmentSource === 'client_registry' ? 'direct' : 'heuristic';
    } else if (normalizedLower.includes('indústria') || normalizedLower.includes('manufa') || normalizedLower.includes('fábrica')) {
      normalizedCode = 'INDUSTRY';
      confidenceVal = 0.9;
      infMode = segmentSource === 'client_registry' ? 'direct' : 'heuristic';
    } else if (normalizedLower.includes('saúde') || normalizedLower.includes('hospit') || normalizedLower.includes('clínica') || normalizedLower.includes('médic')) {
      normalizedCode = 'HEALTHCARE';
      confidenceVal = 0.9;
      infMode = segmentSource === 'client_registry' ? 'direct' : 'heuristic';
    } else if (normalizedLower.includes('serviço') || normalizedLower.includes('b2b') || normalizedLower.includes('consult')) {
      normalizedCode = 'SERVICES';
      confidenceVal = 0.8;
      infMode = segmentSource === 'client_registry' ? 'direct' : 'heuristic';
    } else if (normalizedLower.includes('tech') || normalizedLower.includes('software') || normalizedLower.includes('ti') || normalizedLower.includes('informát')) {
      normalizedCode = 'TECHNOLOGY';
      confidenceVal = 0.9;
      infMode = segmentSource === 'client_registry' ? 'direct' : 'heuristic';
    } else if (normalizedLower.includes('ong') || normalizedLower.includes('terceiro setor') || normalizedLower.includes('associa') || normalizedLower.includes('institu')) {
      normalizedCode = 'NONPROFIT';
      confidenceVal = 0.9;
      infMode = segmentSource === 'client_registry' ? 'direct' : 'heuristic';
    } else if (normalizedLower.includes('educa') || normalizedLower.includes('ensin') || normalizedLower.includes('escola') || normalizedLower.includes('faculd')) {
      normalizedCode = 'EDUCATION';
      confidenceVal = 0.9;
      infMode = segmentSource === 'client_registry' ? 'direct' : 'heuristic';
    } else if (normalizedLower.includes('constru') || normalizedLower.includes('engenh') || normalizedLower.includes('incorpor')) {
      normalizedCode = 'CONSTRUCTION';
      confidenceVal = 0.9;
      infMode = segmentSource === 'client_registry' ? 'direct' : 'heuristic';
    } else if (normalizedLower.includes('logístic') || normalizedLower.includes('transport') || normalizedLower.includes('fret')) {
      normalizedCode = 'LOGISTICS';
      confidenceVal = 0.9;
      infMode = segmentSource === 'client_registry' ? 'direct' : 'heuristic';
    } else {
      normalizedCode = 'GENERIC_OPERATION';
      confidenceVal = 0.3;
      infMode = 'fallback';
    }

    const operationalSegment = {
      code: normalizedCode,
      label: SegmentIntelligenceRegistry[normalizedCode].segmentLabel,
      source: segmentSource
    };

    const segmentConfidence: SegmentConfidenceScore = {
      segment: normalizedCode,
      confidence: confidenceVal,
      source: segmentSource,
      inferenceMode: infMode
    };

    // 4. Operational Model
    const operationalModel = {
      code: economicModel,
      label: economicModel,
      confidence: confidence.dataConfidence
    };

    // 5. Financial Profile
    const financialProfile = {
      code: liabilityProfile[0] || 'BALANCED_LIABILITY',
      label: liabilityProfile[0] || 'BALANCED_LIABILITY',
      drivers: liabilityProfile
    };

    // 6. Institutional Maturity
    let historicalSupport = historicalDensity;
    if (historicalCyclesCount === 1) historicalSupport = 'SINGLE_YEAR_ONLY';
    else if (historicalCyclesCount === 0) historicalSupport = 'NO_VALID_HISTORY';

    const institutionalMaturity = {
      code: businessStage,
      label: InstitutionalLocaleGuard.translateBusinessStage(businessStage),
      historicalSupportLevel: historicalSupport
    };

    return {
      operationalSegment,
      segmentConfidence,
      operationalModel,
      financialProfile,
      institutionalMaturity,

      growthPattern,
      confidence,
      narrativeConstraints,
      recommendationBoundaries: {
        focusAreas,
        blockedRecommendations
      },
      scoreCalibrationRules: {
        evolutionWeight,
        profitabilityWeight,
        lossPenaltyFactor,
        inventoryPenaltyFactor
      },
      legacy: {
        businessStage,
        economicModel,
        liabilityProfile,
        historicalDensity,
        operationalProfile
      }
    };
  }
}
