// src/core/runtime/learning/GovernanceLearningEngine.ts

import { 
  GovernanceLearningResult, 
  LearningObservation, 
  ESGIMScenario, 
  ESGIMMode 
} from '../../../capabilities/runtime/esgim/esgimTypes';
import { esgimAssessmentEngine } from '../../../capabilities/runtime/esgim/ESGIMAssessmentEngine';
import { institutionalResilienceIndexEngine } from '../../../capabilities/runtime/esgim/InstitutionalResilienceIndexEngine';
import { boardPrioritiesEngine } from '../../../capabilities/financial/runtime/board/BoardPrioritiesEngine';
import { governanceRoadmapEngine } from '../roadmap/GovernanceRoadmapEngine';
import { governanceMonitoringEngine } from '../monitoring/GovernanceMonitoringEngine';
import { decisionRegistryEngine } from '../../../capabilities/runtime/execution/DecisionRegistryEngine';
import { benchmarkComparativeEngine } from '../benchmark/BenchmarkComparativeEngine';
import { benchmarkAdvisoryEngine } from '../benchmark/BenchmarkAdvisoryEngine';
import { benchmarkReadinessEngine } from '../benchmark/BenchmarkReadinessEngine';

export class GovernanceLearningEngine {
  private static instance: GovernanceLearningEngine;

  public static getInstance(): GovernanceLearningEngine {
    if (!GovernanceLearningEngine.instance) {
      GovernanceLearningEngine.instance = new GovernanceLearningEngine();
    }
    return GovernanceLearningEngine.instance;
  }

  /**
   * Evaluates outcomes and generates institutional learning insights.
   * Closed-loop read-only analyser respecting historical immutability.
   */
  public calculateLearning(
    clientId: string,
    mode: ESGIMMode = 'DEMO_SCENARIO',
    scenario: ESGIMScenario = 'STANDARD'
  ): GovernanceLearningResult {
    const lineageHash = `LIN-GLL-${scenario}-${Date.now()}`;

    // 1. Fetch BRL Gateway to verify eligibility
    const readiness = benchmarkReadinessEngine.evaluateReadiness(clientId, scenario);
    
    // Initializing structure for blocked state
    const emptyResult = (reason: string): GovernanceLearningResult => ({
      gliScore: 0,
      learningMaturity: 'CRITICAL',
      observations: [],
      institutionalStrengths: [],
      recurringFailures: ['Governance Learning loop suspended due to lack of certified fiduciarily execution.'],
      executiveSummary: `Aprendizado suspenso. A holding não atende aos critérios do BRL™ para fechar a malha de controle. Motivo: ${reason}`,
      lineageHash,
      aaiScore: 0,
      aaiLevel: 'WEAK_PREDICTIVE_ACCURACY',
      feedbackMode: 'SIMULATED_FEEDBACK'
    });

    if (readiness.certificationStatus === 'NOT_CERTIFIED') {
      return emptyResult(readiness.benchmarkBlockedReason || 'Maturidade ou consistência de dados insuficiente.');
    }

    // 2. Fetch scores from execution engines
    const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);
    const roadmap = governanceRoadmapEngine.generateRoadmap(clientId, mode, scenario);
    const roadmapProgress = roadmap.roadmapProgress ?? 75;
    const comparison = benchmarkComparativeEngine.calculateComparison(clientId, mode, scenario);
    const bpsScore = comparison.bpsScore;
    
    const monitoring = governanceMonitoringEngine.calculateMonitoring(clientId, mode, scenario);
    const pei = monitoring.snapshots?.[3]?.priorityExecutionIndex ?? 70;

    // 3. Compute GLI (Governance Learning Index)
    // Formula: 40% GEI + 25% GRE Progress + 20% BPS Benchmark + 15% GML Stability
    const rawGLI = Math.round(
      (geiWeighted * 0.40) + 
      (roadmapProgress * 0.25) + 
      (bpsScore * 0.20) + 
      (pei * 0.15)
    );

    let gliScore = rawGLI;
    if (scenario === 'CONSTITUTIONAL_BREACH') {
      gliScore = Math.min(gliScore, 20);
    } else if (scenario === 'LIQUIDITY_SHOCK') {
      gliScore = Math.min(gliScore, 30);
    } else if (scenario === 'MISSION_STRESS') {
      gliScore = Math.min(gliScore, 55);
    } else if (scenario === 'FOUNDER_EXIT' || scenario === 'MARKET_DISRUPTION') {
      gliScore = Math.min(gliScore, 80);
    }

