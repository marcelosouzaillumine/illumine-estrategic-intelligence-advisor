import { FinancialPositionScore, ScoreDimension, StructuralEvent } from '../../contracts/FinancialPositionScore';
import { IntelligenceDiagnosis } from '../../contracts/FinancialPositionIntelligenceContract';

const WEIGHTS = {
  liquidity: 0.25,
  solvencyAndCapitalStructure: 0.25,
  workingCapital: 0.20,
  assetQuality: 0.15,
  evolution: 0.15
};

export class FinancialPositionScoreEngine {
  static calculate(
    diagnosis: IntelligenceDiagnosis, 
    dataPeriods: number,
    historicalEvolution: any,
    metrics?: any // Raw metrics for advanced calculations
  ): FinancialPositionScore {
    
    // Confidence is proportional to data availability
    let confidence = 'LOW';
    if (dataPeriods >= 5) confidence = 'HIGH';
    else if (dataPeriods >= 3) confidence = 'MEDIUM';

    // Helper to map status to score
    const statusToScore = (status: string) => {
      switch (status) {
        case 'EXCELLENT': return 100;
        case 'STRONG': return 100;
        case 'GOOD': return 80;
        case 'NEUTRAL': return 80;
        case 'ATTENTION': return 60;
        case 'CRITICAL': return 20;
        default: return 70;
      }
    };

    const calculateDimension = (indicators: any[], defaultVal: number, title: string, weight: number): ScoreDimension => {
      if (!indicators || indicators.length === 0) {
        return {
          value: defaultVal,
          weight: weight,
          contribution: defaultVal * weight,
          interpretation: `Métricas de ${title.toLowerCase()} indisponíveis para cálculo preciso.`,
          evidence: { metrics: [] },
          confidence: 'LOW'
        };
      }
      
      // Filter out indicators that are NOT_APPLICABLE so they don't skew the score
      const applicableIndicators = indicators.filter(ind => ind.value !== 'NOT_APPLICABLE' && ind.classification !== 'NOT_APPLICABLE');
      const validCount = applicableIndicators.length;
      
      if (validCount === 0) {
          return {
            value: defaultVal,
            weight: weight,
            contribution: defaultVal * weight,
            interpretation: `Métricas de ${title.toLowerCase()} não aplicáveis à estrutura atual.`,
            evidence: { metrics: [] },
            confidence: 'LOW'
          };
      }

      const sum = applicableIndicators.reduce((acc, ind) => acc + statusToScore(ind.classification || ind.status), 0);
      const avg = Math.round(sum / validCount);
      
      let interpretation = `Posição apresenta capacidade robusta em ${title}.`;
      if (avg < 40) interpretation = `Indica exposição estrutural severa na capacidade de ${title}.`;
      else if (avg < 70) interpretation = `Vulnerabilidade moderada com pressão em ${title}.`;
      
      const contributingIndicators = applicableIndicators.map(ind => ({
        indicator: ind.name,
        value: ind.value,
        contribution: statusToScore(ind.classification || ind.status),
        traceability: ind.interpretation || ind.financialMeaning || 'Cálculo direto do indicador contábil.'
      }));

      return {
        value: avg,
        weight: weight,
        contribution: avg * weight,
        interpretation,
        evidence: { metrics: applicableIndicators.map(i => i.name) },
        contributingIndicators,
        confidence
      };
    };

    const liquidityScore = calculateDimension(diagnosis.liquidity, 70, 'Liquidez', WEIGHTS.liquidity);
    const solvencyAndCapitalStructureIndicators = [...(diagnosis.solvencyAndCapitalStructure || [])];
    const solvencyAndCapitalStructureScore = calculateDimension(solvencyAndCapitalStructureIndicators, 70, 'Solvência e Estrutura de Capital', WEIGHTS.solvencyAndCapitalStructure);
    const workingCapitalScore = calculateDimension(diagnosis.workingCapital, 70, 'Capital de Giro', WEIGHTS.workingCapital);
    const solidityScore = calculateDimension(diagnosis.assetQuality, 70, 'Qualidade do Ativo', WEIGHTS.assetQuality);
    
    // Evolution Score derived from historical trajectory
    let evolutionVal = 70;
    let evolutionInterpretation = 'Cobertura histórica insuficiente.';
    if (dataPeriods > 1) {
        evolutionInterpretation = 'Evolução neutra ou estável.';
        if (historicalEvolution?.items?.[0]?.trajectory?.classification === 'strengthening') {
          evolutionVal = 95;
          evolutionInterpretation = 'Forte evolução positiva na estrutura.';
        } else if (historicalEvolution?.items?.[0]?.trajectory?.classification === 'deteriorating') {
          evolutionVal = 30;
          evolutionInterpretation = 'Indicador demonstra deterioração e consumo de capital.';
        } else if (historicalEvolution?.items?.[0]?.trajectory?.classification === 'volatile') {
          evolutionVal = 50;
          evolutionInterpretation = 'Indicador demonstra volatilidade.';
        }
    } else {
        evolutionVal = 50; // Neutral fallback when no history
    }

    const evolutionScore: ScoreDimension = {
      value: evolutionVal,
      weight: WEIGHTS.evolution,
      contribution: evolutionVal * WEIGHTS.evolution,
      interpretation: evolutionInterpretation,
      evidence: { metrics: ['Variação do Patrimônio Líquido (Série Histórica)'] },
      confidence: dataPeriods > 1 ? confidence : 'LOW'
    };

    // Calculate overall using defined weights
    const overallValue = 
      liquidityScore.contribution +
      solvencyAndCapitalStructureScore.contribution +
      workingCapitalScore.contribution +
      solidityScore.contribution +
      evolutionScore.contribution;

    const mathScore = Math.round(overallValue);
    let finalClassification = mathScore >= 80 ? 'STRONG' : (mathScore <= 50 ? 'CRITICAL' : 'ATTENTION');
    let finalStatus = finalClassification;
    
    // Structural Overrides
    const structuralEvents: StructuralEvent[] = [];
    
    // Check for Negative Equity
    const hasNegativeEquity = solvencyAndCapitalStructureIndicators.some(
        ind => ind.code === 'equity_ratio' && (ind.value === 'NOT_APPLICABLE' || Number(ind.value) < 0 || ind.classification === 'CRITICAL' && String(ind.observation || '').includes('Negativo'))
    ) || metrics?.equity?.value < 0;

    if (hasNegativeEquity) {
        structuralEvents.push({
            type: 'NEGATIVE_EQUITY',
            severity: 'CRITICAL',
            impact: 'Status executivo forçado para CRITICAL por patrimônio líquido negativo.',
            evidence: 'O Passivo Total excede o valor dos Ativos, caracterizando passivo a descoberto.'
        });
        finalStatus = 'CRITICAL';
    }

    // Optional trend based on evolution
    let evolutionObj: any = undefined;
    if (dataPeriods > 1) {
      evolutionObj = {
        value: evolutionScore.value,
        trend: evolutionScore.value >= 80 ? 'POSITIVE' : (evolutionScore.value <= 40 ? 'NEGATIVE' : 'STABLE')
      };
    }

    return {
      overall: {
        value: mathScore,
        classification: finalClassification, // Mathematical classification
        finalStatus: finalStatus, // Overriden status
        confidence: confidence,
        explanation: 'Avaliamos a capacidade financeira combinando liquidez, solvência e estrutura de capital, capital de giro, qualidade do ativo e evolução histórica.',
        structuralEvents,
        evolution: evolutionObj
      },
      dimensions: {
        liquidity: liquidityScore,
        solvencyAndCapitalStructure: solvencyAndCapitalStructureScore,
        workingCapital: workingCapitalScore,
        assetQuality: solidityScore,
        evolution: evolutionScore
      },
      methodology: {
        version: '1.4.15.7',
        calculatedAt: new Date().toISOString(),
        dataPeriods: dataPeriods,
        weights: WEIGHTS
      }
    };
  }
}
