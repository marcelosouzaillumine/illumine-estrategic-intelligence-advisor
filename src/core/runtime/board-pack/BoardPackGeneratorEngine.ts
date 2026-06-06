// src/core/runtime/board-pack/BoardPackGeneratorEngine.ts

import { 
  BoardPack, 
  BoardPackSlide, 
  BoardPackSlideTemplate, 
  SlideMeetingCriticality, 
  RecommendedDecisionEntry, 
  ESGIMScenario, 
  ESGIMMode 
} from '../esgim/esgimTypes';
import { esgimAssessmentEngine } from '../esgim/ESGIMAssessmentEngine';
import { institutionalResilienceIndexEngine } from '../esgim/InstitutionalResilienceIndexEngine';
import { boardPrioritiesEngine } from '../board/BoardPrioritiesEngine';
import { governanceRoadmapEngine } from '../roadmap/GovernanceRoadmapEngine';
import { governanceMonitoringEngine } from '../monitoring/GovernanceMonitoringEngine';
import { executiveBoardReportEngine } from '../reports/ExecutiveBoardReportEngine';
import { decisionRegistryEngine } from '../execution/DecisionRegistryEngine';
import { governanceKnowledgeEngine } from '../knowledge/GovernanceKnowledgeEngine';
import { benchmarkAdvisoryEngine } from '../benchmark/BenchmarkAdvisoryEngine';
import { governanceLearningEngine } from '../learning/GovernanceLearningEngine';
import { governanceJourneyEngine } from '../journey/GovernanceJourneyEngine';

export class BoardPackGeneratorEngine {
  private static instance: BoardPackGeneratorEngine;

  public static getInstance(): BoardPackGeneratorEngine {
    if (!BoardPackGeneratorEngine.instance) {
      BoardPackGeneratorEngine.instance = new BoardPackGeneratorEngine();
    }
    return BoardPackGeneratorEngine.instance;
  }

