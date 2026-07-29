import { CustomerHealthScoreEngine, valueEvidenceEngine, ExpansionRecommendationEngine } from '../../../packages/customer-success/src/index';
import { FoundingPartnerLifecycleEngine } from '../../../packages/founding-partners-os/src/index';
import { BenchmarkEngine } from '../../../packages/benchmark-intelligence/src/index';
import { EnterpriseFitScoreEngine } from '../../../packages/sales-intelligence/src/index';
import { EnterpriseAgentOrchestrator } from '../../../packages/advisory-agents/src/index';

export function testWave8MarketValidation(): boolean {
  // Test 01: Customer Health Score Engine
  const health = CustomerHealthScoreEngine.calculateHealthScore('tnt-globex');
  if (health.overallHealthScore < 90 || health.status !== 'EXCELLENT') {
    throw new Error('Falha no cálculo do Customer Health Score Engine');
  }

  // Test 02: Value Evidence Engine
  valueEvidenceEngine.registerEvidence({
    id: 'ev-001',
    tenantId: 'tnt-globex',
    initialHypothesis: 'Otimização do Prazo Médio de Recebimento',
    recommendation: 'Renegociar prazos de pagamento com grandes clientes',
    decision: 'Aprovada alteração nas condições comerciais',
    expectedImpactBrl: 500000,
    realizedImpactBrl: 540000,
    evidenceHash: 'sha256-evidence-value-540k',
    recordedAt: new Date().toISOString()
  });

  const evidences = valueEvidenceEngine.getEvidences('tnt-globex');
  if (evidences.length !== 1 || evidences[0].realizedImpactBrl < 500000) {
    throw new Error('Falha no registro de evidências de ROI realizado pelo ValueEvidenceEngine');
  }

  // Test 03: Founding Partner Lifecycle Engine (Dia 0 ao Dia 90)
  const lifecycle = FoundingPartnerLifecycleEngine.advanceLifecycle('fp-001', 'DAY_30_FIRST_BOARD');
  if (lifecycle.currentStage !== 'DAY_90_VALUE_REVIEW' || !lifecycle.valueReviewCompleted) {
    throw new Error('Falha no avanço do ciclo de vida dos parceiros do programa Founding Partners OS');
  }

  // Test 04: Benchmark Engine & Expansion Recommendation
  const benchmark = BenchmarkEngine.getIndustryBenchmark('HEALTHCARE');
  if (benchmark.p75EbitdaMarginPercentage < 25) {
    throw new Error('Falha na inteligência de benchmarks comparativos por quartis');
  }

  const expansion = ExpansionRecommendationEngine.recommendExpansion('tnt-globex');
  if (expansion.length === 0 || expansion[0].probabilityPercentage < 80) {
    throw new Error('Falha na recomendação automática de expansão comercial dentro da conta');
  }

  // Test 05: Sales Enterprise Fit Score Engine
  const fit = EnterpriseFitScoreEngine.evaluateFit('Corporação Beta', 35000000);
  if (fit.fitScore < 90 || fit.qualificationStatus !== 'QUALIFIED_FOUNDING_PARTNER') {
    throw new Error('Falha no motor de avaliação de Enterprise Fit Score');
  }

  // Test 06: New Agents Integration & Human Approval
  const orch = EnterpriseAgentOrchestrator.orchestrateAll();
  if (orch.analyses.length !== 8 || !orch.requiresHumanApproval) {
    throw new Error('Falha na orquestração dos 8 agentes executivos sob Human-in-the-Loop');
  }

  return true;
}
