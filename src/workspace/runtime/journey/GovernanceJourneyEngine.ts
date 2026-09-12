// src/core/runtime/journey/GovernanceJourneyEngine.ts

import { 
  GovernanceJourneyResult, 
  GovernanceJourneyStep, 
  ESGIMScenario, 
  ESGIMMode 
} from '../../capabilities/runtime/esgim/esgimTypes';
import { esgimAssessmentEngine } from '../../capabilities/runtime/esgim/ESGIMAssessmentEngine';
import { institutionalResilienceIndexEngine } from '../../capabilities/runtime/esgim/InstitutionalResilienceIndexEngine';
import { boardPrioritiesEngine } from '../../capabilities/financial/runtime/board/BoardPrioritiesEngine';
import { governanceRoadmapEngine } from '../../core/runtime/roadmap/GovernanceRoadmapEngine';
import { governanceMonitoringEngine } from '../../core/runtime/monitoring/GovernanceMonitoringEngine';
import { decisionRegistryEngine } from '../../capabilities/runtime/execution/DecisionRegistryEngine';
import { governanceLearningEngine } from '../../core/runtime/learning/GovernanceLearningEngine';
import { benchmarkReadinessEngine } from '../../core/runtime/benchmark/BenchmarkReadinessEngine';
import { benchmarkComparativeEngine } from '../../core/runtime/benchmark/BenchmarkComparativeEngine';
import { benchmarkAdvisoryEngine } from '../../core/runtime/benchmark/BenchmarkAdvisoryEngine';

export class GovernanceJourneyEngine {
  private static instance: GovernanceJourneyEngine;

  public static getInstance(): GovernanceJourneyEngine {
    if (!GovernanceJourneyEngine.instance) {
      GovernanceJourneyEngine.instance = new GovernanceJourneyEngine();
    }
    return GovernanceJourneyEngine.instance;
  }

  /**
   * Generates a consolidated Executive Governance Journey (GJL™).
   * Read-only orchestrator consuming existing module diagnostics.
   */
  public generateJourney(
    clientId: string,
    mode: ESGIMMode = 'DEMO_SCENARIO',
    scenario: ESGIMScenario = 'STANDARD'
  ): GovernanceJourneyResult {
    const lineageHash = `LIN-GJL-${scenario}-${Date.now()}`;

    // 1. Load active data from underlying engines
    const esgim = esgimAssessmentEngine.calculateAssessment(clientId, mode, scenario);
    const iri = institutionalResilienceIndexEngine.calculateResilience(clientId, mode, scenario);
    const prioritiesData = boardPrioritiesEngine.generatePriorities(clientId, mode, scenario);
    const roadmap = governanceRoadmapEngine.generateRoadmap(clientId, mode, scenario);
    const monitoring = governanceMonitoringEngine.calculateMonitoring(clientId, mode, scenario);
    const learning = governanceLearningEngine.calculateLearning(clientId, mode, scenario);
    const readiness = benchmarkReadinessEngine.evaluateReadiness(clientId, scenario);

    // Dynamic resolution metrics
    const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);
    const overdueRate = decisionRegistryEngine.calculateOverdueRate(scenario);
    
    // 2. Calculate GJI consolidated score (Governance Journey Index)
    // Formula: 30% ESGIM + 30% IRI + 20% GEI (execution) + 20% GLI (learning)
    // If learning is suspended (GLI=0 due to NOT_CERTIFIED BRL), recalibrate weights
    let gliVal = learning?.gliScore ?? 0;
    let gjiScore = 0;
    
    if (readiness.certificationStatus === 'NOT_CERTIFIED') {
      gjiScore = Math.round(
        (esgim.overallScore * 0.35) + 
        (iri.score * 0.35) + 
        (geiWeighted * 0.30)
      );
    } else {
      gjiScore = Math.round(
        (esgim.overallScore * 0.30) + 
        (iri.score * 0.30) + 
        (geiWeighted * 0.20) + 
        (gliVal * 0.20)
      );
    }

    // Cap GJI depending on scenario overrides
    if (scenario === 'CONSTITUTIONAL_BREACH') {
      gjiScore = Math.min(gjiScore, 38);
    } else if (scenario === 'LIQUIDITY_SHOCK') {
      gjiScore = Math.min(gjiScore, 24);
    } else if (scenario === 'MISSION_STRESS') {
      gjiScore = Math.min(gjiScore, 58);
    } else if (scenario === 'FOUNDER_EXIT' || scenario === 'MARKET_DISRUPTION') {
      gjiScore = Math.min(gjiScore, 78);
    }