  /**
   * Generates a widescreen Board Pack presentation model for a client.
   */
  public generateBoardPack(
    clientId: string,
    mode: ESGIMMode = 'DEMO_SCENARIO',
    scenario: ESGIMScenario = 'STANDARD',
    companyName: string = 'Holding Illumine S/A',
    template: BoardPackSlideTemplate = 'STANDARD_BOARD',
    actorId?: string
  ): BoardPack {
    const packId = `BPK-BPG-${clientId || 'GLOBAL'}-${scenario}-${Date.now()}`;
    const generatedAt = new Date().toISOString();

    // 1. Fetch active data from all engines
    const esgim = esgimAssessmentEngine.calculateAssessment(clientId, mode, scenario);
    const iri = institutionalResilienceIndexEngine.calculateResilience(clientId, mode, scenario);
    const prioritiesData = boardPrioritiesEngine.generatePriorities(clientId, mode, scenario);
    const roadmap = governanceRoadmapEngine.generateRoadmap(clientId, mode, scenario);
    const monitoring = governanceMonitoringEngine.calculateMonitoring(clientId, mode, scenario);
    const report = executiveBoardReportEngine.generateReport(clientId, mode, scenario, companyName, actorId);

    // 2. Calculate Decision Readiness Score (0 - 100)
    // Formula aggregates ESGIM Score (40%), IRI Score (40%), and GML PEI (20%)
    const pei = monitoring.snapshots?.[3]?.priorityExecutionIndex ?? 70;
    const baseReadiness = Math.round((esgim.overallScore * 0.40) + (iri.score * 0.40) + (pei * 0.20));
    
    let decisionReadinessScore = baseReadiness;
    if (scenario === 'CONSTITUTIONAL_BREACH') {
      decisionReadinessScore = Math.min(baseReadiness, 42); // Severe breach cap
    } else if (scenario === 'LIQUIDITY_SHOCK') {
      decisionReadinessScore = Math.min(baseReadiness, 28); // Liquidity shock cap
    }

    // 3. Populate Recommended Decision Register
    const recommendedDecisionRegister: RecommendedDecisionEntry[] = report.recommendedDecisions.map((dec) => {
      // Parse format: "Decisão: X | Justificativa: Y | Benefício: Z | Horizonte: H"
      const parts = dec.split(' | ');
      const decisionText = parts[0]?.replace('Decisão: ', '') || '';
      const urgencyText = parts[3]?.replace('Horizonte: ', '') || '';
      const benefitText = parts[2]?.replace('Benefício: ', '') || '';

      return {
        decision: decisionText,
        urgency: urgencyText,
        expectedBenefit: benefitText
      };
    });

    // 4. Construct Slide Mappings (13 Widescreen standard slides + 2 Annex/Appendix slides + Cover = 16 slides total)
    const slides: BoardPackSlide[] = [];

    // Slide 1: Cover
    slides.push({
      slideNumber: 1,
      title: companyName.toUpperCase(),
      objective: "Capa institucional e manchete de governança do período.",
      visualType: "SUMMARY",
      meetingCriticality: "LOW",
      content: [
        "Plataforma de Suporte à Decisão Cognitiva de Governança",
        `Cenário de Operação: ${scenario}`,
        `Manchete Principal: "${report.executiveHeadline}"`,
        "Certificação Cognitiva: Level 5 (Governance Cognitive Assurance Framework)"
      ]
    });

    const journey = governanceJourneyEngine.generateJourney(clientId || 'GLOBAL', mode, scenario);
    const sortedSteps = [...journey.steps].sort((a, b) => b.executiveAttentionScore - a.executiveAttentionScore);

    // Slide 2: GJL™ Executive Journey
    slides.push({
      slideNumber: 2,
      title: "1. JORNADA DE GOVERNANÇA (GJL™)",
      objective: "Visão consolidada da jornada executiva baseada no GJI™ e priorizada por atenção (EAI™).",
      visualType: "SUMMARY",
      meetingCriticality: "HIGH",
      content: [
        `Governance Journey Index — índice consolidado de navegação executiva: ${journey.gjiScore}/100 (${journey.gjiStage})`,
        `Parecer Executivo: "${journey.boardNarrative}"`,
        `Passos da Jornada (Ordenados por EAI™ - Prioridade de Atenção):`,
        ...sortedSteps.map((s, idx) => 
          `${idx + 1}. [EAI: ${s.executiveAttentionScore}] ${s.title}: ${s.primaryValue} (${s.status})`
        )
      ]
    });

    // Slide 3: Executive Assessment
    // Break the executive summary into 3 concise slides/bullets
    const bulletList = report.executiveSummary
      .split('.')
      .map(s => s.trim())
      .filter(s => s.length > 15)
      .slice(0, 4);

    slides.push({
      slideNumber: 3,
      title: "2. RESUMO EXECUTIVO E PARECER",
      objective: "Visão geral e opinião analítica sobre o momento institucional da holding.",
      visualType: "SUMMARY",
      meetingCriticality: "HIGH",
      content: bulletList.length > 0 ? bulletList : [
        "A holding apresenta bom alinhamento geral com as alçadas de tomada de decisão colegiadas.",
        "As margens de caixa encontram-se dentro dos limites fiduciários toleráveis no baseline atual.",
        "Exige atenção a mitigação de pontos de dependência informal e o reforço preventivo de sucessão."
      ]
    });

    // Slide 4: ESGIM™
    slides.push({
      slideNumber: 4,
      title: "3. MATURIDADE INSTITUCIONAL (ESGIM™)",
      objective: "Pontuação nas chamadas dimensões de sustentabilidade fiduciária e operacional.",
      visualType: "SCORECARD",
      meetingCriticality: "MODERATE",
      content: esgim.dimensions.map(d => 
        `${d.dimension}: Score ${d.score}/100 - Status: ${d.status}`
      )
    });

    // Slide 5: IRI™
    slides.push({
      slideNumber: 5,
      title: "4. RESILIÊNCIA E CAPACIDADE FUTURA (IRI™)",
      objective: "Análise prospectiva da holding frente a estresses e choques futuros.",
      visualType: "SCORECARD",
      meetingCriticality: "HIGH",
      content: [
        `Score Geral de Resiliência: ${iri.score}/100 - Nível: ${iri.level.replace('_', ' ')}`,
        `Resiliência Fiduciária (Foco em Caixa/Crédito): ${iri.fiduciaryResilience}/100`,
        `Resiliência Institucional (Processos/Sucessão): ${iri.institutionalResilience}/100`,
        `Resiliência Prospectiva (Mercado/Obsolescência): ${iri.prospectiveResilience}/100`,
        `Continuidade da Missão (Alinhamento ao Legado): ${iri.missionContinuity}/100`
      ]
    });

    // Slide 6: Top Risks
    slides.push({
      slideNumber: 6,
      title: "5. REGISTER DE RISCOS E EXPOSIÇÕES",
      objective: "Identificar ameaças ativas à sustentabilidade e conformidade da holding.",
      visualType: "RISK_MATRIX",
      meetingCriticality: (scenario === 'CONSTITUTIONAL_BREACH' || scenario === 'LIQUIDITY_SHOCK') ? "CRITICAL" : "HIGH",
      content: report.principalRisks
    });

    // Slide 7: Top Opportunities
    slides.push({
      slideNumber: 7,
      title: "6. OPORTUNIDADES DE GERAÇÃO DE VALOR",
      objective: "Mapear iniciativas para fortalecimento de patrimônio e profissionalização.",
      visualType: "RISK_MATRIX",
      meetingCriticality: "MODERATE",
      content: report.principalOpportunities
    });

    // Slide 8: Board Priorities
    slides.push({
      slideNumber: 8,
      title: "7. RECOMENDAÇÕES PRIORITÁRIAS (BPE™)",
      objective: "Determinar as 5 ações que exigem atenção imediata da governança.",
      visualType: "ROADMAP",
      meetingCriticality: (scenario === 'CONSTITUTIONAL_BREACH' || scenario === 'LIQUIDITY_SHOCK') ? "CRITICAL" : "HIGH",
      content: report.boardPriorities.slice(0, 5)
    });

    // Slide 9: Governance Roadmap
    slides.push({
      slideNumber: 9,
      title: "8. CRONOGRAMA DE EVOLUÇÃO (GRE™)",
      objective: "Sequenciamento dos próximos marcos de estabilização e fortalecimento.",
      visualType: "ROADMAP",
      meetingCriticality: "MODERATE",
      content: report.roadmapHighlights
    });

    // Slide 10: Monitoring Overview
    slides.push({
      slideNumber: 10,
      title: "9. INDICADORES DE EVOLUÇÃO (GML™)",
      objective: "Acompanhamento longitudinal das tendências e alertas de governança.",
      visualType: "TREND",
      meetingCriticality: "HIGH",
      content: report.monitoringHighlights
    });

    // Slide 11: Recommended Decisions (Clean decisions list - NO hashes)
    slides.push({
      slideNumber: 11,
      title: "10. MATRIZ DE DECISÕES DO CONSELHO",
      objective: "Propostas e resoluções formais para homologação imediata na reunião.",
      visualType: "DECISION",
      meetingCriticality: "CRITICAL",
      content: recommendedDecisionRegister.map(entry => 
        `Decisão: ${entry.decision} (Horizonte: ${entry.urgency}) - Benefício: ${entry.expectedBenefit}`
      )
    });

    // Slide 12: Governance Execution Overview (GDTL™)
    const geiSimple = decisionRegistryEngine.calculateGeiSimpleScore(scenario);
    const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);
    const gai = decisionRegistryEngine.calculateGaiScore(scenario);
    const overdueRate = decisionRegistryEngine.calculateOverdueRate(scenario);
    const aging = decisionRegistryEngine.calculateAgingBuckets(scenario);

