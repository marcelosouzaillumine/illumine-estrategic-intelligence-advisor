import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';

export interface PatrimonialScoreBreakdown {
  liquidityScore: number | null;
  liquidityCriticalRiskDriver?: boolean;
  workingCapitalScore: number | null;
  capitalStructureScore: number | null;
  assetImmobilizationScore: number | null;
  globalScore: number | null;
  rationale: string;
  confidence: number;
  lineageHash: string;
  sourceRuntime: string;
}

export class PatrimonialScoreExplainabilityEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  private static WEIGHTS = {
    liquidity: 0.30,
    workingCapital: 0.25,
    capitalStructure: 0.30,
    assetImmobilization: 0.15
  };

  private static mapSeverityToScore(severity: string): number {
    switch (severity) {
      case 'HEALTHY': return 100;
      case 'CAPITAL_IDLE_WARNING': return 80;
      case 'POSITIVE_TREASURY': return 100;
      case 'ATTENTION': return 50;
      case 'CRITICAL': return 0;
      case 'TREASURY_STRESS': return 0;
      case 'SHORT_TERM_PRESSURE': return 0;
      default: return 50; // NEUTRAL fallback
    }
  }

  private static calculateFamilyScore(indicators: PatrimonialIndicator[], family: string): number | null {
    const familyInds = indicators.filter(i => i.family === family && i.value !== 'INSUFFICIENT_DATA');
    if (familyInds.length === 0) return null;

    const total = familyInds.reduce((sum, ind) => sum + this.mapSeverityToScore(ind.severity), 0);
    return Math.round(total / familyInds.length);
  }

  public static calculateScore(indicators: PatrimonialIndicator[]): PatrimonialScoreBreakdown {
    const liquidityScore = this.calculateFamilyScore(indicators, 'Liquidez');
    const workingCapitalScore = this.calculateFamilyScore(indicators, 'Capital de Giro');
    const capitalStructureScore = this.calculateFamilyScore(indicators, 'Estrutura de Capital');
    const assetImmobilizationScore = this.calculateFamilyScore(indicators, 'Imobilização');

    let globalScore = null;
    let effectiveWeight = 0;
    let scoreSum = 0;

    if (liquidityScore !== null) { scoreSum += liquidityScore * this.WEIGHTS.liquidity; effectiveWeight += this.WEIGHTS.liquidity; }
    if (workingCapitalScore !== null) { scoreSum += workingCapitalScore * this.WEIGHTS.workingCapital; effectiveWeight += this.WEIGHTS.workingCapital; }
    if (capitalStructureScore !== null) { scoreSum += capitalStructureScore * this.WEIGHTS.capitalStructure; effectiveWeight += this.WEIGHTS.capitalStructure; }
    if (assetImmobilizationScore !== null) { scoreSum += assetImmobilizationScore * this.WEIGHTS.assetImmobilization; effectiveWeight += this.WEIGHTS.assetImmobilization; }

    if (effectiveWeight > 0) {
      globalScore = Math.round(scoreSum / effectiveWeight);
    }

    const confidence = Math.round((effectiveWeight / 1.0) * 100);
    
    const liqSeca = indicators.find(i => i.metricName === 'Liquidez Seca')?.severity;
    const liqImediata = indicators.find(i => i.metricName === 'Liquidez Imediata')?.severity;
    const liquidityCriticalRiskDriver = liqSeca === 'CRITICAL' && liqImediata === 'CRITICAL';

    return {
      liquidityScore,
      liquidityCriticalRiskDriver,
      workingCapitalScore,
      capitalStructureScore,
      assetImmobilizationScore,
      globalScore,
      rationale: globalScore !== null 
        ? `Score Global calculado ponderando ${(effectiveWeight * 100).toFixed(0)}% da estrutura metodológica disponível.`
        : 'Score não pôde ser calculado por ausência de indicadores válidos.',
      confidence,
      lineageHash: 'PSEE-' + Date.now().toString(16).toUpperCase(),
      sourceRuntime: 'BP_RUNTIME'
    };
  }
}