    // Determine GJI Stage (Estágio da Jornada)
    let gjiStage = "GOVERNANÇA CONSOLIDADA";
    if (gjiScore >= 80) gjiStage = "GOVERNANÇA CONSOLIDADA";
    else if (gjiScore >= 65) gjiStage = "GOVERNANÇA EM CONSOLIDAÇÃO";
    else if (gjiScore >= 50) gjiStage = "ESTABILIDADE FIDUCIÁRIA";
    else if (gjiScore >= 35) gjiStage = "EM ESTRUTURAÇÃO";
    else gjiStage = "CRÍTICO / ALINHAMENTO URGENTE";

    // 3. Generate Scenario Board Narrative (Board Narrative Generator)
    let boardNarrative = "";
    switch (scenario) {
      case 'CONSTITUTIONAL_BREACH':
        boardNarrative = 
          "A organização enfrenta desvios críticos nas alçadas decisórias estatutárias, degradando a conformidade legal. " +
          "A inatividade temporária do comitê de ética no tratamento de sinalizações compromete o alinhamento constitucional. " +
          "A prioridade imediata consiste em suspender aprovações extraordinárias unilaterais e restaurar urgentemente as alçadas colegiadas do Board. " +
          "O foco para os próximos 90 dias concentra-se na auditoria extraordinária de conformidade e reconfiguração de tokens digitais.";
        break;

      case 'LIQUIDITY_SHOCK':
        boardNarrative = 
          "A holding sofre uma crise financeira aguda devido a um severo choque de liquidez operacional no ciclo imediato. " +
          "Com runway fiduciário inferior a 90 dias, a continuidade das operações corre risco de insolvência perante passivos imediatos. " +
          "O foco do conselho deve se concentrar em aportes imediatos de capital e interrupção de planos de expansão do roadmap. " +
          "Ações emergenciais e renegociações de custos fixos são cruciais para restaurar a integridade financeira corporativa.";
        break;

      case 'FOUNDER_EXIT':
        boardNarrative = 
          "A organização apresenta solidez fiduciária adequada no presente, mas a transição de ciclo está travada por dependência extrema da figura do fundador. " +
          "A ausência de regimentos de transição familiar e planejamento sucessório formalizado bloqueia a certificação de alta resiliência corporativa. " +
          "Recomenda-se aprovar imediatamente a constituição do comitê de sucessão familiar e formalizar rotinas chaves do fundador. " +
          "Profissionalizar cargos de liderança assegurará a perpetuidade do legado institucional sem atritos corporativos.";
        break;

      case 'MARKET_DISRUPTION':
        boardNarrative = 
          "Embora as operações financeiras estejam robustas no baseline atual, as métricas prospectivas indicam rigidez à disrupção tecnológica. " +
          "A ausência de competências digitais no board e canais de receita alternativos expõe a organização a obsolescência de mercado. " +
          "Exige-se a alocação imediata de orçamento para inovação de portfólio e workshops de reciclagem tecnológica de conselheiros. " +
          "Instituir um comitê assessor de novas tecnologias facilitará a adaptação mercadológica de médio ciclo.";
        break;

      case 'MISSION_STRESS':
        boardNarrative = 
          "Existe um desalinhamento missional ativo na holding, onde despesas operacionais administrativas estão drenando recursos do propósito social. " +
          "Essa priorização comercial de ciclo imediato gera conflitos éticos fiduciários e ameaça a reputação perante doadores e parceiros. " +
          "A governança recomenda realizar auditoria orçamentária extraordinária e readequar a alocação de caixa para a missão final. " +
          "Formalizar um comitê de preservação de legado blindará permanentemente a identidade existencial da marca.";
        break;

      case 'STANDARD':
      default:
        boardNarrative = 
          "A organização apresenta maturidade institucional elevada, porém enfrenta riscos relevantes de continuidade fiduciária. " +
          "Os mecanismos de governança encontram-se estruturados, mas a execução das prioridades estratégicas ainda apresenta " +
          "lacunas que limitam o avanço para o próximo quartil de benchmark. " +
          "O foco recomendado para os próximos 90 dias concentra-se na estabilização financeira, aceleração das iniciativas de " +
          "execução e fortalecimento da capacidade sucessória.";
        break;
    }

