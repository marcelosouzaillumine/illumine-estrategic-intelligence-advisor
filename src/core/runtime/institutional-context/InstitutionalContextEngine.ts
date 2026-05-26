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

    if (businessStage === 'TURNAROUND_DISTRESS') {
      focusAreas = ['Reestruturação de passivos', 'Redução drástica de despesas operacionais', 'Controle rígido do fluxo de caixa diário'];
      blockedRecommendations = ['Expansão física ou Capex imobiliário', 'Investimento agressivo em novas frentes comerciais', 'Estoque de antecipação'];
    } else if (businessStage === 'FIRST_OPERATIONAL_YEAR') {
      focusAreas = ['Definição do ponto de equilíbrio (Break-even)', 'Validação de Unit Economics', 'Preservação de caixa mínimo'];
      blockedRecommendations = ['Distribuição de lucros ou dividendos', 'Financiamento bancário de longo prazo estruturado'];
    } else if (businessStage === 'GROWTH_STAGE' || businessStage === 'SCALE_STAGE') {
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

    return {
      businessStage,
      economicModel,
      historicalDensity,
      liabilityProfile,
      operationalProfile,
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
      }
    };
  }
}