    let learningMaturity: "HIGH" | "MODERATE" | "LOW" | "CRITICAL" = 'MODERATE';
    if (gliScore >= 80) learningMaturity = 'HIGH';
    else if (gliScore >= 60) learningMaturity = 'MODERATE';
    else if (gliScore >= 40) learningMaturity = 'LOW';
    else learningMaturity = 'CRITICAL';

    // 4. Calculate AAI (Advisory Accuracy Index) & Level based on scenario
    let aaiScore = 93;
    let aaiLevel: "HIGHLY_ACCURATE" | "RELIABLE" | "NEEDS_CALIBRATION" | "WEAK_PREDICTIVE_ACCURACY" = "HIGHLY_ACCURATE";

    if (scenario === 'MISSION_STRESS') {
      aaiScore = 78;
      aaiLevel = 'RELIABLE';
    } else if (scenario === 'FOUNDER_EXIT') {
      aaiScore = 68;
      aaiLevel = 'NEEDS_CALIBRATION';
    } else if (scenario === 'MARKET_DISRUPTION') {
      aaiScore = 45;
      aaiLevel = 'WEAK_PREDICTIVE_ACCURACY';
    } else if (scenario === 'CONSTITUTIONAL_BREACH' || scenario === 'LIQUIDITY_SHOCK') {
      aaiScore = 0;
      aaiLevel = 'WEAK_PREDICTIVE_ACCURACY';
    }

    // 5. Build Observations
    const observations: LearningObservation[] = [];

    // Observation 1: Stat Limits (GDTL / BPE)
    observations.push({
      id: 'OBS-01',
      title: 'Aprovar e homologar regimento de alçadas estatutárias',
      source: 'GDTL',
      expectedOutcome: 'Segregação de assinaturas individuais para aportes e mitigação de person-key risk.',
      actualOutcome: 'Alçadas financeiras implementadas com fluxos de aprovação colegiada redundantes.',
      effectivenessScore: scenario === 'CONSTITUTIONAL_BREACH' ? 20 : 90,
      status: scenario === 'CONSTITUTIONAL_BREACH' ? 'FAILED' : 'ACHIEVED',
      lessonsLearned: ['A governança de alçadas de caixa mitigou transações individuais de alto valor sem validação dupla.'],
      recommendations: ['Homologar limites para todas as subsidiárias operacionais.'],
      expectedImpact: 6,
      actualImpact: scenario === 'CONSTITUTIONAL_BREACH' ? 1 : 6,
      variance: scenario === 'CONSTITUTIONAL_BREACH' ? 5 : 0
    });

    // Observation 2: BRL Roadmap foundations (GRE)
    observations.push({
      id: 'OBS-02',
      title: 'Estruturação de Fundamentos BRL™ (PH-01)',
      source: 'GRE',
      expectedOutcome: 'Conclusão das auditorias de consistência fiduciária e estruturação dos dados históricos.',
      actualOutcome: 'Auditorias internas fiduciárias finalizadas com conformidade regulatória integral.',
      effectivenessScore: 95,
      status: 'ACHIEVED',
      lessonsLearned: ['A formalização das trilhas reduziu a latência no processamento e análise dos relatórios de DFC.'],
      recommendations: ['Iniciar a integração com sistemas de validação fiduciária automáticos.']
    });

    // Observation 3: Cash resilience (BAI)
    observations.push({
      id: 'OBS-03',
      title: 'Reforçar trilha de auditoria e reconciliação (ADV-04)',
      source: 'BAI',
      expectedOutcome: 'Acurácia máxima nas reconciliações de fluxo de caixa e redução do aging de pendências.',
      actualOutcome: 'Reconciliações concluídas e índice de pendências liquidadas reduzido.',
      effectivenessScore: 90,
      status: 'ACHIEVED',
      lessonsLearned: ['A auditoria rotineira diária eliminou ruídos e inconsistências fiduciárias históricas.'],
      recommendations: ['Promover trilhas automatizadas no ERP corporativo.'],
      expectedImpact: 5,
      actualImpact: 5,
      variance: 0
    });