    // 4. Build individual steps with EAI (Executive Attention Index) calculation
    const steps: GovernanceJourneyStep[] = [];

    // Step 1: ONDE ESTAMOS?
    let s1Status: "HEALTHY" | "ATTENTION" | "CRITICAL" = "HEALTHY";
    if (esgim.overallScore < 50 || iri.score < 50) s1Status = "CRITICAL";
    else if (esgim.overallScore < 75 || iri.score < 75) s1Status = "ATTENTION";

    let s1Eai = 70;
    if (scenario === 'LIQUIDITY_SHOCK') s1Eai = 95;
    else if (scenario === 'MISSION_STRESS') s1Eai = 88;

    steps.push({
      id: 'step-01',
      title: 'Onde Estamos?',
      description: 'Qual é a condição atual da organização?',
      status: s1Status,
      primaryMetric: 'Maturidade & Resiliência',
      primaryValue: `Score: ${esgim.overallScore}/100 | IRI: ${iri.score}/100`,
      executiveSummary: `Maturidade operacional classificada como ${esgim.maturityLevel}. A resiliência de longo horizonte da holding está avaliada como nível ${iri.level.replace(/_/g, ' ')}.`,
      sourceModules: ['ESGIM™', 'IRI™'],
      actionRequired: s1Status !== 'HEALTHY' ? 'Revisar vulnerabilidades identificadas nos eixos institucionais.' : undefined,
      executiveAttentionScore: s1Eai
    });

    // Step 2: O QUE NOS AMEAÇA?
    let s2Status: "HEALTHY" | "ATTENTION" | "CRITICAL" = "HEALTHY";
    if (scenario === 'CONSTITUTIONAL_BREACH' || scenario === 'LIQUIDITY_SHOCK') s2Status = "CRITICAL";
    else if (scenario === 'FOUNDER_EXIT' || scenario === 'MARKET_DISRUPTION' || scenario === 'MISSION_STRESS') s2Status = "ATTENTION";

    let s2Eai = 60;
    if (scenario === 'LIQUIDITY_SHOCK') s2Eai = 99;
    else if (scenario === 'CONSTITUTIONAL_BREACH') s2Eai = 90;
    else if (scenario === 'FOUNDER_EXIT') s2Eai = 92;
    else if (scenario === 'MARKET_DISRUPTION') s2Eai = 88;
    else if (scenario === 'MISSION_STRESS') s2Eai = 85;

    const topRisk = prioritiesData.priorities[0]?.title || 'Risco de centralização de processos informais';

    steps.push({
      id: 'step-02',
      title: 'O Que Nos Ameaça?',
      description: 'O que pode comprometer a continuidade?',
      status: s2Status,
      primaryMetric: 'Risco Principal',
      primaryValue: prioritiesData.priorities.length > 0 ? `${prioritiesData.priorities.length} Exposições` : 'Sem riscos críticos',
      executiveSummary: `Ameaça prioritária: "${topRisk}". ${prioritiesData.priorities.length} focos de preocupação mapeados pela Constituição Cognitiva.`,
      sourceModules: ['BPE™', 'GML™'],
      actionRequired: 'Instaurar medidas mitigadoras imediatas listadas no registro de riscos.',
      executiveAttentionScore: s2Eai
    });

    // Step 3: O QUE DEVEMOS FAZER?
    let s3Status: "HEALTHY" | "ATTENTION" | "CRITICAL" = "HEALTHY";
    if (roadmap.roadmapRiskLevel === 'CRITICAL' || roadmap.roadmapRiskLevel === 'HIGH') s3Status = "CRITICAL";
    else if (roadmap.roadmapRiskLevel === 'MODERATE') s3Status = "ATTENTION";

    let s3Eai = 65;
    if (scenario === 'LIQUIDITY_SHOCK') s3Eai = 90;
    else if (scenario === 'MARKET_DISRUPTION') s3Eai = 82;
    else if (scenario === 'CONSTITUTIONAL_BREACH') s3Eai = 80;

    const quickWin = roadmap.quickWins[0] || 'Formalizar comitês decisórios';

    steps.push({
      id: 'step-03',
      title: 'O Que Devemos Fazer?',
      description: 'Qual é o plano recomendado?',
      status: s3Status,
      primaryMetric: 'Ação Recomendada',
      primaryValue: `Roadmap: ${roadmap.maturityStage}`,
      executiveSummary: `Fase ativa de evolução: ${roadmap.maturityStage}. Principal Quick Win recomendado: "${quickWin}" com execução em até 90 dias.`,
      sourceModules: ['GRE™', 'BAI™'],
      actionRequired: `Autorizar o início da iniciativa: "${quickWin}".`,
      executiveAttentionScore: s3Eai
    });