    slides.push({
      slideNumber: 12,
      title: "11. ACOMPANHAMENTO DE EXECUÇÃO (GDTL™)",
      objective: "Apresentar a resolutividade de decisões (GEI™), delegação (GAI™) e aging de pendências.",
      visualType: "TREND",
      meetingCriticality: "HIGH",
      content: [
        `Governance Execution Index (GEI™) Ponderado: ${geiWeighted}/100`,
        `Governance Execution Index (GEI™) Simples: ${geiSimple}/100`,
        `Governance Accountability Index (GAI™): ${gai}/100 (Delegação)`,
        `Taxa de Atraso (Overdue Rate): ${overdueRate}%`,
        `Aging de Decisões Abertas: 0-30 dias: ${aging.bucket30} | 31-90 dias: ${aging.bucket90} | 91-180 dias: ${aging.bucket180} | 180+ dias: ${aging.bucket180Plus}`
      ]
    });

    // Slide 13: Supporting Principles Supporting Decisions (GKL™ / IWL™)
    const { score: paiScore, level: paiLevel } = governanceKnowledgeEngine.calculatePAI(clientId, scenario);
    const knowledgeResult = governanceKnowledgeEngine.matchFinding(packId, 'BMM', report.executiveSummary);
    const matchedPrinciples = knowledgeResult.principleMatches;

    slides.push({
      slideNumber: 13,
      title: "12. PRINCÍPIOS INSTITUCIONAIS APOIADORES (IWL™)",
      objective: "Demonstrar a aderência aos valores e princípios constitucionais da holding.",
      visualType: "SUMMARY",
      meetingCriticality: "MODERATE",
      content: [
        `Principle Adherence Index (PAI™): ${paiScore}/100 - Status: ${paiLevel}`,
        `Raciocínio Executivo: ${knowledgeResult.executiveRationale}`,
        ...matchedPrinciples.map(p => 
          `[${p.category}] ${p.title} (Aderência: ${p.relevanceScore}%): ${p.explanation}`
        )
      ]
    });

