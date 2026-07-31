import { ExecutiveAdvisorRuntimeContext } from '@illumine/executive-advisor-runtime';
import { Recommendation } from '@illumine/architecture-governance-recommendation';
import { ExecutiveDecisionContext } from '@illumine/executive-decision-intelligence';
import { InstitutionalLesson, LearningPattern } from '@illumine/institutional-learning-intelligence';

import { ExecutiveWorkspaceSnapshot } from '../models/ExecutiveWorkspaceSnapshot';
import { ExecutiveSituation } from '../models/ExecutiveSituation';
import { ExecutiveNarrativeBlock } from '../models/ExecutiveNarrativeBlock';

import { RecommendationConfidenceEngine } from '../engines/RecommendationConfidenceEngine';
import { ExecutiveTrustCalculator } from '../engines/ExecutiveTrustCalculator';
import { WorkspaceSnapshotFactory } from '../factories/WorkspaceSnapshotFactory';
import { ExecutiveWorkspaceSnapshotValidator } from '../validators/ExecutiveWorkspaceSnapshotValidator';
import { SnapshotResolver } from '../resolvers/SnapshotResolver';
import { ExecutiveIntelligencePipeline } from '@illumine/executive-advisor-runtime';
import { WorkspaceAdvisoryEngine } from '@illumine/executive-advisor-runtime';

export class ExecutiveWorkspaceOrchestrator {
  private confidenceEngine = new RecommendationConfidenceEngine();
  private trustCalculator = new ExecutiveTrustCalculator();
  private snapshotFactory = new WorkspaceSnapshotFactory();
  private snapshotValidator = new ExecutiveWorkspaceSnapshotValidator();
  private resolver = new SnapshotResolver();
  private advisoryEngine = new WorkspaceAdvisoryEngine();

  async orchestrate(
    context: ExecutiveAdvisorRuntimeContext,
    query: string
  ): Promise<ExecutiveWorkspaceSnapshot> {
    
    // In a real scenario, this fetches from the Enterprise Knowledge Fabric (EKF)
    const rawRecommendations: Recommendation[] = [];
    const rawDecisions: ExecutiveDecisionContext[] = [];
    const rawLearnings: InstitutionalLesson[] = [];
    const rawPatterns: LearningPattern[] = [];
    
    // 1. Resolve and filter raw intelligence
    const recommendations = this.resolver.resolveRecommendations(rawRecommendations);
    const learnings = this.resolver.resolveLearnings(rawLearnings);
    const patterns = this.resolver.resolvePatterns(rawPatterns);
    
    // 1.5 Execute AI Pipeline (replaces direct UI call)
    // We can run the pipeline to get the structured contract
    const contract = await ExecutiveIntelligencePipeline.execute(context, this.advisoryEngine, query);
    
    // 2. Calculate Confidence & Trust
    const confidence = this.confidenceEngine.calculate(context, recommendations);
    const trust = this.trustCalculator.calculate(confidence);
    
    // 3. Synthesize Situation
    const situation: ExecutiveSituation = {
      whereAmI: `Módulo de ${context.page.domain}`,
      whatChanged: "Sem alterações drásticas no último período.",
      whatNeedsAttention: "Aderência dos novos processos de governança",
      highestRisk: "Risco de desalinhamento de cultura no novo tenant",
      highestOpportunity: "Consolidação de dados do EKF pode acelerar decisões financeiras",
      explanatoryIndicators: ["NPS Interno", "Taxa de Adoção de Processos"]
    };

    // 4. Synthesize Narrative
    const narrative: ExecutiveNarrativeBlock = {
      headline: "Análise Estratégica Completa",
      situation: situation.whatChanged,
      interpretation: contract.executiveSummary || "O ambiente demanda estabilidade operacional.",
      recommendation: recommendations.length > 0 ? (recommendations[0] as any).description || 'Manter curso' : 'Manter curso atual',
      reason: "Baseado no padrão de aprendizado institucional",
      evidence: "4 decisões similares",
      confidence: confidence.overallConfidence,
      nextStep: "Validar painel de risco"
    };

    // 5. Create Snapshot via Factory
    const snapshot = this.snapshotFactory.createSnapshot({
      executiveContext: context,
      situation,
      narrative,
      recommendations,
      pendingDecisions: rawDecisions,
      institutionalLearning: learnings,
      institutionalPatterns: patterns,
      recommendationConfidence: confidence,
      executiveTrustIndex: trust
    });

    // 6. Validate Governance (GFC)
    this.snapshotValidator.validate(snapshot);

    return snapshot;
  }
}