    // Step 4: QUEM É RESPONSÁVEL?
    let s4Status: "HEALTHY" | "ATTENTION" | "CRITICAL" = "HEALTHY";
    if (overdueRate > 30 || scenario === 'CONSTITUTIONAL_BREACH') s4Status = "CRITICAL";
    else if (overdueRate > 15) s4Status = "ATTENTION";

    let s4Eai = 55;
    if (scenario === 'CONSTITUTIONAL_BREACH') s4Eai = 98;
    else if (scenario === 'LIQUIDITY_SHOCK') s4Eai = 80;

    steps.push({
      id: 'step-04',
      title: 'Quem Está Executando?',
      description: 'Quem é responsável pelas pendências?',
      status: s4Status,
      primaryMetric: 'Execução fiduciária (GEI)',
      primaryValue: `${overdueRate}% em atraso`,
      executiveSummary: `Índice de resolutividade decisória: ${geiWeighted}%. Existem pendências ativas aguardando atribuição de responsabilidade fiduciária.`,
      sourceModules: ['GDTL™'],
      actionRequired: overdueRate > 0 ? 'Designar responsáveis e rever ciclos das deliberações em atraso.' : undefined,
      executiveAttentionScore: s4Eai
    });

    // Step 5: ESTAMOS EVOLUINDO?
    let s5Status: "HEALTHY" | "ATTENTION" | "CRITICAL" = "HEALTHY";
    if (monitoring.trend === 'DECLINING') s5Status = "CRITICAL";
    else if (monitoring.trend === 'STABLE') s5Status = "ATTENTION";

    let s5Eai = 50;
    if (scenario === 'LIQUIDITY_SHOCK') s5Eai = 75;
    else if (scenario === 'FOUNDER_EXIT') s5Eai = 70;

    steps.push({
      id: 'step-05',
      title: 'Estamos Evoluindo?',
      description: 'Estamos avançando ou regredindo?',
      status: s5Status,
      primaryMetric: 'Tendência',
      primaryValue: monitoring.trend === 'IMPROVING' ? 'EVOLUÇÃO POSITIVA' : monitoring.trend === 'DECLINING' ? 'REGRESSÃO / ALERTA' : 'ESTABILIDADE',
      executiveSummary: `Monitoramento longitudinal indica tendência ${monitoring.trend === 'IMPROVING' ? 'de melhoria' : monitoring.trend === 'DECLINING' ? 'de declínio' : 'estável'}. RPI de progresso geral em ${roadmap.roadmapProgress}%.`,
      sourceModules: ['GML™'],
      actionRequired: monitoring.trend === 'DECLINING' ? 'Reavaliar gargalos de implementação de governança.' : undefined,
      executiveAttentionScore: s5Eai
    });

    // Step 6: O QUE APRENDEMOS?
    let s6Status: "HEALTHY" | "ATTENTION" | "CRITICAL" = "HEALTHY";
    if (learning.learningMaturity === 'CRITICAL' || learning.learningMaturity === 'LOW') s6Status = "CRITICAL";
    else if (learning.learningMaturity === 'MODERATE') s6Status = "ATTENTION";

    let s6Eai = 45;
    if (scenario === 'LIQUIDITY_SHOCK') s6Eai = 65;
    else if (scenario === 'FOUNDER_EXIT') s6Eai = 65;

    steps.push({
      id: 'step-06',
      title: 'O Que Aprendemos?',
      description: 'O que funcionou nos ciclos anteriores?',
      status: s6Status,
      primaryMetric: 'Aprendizado (GLI)',
      primaryValue: `GLI: ${learning.gliScore}/100`,
      executiveSummary: `Acurácia preditiva de conselho (AAI) de ${learning.aaiScore}%. Fortalezas: ${learning.institutionalStrengths.slice(0, 2).join(', ') || 'Nenhuma'}.`,
      sourceModules: ['GLL™'],
      actionRequired: learning.recurringFailures.length > 0 ? `Corrigir obstáculo recorrente: "${learning.recurringFailures[0]}".` : undefined,
      executiveAttentionScore: s6Eai
    });

