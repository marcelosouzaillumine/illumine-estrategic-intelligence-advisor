// src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts

import { 
  BenchmarkAdvisoryResult, 
  AdvisoryInitiative, 
  BenchmarkAdvancementGap, 
  BenchmarkPosition, 
  BenchmarkTargetTier, 
  ESGIMScenario 
} from '../../../capabilities/runtime/esgim/esgimTypes';
import { benchmarkReadinessEngine } from './BenchmarkReadinessEngine';
import { benchmarkComparativeEngine } from './BenchmarkComparativeEngine';
import { esgimAssessmentEngine } from '../../../capabilities/runtime/esgim/ESGIMAssessmentEngine';
import { institutionalResilienceIndexEngine } from '../../../capabilities/runtime/esgim/InstitutionalResilienceIndexEngine';
import { decisionRegistryEngine } from '../../../capabilities/runtime/execution/DecisionRegistryEngine';
import { governanceKnowledgeEngine } from '../knowledge/GovernanceKnowledgeEngine';
import { BenchmarkCohortRepository } from './BenchmarkCohortRepository';

export class BenchmarkAdvisoryEngine {
  private static instance: BenchmarkAdvisoryEngine;

  public static getInstance(): BenchmarkAdvisoryEngine {
    if (!BenchmarkAdvisoryEngine.instance) {
      BenchmarkAdvisoryEngine.instance = new BenchmarkAdvisoryEngine();
    }
    return BenchmarkAdvisoryEngine.instance;
  }

