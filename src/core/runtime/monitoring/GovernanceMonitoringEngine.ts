// src/core/runtime/monitoring/GovernanceMonitoringEngine.ts

import { 
  GovernanceMonitoringSnapshot, 
  GovernanceMonitoringResult, 
  MonitoringAlert, 
  ExplainabilityTrail,
  ESGIMMode, 
  ESGIMScenario 
} from '../esgim/esgimTypes';
import { esgimAssessmentEngine } from '../esgim/ESGIMAssessmentEngine';
import { institutionalResilienceIndexEngine } from '../esgim/InstitutionalResilienceIndexEngine';
import { boardPrioritiesEngine } from '../board/BoardPrioritiesEngine';
import { governanceRoadmapEngine } from '../roadmap/GovernanceRoadmapEngine';
import { decisionRegistryEngine } from '../execution/DecisionRegistryEngine';

export class GovernanceMonitoringEngine {
  private static instance: GovernanceMonitoringEngine;

  public static getInstance(): GovernanceMonitoringEngine {
    if (!GovernanceMonitoringEngine.instance) {
      GovernanceMonitoringEngine.instance = new GovernanceMonitoringEngine();
    }
    return GovernanceMonitoringEngine.instance;
  }

  /**
   * Consolidates ESGIM, IRI, BPE, and GRE into a temporal monitoring view.
   */
  public calculateMonitoring(
    clientId: string,
    mode: ESGIMMode = 'DEMO_SCENARIO',
    scenario: ESGIMScenario = 'STANDARD'
  ): GovernanceMonitoringResult {
    const timestamp = new Date().toISOString();

    // 1. Fetch active calculations from current engines
    const esgimResult = esgimAssessmentEngine.calculateAssessment(clientId, mode, scenario);
    const iriResult = institutionalResilienceIndexEngine.calculateResilience(clientId, mode, scenario);
    const prioritiesResult = boardPrioritiesEngine.generatePriorities(clientId, mode, scenario);
    const roadmapResult = governanceRoadmapEngine.generateRoadmap(clientId, mode, scenario);

    // Present Roadmap Progress Index (RPI) from GRE
    const presentRpi = roadmapResult.roadmapProgress;

    // Calculate Present Priority Execution Index (PEI) mapped directly to GEI™ Weighted
    const presentPei = decisionRegistryEngine.calculateGeiWeightedScore(scenario);

    // Calculate Institutional Risk Index based on active scenario and resilience score
    let presentRiskIndex = 100 - iriResult.score;
    if (scenario === 'STANDARD') {
      presentRiskIndex = 18;
    } else if (scenario === 'CONSTITUTIONAL_BREACH') {
      presentRiskIndex = 82;
    } else if (scenario === 'LIQUIDITY_SHOCK') {
      presentRiskIndex = 94;
    } else if (scenario === 'MISSION_STRESS') {
      presentRiskIndex = 58;
    } else if (scenario === 'FOUNDER_EXIT') {
      presentRiskIndex = 62;
    } else if (scenario === 'MARKET_DISRUPTION') {
      presentRiskIndex = 66;
    }

    // 2. Setup Historical Timeline Snapshots (T-36, T-24, T-12, Present)
    const timelineMode = (mode === 'LIVE_DATA') ? 'LIVE_HISTORY' : 'DEMO_TIMELINE';

    // Baseline historical states
    const t36 = { esgim: 68, iri: 58, progress: 20, pei: 55, risk: 45, geiSimple: 60, geiWeighted: 55, gai: 50, overdue: 30 };
    const t24 = { esgim: 74, iri: 64, progress: 45, pei: 68, risk: 35, geiSimple: 70, geiWeighted: 68, gai: 65, overdue: 20 };
    const t12 = { esgim: 81, iri: 69, progress: 65, pei: 82, risk: 25, geiSimple: 85, geiWeighted: 82, gai: 80, overdue: 10 };

    const snapshots: GovernanceMonitoringSnapshot[] = [
      {
        timestamp: new Date(Date.now() - 36 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        esgimScore: t36.esgim,
        iriScore: t36.iri,
        roadmapProgress: t36.progress,
        priorityExecutionIndex: t36.pei,
        institutionalRiskIndex: t36.risk,
        geiSimpleScore: t36.geiSimple,
        geiWeightedScore: t36.geiWeighted,
        gaiScore: t36.gai,
        overdueRate: t36.overdue
      },
      {
        timestamp: new Date(Date.now() - 24 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        esgimScore: t24.esgim,
        iriScore: t24.iri,
        roadmapProgress: t24.progress,
        priorityExecutionIndex: t24.pei,
        institutionalRiskIndex: t24.risk,
        geiSimpleScore: t24.geiSimple,
        geiWeightedScore: t24.geiWeighted,
        gaiScore: t24.gai,
        overdueRate: t24.overdue
      },
      {
        timestamp: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        esgimScore: t12.esgim,
        iriScore: t12.iri,
        roadmapProgress: t12.progress,
        priorityExecutionIndex: t12.pei,
        institutionalRiskIndex: t12.risk,
        geiSimpleScore: t12.geiSimple,
        geiWeightedScore: t12.geiWeighted,
        gaiScore: t12.gai,
        overdueRate: t12.overdue
      },
      {
        timestamp,
        esgimScore: esgimResult.overallScore,
        iriScore: iriResult.score,
        roadmapProgress: presentRpi,
        priorityExecutionIndex: presentPei,
        institutionalRiskIndex: presentRiskIndex,
        geiSimpleScore: decisionRegistryEngine.calculateGeiSimpleScore(scenario),
        geiWeightedScore: presentPei,
        gaiScore: decisionRegistryEngine.calculateGaiScore(scenario),
        overdueRate: decisionRegistryEngine.calculateOverdueRate(scenario)
      }
    ];

    // 3. Trend calculations (Present ESGIM vs T-12 ESGIM)
    let trend: "IMPROVING" | "STABLE" | "DECLINING" = "STABLE";
    const deltaEsgim = esgimResult.overallScore - t12.esgim;
    if (deltaEsgim > 1) {
      trend = "IMPROVING";
    } else if (deltaEsgim < -1) {
      trend = "DECLINING";
    }

    // 4. Monitoring Alerts Engine
    const alerts: MonitoringAlert[] = [];

    // Score change alerts
    if (deltaEsgim <= -10) {
      alerts.push({
        title: "Deterioração de Maturidade ESGIM™",
        severity: deltaEsgim <= -25 ? "CRITICAL" : "HIGH",
        description: `O score ESGIM consolidado da holding sofreu uma queda de ${Math.abs(deltaEsgim)} pontos em relação aos últimos 12 meses.`,
        recommendedAction: "Instaurar auditoria de governança corporativa e rever alçadas executivas."
      });
    }

    const deltaIri = iriResult.score - t12.iri;
    if (deltaIri <= -10) {
      alerts.push({
        title: "Declínio na Resiliência Institucional (IRI™)",
        severity: deltaIri <= -20 ? "CRITICAL" : "HIGH",
        description: `A resiliência futura (IRI™) sofreu uma redução de ${Math.abs(deltaIri)} pontos comparado a T-12.`,
        recommendedAction: "Restabelecer provisões financeiras fiduciárias e revisar planejamento sucessório."
      });
    }

    // Scenario-specific alerts
    if (scenario === 'CONSTITUTIONAL_BREACH') {
      alerts.push({
        title: "Violação Constitucional Ativa",
        severity: "CRITICAL",
        description: "Foi detectado descumprimento de limites estatutários com violação de alçadas pelo Board.",
        recommendedAction: "Suspender novas aprovações decisórias extraordinárias e auditar as assinaturas societárias."
      });
      alerts.push({
        title: "Indice de Execução de Prioridades Crítico (PEI)",
        severity: "HIGH",
        description: "A execução das prioridades do conselho falhou em alcançar limites mínimos toleráveis (PEI 30/100).",
        recommendedAction: "Realinhar agendas decisórias e sanar a quebra do comitê de ética."
      });
    }

    if (scenario === 'LIQUIDITY_SHOCK') {
      alerts.push({
        title: "Colapso de Liquidez e Risco Crítico Fiduciário",
        severity: "CRITICAL",
        description: "Reservas financeiras fiduciárias esgotadas. Caixa projetado cobre menos de 90 dias de custos operacionais.",
        recommendedAction: "Realizar aporte emergencial líquido via holding e renegociar passivos exigíveis em 24h."
      });
      alerts.push({
        title: "Roadmap Estagnado por Iliquidez",
        severity: "HIGH",
        description: "Fases subsequentes de estruturação e escala suspensas. Progresso do roadmap (RPI) limitado a 10%.",
        recommendedAction: "Mitigar custos fixos operacionais e congelar novas contratações."
      });
    }

    if (scenario === 'FOUNDER_EXIT') {
      alerts.push({
        title: "Risco de Pessoa-Chave e Sucessão (Key Person)",
        severity: "HIGH",
        description: "Teste de descontinuidade societária apontou vulnerabilidade grave decorrente da dependência pessoal do fundador.",
        recommendedAction: "Formalizar regimento sucessório do conselho executivo e transferir alçadas para colegiado."
      });
    }

    if (scenario === 'MARKET_DISRUPTION') {
      alerts.push({
        title: "Rigidez Estratégica e Prontidão Prospectiva Fragilizada",
        severity: "MODERATE",
        description: "Competências de mercado inativas e baixa capacidade adaptativa perante novos entrantes de tecnologia.",
        recommendedAction: "Implementar comitê assessor de inteligência prospectiva e iniciar diversificação de portfólio."
      });
    }

    if (scenario === 'MISSION_STRESS') {
      alerts.push({
        title: "Pressão de Custos sobre Missão Principal",
        severity: "HIGH",
        description: "Dissonância orçamentária entre custos operacionais de escala e recursos direcionados ao propósito fundador.",
        recommendedAction: "Efetuar auditoria fiduciária-missional de gastos e realinhar os investimentos de marca."
      });
    }

    // Default alert if roadmap is behind
    if (presentRpi < 50 && scenario !== 'CONSTITUTIONAL_BREACH' && scenario !== 'LIQUIDITY_SHOCK' && scenario !== 'MISSION_STRESS') {
      alerts.push({
        title: "Cronograma de Governança Estagnado",
        severity: "LOW",
        description: "O progresso real de implantação do roadmap encontra-se abaixo de 50%.",
        recommendedAction: "Identificar gargalos de aprovação nas fases de estruturação."
      });
    }

    // 5. Recommendations
    const recommendations: string[] = [];
    if (trend === "DECLINING") {
      recommendations.push("Instaurar plano emergencial de contingência corporativa fiduciária.");
      recommendations.push("Suspender temporariamente iniciativas de escala (GRE™) até saneamento dos alertas críticos.");
    } else if (trend === "STABLE") {
      recommendations.push("Acelerar a execução das prioridades de curto prazo (BPE™) pendentes.");
      recommendations.push("Mapear preventivamente o comitê de transição sucessória.");
    } else {
      recommendations.push("Prosseguir para as fases avançadas de Escala Sustentável e Preservação de Legado do GRE™.");
      recommendations.push("Assinar eletronicamente o relatório de conformidade temporal e reportar aos acionistas.");
    }

    // 6. Executive Monitoring Summary
    let executiveSummary = "";
    if (scenario === 'STANDARD') {
      executiveSummary = "A holding apresentou evolução consistente em governança e resiliência institucional ao longo dos últimos 36 meses. O plano estratégico avança de forma saudável, com excelente execução de prioridades (PEI 92) e maturidade corporativa consolidada.";
    } else if (scenario === 'CONSTITUTIONAL_BREACH') {
      executiveSummary = "A organização apresentou declínio severo de sua governança no período atual. A ocorrência de violações constitucionais e desvios de alçada decisória suspenderam o avanço do roadmap corporativo planejado.";
    } else if (scenario === 'LIQUIDITY_SHOCK') {
      executiveSummary = "A holding apresentou colapso de sua condição fiduciária decorrente de choque severo de liquidez. A ausência de caixa operacional impede a mitigação de riscos sucessórios e ameaça a continuidade corporativa.";
    } else if (scenario === 'FOUNDER_EXIT') {
      executiveSummary = "A maturidade operacional corporativa permanece robusta, porém a saída simulada do fundador provocou alerta de continuidade. Gargalos sucessórios e alta dependência pessoal fragilizam a resiliência futura.";
    } else if (scenario === 'MARKET_DISRUPTION') {
      executiveSummary = "A estrutura financeira e de compliance da holding é estável, mas a escuta de inteligência prospectiva indica baixa adaptabilidade de mercado. Riscos de obsolescência exigem renovação ágil do conselho.";
    } else if (scenario === 'MISSION_STRESS') {
      executiveSummary = "A holding apresenta conflito de propósito ativo, caracterizado por excessiva drenagem de caixa fiduciário em despesas operacionais em detrimento da entrega da missão fundadora principal.";
    }

    // 7. Explainability Logs
    const explainability: ExplainabilityTrail[] = [
      {
        title: "Consolidação de Linha Temporal",
        type: "evidence",
        description: `Métricas temporais sintetizadas a partir de 4 snapshots corporativos estruturados. Modo ativo: ${timelineMode}.`,
        timestamp
      },
      {
        title: "Regra Constitucional Monitorada",
        type: "rule",
        description: "Sinais coletados diretamente das inteligências de ESGIM, IRI, BPE e GRE engines.",
        timestamp
      }
    ];

    if (scenario !== 'STANDARD') {
      explainability.push({
        title: "Override de Risco Sistêmico",
        type: "override",
        description: `O desvio crítico do cenário '${scenario}' induziu rebaixamento imediato do score e ativação de triggers de alerta.`,
        timestamp
      });
    }

    const lineageHash = `LIN-GML-${clientId || 'GLOBAL'}-${mode}-${scenario}-${Date.now()}`;

    return {
      trend,
      snapshots,
      executiveSummary,
      alerts,
      recommendations,
      lineageHash,
      explainability,
      timelineMode
    };
  }
}

export const governanceMonitoringEngine = GovernanceMonitoringEngine.getInstance();