    // Slide 14: Benchmark Advancement Roadmap (BAI™)
    const advisory = benchmarkAdvisoryEngine.evaluateAdvisory(clientId, mode, scenario);
    const advisoryContent = advisory.benchmarkReady 
      ? [
          `Mapeamento de Transição: ${advisory.currentPosition.replace('_', ' ')} -> Target: ${advisory.targetPosition.replace('_', ' ')}`,
          `Advancement Potential Score (APS™): ${advisory.apsScore}/100 | Confiança Advisory (ACS™): ${advisory.advisoryConfidenceScore}/100`,
          `Impacto de Evolução Projetado: ${advisory.expectedAdvancementImpact}`,
          ...advisory.initiatives.slice(0, 3).map(init => 
            `[${init.initiativeType}] ${init.title} (Impacto: +${init.simulatedBpsImpact} BPS, Target: ${init.simulatedTargetPosition.replace('_', ' ')})`
          )
        ]
      : [
          `Acesso Suspenso: ${advisory.executiveSummary}`,
          ...advisory.confidenceWarnings
        ];

    if (advisory.advisoryLimitations && advisory.advisoryLimitations.length > 0) {
      advisoryContent.push(`Limitações: ${advisory.advisoryLimitations.slice(0, 2).join(' ')}`);
    }

    slides.push({
      slideNumber: 14,
      title: "13. ROADMAP DE AVANÇO COMPARATIVO (BAI™)",
      objective: "Apresentar a estratégia e iniciativas recomendadas para ascensão de quadrante de benchmark.",
      visualType: "ROADMAP",
      meetingCriticality: "HIGH",
      content: advisoryContent
    });

    // Slide 15: Institutional Learning Review (GLL™)
    const learning = governanceLearningEngine.calculateLearning(clientId, mode, scenario);
    const learningContent = learning.observations.length > 0
      ? [
          `Índice de Aprendizado (GLI™): ${learning.gliScore}/100 | Maturidade: ${learning.learningMaturity}`,
          `Acurácia de Projeção (AAI™): ${learning.aaiScore}% (${learning.aaiLevel.replace(/_/g, ' ')}) | Modo: ${learning.feedbackMode}`,
          `Sumário Executivo: ${learning.executiveSummary}`,
          `Fortalezas Institucionais: ${learning.institutionalStrengths.join(' | ')}`,
          ...(learning.recurringFailures.length > 0 ? [`Obstáculos Recorrentes: ${learning.recurringFailures.join(' | ')}`] : []),
          ...learning.observations.slice(0, 2).map(obs => 
            `[${obs.source}] ${obs.title}: Esperado: ${obs.expectedOutcome.substring(0, 50)}... / Real: ${obs.actualOutcome.substring(0, 50)}... (${obs.status})`
          )
        ]
      : [
          `Métricas de Aprendizado Suspensas: ${learning.executiveSummary}`
        ];

    slides.push({
      slideNumber: 15,
      title: "14. REVISÃO DE APRENDIZADO INSTITUCIONAL (GLL™)",
      objective: "Mapear o aprendizado do ciclo, aferir acurácia de advisory e consolidar lições aprendidas.",
      visualType: "SUMMARY",
      meetingCriticality: "HIGH",
      content: learningContent
    });

    // Slide 16: Governance Traceability Appendix (Annex Slide - Hideable)
    slides.push({
      slideNumber: 16,
      title: "APÊNDICE: RASTREABILIDADE E AUDITORIA COGNITIVA",
      objective: "Rastreabilidade completa de dados fiduciários e assinaturas criptográficas.",
      visualType: "SUMMARY",
      meetingCriticality: "LOW",
      content: [
        `Lineage Hash Criptográfico: ${report.lineageHash}`,
        `ID do Relatório Base: ${report.reportId}`,
        `Cenário Operacional Validado: ${scenario}`,
        `Modo do Histórico de Dados: ${mode} (${monitoring.timelineMode})`,
        "Algoritmos de Validação: ESGIM v1.0, IRI v1.0, BPE v1.0, GRE v1.0, GML v1.0, EBRG v1.0, BAI v1.0, GLL v1.0",
        `Actor ID Autorizado: ${actorId || 'SYSTEM'}`,
        "Normativa Aplicada: Cognitive Constitution Framework (Overrides Fail-Closed e Proteções Fiduciárias Ativas)"
      ]
    });

    return {
      packId,
      generatedAt,
      title: `${companyName} - Board Presentation Pack`,
      executiveHeadline: report.executiveHeadline,
      slideTemplate: template,
      decisionReadinessScore,
      slides,
      recommendedDecisionRegister,
      lineageHash: report.lineageHash,
      scenario,
      timelineMode: monitoring.timelineMode
    };
  }
}

export const boardPackGeneratorEngine = BoardPackGeneratorEngine.getInstance();
