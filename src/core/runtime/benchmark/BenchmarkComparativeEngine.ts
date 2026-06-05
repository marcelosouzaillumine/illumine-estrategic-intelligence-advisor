// src/core/runtime/benchmark/BenchmarkComparativeEngine.ts

import { 
  BenchmarkComparativeResult, 
  BenchmarkPosition, 
  BenchmarkGap, 
  ComparativeDimension, 
  ESGIMScenario 
} from '../esgim/esgimTypes';
import { benchmarkReadinessEngine } from './BenchmarkReadinessEngine';
import { esgimAssessmentEngine } from '../esgim/ESGIMAssessmentEngine';
import { institutionalResilienceIndexEngine } from '../esgim/InstitutionalResilienceIndexEngine';
import { decisionRegistryEngine } from '../execution/DecisionRegistryEngine';
import { governanceKnowledgeEngine } from '../knowledge/GovernanceKnowledgeEngine';
import { BenchmarkCohortRepository, BenchmarkCohort } from './BenchmarkCohortRepository';

export class BenchmarkComparativeEngine {
  private static instance: BenchmarkComparativeEngine;

  public static getInstance(): BenchmarkComparativeEngine {
    if (!BenchmarkComparativeEngine.instance) {
      BenchmarkComparativeEngine.instance = new BenchmarkComparativeEngine();
    }
    return BenchmarkComparativeEngine.instance;
  }

