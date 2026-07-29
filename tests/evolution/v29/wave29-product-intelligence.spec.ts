import { ProductAnalyticsEngine, ExecutiveJourneyEngine } from '../../../packages/product-analytics/src/index';
import { AgentObservabilityEngine, decisionObservabilityEngine, ValueObservabilityEngine } from '../../../packages/agent-observability/src/index';
import { ExperimentEngine } from '../../../packages/product-experimentation/src/index';
import { LearningEngine, RoadmapIntelligenceEngine, ProductHealthEngine } from '../../../packages/organizational-learning/src/index';
import { EnterpriseAgentOrchestrator } from '../../../packages/advisory-agents/src/index';

export function testPhaseAProductIntelligence(): boolean {
  // 1. Product Analytics & Executive Journey
  const usage = ProductAnalyticsEngine.getUsageMetrics();
  const journey = ExecutiveJourneyEngine.evaluateJourney('tnt-globex');
  if (usage.weeklyRetentionPercentage < 90 || journey.executiveJourneyScore < 90) {
    throw new Error('Falha no motor de Product Analytics e Executive Journey Score');
  }

  // 2. Agent Observability & Decision Trace
  const agentPerf = AgentObservabilityEngine.getAgentPerformance('CFO Specialist Agent');
  if (agentPerf.approvalRatePercentage < 90 || agentPerf.generatedFinancialValueBrl < 10000000) {
    throw new Error('Falha na telemetria de performance e valor financeiro gerado pelos agentes');
  }

  decisionObservabilityEngine.recordTrace({
    decisionId: 'dec-trace-001',
    recommendation: 'Acelerar expansão no segmento de inteligência decisória',
    humanApprovalStatus: 'APPROVED',
    executionTraceHash: 'sha256-trace-decision-001',
    financialImpactBrl: 2400000
  });

  const trace = decisionObservabilityEngine.getTrace('dec-trace-001');
  if (!trace || trace.humanApprovalStatus !== 'APPROVED') {
    throw new Error('Falha no Decision Trace 100% auditável');
  }

  const valueAcc = ValueObservabilityEngine.calculateAccuracy('tnt-globex');
  if (valueAcc.valueAccuracyScore < 90) {
    throw new Error('Falha no cálculo do Value Accuracy Score (previsto vs realizado)');
  }

  // 3. Product Experimentation Platform
  const exp = ExperimentEngine.runExperiment('exp-narrative-v2', 'Evolução da síntese executiva por A/B test');
  if (exp.adoptionIncreasePercentage < 10 || exp.status !== 'ACTIVE') {
    throw new Error('Falha no motor de testes A/B e experimentação orientada por dados');
  }

  // 4. Organizational Learning Engine & Product Health
  const learning = LearningEngine.evaluateLearning();
  const priorities = RoadmapIntelligenceEngine.generatePriorities();
  const health = ProductHealthEngine.getHealth();

  if (learning.organizationalLearningIndex < 90 || priorities.length === 0 || health.overallProductHealthScore < 95) {
    throw new Error('Falha no motor de aprendizado organizacional contínuo e saúde do produto');
  }

  // 5. Human-in-the-Loop Preservation (12 Executive Agents)
  const orch = EnterpriseAgentOrchestrator.orchestrateAll();
  if (orch.analyses.length !== 12 || !orch.requiresHumanApproval) {
    throw new Error('Falha no travamento soberano Human-in-the-Loop dos 12 agentes executivos');
  }

  return true;
}
