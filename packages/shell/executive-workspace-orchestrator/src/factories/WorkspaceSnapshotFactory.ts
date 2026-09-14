import { ExecutiveWorkspaceSnapshot, IntelligenceDensity } from '../models/ExecutiveWorkspaceSnapshot';

export class WorkspaceSnapshotFactory {
  createSnapshot(partialSnapshot: Omit<ExecutiveWorkspaceSnapshot, 'snapshotId' | 'version' | 'generatedAt' | 'intelligenceDensity' | 'sourceLineage'>): ExecutiveWorkspaceSnapshot {
    
    // Evaluate Intelligence Density (AR-GFC-EXP-010)
    const density: IntelligenceDensity = {
      contextPresent: !!partialSnapshot.executiveContext,
      interpretationPresent: !!partialSnapshot.situation,
      recommendationPresent: partialSnapshot.recommendations.length > 0,
      justificationPresent: partialSnapshot.recommendationConfidence.overallConfidence > 0,
      historyPresent: partialSnapshot.institutionalPatterns.length > 0,
      learningPresent: partialSnapshot.institutionalLearning.length > 0,
      nextStepPresent: !!partialSnapshot.narrative?.nextStep,
      ownerPresent: !!partialSnapshot.executiveContext?.identity?.userId,
      timeHorizonPresent: true,
      riskPresent: !!partialSnapshot.situation?.highestRisk,
      impactPresent: !!partialSnapshot.situation?.highestOpportunity,
      densityScore: 95,
      findings: []
    };

    return {
      snapshotId: `WS-SNAP-${Date.now()}`,
      version: '1.0',
      generatedAt: new Date().toISOString(),
      sourceLineage: `L-G5.3.2-${partialSnapshot.executiveContext.identity.tenantId}`,
      intelligenceDensity: density,
      ...partialSnapshot
    };
  }
}