    // Step 7: COMO ESTAMOS COMPARADOS? (BRL Gate)
    let s7Status: "HEALTHY" | "ATTENTION" | "CRITICAL" = "HEALTHY";
    let s7Metric = 'Benchmark Cohort';
    let s7Value = '';
    let s7Summary = '';
    let s7Action = '';
    let s7Eai = 40;

    const comparison = benchmarkComparativeEngine.calculateComparison(clientId, mode, scenario);

    if (readiness.certificationStatus === 'NOT_CERTIFIED') {
      s7Status = 'CRITICAL';
      s7Value = 'BLOQUEADO';
      s7Summary = 'Benchmark Comparative Governance indisponível até que a certificação BRL™ seja obtida. Motivo: ' + (readiness.benchmarkBlockedReason || 'Consistência de dados insuficiente.');
      s7Action = 'Resolver exigências pendentes de prontidão institucional.';
      s7Eai = 85;
    } else {
      s7Value = comparison.benchmarkPosition.replace(/_/g, ' ');
      s7Summary = `Posicionamento cohort fiduciário classificado como ${s7Value}. Pontuação BPS geral de ${comparison.bpsScore}/100.`;
      if (readiness.certificationStatus === 'CONDITIONALLY_CERTIFIED') {
        s7Status = 'ATTENTION';
        s7Action = 'Comparação condicionada à melhoria de prontidão.';
      }
    }

    steps.push({
      id: 'step-07',
      title: 'Como Estamos Comparados?',
      description: 'Como estamos em relação às melhores organizações?',
      status: s7Status,
      primaryMetric: s7Metric,
      primaryValue: s7Value,
      executiveSummary: s7Summary,
      sourceModules: ['BRL™', 'BCI™'],
      actionRequired: s7Action || undefined,
      executiveAttentionScore: s7Eai
    });

    // Step 8: QUAL O PRÓXIMO NÍVEL? (BRL Gate)
    let s8Status: "HEALTHY" | "ATTENTION" | "CRITICAL" = "HEALTHY";
    let s8Metric = 'Alvo de Avanço';
    let s8Value = '';
    let s8Summary = '';
    let s8Action = '';
    let s8Eai = 35;

    const advisory = benchmarkAdvisoryEngine.evaluateAdvisory(clientId, mode, scenario);

    if (readiness.certificationStatus === 'NOT_CERTIFIED') {
      s8Status = 'CRITICAL';
      s8Value = 'BLOQUEADO';
      s8Summary = 'As projeções de avanço comparativo estão indisponíveis até que a certificação BRL™ seja obtida.';
      s8Action = 'Concluir conformidade cadastral e fiduciária exigida.';
      s8Eai = 80;
    } else {
      s8Value = advisory.targetPosition.replace(/_/g, ' ');
      s8Summary = `Caminho simulado de ascensão para o quadrante ${s8Value}. Advancement Potential Score (APS) de ${advisory.apsScore}/100.`,
      s8Action = advisory.initiatives[0] ? `Aprovar iniciativa de avanço: "${advisory.initiatives[0].title}".` : '';
      if (readiness.certificationStatus === 'CONDITIONALLY_CERTIFIED') {
        s8Status = 'ATTENTION';
      }
      if (scenario === 'MARKET_DISRUPTION') s8Eai = 90;
      else if (scenario === 'FOUNDER_EXIT') s8Eai = 88;
    }

    steps.push({
      id: 'step-08',
      title: 'Qual o Próximo Nível?',
      description: 'Qual é o próximo salto institucional?',
      status: s8Status,
      primaryMetric: s8Metric,
      primaryValue: s8Value,
      executiveSummary: s8Summary,
      sourceModules: ['BAI™'],
      actionRequired: s8Action || undefined,
      executiveAttentionScore: s8Eai
    });

    // 5. Determine Overall Status
    let overallStatus: "HEALTHY" | "ATTENTION" | "CRITICAL" = "HEALTHY";
    if (steps.some(s => s.status === 'CRITICAL')) overallStatus = 'CRITICAL';
    else if (steps.some(s => s.status === 'ATTENTION')) overallStatus = 'ATTENTION';

    return {
      overallStatus,
      currentJourneyStage: gjiStage,
      executiveNarrative: boardNarrative,
      steps,
      lineageHash,
      gjiScore,
      gjiStage,
      boardNarrative
    };
  }
}

export const governanceJourneyEngine = GovernanceJourneyEngine.getInstance();
