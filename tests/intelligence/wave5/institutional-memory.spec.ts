import { InstitutionalIntelligenceEngine } from '../../../packages/organizational-intelligence/src/index';
import { businessMemoryRepository } from '../../../packages/institutional-memory/src/index';
import { EnterpriseAgentOrchestrator } from '../../../packages/advisory-agents/src/index';
import { ArchitectureScoreCalculator } from '../../../packages/certification/src/index';

export function testWave5OrganizationalIntelligence(): boolean {
  // 1. Validate Institutional Intelligence & Executive Insights
  const insights = InstitutionalIntelligenceEngine.generateExecutiveInsights('tnt-globex');
  if (insights.length !== 2 || insights[0].confidenceScore < 0.90) {
    throw new Error('Falha no teste da camada de inteligência organizacional');
  }

  // 2. Validate Institutional Memory Repository
  businessMemoryRepository.saveDecision({
    id: 'dec-001',
    tenantId: 'tnt-globex',
    context: 'Reestruturação do Capital de Giro',
    assumptions: ['Taxa Selic em 10.5%', 'Crescimento de receita de 15%'],
    selectedAction: 'Amortização de dívidas bancárias de curto prazo',
    expectedImpact: 'Redução do custo financeiro em R$ 1.2M a.a.',
    createdAt: new Date().toISOString()
  });

  const decisions = businessMemoryRepository.getDecisions('tnt-globex');
  if (decisions.length !== 1 || decisions[0].selectedAction !== 'Amortização de dívidas bancárias de curto prazo') {
    throw new Error('Falha no repositório de memória institucional permanente');
  }

  // 3. Validate 5 Executive Advisory Agents & Orchestration
  const orchResult = EnterpriseAgentOrchestrator.orchestrateAll();
  if (orchResult.analyses.length !== 5 || !orchResult.requiresHumanApproval) {
    throw new Error('Falha no orquestrador dos 5 agentes especialistas executivos sob Human-in-the-Loop');
  }

  // 4. Validate Global Certification (OIS >= 95%, ACI >= 95%, 75+ L4 Pages)
  const cert = ArchitectureScoreCalculator.calculateGlobalCertification();
  if (cert.organizationalIntelligenceScore < 95 || cert.advisoryConfidenceIndex < 95 || cert.l4CertifiedPagesCount < 75) {
    throw new Error('Falha nas métricas OIS/ACI ou na expansão de 75+ páginas L4 Certified Native');
  }

  return true;
}