  /**
   * Calculates the comparative positioning of the organization against a cohort.
   */
  public calculateComparison(
    clientId: string,
    mode: string = 'DEMO_SCENARIO',
    scenario: ESGIMScenario = 'STANDARD'
  ): BenchmarkComparativeResult {
    const lineageHash = `LIN-BCI-${scenario}-${Date.now()}`;
    
    // 1. Fetch Readiness Result (BRL™ Gateway)
    const readiness = benchmarkReadinessEngine.evaluateReadiness(clientId, scenario);
    
    // Initializing structure for blocked state
    const emptyResult = (reason: string): BenchmarkComparativeResult => ({
      bpsScore: 0,
      benchmarkPosition: 'BOTTOM_25',
      benchmarkEligible: false,
      cohortId: 'UNKNOWN',
      cohortName: 'Nenhum Cohort Ativo',
      cohortDataMode: 'SYNTHETIC_COHORT',
      comparativeDimensions: [],
      strengths: [],
      vulnerabilities: [],
      benchmarkGaps: [],
      executiveSummary: `Comparação bloqueada. A holding não atende aos critérios mínimos da certificação de prontidão de benchmark (BRL™). Motivo: ${reason}`,
      recommendations: readiness.requiredBeforeBenchmark || [],
      lineageHash,
      benchmarkLimitations: [
        'A análise comparativa BCI™ exige aprovação prévia do selo de prontidão BRL™.',
        'BCI™ v1.0 representa posicionamento comparativo contra cohorts sintéticos de referência, não verdades estatísticas absolutas de mercado.'
      ],
      advisoryWarnings: [
        'Acesso suspenso. A governança ou qualidade de dados atual impede comparações setoriais confiáveis.'
      ]
    });

    if (readiness.certificationStatus === 'NOT_CERTIFIED') {
      return emptyResult(readiness.benchmarkBlockedReason || 'Maturidade ou integridade de dados insuficiente.');
    }

    // 2. Select Certified Cohort Profile
    // If mission stress is active, select BAM profile to show values alignment, else general Holding
    const cohortId = scenario === 'MISSION_STRESS' ? 'BAM_ORGANIZATION' : 'HOLDING_GROUP';
    const cohort = BenchmarkCohortRepository.getCohort(cohortId)!;

    // 3. Fetch active scores for BPS calculation
    const esgimScore = esgimAssessmentEngine.calculateAssessment(clientId, 'DEMO_SCENARIO', scenario).overallScore;
    const iriScore = institutionalResilienceIndexEngine.calculateResilience(clientId, 'DEMO_SCENARIO', scenario).score;
    const paiScore = governanceKnowledgeEngine.calculatePAI(clientId, scenario).score;
    const geiScore = decisionRegistryEngine.calculateGeiWeightedScore(scenario);
    const briScore = readiness.score;

    // BPS™ Calculation Formula
    // ESGIM 25%, IRI 25%, PAI 20%, GEI 15%, BRI 15%
    const bpsScore = Math.round(
      (esgimScore * 0.25) +
      (iriScore * 0.25) +
      (paiScore * 0.20) +
      (geiScore * 0.15) +
      (briScore * 0.15)
    );

    // 4. Map BPS to relative BenchmarkPosition
    let benchmarkPosition: BenchmarkPosition = 'BOTTOM_25';
    if (bpsScore >= 90) {
      benchmarkPosition = 'TOP_10';
    } else if (bpsScore >= 80) {
      benchmarkPosition = 'TOP_25';
    } else if (bpsScore >= 65) {
      benchmarkPosition = 'TOP_50';
    } else if (bpsScore >= 50) {
      benchmarkPosition = 'BOTTOM_50';
    } else {
      benchmarkPosition = 'BOTTOM_25';
    }

    // 5. Dimension delta comparisons
    const dimensionsToMap = [
      { name: 'Maturidade ESGIM™', current: esgimScore, benchmark: cohort.benchmarkESGIM },
      { name: 'Resiliência IRI™', current: iriScore, benchmark: cohort.benchmarkIRI },
      { name: 'Princípios PAI™', current: paiScore, benchmark: cohort.benchmarkPAI },
      { name: 'Execução GEI™', current: geiScore, benchmark: cohort.benchmarkGEI },
      { name: 'Prontidão BRI™', current: briScore, benchmark: cohort.benchmarkBRI }
    ];

    const comparativeDimensions: ComparativeDimension[] = dimensionsToMap.map(d => {
      let dimPos: BenchmarkPosition = 'BOTTOM_25';
      if (d.current >= 90) dimPos = 'TOP_10';
      else if (d.current >= 80) dimPos = 'TOP_25';
      else if (d.current >= 65) dimPos = 'TOP_50';
      else if (d.current >= 50) dimPos = 'BOTTOM_50';

      return {
        dimension: d.name,
        currentScore: d.current,
        benchmarkScore: d.benchmark,
        delta: d.current - d.benchmark,
        position: dimPos
      };
    });

    // 6. Gap analysis against targets
    const benchmarkGaps: BenchmarkGap[] = [];
    const leaderTarget = 92;
    const nextQuartileTarget = 82;

    if (bpsScore < nextQuartileTarget) {
      benchmarkGaps.push({
        metric: 'Gap para Top 25%',
        currentScore: bpsScore,
        targetScore: nextQuartileTarget,
        gap: nextQuartileTarget - bpsScore
      });
    }

    if (bpsScore < leaderTarget) {
      benchmarkGaps.push({
        metric: 'Gap para Liderança (Top 10%)',
        currentScore: bpsScore,
        targetScore: leaderTarget,
        gap: leaderTarget - bpsScore
      });
    }

    // 7. Strengths, Vulnerabilities & Warnings
    const strengths: string[] = [];
    const vulnerabilities: string[] = [];
    const advisoryWarnings: string[] = [];
    const benchmarkLimitations: string[] = [
      'BCI™ v1.0 representa posicionamento comparativo contra cohorts sintéticos de referência, não verdades estatísticas de mercado.',
      'Os dados de referência baseiam-se em modelos teóricos estruturados de melhores práticas (SYNTHETIC_COHORT).'
    ];

    if (readiness.certificationStatus === 'CONDITIONALLY_CERTIFIED') {
      advisoryWarnings.push('Comparação condicionada à melhoria da prontidão institucional.');
    }

    // Scenario specific warnings
    if (scenario === 'MISSION_STRESS') {
      advisoryWarnings.push('Alinhamento de missão sob atenção. O cohort de BAM possui rigor estratégico diferenciado.');
    } else if (scenario === 'FOUNDER_EXIT') {
      advisoryWarnings.push('Cenário de transição de fundador ativo. Risco de descontinuidade processual mapeado.');
    }

    comparativeDimensions.forEach(cd => {
      if (cd.delta > 5) {
        strengths.push(`Desempenho em ${cd.dimension} supera a média do cohort em +${cd.delta} pontos.`);
      } else if (cd.delta < -5) {
        vulnerabilities.push(`Déficit em ${cd.dimension} em relação à média do cohort: delta de ${cd.delta} pontos.`);
      }
    });

    if (strengths.length === 0) {
      strengths.push('Desempenho alinhado com a média geral do cohort nas principais dimensões.');
    }
    if (vulnerabilities.length === 0) {
      vulnerabilities.push('Nenhum desvio crítico negativo identificado em relação às médias do cohort.');
    }

    // 8. Executive Narrative
    let executiveSummary = `A holding apresenta pontuação BPS™ de ${bpsScore}/100, posicionando-se no quadrante **${benchmarkPosition.replace('_', ' ')}** do cohort **${cohort.name}**. `;
    
    if (bpsScore >= 75) {
      executiveSummary += `O posicionamento indica maturidade comparativa saudável, com liderança em eixos fiduciários principais. `;
    } else {
      executiveSummary += `O posicionamento comparativo aponta necessidade de reforço em eixos estruturais de governança e dados. `;
    }

    if (benchmarkGaps.length > 0) {
      executiveSummary += `O gap estimado para atingir a zona de excelência (Top 25%) é de ${nextQuartileTarget - bpsScore} pontos.`;
    }

    const recommendations = [
      'Iniciar plano de ação preventivo no GDTL™ para as vulnerabilidades listadas.',
      'Revisar thresholds de controle interno com o Comitê de Auditoria.'
    ];

    if (scenario === 'MISSION_STRESS') {
      recommendations.push('Reestabelecer o fórum de mediação familiar para blindar a integridade fiduciária.');
    }

    return {
      bpsScore,
      benchmarkPosition,
      benchmarkEligible: true,
      cohortId: cohort.id,
      cohortName: cohort.name,
      cohortDataMode: 'SYNTHETIC_COHORT',
      comparativeDimensions,
      strengths,
      vulnerabilities,
      benchmarkGaps,
      executiveSummary,
      recommendations,
      lineageHash,
      benchmarkLimitations,
      advisoryWarnings
    };
  }
}

export const benchmarkComparativeEngine = BenchmarkComparativeEngine.getInstance();