  /**
   * Generates benchmark advancement advisory recommendations.
   */
  public evaluateAdvisory(
    clientId: string,
    mode: string = 'DEMO_SCENARIO',
    scenario: ESGIMScenario = 'STANDARD'
  ): BenchmarkAdvisoryResult {
    const lineageHash = `LIN-BAI-${scenario}-${Date.now()}`;
    
    // 1. Fetch BRL/BCI Gateway results
    const readiness = benchmarkReadinessEngine.evaluateReadiness(clientId, scenario);
    const comparison = benchmarkComparativeEngine.calculateComparison(clientId, mode, scenario);

    // Initializing structure for blocked state
    const emptyResult = (reason: string): BenchmarkAdvisoryResult => ({
      apsScore: 0,
      currentPosition: 'BOTTOM_25',
      targetPosition: 'TOP_50',
      benchmarkReady: false,
      advancementGaps: [],
      initiatives: [],
      executiveSummary: `Recomendações suspensas. A holding não atende aos critérios da certificação de prontidão (BRL™). Motivo: ${reason}`,
      expectedAdvancementImpact: 'Nenhuma evolução projetada.',
      strengthsToProtect: [],
      weaknessesToImprove: [],
      roadmapRecommendations: readiness.requiredBeforeBenchmark || [],
      lineageHash,
      advisoryConfidenceScore: 0,
      confidenceDrivers: [],
      confidenceWarnings: ['Benchmark Advisory blocked due to BRL gate restriction.'],
      advisoryLimitations: [
        'Este roadmap representa recomendação fiduciária metodológica.',
        'Não substitui decisão de conselho, parecer jurídico, auditoria independente ou avaliação de investimentos.'
      ]
    });

    if (readiness.certificationStatus === 'NOT_CERTIFIED') {
      return emptyResult(readiness.benchmarkBlockedReason || 'Maturidade ou qualidade de dados insuficiente.');
    }

    // 2. Fetch scores for calculations
    const esgimScore = esgimAssessmentEngine.calculateAssessment(clientId, 'DEMO_SCENARIO', scenario).overallScore;
    const iriScore = institutionalResilienceIndexEngine.calculateResilience(clientId, 'DEMO_SCENARIO', scenario).score;
    const paiScore = governanceKnowledgeEngine.calculatePAI(clientId, scenario).score;
    const geiScore = decisionRegistryEngine.calculateGeiWeightedScore(scenario);
    const briScore = readiness.score;

    // 3. Calculate APS™ (Advancement Potential Score)
    // Formula: Weighted capacity index
    const rawAPS = Math.round(
      (briScore * 0.40) + 
      (geiScore * 0.30) + 
      (iriScore * 0.20) + 
      (esgimScore * 0.10)
    );

    let apsScore = rawAPS;
    if (scenario === 'CONSTITUTIONAL_BREACH') {
      apsScore = Math.min(apsScore, 30);
    } else if (scenario === 'LIQUIDITY_SHOCK') {
      apsScore = Math.min(apsScore, 45);
    } else if (scenario === 'MISSION_STRESS') {
      apsScore = Math.min(apsScore, 58);
    } else if (scenario === 'FOUNDER_EXIT' || scenario === 'MARKET_DISRUPTION') {
      apsScore = Math.min(apsScore, 85);
    }

    // 4. Calculate ACS™ (Advisory Confidence Score) & Drivers
    let advisoryConfidenceScore = 90;
    const confidenceDrivers: string[] = ['BRL Certificado', 'Dados fiduciários íntegros', 'Linhagem de processo intacta'];
    const confidenceWarnings: string[] = [];
    const advisoryLimitations = [
      'Este roadmap representa recomendação fiduciária metodológica baseada no cohort referenciado.',
      'Não substitui decisão soberana de conselho, parecer jurídico corporativo, auditoria independente ou avaliação estratégica de investimentos.'
    ];

    if (readiness.certificationStatus === 'CONDITIONALLY_CERTIFIED') {
      advisoryConfidenceScore = 65;
      confidenceDrivers.shift(); // Remove certified driver
      confidenceDrivers.push('BRL Certificado Condicionalmente');
      confidenceWarnings.push('Prontidão institucional contendo gaps moderados.');
    }

    // Deduct for synthetic cohort reference
    advisoryConfidenceScore -= 5;
    confidenceWarnings.push('Utilizando cohort sintético de referência (SYNTHETIC_COHORT).');

    // 5. Target Position matching
    const currentPosition = comparison.benchmarkPosition;
    let targetPosition: BenchmarkTargetTier = 'TOP_25';
    if (comparison.bpsScore >= 80) {
      targetPosition = 'TOP_10';
    } else if (comparison.bpsScore >= 65) {
      targetPosition = 'TOP_25';
    } else {
      targetPosition = 'TOP_50';
    }

    // 6. Gaps mapping
    const cohortId = scenario === 'MISSION_STRESS' ? 'BAM_ORGANIZATION' : 'HOLDING_GROUP';
    const cohort = BenchmarkCohortRepository.getCohort(cohortId)!;

    const advancementGaps: BenchmarkAdvancementGap[] = [
      {
        metric: 'Maturidade ESGIM™',
        currentValue: esgimScore,
        nextTierTarget: cohort.benchmarkESGIM,
        leaderTarget: 90,
        improvementRequired: Math.max(0, cohort.benchmarkESGIM - esgimScore)
      },
      {
        metric: 'Resiliência IRI™',
        currentValue: iriScore,
        nextTierTarget: cohort.benchmarkIRI,
        leaderTarget: 88,
        improvementRequired: Math.max(0, cohort.benchmarkIRI - iriScore)
      },
      {
        metric: 'Princípios PAI™',
        currentValue: paiScore,
        nextTierTarget: cohort.benchmarkPAI,
        leaderTarget: 92,
        improvementRequired: Math.max(0, cohort.benchmarkPAI - paiScore)
      },
      {
        metric: 'Execução GEI™',
        currentValue: geiScore,
        nextTierTarget: cohort.benchmarkGEI,
        leaderTarget: 85,
        improvementRequired: Math.max(0, cohort.benchmarkGEI - geiScore)
      },
      {
        metric: 'Prontidão BRI™',
        currentValue: briScore,
        nextTierTarget: cohort.benchmarkBRI,
        leaderTarget: 90,
        improvementRequired: Math.max(0, cohort.benchmarkBRI - briScore)
      }
    ];

    // 7. Initiative Builder (Top 5 initiatives)
    const initiatives: AdvisoryInitiative[] = [];

    // Standard initiatives list
    let init1: AdvisoryInitiative = {
      id: 'ADV-01',
      title: 'Formalizar periodicidade de reuniões ordinárias de board',
      category: 'GOVERNANCE',
      currentScore: geiScore,
      targetScore: Math.min(100, geiScore + 10),
      expectedImpact: 4,
      difficulty: 'LOW',
      horizon: 'SHORT_TERM',
      rationale: 'Quick win que eleva a disciplina periódica e formalidade decisória.',
      initiativeType: 'QUICK_WIN',
      simulatedBpsImpact: 4,
      simulatedTargetPosition: currentPosition
    };

    let init2: AdvisoryInitiative = {
      id: 'ADV-02',
      title: 'Aprovar e homologar regimento de alçadas estatutárias',
      category: 'FIDUCIARY',
      currentScore: esgimScore,
      targetScore: Math.min(100, esgimScore + 12),
      expectedImpact: 6,
      difficulty: 'MODERATE',
      horizon: 'MEDIUM_TERM',
      rationale: 'Fortalece os limites de caixa, segregando aprovação executiva de decisões colegiadas.',
      initiativeType: 'FOUNDATIONAL',
      simulatedBpsImpact: 6,
      simulatedTargetPosition: currentPosition
    };

    let init3: AdvisoryInitiative = {
      id: 'ADV-03',
      title: 'Instituir planejamento sucessório e regimento de transição de conselheiros',
      category: 'INSTITUTIONAL',
      currentScore: paiScore,
      targetScore: Math.min(100, paiScore + 15),
      expectedImpact: 8,
      difficulty: 'HIGH',
      horizon: 'LONG_TERM',
      rationale: 'Mitiga pontos de dependência de fundadores chave, blindando a perenidade do legado.',
      initiativeType: 'TRANSFORMATIONAL',
      simulatedBpsImpact: 8,
      simulatedTargetPosition: currentPosition
    };

    let init4: AdvisoryInitiative = {
      id: 'ADV-04',
      title: 'Reforçar trilha de auditoria e reconciliação dos registros de caixa',
      category: 'EXECUTION',
      currentScore: briScore,
      targetScore: Math.min(100, briScore + 10),
      expectedImpact: 5,
      difficulty: 'LOW',
      horizon: 'SHORT_TERM',
      rationale: 'Eleva a acurácia fiduciária e robustece a prontidão contra fraudes e erros.',
      initiativeType: 'QUICK_WIN',
      simulatedBpsImpact: 5,
      simulatedTargetPosition: currentPosition
    };

    let init5: AdvisoryInitiative = {
      id: 'ADV-05',
      title: 'Aprovar manual de conformidade e integridade socioambiental',
      category: 'MISSION',
      currentScore: esgimScore,
      targetScore: Math.min(100, esgimScore + 8),
      expectedImpact: 4,
      difficulty: 'MODERATE',
      horizon: 'MEDIUM_TERM',
      rationale: 'Alinha as operações produtivas aos critérios institucionais de conformidade ativa.',
      initiativeType: 'FOUNDATIONAL',
      simulatedBpsImpact: 4,
      simulatedTargetPosition: currentPosition
    };

    // Scenario Customization
    if (scenario === 'FOUNDER_EXIT') {
      // Prioritize succession
      init3.title = 'Acelerar a transição operacional do fundador e formalizar conselho familiar';
      init3.difficulty = 'HIGH';
      init3.expectedImpact = 12;
      init3.simulatedBpsImpact = 12;
      init3.rationale = 'Ação mandatória emergencial em contextos de saída de fundadores para conter riscos de legado.';
    } else if (scenario === 'MARKET_DISRUPTION') {
      // Prioritize adaptiveness
      init2.title = 'Implantar programa de modernização tecnológica e disrupção de portfólio';
      init2.category = 'GOVERNANCE';
      init2.expectedImpact = 10;
      init2.simulatedBpsImpact = 10;
      init2.rationale = 'Indispensável para conter a obsolescência sob contextos de disrupção mercadológica.';
    }

    initiatives.push(init1, init2, init3, init4, init5);

    // Calculate simulated BPS impact
    const totalImpact = initiatives.reduce((sum, init) => sum + init.simulatedBpsImpact, 0);
    const simulatedBps = Math.min(100, comparison.bpsScore + totalImpact);
    
    let simulatedTargetPosition: BenchmarkPosition = 'BOTTOM_25';
    if (simulatedBps >= 90) simulatedTargetPosition = 'TOP_10';
    else if (simulatedBps >= 80) simulatedTargetPosition = 'TOP_25';
    else if (simulatedBps >= 65) simulatedTargetPosition = 'TOP_50';
    else if (simulatedBps >= 50) simulatedTargetPosition = 'BOTTOM_50';

    // Set simulated values back to initiatives
    initiatives.forEach(init => {
      init.simulatedTargetPosition = simulatedTargetPosition;
    });

    const expectedAdvancementImpact = `Se todas as 5 iniciativas recomendadas forem executadas com sucesso, projeta-se um incremento de +${totalImpact} pontos no BPS™, elevando a classificação comparativa de ${currentPosition.replace('_', ' ')} para ${simulatedTargetPosition.replace('_', ' ')} em até 12 meses.`;

    const strengthsToProtect = [
      'Manter e expandir a disciplina de prestação de contas periódicas.',
      'Proteger a acurácia dos dados estruturados do DFC.'
    ];

    const weaknessesToImprove = [
      'Reduzir a dependência de assinaturas individuais para aportes financeiros.',
      'Superar a morosidade na implementação das resoluções deliberadas pelo Board.'
    ];

    const roadmapRecommendations = [
      'Homologar o cronograma de implantação do BRL™ no comitê consultivo.',
      'Iniciar a execução imediata das iniciativas do tipo Quick Win.'
    ];

    const executiveSummary = `A holding possui capacidade de evolução estimada em APS™ ${apsScore}/100. Com um índice de confiança ACS™ de ${advisoryConfidenceScore}/100, o sistema recomenda 5 iniciativas estruturadas para transicionar de ${currentPosition.replace('_', ' ')} rumo a ${targetPosition.replace('_', ' ')}.`;

    return {
      apsScore,
      currentPosition,
      targetPosition,
      benchmarkReady: true,
      advancementGaps,
      initiatives,
      executiveSummary,
      expectedAdvancementImpact,
      strengthsToProtect,
      weaknessesToImprove,
      roadmapRecommendations,
      lineageHash,
      advisoryConfidenceScore,
      confidenceDrivers,
      confidenceWarnings,
      advisoryLimitations
    };
  }
}

export const benchmarkAdvisoryEngine = BenchmarkAdvisoryEngine.getInstance();
