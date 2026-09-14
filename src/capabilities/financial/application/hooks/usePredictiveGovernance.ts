import { useState, useEffect } from 'react';
import { InMemoryTrendRepository } from '../../../runtime/predictive-governance/InstitutionalTrendRepository';
import { InstitutionalTrajectoryEngine, TrajectoryOutput } from '../../../runtime/predictive-governance/InstitutionalTrajectoryEngine';
import { PredictiveRiskEngine, PredictiveRiskOutput } from '../../../runtime/predictive-governance/PredictiveRiskEngine';
import { InstitutionalEarlyWarningEngine, EarlyWarningOutput, EarlyWarningSignal } from '../../../runtime/predictive-governance/InstitutionalEarlyWarningEngine';
import { InstitutionalScenarioEngine, ScenarioOutput } from '../../../runtime/predictive-governance/InstitutionalScenarioEngine';
import { GovernanceMomentumEngine, MomentumOutput } from '../../../runtime/predictive-governance/GovernanceMomentumEngine';
import { PredictiveRecommendationEngine, RecommendationOutput } from '../../../runtime/predictive-governance/PredictiveRecommendationEngine';
import { PredictiveGovernanceScoreEngine, ScoreOutput } from '../../../runtime/predictive-governance/PredictiveGovernanceScoreEngine';

export interface PredictiveGovernanceData {
  trajectory: TrajectoryOutput;
  risks: PredictiveRiskOutput;
  warnings: EarlyWarningOutput;
  scenarios: ScenarioOutput;
  momentum: MomentumOutput;
  recommendations: RecommendationOutput;
  overallScore: ScoreOutput;
  isLoading: boolean;
}

// Global instance for architectural UI testing
const mockRepo = new InMemoryTrendRepository();

export function usePredictiveGovernance(companyId: string): PredictiveGovernanceData {
  const [data, setData] = useState<PredictiveGovernanceData>({
    trajectory: { trajectoryScore: 0, trajectoryDirection: 'STABLE', confidenceLevel: 'LOW', confidenceReason: '', causalExplanation: '' },
    risks: { emergingRisks: [], confidenceLevel: 'LOW', confidenceReason: '' },
    warnings: { signal: EarlyWarningSignal.GREEN, alerts: [], confidenceLevel: 'LOW', confidenceReason: '' },
    scenarios: { scenarios: [], confidenceLevel: 'LOW', confidenceReason: '' },
    momentum: { momentumScore: 0, momentumDirection: 'STABLE', confidenceLevel: 'LOW', confidenceReason: '' },
    recommendations: { recommendations: [], confidenceLevel: 'LOW', confidenceReason: '' },
    overallScore: { predictiveScore: 0, classification: 'ATENCAO_PREVENTIVA', confidenceLevel: 'LOW', confidenceReason: '' },
    isLoading: true
  });

  useEffect(() => {
    // For MVP/architecture review, seed data if empty
    if (mockRepo.getSnapshots(companyId).length === 0) {
      mockRepo.seedMockData(companyId);
    }

    const snapshots = mockRepo.getSnapshots(companyId);

    const trajectory = InstitutionalTrajectoryEngine.calculateTrajectory(snapshots);
    const risks = PredictiveRiskEngine.evaluateRisks(snapshots);
    const warnings = InstitutionalEarlyWarningEngine.generateWarnings(snapshots);
    const scenarios = InstitutionalScenarioEngine.projectScenarios(snapshots, trajectory);
    const momentum = GovernanceMomentumEngine.calculateMomentum(snapshots);
    const recommendations = PredictiveRecommendationEngine.generateRecommendations(snapshots);
    const overallScore = PredictiveGovernanceScoreEngine.computeScore(snapshots);

    setData({
      trajectory,
      risks,
      warnings,
      scenarios,
      momentum,
      recommendations,
      overallScore,
      isLoading: false
    });
  }, [companyId]);

  return data;
}