    // Observation 4: Board periodicity (BOARD)
    observations.push({
      id: 'OBS-04',
      title: 'Formalizar periodicidade de reuniões ordinárias de board (ADV-01)',
      source: 'BOARD',
      expectedOutcome: 'Realização periódica e formal das deliberações ordinárias.',
      actualOutcome: 'Reuniões mensais instituídas com atas devidamente arquivadas.',
      effectivenessScore: 85,
      status: 'ACHIEVED',
      lessonsLearned: ['A constância periódica no board elevou a velocidade de execução de resoluções complexas.'],
      recommendations: ['Digitalizar fluxo de assinaturas de ata para aprovação em até 48 horas.'],
      expectedImpact: 4,
      actualImpact: 4,
      variance: 0
    });

    // Observation 5: Custom Scenario observation
    if (scenario === 'FOUNDER_EXIT') {
      observations.push({
        id: 'OBS-05',
        title: 'Planejamento Sucessório de Liderança (ADV-03)',
        source: 'BAI',
        expectedOutcome: 'Instituir planejamento sucessório e regimento de transição sucessória.',
        actualOutcome: 'Iniciativas sucessórias permanecem em atraso acumulado pelo quarto ciclo consecutivo.',
        effectivenessScore: 20,
        status: 'FAILED',
        lessonsLearned: ['A ausência de comissão sucessória do fundador trava a transição profissional.'],
        recommendations: ['Instituir mediação consultiva externa para mediar conflitos de sucessão imediata.'],
        expectedImpact: 12,
        actualImpact: 2,
        variance: 10
      });
    } else if (scenario === 'MARKET_DISRUPTION') {
      observations.push({
        id: 'OBS-05',
        title: 'Inovação e Modernização de Portfólio (ADV-02)',
        source: 'BAI',
        expectedOutcome: 'Acelerar modernização tecnológica de processos essenciais.',
        actualOutcome: 'Implementação tecnológica ágil superando as metas de produtividade.',
        effectivenessScore: 95,
        status: 'EXCEEDED',
        lessonsLearned: ['A contratação ágil de recursos técnicos minimizou riscos concorrenciais externos.'],
        recommendations: ['Formalizar o comitê permanente de tecnologia e disrupção.'],
        expectedImpact: 10,
        actualImpact: 12,
        variance: -2
      });
    } else {
      observations.push({
        id: 'OBS-05',
        title: 'Aprovar manual de conformidade e integridade socioambiental (ADV-05)',
        source: 'BAI',
        expectedOutcome: 'Alinhamento corporativo completo aos critérios socioambientais.',
        actualOutcome: 'Manual aprovado e homologado com treinamento piloto aplicado.',
        effectivenessScore: 80,
        status: 'ACHIEVED',
        lessonsLearned: ['A sensibilização da média gerência facilitou a adesão prática das normativas ambientais.'],
        recommendations: ['Agendar a primeira auditoria externa de verificação independente.'],
        expectedImpact: 4,
        actualImpact: 4,
        variance: 0
      });
    }

    // 6. Capabilities & Weaknesses
    let institutionalStrengths: string[] = ['Colegialidade Ativa', 'Consistência de Dados Fiduciários'];
    let recurringFailures: string[] = [];

    if (scenario === 'FOUNDER_EXIT') {
      recurringFailures = ['Leadership Transition (Planejamento sucessório pendente há 4 ciclos)'];
    } else if (scenario === 'MARKET_DISRUPTION') {
      institutionalStrengths.push('Inovação e Adaptação Digital');
    } else {
      // Repeated success in standard
      institutionalStrengths.push('Financial Discipline (Controle de caixa validado por 3 ciclos consecutivos)');
    }

    // 7. Executive Summary
    const executiveSummary = `A holding apresenta índice de aprendizado institucional GLI™ de ${gliScore}/100, classificando a maturidade de aprendizado como ${learningMaturity}. O índice de acurácia consultiva das projeções (AAI™) é de ${aaiScore}% (${aaiLevel.replace(/_/g, ' ')}), baseado em simulações de feedback fiduciário.`;

    return {
      gliScore,
      learningMaturity,
      observations,
      institutionalStrengths,
      recurringFailures,
      executiveSummary,
      lineageHash,
      aaiScore,
      aaiLevel,
      feedbackMode: 'SIMULATED_FEEDBACK'
    };
  }
}

export const governanceLearningEngine = GovernanceLearningEngine.getInstance();
